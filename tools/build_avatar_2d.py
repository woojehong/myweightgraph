"""Build standardized transparent 2D avatar bodies from the approved art sheet."""

from pathlib import Path

import numpy as np
from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/avatar-v2/body-sheet-v3.png"
OUT_DIR = ROOT / "assets/avatar-v2"
EQUIPMENT_SOURCE = OUT_DIR / "equipment-atlas-v3-keyed.png"
EQUIPMENT_DIR = OUT_DIR / "items"

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

    build_equipment()


def remove_magenta(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    source = np.asarray(rgba.convert("RGB"), dtype=np.float32)
    key_rgb = np.array([255.0, 0.0, 255.0], dtype=np.float32)
    distance = np.sqrt(np.sum((source - key_rgb) ** 2, axis=2)) / np.sqrt(3.0)
    alpha_array = np.clip((distance - 4.0) / 86.0, 0.0, 1.0)
    alpha = Image.fromarray(np.round(alpha_array * 255).astype(np.uint8), "L")
    a = np.asarray(alpha, dtype=np.float32) / 255.0
    safe = np.maximum(a[..., None], 1 / 255)
    foreground = (source - (1.0 - a[..., None]) * key_rgb) / safe
    foreground = np.clip(foreground, 0, 255).astype(np.uint8)
    result = Image.fromarray(foreground, "RGB").convert("RGBA")
    result.putalpha(alpha)
    return result


def build_equipment() -> None:
    atlas = Image.open(EQUIPMENT_SOURCE).convert("RGBA")
    EQUIPMENT_DIR.mkdir(parents=True, exist_ok=True)
    rows = ("hair", "headgear", "top", "bottom", "right", "left")
    for row, slot in enumerate(rows):
        y0 = round(row * atlas.height / 6)
        y1 = round((row + 1) * atlas.height / 6)
        for column in range(10):
            x0 = round(column * atlas.width / 10)
            x1 = round((column + 1) * atlas.width / 10)
            cell = atlas.crop((x0, y0, x1, y1))
            if cell.getchannel("A").getextrema()[0] == 255:
                cell = remove_magenta(cell)
            bbox = cell.getchannel("A").getbbox()
            if not bbox:
                raise RuntimeError(f"Empty equipment cell {slot} {column + 1}")
            subject = cell.crop(bbox)
            canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
            scale = min(238 / subject.width, 238 / subject.height)
            subject = subject.resize((round(subject.width * scale), round(subject.height * scale)), Image.Resampling.LANCZOS)
            canvas.alpha_composite(subject, ((256 - subject.width) // 2, (256 - subject.height) // 2))
            output = EQUIPMENT_DIR / f"{slot}-{column + 1:02d}.png"
            canvas.save(output, optimize=True)
            print(slot, column + 1, output.stat().st_size)
            if slot == "bottom":
                # The lower third is a dedicated shoe layer; pants remain in bottom-XX.
                lower = subject.crop((0, round(subject.height * .64), subject.width, subject.height))
                shoe_canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
                shoe_scale = min(238 / lower.width, 150 / max(1, lower.height))
                lower = lower.resize((round(lower.width * shoe_scale), round(lower.height * shoe_scale)), Image.Resampling.LANCZOS)
                shoe_canvas.alpha_composite(lower, ((256 - lower.width) // 2, 256 - lower.height - 8))
                shoe_output = EQUIPMENT_DIR / f"shoes-{column + 1:02d}.png"
                shoe_canvas.save(shoe_output, optimize=True)
                print("shoes", column + 1, shoe_output.stat().st_size)


if __name__ == "__main__":
    main()
