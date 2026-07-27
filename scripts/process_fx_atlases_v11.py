from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "showroom-v11" / "ambient_effect"

ATLASES = {
    "ae11_u_champion_stadium": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_vCpv1YXQxoDZAwtlWL7mvv04.png"),
    "ae11_u_ink_battlefield": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_5C2Wk91YFMYHguVubx3GsHsJ.png"),
    "ae11_r_eight_formation": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_0d0E06CCFwH0r8V3NH718JfO.png"),
    "ae11_r_red_cliff": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_PTlOjxNK0TGHKiH0tjuLWiM7.png"),
    "ae11_e_storm_dimension": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_DDXZHXJLMnEtaYKCh7oTCzFP.png"),
    "ae11_e_crimson_chaos": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_2BLsDBKVqUeHuwqo8dJRegw9.png"),
    "ae11_m_frozen_crown": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_wl3UfpN747hHRpXIhOlXH0Pb.png"),
    "ae11_m_black_sanctuary": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_ZRZ4ZC8braKn5FfMuC0Wt81q.png"),
}


def remove_magenta(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, _ = pixels[x, y]
            distance = ((255 - r) ** 2 + g**2 + (255 - b) ** 2) ** 0.5
            if distance <= 18:
                alpha = 0
            elif distance >= 100:
                alpha = 255
            else:
                alpha = round((distance - 18) / 82 * 255)
            if alpha < 58:
                alpha = 0
            elif alpha < 255:
                blend = alpha / 255
                r = round((r - 255 * (1 - blend)) / blend)
                g = round(g / blend)
                b = round((b - 255 * (1 - blend)) / blend)
                r, g, b = (max(0, min(255, value)) for value in (r, g, b))
            pixels[x, y] = (r, g, b, alpha)
    return image


def normalize(image: Image.Image, size: int = 384) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return Image.new("RGBA", (size, size))
    subject = image.crop(bbox)
    target = round(size * 0.88)
    scale = min(target / subject.width, target / subject.height)
    subject = subject.resize(
        (max(1, round(subject.width * scale)), max(1, round(subject.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (size, size))
    canvas.alpha_composite(subject, ((size - subject.width) // 2, (size - subject.height) // 2))
    return canvas


def split_atlas(item_id: str, source: Path) -> None:
    image = Image.open(source).convert("RGB")
    cell_width, cell_height = image.width / 4, image.height / 2
    for index in range(8):
        column, row = index % 4, index // 4
        margin = 6
        box = (
            round(column * cell_width) + margin,
            round(row * cell_height) + margin,
            round((column + 1) * cell_width) - margin,
            round((row + 1) * cell_height) - margin,
        )
        sprite = normalize(remove_magenta(image.crop(box)))
        sprite.save(OUT / f"{item_id}_{index + 1:02d}.png", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for item_id, source in ATLASES.items():
        if not source.exists():
            raise FileNotFoundError(source)
        split_atlas(item_id, source)
        print(item_id)


if __name__ == "__main__":
    main()
