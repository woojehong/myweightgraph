from pathlib import Path
from PIL import Image

SHEETS = [
    (
        Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_qN7vF5Zk0WLLrDw0hDldDDUB.png"),
        ["ct8_u_bear_dugout", "ct8_u_twin_stadium", "ct8_u_tiger_clubhouse", "ct8_u_walnut_cafe", "ct8_u_dawn_runner"],
        [(0, 168), (174, 332), (342, 494), (501, 640), (646, 793)],
    ),
    (
        Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_GrYkrzqgv600Is1DmY5dCyk3.png"),
        ["ct8_r_wolong_silk", "ct8_r_red_hare_lacquer", "ct8_r_crescent_dragon", "ct8_r_imperial_bronze", "ct8_r_moon_archive"],
        [(5, 181), (186, 354), (360, 520), (532, 694), (707, 881)],
    ),
    (
        Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_GtKVeVYoRTY8MlDmh3zhjT6F.png"),
        ["ct8_e_crimson_reactor", "ct8_e_storm_guardian", "ct8_e_web_tech", "ct8_e_dimensional_mystic", "ct8_e_kinetic_alloy"],
        [(5, 174), (180, 350), (356, 524), (530, 699), (704, 878)],
    ),
    (
        Path(r"C:\Users\moonh\.codex\generated_images\019f7e8c-44f2-7d21-84af-21382fa0116b\call_hBoL5Mefuf8bgh6bqQmN0n1o.png"),
        ["ct8_l_sun_crystal_regalia", "ct8_l_raven_arcane", "ct8_l_dark_ranger_requiem"],
        [(5, 239), (245, 478), (484, 720)],
    ),
]

OUT = Path(__file__).resolve().parents[1] / "assets" / "showroom-v8" / "card_theme"
OUT.mkdir(parents=True, exist_ok=True)

for source, names, bounds in SHEETS:
    image = Image.open(source).convert("RGB")
    width, height = image.size
    for name, (top, bottom) in zip(names, bounds):
        crop = image.crop((0, top, width, bottom))
        crop.save(OUT / f"{name}.webp", "WEBP", quality=92, method=6)
        print(name, crop.size)
