from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "showroom-v10" / "trophy"

SOURCES = {
    "tr_a_world_series_constellation": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_HlBUyvtYY25AaQIA9ZgXPv7X.png"),
    "tr_a_big_ears": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_ZtZhaxI3jUL1bB5syu7S97N9.png"),
    "tr_a_world_cup_orb": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_6aElSZW959xZ3dR8r6xIMVLn.png"),
    "tr_a_club_world_orbit": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_K2Pog9h3weB4e2acdDuNr609.png"),
    "tr_a_golden_ball": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_LawaJFOA3pOcDwUbWUEdOSOG.png"),
    "tr_a_summoners_cup": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_v5Tl7a6d2xphAp3kogDUVgHu.png"),
    "tr_a_stanley_tower": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_qKSKJkGGlrgyoKOmMo1joFWQ.png"),
    "tr_a_golden_gramophone": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_oKM6vSOpzMHEfT4Wd9jclToM.png"),
    "tr_a_cinema_guardian": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_LxTrxx5tUtNmYosBPnwQ1mXp.png"),
    "tr_a_frostmourne_statue": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_6O7gjxrWbJIk3kob0PBSwSDr.png"),
    "tr_a_doomhammer_statue": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_uvHXDUkRbLvU8jjXU3kUdTY6.png"),
    "tr_a_aegis_shield": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_fKRW6WQ2GFGjRFMO1gLesaxI.png"),
}


def remove_magenta(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, _ = pixels[x, y]
            distance = ((255 - r) ** 2 + g**2 + (255 - b) ** 2) ** 0.5
            if distance <= 16:
                alpha = 0
            elif distance >= 90:
                alpha = 255
            else:
                alpha = round((distance - 16) / 74 * 255)
            if alpha < 64:
                alpha = 0
            elif alpha < 255:
                blend = alpha / 255
                r = round((r - 255 * (1 - blend)) / blend)
                g = round(g / blend)
                b = round((b - 255 * (1 - blend)) / blend)
                r, g, b = (max(0, min(255, value)) for value in (r, g, b))
            pixels[x, y] = (r, g, b, alpha)
    return image


def normalize_square(image: Image.Image, size: int = 512) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        raise ValueError("No non-transparent trophy content found")
    subject = image.crop(bbox)
    target = round(size * 0.88)
    scale = min(target / subject.width, target / subject.height)
    subject = subject.resize(
        (max(1, round(subject.width * scale)), max(1, round(subject.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(subject, ((size - subject.width) // 2, (size - subject.height) // 2))
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for item_id, source_path in SOURCES.items():
        if not source_path.exists():
            raise FileNotFoundError(source_path)
        output = OUT / f"{item_id}.png"
        normalize_square(remove_magenta(Image.open(source_path))).save(output, optimize=True)
        print(output.relative_to(ROOT))


if __name__ == "__main__":
    main()
