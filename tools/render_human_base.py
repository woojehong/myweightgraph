import bpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/avatar-3d/source/human-base-meshes/human_base_meshes_bundle.blend"
OUT = ROOT / "assets/avatar-3d/source/human-base-review.png"

bpy.ops.wm.read_factory_settings(use_empty=True)
with bpy.data.libraries.load(str(SOURCE), link=False) as (src, dst):
    dst.objects = [n for n in src.objects if n in {
        "GEO-body_male_stylized", "GEO-body_male_stylized.eye.L", "GEO-body_male_stylized.eye.R"
    }]
for obj in dst.objects:
    if obj: bpy.context.collection.objects.link(obj)

body=bpy.data.objects.get("GEO-body_male_stylized")
for obj in bpy.context.scene.objects:
    if obj.type=='MESH':
        for p in obj.data.polygons:p.use_smooth=True
        if not obj.data.materials:
            m=bpy.data.materials.new(obj.name+'Mat');m.diffuse_color=(.58,.30,.18,1);obj.data.materials.append(m)

bpy.ops.object.camera_add(location=(0,-5.4,1.05),rotation=(1.5708,0,0))
cam=bpy.context.object
def track(obj, point):
    obj.rotation_euler=(point-obj.location).to_track_quat('-Z','Y').to_euler()
track(cam,body.location.copy())
bpy.context.scene.camera=cam
bpy.ops.object.light_add(type='AREA',location=(-3,-4,4));bpy.context.object.data.energy=1000;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=5
bpy.ops.object.light_add(type='AREA',location=(3,-1,2));bpy.context.object.data.energy=700;bpy.context.object.data.color=(.2,.8,1);bpy.context.object.data.size=3
track(bpy.context.object,body.location.copy())
bpy.context.scene.render.engine='BLENDER_EEVEE_NEXT'
bpy.context.scene.render.resolution_x=900;bpy.context.scene.render.resolution_y=1100;bpy.context.scene.render.resolution_percentage=100
bpy.context.scene.render.image_settings.file_format='PNG';bpy.context.scene.render.filepath=str(OUT)
world=bpy.data.worlds.new('ReviewWorld');world.color=(.008,.012,.02);bpy.context.scene.world=world
bpy.ops.render.render(write_still=True)
coords=[v.co for v in body.data.vertices]
print('BOUNDS',[(min(v[i] for v in coords),max(v[i] for v in coords)) for i in range(3)])
print('MODIFIERS',[(m.name,m.type) for m in body.modifiers],'VGROUPS',[v.name for v in body.vertex_groups],OUT)
