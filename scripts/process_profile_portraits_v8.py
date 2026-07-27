"""Build frame-safe transparent profile portraits from individual chroma sources."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "showroom-v8" / "profile_emoji"
QA = ROOT / "tmp" / "profile-portraits-v8-qa.jpg"
QA_FRAMED = ROOT / "tmp" / "profile-portraits-v8-framed-qa.jpg"
CANVAS = 1024
SAFE = 778  # 76%: leaves room for the thickest existing portrait frame.
KEY = (255, 0, 255)

SOURCES = {
    "pe_u_blue_bear_slugger": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_IRUR0zvC50aOCLkCoLFmxqam.png",
    "pe_u_twin_cheer_pair": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_IJdN0B9N8KysQ3CaHOgNs0el.png",
    "pe_u_soft_bear_fan": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_B0EIqclxqgBFGq1eSLrYbyDB.png",
    "pe_u_red_tiger_pitcher": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_GDQdeIpyXaQTi40W66mHDh8B.png",
    "pe_u_orange_eagle_cheer": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_wm2CcfJQPQUJc9IVpiI8x9LU.png",
    "pe_r_jade_fan_strategist": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_8oqyPdhEH11deQmal0UyT9kz.png",
    "pe_r_crimson_flying_general": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_r9VJ8feCowvcrLaUUH0uDd8m.png",
    "pe_r_crescent_beard_general": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_RxHBIZt6nw9dwaomeAHHOohf.png",
    "pe_r_roaring_tiger_general": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_KODvUlLNUIAhfC04HSW3yT4W.png",
    "pe_r_silver_spear_dragon": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_xz2xcPBFCo830SGgXIYuinlU.png",
    "pe_e_crimson_reactor_sentinel": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_SZzKiC2xT96aIRl6Wp5w24rD.png",
    "pe_e_storm_prince_guardian": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_qCF6uaJAnaMjJxvemTZkpYb1.png",
    "pe_e_silver_filament_engineer": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_PBTk18axdTWA6qq5AZ0VAUi7.png",
    "pe_e_dimensional_mystic": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_bTNG96Mk1RoEJHnLhhxjzX1G.png",
    "pe_e_crimson_chaos_witch": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_XoB8JZeRrTsJu57oRmEhPeGI.png",
    "pe_e_kinetic_alloy_guardian": r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_L2SgGbTntyXHGljgC8blBmWO.png",
}

FRAMES = [
    "eb_u_bear_batter", "eb_u_twin_stadium", "eb_u_morning_brew", "eb_u_tiger_dugout", "eb_u_dawn_running",
    "eb_r_wolong_trigram", "eb_r_red_hare_armor", "eb_r_crescent_dragon", "eb_r_imperial_bronze", "eb_r_moon_archive",
    "eb_e_crimson_core", "eb_e_thunder_guard", "eb_e_web_mobility", "eb_e_dimensional_sanctum",
    "eb_e_crimson_core", "eb_e_black_vibration",
]


def alpha_from_key(image):
    rgba = image.convert("RGBA")
    output = []
    for red, green, blue, _ in rgba.getdata():
        distance = abs(red - 255) + green + abs(blue - 255)
        if distance <= 24:
            alpha = 0
        elif distance >= 145:
            alpha = 255
        else:
            alpha = round((distance - 24) / 121 * 255)
        if alpha < 255:
            excess = max(0, min(red, blue) - green)
            red = max(0, red - round(excess * (1 - alpha / 255)))
            blue = max(0, blue - round(excess * (1 - alpha / 255)))
        output.append((red, green, blue, alpha))
    rgba.putdata(output)
    return rgba


def frame_safe(image):
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        raise ValueError("No foreground after chroma removal")
    subject = image.crop(bbox)
    scale = min(SAFE / subject.width, SAFE / subject.height)
    size = (round(subject.width * scale), round(subject.height * scale))
    subject = subject.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    x = (CANVAS - size[0]) // 2
    y = (CANVAS - size[1]) // 2
    canvas.alpha_composite(subject, (x, y))
    return canvas


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    finals = []
    for portrait_id, source in SOURCES.items():
        image = frame_safe(alpha_from_key(Image.open(source)))
        output = OUT / f"{portrait_id}.webp"
        image.save(output, "WEBP", lossless=True, method=6)
        finals.append((portrait_id, image))
        print(f"{portrait_id}: {image.size}, {output.stat().st_size} bytes")

    QA.parent.mkdir(parents=True, exist_ok=True)
    tile = 256
    label = 24
    rows = (len(finals) + 4) // 5
    montage = Image.new("RGB", (tile * 5, (tile + label) * rows), "#151922")
    draw = ImageDraw.Draw(montage)
    for index, (portrait_id, image) in enumerate(finals):
        x = (index % 5) * tile
        y = (index // 5) * (tile + label)
        thumb = image.resize((tile, tile), Image.Resampling.LANCZOS)
        checker = Image.new("RGB", (tile, tile), "#232a36")
        checker.paste(thumb, (0, 0), thumb)
        montage.paste(checker, (x, y + label))
        draw.text((x + 5, y + 6), portrait_id, fill="#ffffff")
    montage.save(QA, quality=92)
    print(f"QA montage: {QA}")

    framed = Image.new("RGB", (tile * 5, (tile + label) * rows), "#151922")
    framed_draw = ImageDraw.Draw(framed)
    frame_root = ROOT / "assets" / "showroom-v7" / "emoji_border"
    for index, ((portrait_id, image), frame_id) in enumerate(zip(finals, FRAMES)):
        x = (index % 5) * tile
        y = (index // 5) * (tile + label)
        frame = Image.open(frame_root / f"{frame_id}.png").convert("RGBA").resize((tile, tile), Image.Resampling.LANCZOS)
        portrait = image.resize((tile, tile), Image.Resampling.LANCZOS)
        composite = Image.alpha_composite(portrait, frame)
        checker = Image.new("RGB", (tile, tile), "#232a36")
        checker.paste(composite, (0, 0), composite)
        framed.paste(checker, (x, y + label))
        framed_draw.text((x + 5, y + 6), f"{portrait_id} + {frame_id}", fill="#ffffff")
    framed.save(QA_FRAMED, quality=92)
    print(f"Framed QA montage: {QA_FRAMED}")


if __name__ == "__main__":
    main()
