"""Normalize individually generated card-theme artwork into production assets.

Only the quiet middle 20% is stretched or compressed. The authored frame,
corners, and edge ornaments retain their original proportions.
"""

from pathlib import Path

from PIL import Image
from PIL import ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "showroom-v8" / "card_theme"
TARGET = (1680, 400)
KEY = (255, 0, 255)
QA_MONTAGE = ROOT / "tmp" / "card-theme-individual-qa.jpg"

SOURCES = {
    "ct8_u_bear_dugout": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_7YppsABhmCMq4fNxYOfXMwTJ.png",
    "ct8_u_twin_stadium": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_goXfSbY2PRUoCL0VW6fLSN2V.png",
    "ct8_u_tiger_clubhouse": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_fvI6feKCL8N3N2gwIMm2bJRU.png",
    "ct8_u_walnut_cafe": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_VMmLb7VxcOqqiu0mvosDlMhW.png",
    "ct8_u_dawn_runner": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_CKfPfxKz97AvIKhPPgy5Lg3Q.png",
    "ct8_r_wolong_silk": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_2JWeYIg7aKdLO8JcJfwVIbDz.png",
    "ct8_r_red_hare_lacquer": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_TcXlWirLRLIduluQKNKODUf1.png",
    "ct8_r_crescent_dragon": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_3qN3yjkzJBobc9uvY1SEyijy.png",
    "ct8_r_imperial_bronze": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_fbitrRtXQfXnMklXFVSvYmuI.png",
    "ct8_r_moon_archive": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_4Qq5v2h109owCiz84MQvhmA5.png",
    "ct8_e_crimson_reactor": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_bOaytYrvzX4tOAKjXNQxvqaR.png",
    "ct8_e_storm_guardian": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_xE97suhR0x6d9MDJvC5hchV9.png",
    "ct8_e_web_tech": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_JQO2Zc1olIs4UxCTFUeVlfW5.png",
    "ct8_e_dimensional_mystic": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_zJMYbjrJmkYVAYovjLw6h8HX.png",
    "ct8_e_kinetic_alloy": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_PX04sZ85SShDFLUkP1sYoKFf.png",
}


def key_distance(pixel):
    return abs(pixel[0] - KEY[0]) + abs(pixel[1] - KEY[1]) + abs(pixel[2] - KEY[2])


def crop_key_gutters(image):
    rgb = image.convert("RGB")
    # Scan rows and columns. A row/column belongs to the artwork when at least
    # 1% of its pixels are meaningfully different from the flat key.
    rows = []
    for y in range(rgb.height):
        count = sum(key_distance(rgb.getpixel((x, y))) > 70 for x in range(rgb.width))
        if count >= max(4, rgb.width // 100):
            rows.append(y)
    cols = []
    for x in range(rgb.width):
        count = sum(key_distance(rgb.getpixel((x, y))) > 70 for y in range(rgb.height))
        if count >= max(4, rgb.height // 100):
            cols.append(x)
    if not rows or not cols:
        raise ValueError("No non-key artwork found")
    cropped = rgb.crop((min(cols), min(rows), max(cols) + 1, max(rows) + 1))
    rgba = cropped.convert("RGBA")
    pixels = []
    for red, green, blue, _ in rgba.getdata():
        distance = key_distance((red, green, blue))
        if distance <= 28:
            alpha = 0
        elif distance >= 150:
            alpha = 255
        else:
            alpha = round((distance - 28) / 122 * 255)
        # Despill the chroma edge so interpolation cannot leave a pink fringe.
        if alpha < 255:
            magenta_excess = max(0, red - max(green, blue))
            red = max(0, red - round(magenta_excess * (1 - alpha / 255)))
        pixels.append((red, green, blue, alpha))
    rgba.putdata(pixels)
    return rgba


def normalize_middle_only(image):
    scale = TARGET[1] / image.height
    width = round(image.width * scale)
    image = image.resize((width, TARGET[1]), Image.Resampling.LANCZOS)
    if width == TARGET[0]:
        return image

    left_x = round(width * 0.42)
    right_x = round(width * 0.58)
    left = image.crop((0, 0, left_x, TARGET[1]))
    middle = image.crop((left_x, 0, right_x, TARGET[1]))
    right = image.crop((right_x, 0, width, TARGET[1]))
    middle_width = TARGET[0] - left.width - right.width
    if middle_width < 40:
        # The target is narrower than the immutable ornament zones. Scale the
        # whole image minimally rather than amputating authored corners.
        return image.resize(TARGET, Image.Resampling.LANCZOS)
    middle = middle.resize((middle_width, TARGET[1]), Image.Resampling.LANCZOS)
    result = Image.new("RGBA", TARGET, (0, 0, 0, 0))
    result.paste(left, (0, 0))
    result.paste(middle, (left.width, 0))
    result.paste(right, (left.width + middle.width, 0))
    return result


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for theme_id, source in SOURCES.items():
        source_path = Path(source)
        if not source_path.exists():
            raise FileNotFoundError(source_path)
        cropped = crop_key_gutters(Image.open(source_path))
        final = normalize_middle_only(cropped)
        output = OUT / f"{theme_id}.webp"
        final.save(output, "WEBP", quality=94, method=6)
        print(f"{theme_id}: {cropped.size} -> {final.size} ({output.stat().st_size} bytes)")

    QA_MONTAGE.parent.mkdir(parents=True, exist_ok=True)
    thumb_size = (840, 200)
    label_height = 28
    montage = Image.new("RGB", (thumb_size[0] * 2, (thumb_size[1] + label_height) * 8), "#080b11")
    draw = ImageDraw.Draw(montage)
    for index, theme_id in enumerate(SOURCES):
        x = (index % 2) * thumb_size[0]
        y = (index // 2) * (thumb_size[1] + label_height)
        image = Image.open(OUT / f"{theme_id}.webp").convert("RGBA")
        checker = Image.new("RGB", thumb_size, "#151922")
        thumb = image.resize(thumb_size, Image.Resampling.LANCZOS)
        checker.paste(thumb, (0, 0), thumb)
        montage.paste(checker, (x, y + label_height))
        draw.text((x + 8, y + 7), theme_id, fill="#ffffff")
    montage.save(QA_MONTAGE, quality=91)
    print(f"QA montage: {QA_MONTAGE}")


if __name__ == "__main__":
    main()
