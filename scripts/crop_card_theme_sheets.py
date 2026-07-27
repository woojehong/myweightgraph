from pathlib import Path
from PIL import Image

SHEETS = [
    (
        Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_qN7vF5Zk0WLLrDw0hDldDDUB.png"),
        ["ct8_u_bear_dugout", "ct8_u_twin_stadium", "ct8_u_tiger_clubhouse", "ct8_u_walnut_cafe", "ct8_u_dawn_runner"],
    ),
    (
        Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_GrYkrzqgv600Is1DmY5dCyk3.png"),
        ["ct8_r_wolong_silk", "ct8_r_red_hare_lacquer", "ct8_r_crescent_dragon", "ct8_r_imperial_bronze", "ct8_r_moon_archive"],
    ),
    (
        Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_GtKVeVYoRTY8MlDmh3zhjT6F.png"),
        ["ct8_e_crimson_reactor", "ct8_e_storm_guardian", "ct8_e_web_tech", "ct8_e_dimensional_mystic", "ct8_e_kinetic_alloy"],
    ),
    (
        Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_hBoL5Mefuf8bgh6bqQmN0n1o.png"),
        ["ct8_l_sun_crystal_regalia", "ct8_l_raven_arcane", "ct8_l_dark_ranger_requiem"],
    ),
]

OUT = Path(__file__).resolve().parents[1] / "assets" / "showroom-v8" / "card_theme"
OUT.mkdir(parents=True, exist_ok=True)

for source, names in SHEETS:
    image = Image.open(source).convert("RGB")
    width, height = image.size
    for index, name in enumerate(names):
        top = round(height * index / len(names))
        bottom = round(height * (index + 1) / len(names))
        crop = image.crop((0, top, width, bottom))
        crop.save(OUT / f"{name}.webp", "WEBP", quality=92, method=6)
        print(name, crop.size)
