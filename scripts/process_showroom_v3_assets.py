from pathlib import Path
from PIL import Image
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SHEETS = ROOT / "assets" / "showroom-v3" / "sheets"
OUT = ROOT / "assets" / "showroom-v3"
PYTHON = Path(r"C:\Users\moonh\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe")
KEYER = Path(r"C:\Users\moonh\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py")

LANDSCAPE = {
    "graph-skins.png": ("graph_skin", ["gs_explorer_parchment", "gs_frost_runestone", "gs_dragonbone_slab", "gs_cosmic_timekeeper"]),
    "card-themes.png": ("card_theme", ["ct_alpine_dawn", "ct_sunken_temple", "ct_moonlit_grove", "ct_cosmic_observatory"]),
    "ambient-effects.png": ("ambient_effect", ["ae_forest_breath", "ae_deep_caustics", "ae_dimensional_breach", "ae_ancient_dragon"]),
}

TRANSPARENT = {
    "point-markers.png": ("point_marker", ["pm_expedition_compass", "pm_moon_crystal", "pm_watcher_eye", "pm_phoenix_seal"], 256),
    "companions.png": ("companion", ["cp_sleepy_golem", "cp_candle_wisp", "cp_satchel_mimic", "cp_lantern_moth"], 512),
    "trophies.png": ("trophy", ["tr_summit_compass", "tr_sea_chalice", "tr_giant_horn", "tr_cosmic_goblet"], 512),
    "profile-emojis.png": ("profile_emoji", ["pe_archive_spirit", "pe_forest_goblin", "pe_dragonblood", "pe_celestial_oracle"], 512),
    "emoji-borders.png": ("emoji_border", ["eb_forged_iron", "eb_worldroot", "eb_giant_hunter", "eb_twin_dragon"], 768),
}


def quadrants(image):
    w, h = image.size
    gap_x = max(2, round(w * 0.012)) if w != h else 0
    gap_y = max(2, round(h * 0.014)) if w != h else 0
    x_mid, y_mid = w // 2, h // 2
    if w == h:
        return [(0, 0, x_mid, y_mid), (x_mid, 0, w, y_mid), (0, y_mid, x_mid, h), (x_mid, y_mid, w, h)]
    return [
        (gap_x, gap_y, x_mid - gap_x // 2, y_mid - gap_y // 2),
        (x_mid + gap_x // 2, gap_y, w - gap_x, y_mid - gap_y // 2),
        (gap_x, y_mid + gap_y // 2, x_mid - gap_x // 2, h - gap_y),
        (x_mid + gap_x // 2, y_mid + gap_y // 2, w - gap_x, h - gap_y),
    ]


for sheet_name, (category, names) in LANDSCAPE.items():
    image = Image.open(SHEETS / sheet_name).convert("RGB")
    target_dir = OUT / category
    target_dir.mkdir(parents=True, exist_ok=True)
    for box, name in zip(quadrants(image), names):
        crop = image.crop(box).resize((1600, 900), Image.Resampling.LANCZOS)
        crop.save(target_dir / f"{name}.webp", "WEBP", quality=92, method=6)

for sheet_name, (category, names, size) in TRANSPARENT.items():
    image = Image.open(SHEETS / sheet_name).convert("RGB")
    target_dir = OUT / category
    target_dir.mkdir(parents=True, exist_ok=True)
    for box, name in zip(quadrants(image), names):
        source = target_dir / f"{name}-key.png"
        final = target_dir / f"{name}.png"
        image.crop(box).resize((size, size), Image.Resampling.LANCZOS).save(source)
        subprocess.run([
            str(PYTHON), str(KEYER), "--input", str(source), "--out", str(final),
            "--auto-key", "border", "--soft-matte", "--transparent-threshold", "12",
            "--opaque-threshold", "220", "--despill"
        ], check=True)
        source.unlink()

print("showroom-v3 assets processed")
