"""Bakes the calculator's body and keys into images (calc/body.webp, calc/keys.webp).

Needs the local server running (python -m http.server 5417) and Playwright with Chromium:
  python tools/bake.py            [--scale 36]   (1em = scale px; the images are 25.4em x 54.9em)
"""
import io, os, sys
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCALE = int(sys.argv[sys.argv.index('--scale') + 1]) if '--scale' in sys.argv else 36
BASE = 'http://localhost:5417/tools/calc-bake.html'

def shoot(page, ps):
    page.goto(BASE + '?pass=' + ps, wait_until='networkidle')
    page.wait_for_selector('body[data-ready="1"]')
    page.evaluate('document.fonts.ready')
    page.evaluate("document.getElementById('calc').style.fontSize = '%dpx'" % SCALE)
    page.wait_for_timeout(400)
    png = page.locator('#calc .czbody').screenshot(omit_background=True, animations='disabled')
    return Image.open(io.BytesIO(png)).convert('RGBA')

def main():
    os.makedirs(os.path.join(ROOT, 'calc'), exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={'width': 860, 'height': int(SCALE * 60)}, device_scale_factor=1)
        for ps in ('body', 'keys'):
            im = shoot(page, ps)
            out = os.path.join(ROOT, 'calc', ps + '.webp')
            im.save(out, 'WEBP', quality=80, method=6)
            im.save(os.path.join(ROOT, 'tools', 'bake-' + ps + '.png'))
            print(ps, im.size, os.path.getsize(out), 'bytes')
        b.close()

if __name__ == '__main__':
    main()
