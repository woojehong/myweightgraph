"""Mechanical post-processing for approved Showroom V13 ImageGen sources."""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageChops
import math

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "showroom-v13"


def chroma_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    px = rgba.load()
    key_samples = [
        px[2, 2][:3], px[rgba.width - 3, 2][:3],
        px[2, rgba.height - 3][:3], px[rgba.width - 3, rgba.height - 3][:3],
    ]
    key = tuple(sum(sample[i] for sample in key_samples) / len(key_samples) for i in range(3))
    out = Image.new("L", rgba.size)
    alpha = out.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            rgb = px[x, y][:3]
            distance = math.sqrt(sum((rgb[i] - key[i]) ** 2 for i in range(3)))
            alpha[x, y] = 0 if distance < 42 else 255 if distance > 82 else round((distance - 42) / 40 * 255)
    rgba.putalpha(out)
    return rgba


def fit_square(image: Image.Image, size: int = 1024, padding: float = .035) -> Image.Image:
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    if not box:
        raise ValueError("asset has no visible pixels")
    subject = image.crop(box)
    target = round(size * (1 - padding * 2))
    subject.thumbnail((target, target), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size))
    canvas.alpha_composite(subject, ((size - subject.width) // 2, (size - subject.height) // 2))
    return canvas


def save_alpha(source: Path, target: Path, *, fit: bool = False) -> None:
    image = chroma_alpha(Image.open(source))
    if fit:
        image = fit_square(image)
    else:
        image = image.resize((1024, 1024), Image.Resampling.LANCZOS)
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "WEBP", lossless=True, method=6)


def save_card(source: Path, target: Path) -> None:
    image = Image.open(source).convert("RGB")
    image = image.resize((1680, round(image.height * 1680 / image.width)), Image.Resampling.LANCZOS)
    h = image.height
    top_end = round(h * .17)
    bottom_start = round(h * .83)
    top = image.crop((0, 0, 1680, top_end)).resize((1680, 90), Image.Resampling.LANCZOS)
    middle = image.crop((0, top_end, 1680, bottom_start)).resize((1680, 220), Image.Resampling.LANCZOS)
    bottom = image.crop((0, bottom_start, 1680, h)).resize((1680, 90), Image.Resampling.LANCZOS)
    output = Image.new("RGB", (1680, 400))
    output.paste(top, (0, 0))
    output.paste(middle, (0, 90))
    output.paste(bottom, (0, 310))
    target.parent.mkdir(parents=True, exist_ok=True)
    output.save(target, "WEBP", quality=93, method=6)


def save_marker_sheet(source: Path, item_id: str) -> None:
    image = chroma_alpha(Image.open(source))
    half = image.width // 2
    for suffix, crop in (
        ("high", (0, 0, half, image.height)),
        ("low", (half, 0, image.width, image.height)),
    ):
        marker = fit_square(image.crop(crop), size=512, padding=.07)
        marker.save(ASSETS / "point_marker" / f"{item_id}_{suffix}.webp", "WEBP", lossless=True, method=6)
    # Catalog `asset` is the low marker and must be a real unique file.
    low = Image.open(ASSETS / "point_marker" / f"{item_id}_low.webp")
    low.save(ASSETS / "point_marker" / f"{item_id}.webp", "WEBP", lossless=True, method=6)


def main() -> None:
    for source in (ASSETS / "card_theme").glob("*.source.png"):
        save_card(source, source.with_name(source.name.replace(".source.png", ".webp")))
    for folder in ("profile_emoji", "emoji_border"):
        for source in (ASSETS / folder).glob("*.source.png"):
            save_alpha(source, source.with_name(source.name.replace(".source.png", ".webp")), fit=folder == "profile_emoji")
    for source in (ASSETS / "point_marker").glob("*.source.png"):
        save_marker_sheet(source, source.name.replace(".source.png", ""))


if __name__ == "__main__":
    main()
