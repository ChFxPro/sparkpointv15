"""Make installable .ttf fonts for the template kit.

Keynote, PowerPoint and Canva need ordinary installed fonts, and handle
variable fonts badly. This cuts static Josefin Sans (the Gala's one face)
from the same variable file the deck uses, named so each family has the
Regular / Italic / Bold / Bold Italic the apps understand:

  Josefin Sans           Regular 400, Italic 400, Bold 700, Bold Italic 700
  Josefin Sans Light     Regular 300, Italic 300   (the tagline, quotes)
  Josefin Sans SemiBold  Regular 600, Italic 600   (titles, labels, figures)

Open Font License, no reserved names.

Usage: python fonts.py <gala-show dir> <output dir>   (needs fonttools and brotli)
"""
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

app = Path(sys.argv[1])
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

JS = app / "node_modules/@fontsource-variable/josefin-sans"
NORMAL = JS / "files/josefin-sans-latin-wght-normal.woff2"
ITALIC = JS / "files/josefin-sans-latin-wght-italic.woff2"


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


def cut(src, wght, family, style, weight, italic, bold):
    font = TTFont(src)
    font.flavor = None
    font = instantiateVariableFont(font, {"wght": wght})
    name(font, family, style, weight, italic, bold)
    path = out / f"{family.replace(' ', '')}-{style.replace(' ', '')}.ttf"
    font.save(path)
    print(path.name)


cut(NORMAL, 400, "Josefin Sans", "Regular", 400, False, False)
cut(ITALIC, 400, "Josefin Sans", "Italic", 400, True, False)
cut(NORMAL, 700, "Josefin Sans", "Bold", 700, False, True)
cut(ITALIC, 700, "Josefin Sans", "Bold Italic", 700, True, True)
cut(NORMAL, 300, "Josefin Sans Light", "Regular", 300, False, False)
cut(ITALIC, 300, "Josefin Sans Light", "Italic", 300, True, False)
cut(NORMAL, 600, "Josefin Sans SemiBold", "Regular", 600, False, False)
cut(ITALIC, 600, "Josefin Sans SemiBold", "Italic", 600, True, False)

(out / "OFL.txt").write_text((JS / "LICENSE").read_text())
