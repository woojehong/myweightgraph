"""Remove isolated sheet-split debris from approved V13 high-point markers.

The primary medallion is centered. The accidental paired-sheet fragment sits
outside a 48% radius and can be removed without redrawing or resampling the art.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MARKERS = (
    "pm13_e_arc_reactor_high.webp",
    "pm13_e_crimson_hex_high.webp",
    "pm13_e_star_shield_high.webp",
    "pm13_m_azshara_tiara_high.webp",
    "pm13_m_banshee_arrow_high.webp",
    "pm13_m_sunwell_orb_high.webp",
    "pm13_u_loopy_cheer_high.webp",
)


def clean(path: Path) -> int:
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    cx, cy = (width - 1) / 2, (height - 1) / 2
    radius_sq = (min(width, height) * 0.48) ** 2
    pixels = image.load()
    removed = 0
    for y in range(height):
        for x in range(width):
            if pixels[x, y][3] and (x - cx) ** 2 + (y - cy) ** 2 > radius_sq:
                pixels[x, y] = (0, 0, 0, 0)
                removed += 1
    image.save(path, "WEBP", lossless=True, method=6)
    return removed


if __name__ == "__main__":
    folder = ROOT / "assets" / "showroom-v13" / "point_marker"
    for filename in MARKERS:
        path = folder / filename
        print(f"{filename}: removed {clean(path)} pixels")
