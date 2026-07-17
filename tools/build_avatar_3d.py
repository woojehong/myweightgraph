import bpy
import math
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "avatar-3d" / "maweg-avatar.glb"
OUT.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for block in bpy.data.materials:
    bpy.data.materials.remove(block)

def mat(name, color, metallic=0.0, rough=0.62, emission=None):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = rough
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = 2.5
    return m

M = {
    "skin": mat("Skin", (0.67, 0.38, 0.24), rough=0.72),
    "skin2": mat("SkinHighlight", (0.83, 0.55, 0.38), rough=0.68),
    "white": mat("BasicWhite", (0.82, 0.86, 0.88)),
    "black": mat("TrainingBlack", (0.025, 0.032, 0.045)),
    "hair": mat("HairBlack", (0.018, 0.023, 0.03), metallic=.05, rough=.35),
    "eye": mat("Eye", (0.015, 0.02, 0.025), rough=.25),
    "teal": mat("MawegTeal", (0.0, .83, .68), metallic=.15, rough=.35),
    "blue": mat("ArcBlue", (.02, .28, .78), metallic=.4, rough=.25),
    "red": mat("Crimson", (.62, .025, .04), metallic=.25, rough=.32),
    "gold": mat("Gold", (.92, .53, .055), metallic=.82, rough=.22),
    "silver": mat("Silver", (.52, .60, .67), metallic=.88, rough=.18),
    "purple": mat("VoidPurple", (.28, .025, .65), metallic=.45, rough=.2),
    "green": mat("FieldGreen", (.04, .42, .19), rough=.5),
    "brown": mat("Leather", (.18, .065, .025), rough=.78),
    "cyanGlow": mat("CyanGlow", (.01, .55, .9), rough=.2, emission=(.01, .45, 1.0)),
    "orangeGlow": mat("OrangeGlow", (.9, .16, .01), rough=.2, emission=(1.0, .08, .01)),
}

def finish(obj, name, material, parent=None):
    obj.name = name
    if obj.data and hasattr(obj.data, "materials"):
        obj.data.materials.append(material)
    for p in getattr(obj.data, "polygons", []):
        p.use_smooth = True
    if parent:
        obj.parent = parent
    return obj

def uv(name, loc, scale, material, parent=None, seg=32, rings=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, location=loc)
    o = bpy.context.object
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, name, material, parent)

def cube(name, loc, scale, material, parent=None, bevel=.04, rot=(0,0,0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.object
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = o.modifiers.new("Soft edges", "BEVEL")
        mod.width = bevel
        mod.segments = 3
    return finish(o, name, material, parent)

def cyl(name, loc, radius, depth, material, parent=None, rot=(0,0,0), vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rot)
    return finish(bpy.context.object, name, material, parent)

def torus(name, loc, major, minor, material, parent=None, rot=(0,0,0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, major_segments=32, minor_segments=10, location=loc, rotation=rot)
    return finish(bpy.context.object, name, material, parent)

def empty(name, parent=None):
    o = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(o)
    o.empty_display_type = "PLAIN_AXES"
    o.parent = parent
    return o

# Root and skeleton sockets. These named nodes are the stable web runtime contract.
root = empty("AvatarRoot")
rig = empty("Rig", root)
nodes = {}
for name, loc in {
    "hips": (0,0,1.05), "spine": (0,0,1.38), "chest": (0,0,1.62), "head": (0,-.005,1.98),
    "upperArm.L": (.43,0,1.62), "forearm.L": (.70,0,1.43), "hand.L": (.82,-.01,1.22),
    "upperArm.R": (-.43,0,1.62), "forearm.R": (-.70,0,1.43), "hand.R": (-.82,-.01,1.22),
    "thigh.L": (.17,0,.90), "shin.L": (.17,0,.48), "foot.L": (.17,-.08,.12),
    "thigh.R": (-.17,0,.90), "shin.R": (-.17,0,.48), "foot.R": (-.17,-.08,.12),
}.items():
    n = empty(name, rig)
    n.location = loc
    nodes[name] = n

socket_head = empty("Socket.Head", nodes["head"])
socket_r = empty("Socket.Hand.R", nodes["hand.R"])
socket_l = empty("Socket.Hand.L", nodes["hand.L"])
socket_fx = empty("Socket.Effect", root)

BODY_SPECS = {
    "basic": (.39,.25, .18,.16, .16,.15),
    "slim": (.37,.20, .15,.135, .135,.13),
    "toned": (.43,.205, .19,.155, .155,.145),
    "power": (.53,.30, .245,.205, .205,.18),
    "physique": (.55,.215, .225,.17, .18,.145),
}

for key, (shoulder, belly, arm, fore, thigh, calf) in BODY_SPECS.items():
    g = empty(f"Body.{key}", root)
    # Default body intentionally ordinary: narrower shoulder and a soft belly.
    uv(f"Body.{key}.Torso", (0,0,1.48), (shoulder,.19,.43), M["skin"], g)
    uv(f"Body.{key}.Belly", (0,-.005,1.22), (belly,.205,.30), M["skin2"], g)
    uv(f"Body.{key}.Head", (0,-.015,1.94), (.245,.215,.285), M["skin2"], g)
    uv(f"Body.{key}.Ear.L", (.238,-.01,1.94), (.035,.025,.065), M["skin"], g, 20, 10)
    uv(f"Body.{key}.Ear.R", (-.238,-.01,1.94), (.035,.025,.065), M["skin"], g, 20, 10)
    for side, s in (("L",1),("R",-1)):
        uv(f"Body.{key}.UpperArm.{side}", (s*.10,0,-.15), (arm,.145,.30), M["skin"], nodes[f"upperArm.{side}"])
        uv(f"Body.{key}.Forearm.{side}", (s*.06,0,-.18), (fore,.13,.27), M["skin2"], nodes[f"forearm.{side}"])
        uv(f"Body.{key}.Hand.{side}", (0,-.01,-.11), (.115,.085,.15), M["skin2"], nodes[f"hand.{side}"], 24, 12)
        uv(f"Body.{key}.Thigh.{side}", (0,0,-.16), (thigh,.18,.38), M["skin"], nodes[f"thigh.{side}"])
        uv(f"Body.{key}.Shin.{side}", (0,0,-.18), (calf,.145,.35), M["skin2"], nodes[f"shin.{side}"])
        uv(f"Body.{key}.Foot.{side}", (0,-.10,-.04), (.14,.25,.10), M["skin2"], nodes[f"foot.{side}"], 24, 12)

# Ten face presets: brows, eye spacing and simple beard combinations are discrete nodes.
for i in range(10):
    g = empty(f"Face.face-{i+1:02d}", nodes["head"])
    spacing = .078 + (i % 3) * .008
    eye_z = .04 + (i % 2) * .008
    for side, s in (("L",1),("R",-1)):
        uv(f"Face.face-{i+1:02d}.Eye.{side}", (s*spacing,-.208,eye_z), (.027,.017,.022), M["eye"], g, 20, 10)
        cube(f"Face.face-{i+1:02d}.Brow.{side}", (s*spacing,-.222,eye_z+.052), (.045,.009,.009), M["hair"], g, .008, (0,0,s*(i-4.5)*.015))
    if i in (2,4,6,8,9):
        uv(f"Face.face-{i+1:02d}.Beard", (0,-.207,-.105), (.12,.025,.075), M["hair"], g, 24, 12)

# Ten hair styles, purposefully distinct silhouettes.
for i in range(10):
    g = empty(f"Hair.hair-{i+1:02d}", nodes["head"])
    if i == 0:
        uv(f"Hair.hair-{i+1:02d}.Cap", (0,0,.17), (.235,.205,.14), M["hair"], g)
    elif i == 1:
        for x in (-.14,-.07,0,.07,.14): uv(f"Hair.hair-{i+1:02d}.Spike{x}", (x,-.01,.24+abs(x)*.2), (.065,.07,.16), M["hair"], g, 20, 10)
    elif i == 2:
        uv(f"Hair.hair-{i+1:02d}.Long", (0,.035,.05), (.25,.22,.33), M["hair"], g)
    elif i == 3:
        torus(f"Hair.hair-{i+1:02d}.Buzz", (0,0,.14), .18,.055,M["hair"],g,(math.pi/2,0,0))
    else:
        uv(f"Hair.hair-{i+1:02d}.Top", (0,0,.17), (.23-(i%2)*.02,.20,.12+(i%3)*.035), M["hair"], g)
        cube(f"Hair.hair-{i+1:02d}.Fringe", ((i%3-1)*.045,-.205,.10), (.12,.025,.07), M["hair"], g, .025, (0,(i-6)*.03,0))

# Head accessories: none is represented in the catalog, these ten are purchasable.
for i in range(10):
    g = empty(f"HeadAccessory.head-{i+1:02d}", socket_head)
    material = [M["black"],M["gold"],M["red"],M["silver"],M["teal"]][i%5]
    if i in (0,1,2):
        cyl(f"HeadAccessory.head-{i+1:02d}.Band", (0,0,.19), .25,.055,material,g,(math.pi/2,0,0),32)
    elif i in (3,4):
        for s in (-1,1): cyl(f"HeadAccessory.head-{i+1:02d}.Horn{s}", (s*.16,0,.27), .045,.28,material,g,(0,s*.35,0),18)
    elif i in (5,6):
        torus(f"HeadAccessory.head-{i+1:02d}.Halo", (0,0,.42), .22,.018,material,g)
    else:
        cube(f"HeadAccessory.head-{i+1:02d}.Visor", (0,-.235,.06), (.23,.025,.07), material,g,.025)

TOP_COLORS = [M["white"],M["black"],M["teal"],M["red"],M["blue"],M["green"],M["gold"],M["silver"],M["purple"],M["brown"]]
for i in range(10):
    g=empty(f"Top.top-{i+1:02d}", root)
    uv(f"Top.top-{i+1:02d}.Chest", (0,-.008,1.44), (.405+(i%3)*.015,.205,.45), TOP_COLORS[i],g)
    if i in (3,6,8): cube(f"Top.top-{i+1:02d}.Badge", (0,-.206,1.56), (.07,.015,.09), M["gold"],g,.02)

for i in range(10):
    g=empty(f"Bottom.bottom-{i+1:02d}", root)
    color=[M["black"],M["blue"],M["green"],M["brown"],M["silver"]][i%5]
    uv(f"Bottom.bottom-{i+1:02d}.Waist", (0,0,1.09), (.31,.20,.20),color,g)
    for side,s in (("L",1),("R",-1)):
        length=.34 if i in (2,5,8) else .60
        uv(f"Bottom.bottom-{i+1:02d}.Leg.{side}",(0,0,-.18),( .18,.18,length),color,nodes[f"thigh.{side}"])

for i in range(10):
    g=empty(f"Shoes.shoes-{i+1:02d}", root)
    color=[M["white"],M["black"],M["red"],M["blue"],M["gold"]][i%5]
    for side in ("L","R"):
        cube(f"Shoes.shoes-{i+1:02d}.{side}",(0,-.12,-.04),(.155,.26,.115),color,nodes[f"foot.{side}"],.055)

def weapon(group_name, parent, i, mirror=1):
    g=empty(group_name,parent)
    colors=[M["silver"],M["gold"],M["cyanGlow"],M["orangeGlow"],M["purple"]]
    c=colors[i%5]
    if i in (0,2,5,8):
        cyl(group_name+".Grip",(0,0,-.12),.035,.30,M["brown"],g)
        cube(group_name+".Blade",(0,0,.30),(.055,.025,.42),c,g,.025)
        cube(group_name+".Guard",(0,0,.02),(.18,.04,.035),M["gold"],g,.018)
    elif i in (1,6):
        torus(group_name+".Bow",(0,0,.20),.30,.025,c,g,(0,math.pi/2,0))
    elif i in (3,7):
        cube(group_name+".Tool",(0,-.02,.12),(.10,.07,.32),c,g,.04,(0,0,.12*mirror))
    else:
        uv(group_name+".Orb",(0,0,.12),(.13,.13,.13),c,g,24,12)
        torus(group_name+".Ring",(0,0,.12),.18,.018,M["gold"],g,(math.pi/2,0,0))

for i in range(10):
    weapon(f"RightHand.right-{i+1:02d}",socket_r,i,-1)
    weapon(f"LeftHand.left-{i+1:02d}",socket_l,i,1)

# Ten effect rigs. Browser adds motion/pulsing; GLB provides the actual geometry.
for i in range(10):
    g=empty(f"Effect.effect-{i+1:02d}",socket_fx)
    c=[M["cyanGlow"],M["orangeGlow"],M["purple"],M["gold"],M["teal"]][i%5]
    if i%2==0:
        for z in (.35,.75,1.15,1.55,1.95): torus(f"Effect.effect-{i+1:02d}.Ring{z}",(0,0,z),.42+z*.06,.012,c,g)
    else:
        for a in range(8):
            x=.42*math.cos(a*math.pi/4); y=.18*math.sin(a*math.pi/4)
            uv(f"Effect.effect-{i+1:02d}.Orb{a}",(x,y,.35+a*.20),(.035,.035,.09),c,g,16,8)

# Runtime metadata anchors: 10 static poses and 10 click animations are defined in JS.
for i in range(10): empty(f"Pose.pose-{i+1:02d}",root)
for i in range(10): empty(f"Animation.anim-{i+1:02d}",root)

# Ground shadow plate, physically placed below feet instead of floating through ankles.
cyl("Stage.Ground", (0,0,-.145), .62,.018,M["black"],root,vertices=64)
torus("Stage.GroundGlow",(0,0,-.132),.51,.008,M["teal"],root)

bpy.context.scene.world.color=(.003,.006,.012)
bpy.ops.export_scene.gltf(
    filepath=str(OUT), export_format="GLB", export_yup=True,
    export_apply=True, export_materials="EXPORT", export_cameras=False,
    export_lights=False, export_animations=False,
)
print(f"Exported {OUT} ({OUT.stat().st_size} bytes)")
