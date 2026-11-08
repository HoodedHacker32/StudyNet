"""Builds the calculator's LCD fonts into calc-lcd.js.

Main face: "ClassWiz X Display" by Windy Deng (SIL Open Font License 1.1, fonts/classwiz-x-display/), embedded
unmodified. Its em is 14 px with 10 units per pixel, so at font-size 14px every glyph pixel is one LCD pixel.

Three companion faces are built here on the same 14 px grid (10 font units = 1 LCD pixel):
  SN LCD Italic  variables x y z e π θ t F: the ClassWiz face's maths-italic outlines, moved to the plain letters
                 (a modified version of the font, so it carries the OFL and its own name, as the licence requires);
                 other letters are rasterised from Century Schoolbook Italic.
  SN LCD Small   exponents and root indexes: the ClassWiz superscript digits / n / x / r / g / −¹ moved down to the
                 baseline, plus small brackets, signs and letters drawn here. Also OFL.
  SN LCD         fallback for the few characters the ClassWiz face doesn't have (π, θ, ►, …), StudyNet's own
                 pixel glyphs rasterised from Courier New / Century with hinting.

  python tools/lcdfont.py      (Windows: needs C:/Windows/Fonts, Pillow, numpy, fontTools)
Writes calc-lcd.js and tools/lcdfont-preview.png.
"""
import base64, copy, io, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

WF = 'C:/Windows/Fonts/'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CWDIR = os.path.join(ROOT, 'fonts', 'classwiz-x-display')
CW = TTFont(os.path.join(CWDIR, 'ClassWizXDisplay-Regular.ttf'))
CWMAP = CW.getBestCmap()
U, UPM, ASC, DESC = 10, 140, 13, 3   # units per pixel, em, rows above / below the baseline in a cell

_has = {}
def has(font, ch):
    if font not in _has: _has[font] = set(TTFont(WF + font, fontNumber=0).getBestCmap().keys())
    return ord(ch) in _has[font]

def raster(ch, font, ppem, cw, bold=True, center=True):
    """Hinted 1-bit render into a cw x (ASC+DESC) cell, baseline at row ASC."""
    h = ASC + DESC
    fo = ImageFont.truetype(WF + font, ppem)
    im = Image.new('1', (cw * 4, h * 3), 0); d = ImageDraw.Draw(im); d.fontmode = '1'
    d.text((cw, h + ASC), ch, font=fo, fill=1, anchor='ls')
    a = np.array(im, dtype=np.uint8)
    if bold: a = a | np.roll(a, 1, axis=1)
    out = np.zeros((h, cw), np.uint8)
    ys, xs = np.nonzero(a)
    if not len(xs): return out
    x0, x1 = xs.min(), xs.max() + 1; w = x1 - x0
    sub = a[h:h * 2, x0:x1]
    if w > cw: c = (w - cw + 1) // 2; sub = sub[:, c:c + cw]; w = cw
    left = (cw - w) // 2 if center else 0
    out[:, left:left + w] = sub
    return out

def art(rows, cw, bottom):
    """Hand-drawn glyph ('#' lit), centred, its last row `bottom` rows above the baseline (negative = below)."""
    h = ASC + DESC
    out = np.zeros((h, cw), np.uint8)
    w = max(len(r) for r in rows); left = (cw - w + 1) // 2
    top = ASC - bottom - len(rows)
    for i, r in enumerate(rows):
        for j, c in enumerate(r):
            if c == '#': out[top + i, left + j] = 1
    return out

# ---------------------------------------------------------------- fallback face (characters ClassWiz lacks), 11 px
BW = 11
FALLBACK_ART = {  # [rows], bottom row height above baseline
    'π': (['#########', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '##....###'], 0),
    'θ': (['..####..', '.##..##.', '##....##', '##....##', '########', '##....##', '##....##', '.##..##.', '..####..'], 0),
    '►': (['##.....', '####...', '######.', '#######', '######.', '####...', '##.....'], 3),
    '◄': (['.....##', '...####', '.######', '#######', '.######', '...####', '.....##'], 3),
    '·': (['##', '##'], 5),
    '•': (['.##.', '####', '####', '.##.'], 4),
    '′': (['.##', '.##', '##.'], 9),
    '″': (['.##.##', '.##.##', '##.##.'], 9),
    '’': (['##', '##', '.#', '#.'], 8),
    '”': (['##.##', '##.##', '.#..#', '#..#.'], 8),
    '—': (['###########'], 5),
    '⁻': (['#####', '#####'], 9),
    '←': (['...#.....', '..##.....', '.#########', '##########', '.#########', '..##.....', '...#.....'], 2),
    '⇔': (['..#....#..', '.########.', '##......##', '.########.', '..#....#..'], 3),
    '≈': (['.###...#', '#...###.', '........', '.###...#', '#...###.'], 3),
    '¦': (['##', '##', '##', '..', '##', '##', '##'], 2),
}
def fallback_glyph(ch):
    if ch in FALLBACK_ART: rows, b = FALLBACK_ART[ch]; return art(rows, BW, b)
    if ch in 'ŷȳ':
        g = raster('y', 'cour.ttf', 17, BW); top = 2
        if ch == 'ŷ': g[top, 3:8] = 0; g[top, 5] = 1; g[top + 1, 4] = g[top + 1, 6] = 1
        else: g[top, 3:8] = 1
        return g
    if ch == 'ˣ': return small_glyph('x', raised=True)
    for f, s in (('cour.ttf', 17), ('seguisym.ttf', 13), ('arial.ttf', 13)):
        if has(f, ch): return raster(ch, f, s, BW)
    return np.zeros((ASC + DESC, BW), np.uint8)

# ---------------------------------------------------------------- small face: 8 px advance, 7 px tall digits
SW = 8
SMALL_FROM_CW = {'0': 'zero.superior', '1': 'onesuperior', '2': 'twosuperior', '3': 'threesuperior', '4': 'four.superior',
                 '5': 'five.superior', '6': 'six.superior', '7': 'seven.superior', '8': 'eight.superior', '9': 'nine.superior',
                 'n': 'n.superior', 'x': 'x.itc.superior', 'r': 'rsupmod', 'g': 'gmod'}
SMALL_ART = {
    '(': (['..##', '.##.', '##..', '##..', '##..', '.##.', '..##'], 0),
    ')': (['##..', '.##.', '..##', '..##', '..##', '.##.', '##..'], 0),
    '+': (['..##..', '..##..', '######', '######', '..##..', '..##..'], 0),
    '-': (['#####', '#####'], 2), '−': (['#####', '#####'], 2),
    '.': (['##', '##'], 0), ',': (['.##', '.##', '##.'], -1),
    '×': (['##..##', '.####.', '..##..', '.####.', '##..##'], 1),
    '÷': (['..##..', '......', '######', '......', '..##..'], 1),
    '=': (['######', '......', '######'], 2),
    '/': (['....##', '...##.', '..##..', '.##...', '##....'], 0),
    'π': (['######', '.#..#.', '.#..#.', '.#..#.', '##..##'], 0),
    'θ': (['.###.', '##.##', '#####', '##.##', '.###.'], 0),
    'e': (['.###.', '##.##', '#####', '##...', '.####'], 0),
    'y': (['##.##', '##.##', '.####', '...##', '####.'], -2),
    '°': (['###', '#.#', '###'], 4),
    '□': (['######', '#....#', '#....#', '#....#', '#....#', '######'], 0),
}
def cw_bitmap(gname, dy=0):
    """ClassWiz glyph outline -> bitmap in our cell (sampled at pixel centres), shifted down by dy units."""
    gs = CW.getGlyphSet(); from fontTools.pens.recordingPen import RecordingPen
    rp = RecordingPen(); gs[gname].draw(rp)
    h = ASC + DESC; adv = CW['hmtx'][gname][0] // U
    im = Image.new('L', (adv * 10, h * 10), 0); d = ImageDraw.Draw(im)
    acc = np.zeros((h * 10, adv * 10), bool); cur = []
    for op, args in rp.value:
        if op == 'moveTo': cur = [args[0]]
        elif op == 'lineTo': cur.append(args[0])
        elif op in ('closePath', 'endPath'):
            m = Image.new('1', (adv * 10, h * 10), 0)
            ImageDraw.Draw(m).polygon([(x, (ASC * U - (y - dy))) for x, y in cur], fill=1); acc ^= np.array(m); cur = []
        else: cur.extend(args)
    out = np.zeros((h, adv), np.uint8)
    for r in range(h):
        for c in range(adv): out[r, c] = 1 if acc[r * 10 + 5, c * 10 + 5] else 0
    return out

def small_glyph(ch, raised=False):
    if ch in SMALL_FROM_CW:
        b = cw_bitmap(SMALL_FROM_CW[ch], dy=0 if raised else 50)
        ys, xs = np.nonzero(b); out = np.zeros((ASC + DESC, SW if not raised else BW), np.uint8)
        if not len(xs): return out
        w = xs.max() + 1 - xs.min(); left = (out.shape[1] - w + 1) // 2
        out[:, left:left + w] = b[:, xs.min():xs.max() + 1]; return out
    if ch in SMALL_ART: rows, b = SMALL_ART[ch]; return art(rows, SW, b)
    f = 'cour.ttf' if has('cour.ttf', ch) else 'arial.ttf'
    return raster(ch, f, 11, SW, bold=True)

# ---------------------------------------------------------------- italic face for variables
ITAL_FROM_CW = {'x': 'xbolditalic', 'y': 'ybolditalic', 'z': 'zbolditalic', 'e': 'ebolditalic', 'i': 'ibolditalic',
                'π': 'piitalic', 'θ': 'thetaitalic', 't': 'titalic', 'F': 'Fitalic', 'α': 'alphaitalic', 'μ': 'muitalic', 'σ': 'sigmaitalic'}
def ital_glyph(ch):
    if ch in ITAL_FROM_CW: return cw_bitmap(ITAL_FROM_CW[ch])[:, :BW]
    f = 'SCHLBKI.TTF' if has('SCHLBKI.TTF', ch) else 'cour.ttf'
    return raster(ch, f, 16, BW)

# ---------------------------------------------------------------- font building (pixel squares)
def outline(bits):
    pen = TTGlyphPen(None); h, w = bits.shape; runs = {}; rects = []
    for r in range(h):
        row = bits[r]; c = 0; cur = {}
        while c < w:
            if row[c]:
                s = c
                while c < w and row[c]: c += 1
                cur[(s, c)] = runs.pop((s, c), r)
            else: c += 1
        for k, r0 in runs.items(): rects.append((k[0], r0, k[1], r))
        runs = cur
    for k, r0 in runs.items(): rects.append((k[0], r0, k[1], h))
    for x0, r0, x1, r1 in rects:
        X0, X1, Yt, Yb = x0 * U, x1 * U, (ASC - r0) * U, (ASC - r1) * U
        pen.moveTo((X0, Yb)); pen.lineTo((X0, Yt)); pen.lineTo((X1, Yt)); pen.lineTo((X1, Yb)); pen.closePath()
    return pen.glyph()

def build(name, chars, gfun, notice):
    glyphs = {'.notdef': TTGlyphPen(None).glyph(), 'space': TTGlyphPen(None).glyph()}
    order = ['.notdef', 'space']; cmap = {32: 'space', 160: 'space'}; bitmaps = {}
    adv0 = None; metrics = {}
    for ch in chars:
        gn = 'u%04X' % ord(ch); b = gfun(ch); bitmaps[ch] = b
        glyphs[gn] = outline(b); order.append(gn); cmap[ord(ch)] = gn; metrics[gn] = b.shape[1] * U
        adv0 = adv0 or b.shape[1] * U
    metrics['.notdef'] = metrics['space'] = adv0
    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order); fb.setupCharacterMap(cmap); fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics({k: (v, 0) for k, v in metrics.items()})
    fb.setupHorizontalHeader(ascent=ASC * U, descent=-DESC * U)
    fb.setupNameTable({'familyName': name, 'styleName': 'Regular', 'copyright': notice,
                       'licenseDescription': 'This Font Software is licensed under the SIL Open Font License, Version 1.1.',
                       'licenseInfoURL': 'https://openfontlicense.org'})
    fb.setupOS2(sTypoAscender=ASC * U, sTypoDescender=-DESC * U, sTypoLineGap=0, usWinAscent=ASC * U, usWinDescent=DESC * U, fsType=0)
    fb.setupPost()
    buf = io.BytesIO(); fb.save(buf)
    return buf.getvalue(), bitmaps

CW_NOTICE = ('Copyright (c) 2020-2026, Windy Deng (windy0deng@gmail.com), with Reserved Font Name "ClassWiz X Display". '
             'Copyright (c) 2014-2026, CASIO Computer Co., Ltd. Modified for StudyNet (glyphs moved and added).')
OWN_NOTICE = 'StudyNet LCD fallback glyphs. Licensed under the SIL Open Font License 1.1.'

# Characters the calculator can put on its screen that the ClassWiz face lacks.
FALLBACK_CHARS = ''.join(sorted(set(c for c in 'πθσΣ·′″►◄—’”•¦←⇔≈ŷȳˣ⁻' if ord(c) not in CWMAP)))

def main():
    small, sb = build('SN LCD Small', '0123456789nxrg()+-−.,×÷=/πθey°□ABCDEFMXYabcdfhijklmopqstuvwz', small_glyph, CW_NOTICE)
    ital, ib = build('SN LCD Italic', 'xyzeiπθtFαμσABCDEMXYabcdfghjklmnopqrsuvw', ital_glyph, CW_NOTICE)
    fall, fb = build('SN LCD', FALLBACK_CHARS, fallback_glyph, OWN_NOTICE)
    cw = open(os.path.join(CWDIR, 'ClassWizXDisplay-Regular.woff2'), 'rb').read()
    b64 = lambda x: base64.b64encode(x).decode()
    js = ('/* Calculator screen fonts, generated by tools/lcdfont.py. Do not edit by hand.\n'
          '   cw: "ClassWiz X Display" v3.008 by Windy Deng, unmodified. Copyright (c) 2020-2026 Windy Deng, with Reserved Font\n'
          '       Name "ClassWiz X Display"; Copyright (c) 2014-2026 CASIO Computer Co., Ltd. SIL Open Font License 1.1\n'
          '       (fonts/classwiz-x-display/OFL.txt, https://openfontlicense.org). StudyNet is not connected with CASIO.\n'
          '   small, ital: modified from it for StudyNet (renamed, same licence). fall: StudyNet\'s own fallback glyphs (OFL 1.1). */\n'
          'window.SN_LCD_FONTS = {\n'
          "  cw: '%s',\n  small: '%s',\n  ital: '%s',\n  fall: '%s'\n};\n") % (b64(cw), b64(small), b64(ital), b64(fall))
    open(os.path.join(ROOT, 'calc-lcd.js'), 'w', encoding='utf-8', newline='\n').write(js)
    # preview
    h = ASC + DESC
    def strip(s, bm, cw_):
        return np.hstack([bm.get(c, np.zeros((h, cw_), np.uint8)) for c in s])
    rows = [strip('0123456789nxrg()+-.×÷=/πθey°□ABCDEF', sb, SW), strip('xyzeiπθtFABCDEMXYabcd', ib, BW), strip(FALLBACK_CHARS, fb, BW)]
    W = max(r.shape[1] for r in rows)
    a = np.vstack([np.pad(r, ((0, 2), (0, W - r.shape[1]))) for r in rows])
    Image.fromarray((1 - a) * 255).resize((W * 4, a.shape[0] * 4), Image.NEAREST).save(os.path.join(ROOT, 'tools', 'lcdfont-preview.png'))
    print('fallback chars:', FALLBACK_CHARS.encode('unicode_escape').decode(), '| sizes', len(cw), len(small), len(ital), len(fall))

if __name__ == '__main__':
    main()
