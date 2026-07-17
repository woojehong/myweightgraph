"""Build standardized transparent 2D avatar bodies from the approved art sheet."""

from pathlib import Path

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/avatar-v2/body-sheet-v3.png"
OUT_DIR = ROOT / "assets/avatar-v2"

# Approved v3 sheet: five figures in order, with padding kept around hands/feet.
CROPS = {
    "basic": (35, 30, 345, 920),
    "slim": (360, 30, 675, 920),
    "toned": (675, 30, 995, 920),
    "power": (990, 30, 1335, 920),
    "physique": (1320, 30, 1685, 920),
}


def standardize(image: Image.Image) -> Image.Image:
    cutout = remove(image.convert("RGBA"), alpha_matting=True,
                    alpha_matting_foreground_threshold=235,
                    alpha_matting_background_threshold=20,
                    alpha_matting_erode_size=5)
    alpha = cutout.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError("Background removal produced an empty image")
    subject = cutout.crop(bbox)
    max_w, max_h = 420, 870
    scale = min(max_w / subject.width, max_h / subject.height)
    subject = subject.resize(
        (round(subject.width * scale), round(subject.height * scale)),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (460, 900), (0, 0, 0, 0))
    x = (canvas.width - subject.width) // 2
    y = canvas.height - subject.height - 10
    canvas.alpha_composite(subject, (x, y))
    return canvas


def main() -> None:
    sheet = Image.open(SOURCE)
    for body_id, crop in CROPS.items():
        output = OUT_DIR / f"body-{body_id}.png"
        standardize(sheet.crop(crop)).save(output, optimize=True)
        print(body_id, output, output.stat().st_size)


if __name__ == "__main__":
    main()
