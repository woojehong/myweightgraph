import bpy
import json
from pathlib import Path

output = Path(__file__).resolve().parent / "human-bundle-inventory.json"
payload = {
    "file": bpy.data.filepath,
    "collections": [c.name for c in bpy.data.collections],
    "objects": [
        {
            "name": obj.name,
            "type": obj.type,
            "dimensions": [round(float(v), 4) for v in obj.dimensions],
            "vertices": len(obj.data.vertices) if obj.type == "MESH" else None,
            "hidden": bool(obj.hide_get()),
        }
        for obj in bpy.data.objects
    ],
}
output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {output}")
