"""Make installable .ttf fonts for the template kit.

Keynote, PowerPoint and Canva need ordinary installed fonts, and handle
variable fonts badly. This cuts static fonts from the same Fraunces and
Manrope files the deck uses, at the settings the deck uses, named so each
family has Regular / Italic / Bold / Bold Italic the apps understand:

  Fraunces  Regular      weight 500, optical size 144, soft 50  (titles)
            Italic       weight 400, optical size 144, soft 100, wonky ("of Wonders")
            Bold         weight 700, optical size 144, soft 0   (big numbers)
            Bold Italic  weight 700, optical size 144, soft 100
  Manrope   Regular 400, Bold 800 (small capitals labels); Manrope SemiBold 600

Both are SIL Open Font License fonts with no reserved names.

Usage: python fonts.py <repo root> <output dir>   (needs fonttools and brotli)
"""
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

repo = Path(sys.argv[1])
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

FR = repo / "node_modules/@fontsource-variable/fraunces/files"
MR = repo / "node_modules/@fontsource/manrope/files"


def name(font, family, style, weight, italic, bold):
    ps = f"{family}-{style}".replace(" ", "")
    t = font["name"]
    # Drop typographic family/style names so apps group by the four basic styles.
    t.names = [n for n in t.names if n.nameID not in (1, 2, 3, 4, 6, 16, 17, 21, 22, 25)]
    for nid, val in ((1, family), (2, style), (3, f"{ps};SparkPoint Gala kit"), (4, f"{family} {style}"), (6, ps)):
        t.setName(val, nid, 3, 1, 0x409)
        t.setName(val, nid, 1, 0, 0)
    os2 = font["OS/2"]
    os2.usWeightClass = weight
    sel = os2.fsSelection & ~0b1100001  # clear italic, bold, regular
    if italic:
        sel |= 0b1
    if bold:
        sel |= 0b100000
    if not italic and not bold:
        sel |= 0b1000000
    os2.fsSelection = sel
    font["head"].macStyle = (0b10 if italic else 0) | (0b1 if bold else 0)
    if "STAT" in font:
        del font["STAT"]


def cut(src, axes, family, style, weight, italic, bold):
    font = TTFont(src)
    font.flavor = None
    if "fvar" in font:
        present = {a.axisTag for a in font["fvar"].axes}
        font = instantiateVariableFont(font, {k: v for k, v in axes.items() if k in present})
    name(font, family, style, weight, italic, bold)
    path = out / f"{family.replace(' ', '')}-{style.replace(' ', '')}.ttf"
    font.save(path)
    print(path.name)


cut(FR / "fraunces-latin-full-normal.woff2", {"wght": 500, "opsz": 144, "SOFT": 50, "WONK": 0}, "Fraunces", "Regular", 400, False, False)
cut(FR / "fraunces-latin-full-italic.woff2", {"wght": 400, "opsz": 144, "SOFT": 100, "WONK": 1}, "Fraunces", "Italic", 400, True, False)
cut(FR / "fraunces-latin-full-normal.woff2", {"wght": 700, "opsz": 144, "SOFT": 0, "WONK": 0}, "Fraunces", "Bold", 700, False, True)
cut(FR / "fraunces-latin-full-italic.woff2", {"wght": 700, "opsz": 144, "SOFT": 100, "WONK": 1}, "Fraunces", "Bold Italic", 700, True, True)
cut(MR / "manrope-latin-400-normal.woff2", {}, "Manrope", "Regular", 400, False, False)
cut(MR / "manrope-latin-800-normal.woff2", {}, "Manrope", "Bold", 700, False, True)
cut(MR / "manrope-latin-600-normal.woff2", {}, "Manrope SemiBold", "Regular", 400, False, False)

(out / "OFL.txt").write_text(
    (repo / "node_modules/@fontsource-variable/fraunces/LICENSE").read_text()
    + "\n\n"
    + (repo / "node_modules/@fontsource/manrope/LICENSE").read_text()
)
