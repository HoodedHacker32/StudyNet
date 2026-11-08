"""Renders the calculator's body and keys as photo-like pictures: calc/body.webp and calc/keys.webp.

The layout and the printed legends come from the real calculator HTML (tools/calc-bake.html, read with Playwright);
everything else is rendered here as a lit height field, like a product photo:
  height  moulded case with a rounded edge, a pebbled texture on the face, a recessed display window and solar panel,
          raised keys with rounded top edges sitting in gaps, domed round keys, and the cursor pad: a sunken
          rounded-diamond well with four raised keys around a sunken hub
  colour  plastics, ink, LCD, solar cells
  light   a soft key light from the top left, ambient occlusion, soft cast shadows, a studio softbox reflection and
          sensor grain, rendered at 2x and scaled down

Needs the local server (python -m http.server 5417), Playwright with Chromium, numpy and OpenCV:
  python tools/bake.py
Prints the cursor-pad clip-paths for app.css (#calc .czpu etc.) when the pad geometry changes.
"""
import io, json, math, os
import numpy as np
import cv2
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_EM = 36            # output px per em
SS = 2                 # supersampling
R = OUT_EM * SS        # render px per em
URL = 'http://localhost:5417/tools/calc-bake.html'
rng = np.random.default_rng(20261108)

# ---------------------------------------------------------------- browser: layout + ink
def browser():
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={'width': int(26 * R), 'height': int(57 * R)}, device_scale_factor=1)
        inks = {}
        for ps in ('inkbody', 'inkkeys'):
            page.goto(URL + '?pass=' + ps, wait_until='networkidle')
            page.wait_for_selector('body[data-ready="1"]')
            page.evaluate("document.getElementById('calc').style.fontSize = '%dpx'" % R)
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(300)
            geom = page.evaluate('window.__geom()')
            png = page.locator('#calc .czbody').screenshot(omit_background=True, animations='disabled')
            inks[ps] = np.asarray(Image.open(io.BytesIO(png)).convert('RGBA')).astype(np.float32) / 255
        b.close()
    return geom, inks

# ---------------------------------------------------------------- helpers
def srgb2lin(c): c = np.asarray(c, np.float32); return np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4)
def lin2srgb(c): return np.where(c <= .0031308, c * 12.92, 1.055 * np.power(np.clip(c, 0, None), 1 / 2.4) - .055)
def hexc(h): h = h.lstrip('#'); return srgb2lin([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])
def smooth(t): t = np.clip(t, 0, 1); return t * t * (3 - 2 * t)
def blur(a, s): return cv2.GaussianBlur(a, (0, 0), s) if s > 0 else a

def sd_rrect(X, Y, x, y, w, h, rt, rb=None):
    """Signed distance (px, negative inside) to a rounded rectangle with top radius rt and bottom radius rb."""
    rb = rt if rb is None else rb
    cx, cy, hw, hh = x + w / 2, y + h / 2, w / 2, h / 2
    r = np.where(Y < cy, rt, rb)
    qx = np.abs(X - cx) - (hw - r); qy = np.abs(Y - cy) - (hh - r)
    return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r

def value_noise(h, w, cell, seed):
    g = np.random.default_rng(seed).random((int(h / cell) + 3, int(w / cell) + 3)).astype(np.float32)
    return cv2.resize(g, (int((g.shape[1]) * cell), int((g.shape[0]) * cell)), interpolation=cv2.INTER_CUBIC)[:h, :w]

def fbm(h, w, cell, octaves, seed):
    out = np.zeros((h, w), np.float32); amp = 1; tot = 0
    for o in range(octaves):
        out += amp * value_noise(h, w, max(1.5, cell / 2 ** o), seed + o); tot += amp; amp *= .5
    return out / tot

# ---------------------------------------------------------------- scene
def render(geom, inks):
    em = R
    BW, BH = geom['body'][2] * em, geom['body'][3] * em
    W, H = int(round(BW)), int(round(BH))
    Y, X = np.mgrid[0:H, 0:W].astype(np.float32) + .5
    hgt = np.zeros((H, W), np.float32)
    alb = np.zeros((H, W, 3), np.float32)
    ks = np.full((H, W), .035, np.float32)      # specular strength
    gl = np.full((H, W), 18., np.float32)       # gloss exponent
    keyA = np.zeros((H, W), np.float32)         # what belongs to the keys picture

    # --- case and face
    sd = sd_rrect(X, Y, 0, 0, W, H, 2.3 * em, 3.8 * em)
    caseA = np.clip(.5 - sd, 0, 1)
    din = -sd
    re = .5 * em
    t = np.clip(din / re, 0, 1)
    hgt += re * .55 * (np.sqrt(1 - (1 - t) ** 2) - 1)                 # rounded case edge
    face = hexc('#26272f'); rim = hexc('#383a44')
    rimw = smooth((din - .1 * em) / (.14 * em))
    alb[:] = face * rimw[..., None] + rim * (1 - rimw[..., None])
    # The face's moulded texture: a fine staggered pattern (repeat 1.1em x 0.3em rows), measured from a close-up photo
    # of the real case (tools/panel-texture.npy is one averaged repeat). It's subtle: about 3.5% in brightness.
    t = np.load(os.path.join(ROOT, 'tools', 'panel-texture.npy'))
    t = (t - t.mean()) / t.std()
    tw, th = int(round(1.10 * em)), int(round(.607 * em))
    t = cv2.resize(t, (tw, th), interpolation=cv2.INTER_CUBIC)
    peb = np.tile(t, (H // th + 1, W // tw + 1))[:H, :W].astype(np.float32)
    fine = fbm(H, W, 6, 2, 5) - .5
    mott = fbm(H, W, 220, 3, 9) - .5
    hgt += peb * .1 + fine * .25
    alb *= (1 + .04 * mott[..., None] + .03 * peb[..., None])

    def paint(mask, col, k=None, g=None):
        m = mask[..., None]
        alb[:] = alb * (1 - m) + hexc(col) * m
        if k is not None: ks[:] = ks * (1 - mask) + k * mask
        if g is not None: gl[:] = gl * (1 - mask) + g * mask

    # --- display window: glossy black frame set into the face, LCD below it
    bx, by, bw, bh = [v * em for v in geom['bezel']]
    sdb = sd_rrect(X, Y, bx, by, bw, bh, .7 * em, 1 * em)
    mb = np.clip(.5 - sdb, 0, 1)
    hgt -= (peb * .1 + fine * .5) * mb                                    # smooth inside the window
    hgt -= 7 * smooth(-sdb / 3)
    paint(mb, '#0e0f11', .5, 90)
    gx_, gy_, gw_, gh_ = [v * em for v in geom['glass']]
    sdg = sd_rrect(X, Y, gx_, gy_, gw_, gh_, .15 * em)
    mg = np.clip(.5 - sdg, 0, 1)
    hgt -= 3 * smooth(-sdg / 2)
    paint(mg, '#b3bdb4', .06, 40)
    lcd_top = mg * smooth((Y - gy_) / (.5 * em))
    alb *= (1 - .18 * (mg - lcd_top))[..., None]                            # the LCD sits in the shade of the frame

    # --- solar panel
    sx, sy, sw, sh = [v * em for v in geom['solar']]
    sds = sd_rrect(X, Y, sx, sy, sw, sh, .45 * em)
    ms = np.clip(.5 - sds, 0, 1)
    hgt -= (peb * .1 + fine * .5) * ms
    hgt -= 4 * smooth(-sds / 3)
    paint(ms, '#111214', .35, 70)
    pad_ = .42 * em; cw = (sw - 2 * pad_ - 3 * .08 * em) / 4
    for i in range(4):
        cx0 = sx + pad_ + i * (cw + .08 * em)
        sdc = sd_rrect(X, Y, cx0, sy + pad_, cw, sh - 2 * pad_, .06 * em)
        mc = np.clip(.5 - sdc, 0, 1)
        stripes = .9 + .1 * (np.sin((X - cx0) / (.5 * em) * 2 * math.pi) > .96)
        paint(mc, '#4d3b30', .45, 140)
        alb *= (1 - mc * (1 - stripes))[..., None]

    # --- keys
    def key_profile(di, hk, bevel, dome, U=None, V=None):
        t = np.clip(di / bevel, 0, 1)
        h = hk * np.sqrt(1 - (1 - t) ** 2)
        if U is not None: h += dome * np.clip(1 - (U * U + V * V), 0, 1)
        return h

    col = {'fn': '#2b2d35', 'big': '#1b1c21', 'yellow': '#d8ac10', 'round': '#212228'}
    kspec = {'fn': (.07, 30), 'big': (.06, 26), 'yellow': (.09, 30), 'round': (.08, 34)}
    for k in geom['keys']:
        x, y, w, h = [v * em for v in k['r']]
        pad = .5 * em
        x0, y0, x1, y1 = int(max(0, x - pad)), int(max(0, y - pad)), int(min(W, x + w + pad)), int(min(H, y + h + pad))
        sl = (slice(y0, y1), slice(x0, x1))
        Xs, Ys = X[sl], Y[sl]
        if k['kind'] == 'round':
            cx, cy, rr = x + w / 2, y + h / 2, w / 2
            d = np.hypot(Xs - cx, Ys - cy) - rr
            gap = .1 * em
        else:
            rad = (.36 if k['kind'] == 'fn' else .3) * em
            d = sd_rrect(Xs, Ys, x, y, w, h, rad)
            gap = .065 * em
        # the opening around the key
        ring = smooth((gap + 1 - d) / 2) * (d > -1)
        hgt[sl] -= ring * 6 * (d > 0)
        alb[sl] = alb[sl] * (1 - (ring * (d > 0))[..., None]) + hexc('#08090b') * (ring * (d > 0))[..., None]
        # the key
        m = np.clip(.5 - d, 0, 1)
        U, V = (Xs - (x + w / 2)) / (w / 2), (Ys - (y + h / 2)) / (h / 2)
        if k['kind'] == 'round':
            prof = key_profile(-d, 14, .16 * em, 7, U, V)
        else:
            prof = key_profile(-d, 15, .11 * em, 2.5 if k['kind'] == 'fn' else 1.2, U, V)
        hk = np.where(d < 0, prof, 0) + fine[sl] * .2 * m
        hgt[sl] = hgt[sl] * (1 - m) + hk * m
        c = hexc(col[k['kind']])
        a = np.repeat(m[..., None], 3, 2)
        alb[sl] = alb[sl] * (1 - a) + c * a
        if k['kind'] == 'round':
            th = np.arctan2(Ys - cy, Xs - cx)
            lines = .5 + .5 * np.sin(th * 300 + 6 * fine[sl])
            alb[sl] *= (1 - m * .1 * lines)[..., None]
            ks[sl] = ks[sl] * (1 - m) + m * (.05 + .1 * lines)
            gl[sl] = gl[sl] * (1 - m) + m * 34
        else:
            ks[sl] = ks[sl] * (1 - m) + m * kspec[k['kind']][0]
            gl[sl] = gl[sl] * (1 - m) + m * kspec[k['kind']][1]
        keyA[sl] = np.maximum(keyA[sl], m)

    # --- cursor pad: a sunken rounded-diamond well, four raised keys around a sunken hub
    px, py, pw, ph = [v * em for v in geom['pad']]
    pcx, pcy, A, B = px + pw / 2, py + ph / 2, pw / 2, ph / 2
    sl = (slice(int(py) - 10, int(py + ph) + 10), slice(int(px) - 10, int(px + pw) + 10))
    Xs, Ys = X[sl], Y[sl]
    Uu, Vv = (Xs - pcx) / A, (Ys - pcy) / B
    P = 1.55
    fsup = (np.abs(Uu) ** P + np.abs(Vv) ** P) ** (1 / P)
    dw = (fsup - 1) * min(A, B)                                             # ~ signed distance to the well edge (px)
    well = np.clip(.5 - dw, 0, 1)
    wall = smooth(-dw / 4)                                                  # a short wall down to the well floor
    hgt[sl] = np.where(dw < 0, hgt[sl] * (1 - wall) - 4 * wall, hgt[sl])
    alb[sl] = alb[sl] * (1 - well[..., None]) + hexc('#26272e') * well[..., None]
    ks[sl] = ks[sl] * (1 - well) + .03 * well
    inner = dw < -.17 * em
    yU = -.15 - .5 * np.abs(Uu)
    yD = .27 - .15 * np.abs(Uu)
    def side(px_, py_, dx, dy):   # >0 on the right of the line through (px_,py_) along (dx,dy)
        return dx * (Vv - py_) - dy * (Uu - px_)
    sx_ = .40
    # dividing lines from the hub corners out to the rim
    L_up_l = side(-sx_, -.36, -.14, -.28); L_up_r = side(sx_, -.36, .14, -.28)
    L_dn_l = side(-sx_, .23, -.14, .28); L_dn_r = side(sx_, .23, .14, .28)
    regions = {
        'up': inner & (Vv < yU) & (L_up_l > 0) & (L_up_r < 0),
        'down': inner & (Vv > yD) & (L_dn_l < 0) & (L_dn_r > 0),
        'left': inner & (Uu < -sx_) & (L_up_l < 0) & (L_dn_l > 0),
        'right': inner & (Uu > sx_) & (L_up_r > 0) & (L_dn_r < 0),
    }
    gap = .07 * em
    for name, reg in regions.items():
        m0 = reg.astype(np.uint8)
        di = cv2.distanceTransform(m0, cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
        core = (di > gap).astype(np.float32)
        core = (blur(core, .17 * em) > .5).astype(np.uint8)                 # round the corners
        dk = cv2.distanceTransform(core, cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
        m = np.clip(blur(core.astype(np.float32), .6), 0, 1)
        pillow = blur(core.astype(np.float32), .45 * em)                  # a smooth dome, no creases
        prof = 9 * np.sqrt(1 - (1 - np.clip(dk / (.13 * em), 0, 1)) ** 2) + 6 * smooth((pillow - .5) / .5)
        prof = blur(prof.astype(np.float32), 1.2)
        hk = -4 + prof
        hgt[sl] = hgt[sl] * (1 - m) + hk * m
        alb[sl] = alb[sl] * (1 - m[..., None]) + hexc('#2a2c34') * m[..., None]
        ks[sl] = ks[sl] * (1 - m) + .11 * m
        gl[sl] = gl[sl] * (1 - m) + 40 * m
        keyA[sl] = np.maximum(keyA[sl], m)

    # --- printed ink (from the browser) on the case and on the keys
    ib, ik = inks['inkbody'][:H, :W], inks['inkkeys'][:H, :W]
    for ink, where in ((ib, 1 - keyA), (ik, keyA)):
        a = (ink[..., 3] * where)[..., None]
        alb[:ink.shape[0], :ink.shape[1]] = alb[:ink.shape[0], :ink.shape[1]] * (1 - a) + srgb2lin(ink[..., :3]) * .85 * a
        ks[:ink.shape[0], :ink.shape[1]] *= (1 - .4 * a[..., 0])

    # ---------------------------------------------------------------- lighting
    gx = cv2.Sobel(hgt, cv2.CV_32F, 1, 0, ksize=3) / 8
    gy = cv2.Sobel(hgt, cv2.CV_32F, 0, 1, ksize=3) / 8
    nz = 1 / np.sqrt(gx * gx + gy * gy + 1); nx, ny = -gx * nz, -gy * nz
    L = np.array([-.42, -.62, .66]); L /= np.linalg.norm(L)
    ndl = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    # soft cast shadows: march the height field towards the light at quarter resolution
    q = 4
    hq = cv2.resize(hgt, (W // q, H // q), interpolation=cv2.INTER_AREA)
    rise = L[2] / math.hypot(L[0], L[1]) * q                                 # height gained per quarter-res pixel
    occ = np.zeros_like(hq)
    dx, dy = L[0] / math.hypot(L[0], L[1]), L[1] / math.hypot(L[0], L[1])
    for s in range(1, 14):
        M = np.float32([[1, 0, dx * s], [0, 1, dy * s]])
        hs = cv2.warpAffine(hq, M, (hq.shape[1], hq.shape[0]), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        occ = np.maximum(occ, hs - hq - s * rise)
    sh = 1 - np.clip(occ / 5, 0, 1)
    sh = cv2.resize(blur(sh, 1.2), (W, H), interpolation=cv2.INTER_CUBIC)
    sh = np.clip(sh, 0, 1)
    # ambient occlusion from the surrounding height
    ao = np.ones_like(hgt)
    for rad, depth, wgt in ((3, 3, .35), (10, 8, .35), (30, 14, .3)):
        ao -= wgt * np.clip((blur(hgt, rad) - hgt) / depth, 0, 1)
    ao = np.clip(ao, 0, 1) ** 1.3
    hemi = .55 + .45 * nz
    diff = .62 * ndl * sh + .5 * hemi * ao
    # specular: key light highlight + studio softbox reflection
    Hv = L + np.array([0, 0, 1.]); Hv /= np.linalg.norm(Hv)
    ndh = np.clip(nx * Hv[0] + ny * Hv[1] + nz * Hv[2], 0, 1)
    spec = ks * np.power(ndh, gl) * sh * 2.2
    rx, ry, rz = 2 * nz * nx, 2 * nz * ny, 2 * nz * nz - 1
    env = .9 * np.exp(-((rx + .2) / .5) ** 2 - ((ry + .5) / .32) ** 2) + .25 * np.clip(-ry, 0, 1) + .06
    spec += ks * env * ao * 1.6
    rgb = alb * diff[..., None] + spec[..., None]
    # light falls off a little towards the bottom right, like a lamp above the top
    rgb *= (1.06 - .1 * (Y / H) - .04 * (X / W))[..., None]
    out = lin2srgb(np.clip(rgb, 0, 1))
    out += rng.normal(0, 1.3 / 255, out.shape[:2]).astype(np.float32)[..., None]   # sensor grain
    out = np.clip(out, 0, 1)
    return out, caseA, keyA, (W, H)

def clip_paths():
    """Cursor-pad hit areas (percent of the pad box) matching the drawn keys, for app.css."""
    def pc(u, v): return '%.1f%% %.1f%%' % ((u + 1) * 50, (v + 1) * 50)
    s = .40
    def ext(p, d, v_end):   # extend a line from p along d to v = v_end
        t = (v_end - p[1]) / d[1]; return (p[0] + d[0] * t, v_end)
    ul, ur = ext((-s, -.36), (-.14, -.28), -1), ext((s, -.36), (.14, -.28), -1)
    dl, dr = ext((-s, .23), (-.14, .28), 1), ext((s, .23), (.14, .28), 1)
    return {
        'czpu': [pc(*ul), pc(*ur), pc(s, -.36), pc(0, -.15), pc(-s, -.36)],
        'czpd': [pc(*dl), pc(-s, .23), pc(0, .27), pc(s, .23), pc(*dr)],
        'czpl': [pc(-1, -1), pc(*ul), pc(-s, -.36), pc(-s, .23), pc(*dl), pc(-1, 1)],
        'czpr': [pc(1, -1), pc(*ur), pc(s, -.36), pc(s, .23), pc(*dr), pc(1, 1)],
    }

def main():
    geom, inks = browser()
    img, caseA, keyA, (W, H) = render(geom, inks)
    ow, oh = W // SS, H // SS
    def down(a): return cv2.resize(a, (ow, oh), interpolation=cv2.INTER_AREA)
    hole = np.array([.03, .03, .035], np.float32)
    body_rgb = img * (1 - keyA[..., None]) + hole * keyA[..., None]
    body = np.dstack([down(body_rgb), down(caseA)])
    keys = np.dstack([down(img), down(keyA)])
    os.makedirs(os.path.join(ROOT, 'calc'), exist_ok=True)
    for name, arr in (('body', body), ('keys', keys)):
        im = Image.fromarray((np.clip(arr, 0, 1) * 255 + .5).astype(np.uint8), 'RGBA')
        out = os.path.join(ROOT, 'calc', name + '.webp')
        im.save(out, 'WEBP', quality=84, method=6)
        im.save(os.path.join(ROOT, 'tools', 'bake-' + name + '.png'))
        print(name, im.size, os.path.getsize(out), 'bytes')
    comp = Image.alpha_composite(Image.open(os.path.join(ROOT, 'tools', 'bake-body.png')), Image.open(os.path.join(ROOT, 'tools', 'bake-keys.png')))
    comp.save(os.path.join(ROOT, 'tools', 'bake-combined.png'))
    for k, v in clip_paths().items(): print('#calc .%s{clip-path:polygon(%s)}' % (k, ','.join(v)))

if __name__ == '__main__':
    main()
