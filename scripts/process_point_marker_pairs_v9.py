from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "showroom-v9" / "point_marker"

SOURCES = {
    "pm_u_bears_signature": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_CCmRQwHA6vdxeHcr3FpjAsQP.png"),
    "pm_u_twins_signature": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_locGV94dazjJgwebhqpfT5J4.png"),
    "pm_u_softbear_signature": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_MEKJ9wWW1q7U21Ip7BosJk5l.png"),
    "pm_r_feather_stratagem": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_azHkRxFgUmdf7jDoVi95YRm7.png"),
    "pm_e_thunder_hammer": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_mfEY5AUCNtmczM0afyyPM1XJ.png"),
    "pm_l_frozen_runeblade": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_mkXG3kW4mVB6zN1ewsN3nUIf.png"),
    "pm_l_tidal_archmage": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_Qp2MJYdZgdKq5NMGxu0GMJOm.png"),
    "pm_l_iron_warchief": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_wzLZk1G1VeZbWijEgJDy4rmY.png"),
    "pm_l_raven_tower": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_zVz546sch7Xy3f4ugPgOmVk1.png"),
    "pm_l_fel_twinblade": Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_jaRcs9SqW8c510zFtznwSTY5.png"),
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
                # Remove magenta spill from antialiased edge pixels.
                blend = alpha / 255
                if blend:
                    r = round((r - 255 * (1 - blend)) / blend)
                    g = round(g / blend)
                    b = round((b - 255 * (1 - blend)) / blend)
                r, g, b = (max(0, min(255, value)) for value in (r, g, b))
            pixels[x, y] = (r, g, b, alpha)
    return image


def normalize_square(image: Image.Image, size: int = 512) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise ValueError("No non-transparent marker content found")
    subject = image.crop(bbox)
    target = round(size * 0.9)
    scale = min(target / subject.width, target / subject.height)
    resized = subject.resize(
        (max(1, round(subject.width * scale)), max(1, round(subject.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(
        resized,
        ((size - resized.width) // 2, (size - resized.height) // 2),
    )
    return canvas


def process_pair(item_id: str, source_path: Path) -> None:
    source = remove_magenta(Image.open(source_path))
    midpoint = source.width // 2
    halves = {
        "high": source.crop((0, 0, midpoint, source.height)),
        "low": source.crop((midpoint, 0, source.width, source.height)),
    }
    for role, image in halves.items():
        output = OUT / f"{item_id}_{role}.png"
        normalize_square(image).save(output, optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for item_id, source_path in SOURCES.items():
        process_pair(item_id, source_path)
        print(item_id)


if __name__ == "__main__":
    main()
