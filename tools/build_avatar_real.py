import bpy, bmesh, math
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'assets/avatar-3d/source/human-base-meshes/human_base_meshes_bundle.blend'
OUT=ROOT/'assets/avatar-3d/maweg-avatar-real.glb'
bpy.ops.wm.read_factory_settings(use_empty=True)

def material(name,color,metal=0,rough=.58):
    m=bpy.data.materials.new(name);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    return m
skin=material('Skin',(0.58,.30,.18),0,.72); white=material('Basic White Tee',(.78,.84,.88),0,.78); black=material('Black Training Pants',(.018,.025,.035),.02,.72)
hairmat=material('Natural Black Hair',(.012,.018,.025),.04,.52); eye=material('Eyes',(.015,.025,.03),.05,.24); teal=material('Maweg Teal',(0,.72,.58),.35,.28)

with bpy.data.libraries.load(str(SOURCE),link=False) as (src,dst):
    dst.objects=[n for n in src.objects if n=='GEO-body_male_realistic']
for o in dst.objects:
    if o:bpy.context.collection.objects.link(o)
base=bpy.data.objects['GEO-body_male_realistic'];base.name='BodySource';base.data.materials.clear();base.data.materials.append(skin)
source_offset=base.location.copy()
for imported in dst.objects:
    if imported: imported.location-=source_offset
for m in list(base.modifiers):base.modifiers.remove(m)

# Humanoid armature matched to the base mesh's relaxed A-pose.
bpy.ops.object.armature_add(enter_editmode=True,location=(0,0,0));rig=bpy.context.object;rig.name='MawegRig';arm=rig.data;arm.name='MawegSkeleton'
arm.edit_bones.remove(arm.edit_bones[0])
def bone(name,head,tail,parent=None,connected=False):
    b=arm.edit_bones.new(name);b.head=head;b.tail=tail
    if parent:b.parent=arm.edit_bones.get(parent);b.use_connect=connected
    return b
bone('hips',(0,0,.84),(0,0,1.02));bone('spine',(0,0,1.02),(0,0,1.25),'hips',True);bone('chest',(0,0,1.25),(0,0,1.48),'spine',True);bone('neck',(0,0,1.48),(0,0,1.58),'chest',True);bone('head',(0,0,1.58),(0,0,1.78),'neck',True)
for side,s in [('L',1),('R',-1)]:
    bone(f'upperArm.{side}',(s*.20,0,1.47),(s*.39,0,1.34),'chest');bone(f'forearm.{side}',(s*.39,0,1.34),(s*.51,0,1.10),f'upperArm.{side}',True);bone(f'hand.{side}',(s*.51,0,1.10),(s*.50,-.01,.96),f'forearm.{side}',True)
    bone(f'thigh.{side}',(s*.105,0,.88),(s*.105,0,.51),'hips');bone(f'shin.{side}',(s*.105,0,.51),(s*.08,0,.12),f'thigh.{side}',True);bone(f'foot.{side}',(s*.08,0,.12),(s*.08,-.14,.055),f'shin.{side}',True)
bpy.ops.object.mode_set(mode='OBJECT')

def auto_rig(obj):
    bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);rig.select_set(True);bpy.context.view_layer.objects.active=rig
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')

auto_rig(base)
pristine=base.data.copy()

def reshape(obj,kind):
    for v in obj.data.vertices:
        x,y,z=v.co
        # Larger head and slightly shorter legs produce a confident 4.8-head game proportion.
        if z>1.50:
            x*=1.12;y*=1.10;z=1.50+(z-1.50)*1.06
        elif z<.88:
            z=.88+(z-.88)*.92
        if kind=='basic':
            if 1.22<z<1.52:x*=.92
            if .82<z<1.24:y*=1.18;x*=1.06
        elif kind=='slim':x*=.93;y*=.92
        elif kind=='toned':
            if z>1.18:x*=1.075
            y*=1.025
        elif kind=='power':x*=1.14;y*=1.16
        elif kind=='physique':
            if z>1.20:x*=1.18;y*=1.07
            elif .82<z<1.20:x*=.94;y*=.97
        v.co=(x,y,z)

variants={}
for idx,kind in enumerate(['basic','slim','toned','power','physique']):
    obj=base if idx==0 else base.copy()
    obj.data=pristine.copy()
    if idx:bpy.context.collection.objects.link(obj)
    obj.name=f'Body.{kind}';reshape(obj,kind);variants[kind]=obj
base=variants['basic']

def clothing_shell(body,name,zmin,zmax,mat,thickness=.012,region='top'):
    o=body.copy();o.data=body.data.copy();bpy.context.collection.objects.link(o);o.name=name;o.data.materials.clear();o.data.materials.append(mat)
    bm=bmesh.new();bm.from_mesh(o.data)
    def keep(v):
        x,z=abs(v.co.x),v.co.z
        if not (zmin<=z<=zmax):return False
        return (x<.31 or z>1.30) if region=='top' else x<.29
    remove=[v for v in bm.verts if not keep(v)]
    bmesh.ops.delete(bm,geom=remove,context='VERTS');bm.to_mesh(o.data);bm.free()
    if region=='top':
        for v in o.data.vertices:v.co.x*=1.045;v.co.y*=1.10
    sol=o.modifiers.new('Garment thickness','SOLIDIFY');sol.thickness=thickness;sol.offset=1
    return o
for kind,body in variants.items():
    clothing_shell(body,f'TopBody.{kind}',.91,1.50,white,.014,'top')
    clothing_shell(body,f'BottomBody.{kind}',.10,.97,black,.016,'bottom')

def hair_shell(body,index,zcut,ycut):
    o=body.copy();o.data=body.data.copy();bpy.context.collection.objects.link(o);o.name=f'Hair.hair-{index:02d}';o.data.materials.clear();o.data.materials.append(hairmat)
    bm=bmesh.new();bm.from_mesh(o.data)
    remove=[v for v in bm.verts if not (v.co.z>zcut or (v.co.z>zcut-.08 and v.co.y>ycut))]
    bmesh.ops.delete(bm,geom=remove,context='VERTS');bm.to_mesh(o.data);bm.free()
    sol=o.modifiers.new('Hair volume','SOLIDIFY');sol.thickness=.012;sol.offset=1
    return o
for i,(zc,yc) in enumerate([(1.70,-.055),(1.68,-.08),(1.66,-.03),(1.72,-.10),(1.69,.00),(1.67,-.12),(1.71,-.02),(1.65,.02),(1.70,-.14),(1.66,-.07)],1):hair_shell(variants['basic'],i,zc,yc)

def uv(name,loc,scale,mat,parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=20,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
    for p in o.data.polygons:p.use_smooth=True
    if parent:o.parent=parent
    return o

def cube(name,loc,scale,mat,rot=(0,0,0),bevel=.025):
    bpy.ops.mesh.primitive_cube_add(location=loc,rotation=rot);o=bpy.context.object;o.name=name;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
    mod=o.modifiers.new('Rounded edges','BEVEL');mod.width=bevel;mod.segments=2
    return o
def cyl(name,loc,radius,depth,mat,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=28,radius=radius,depth=depth,location=loc,rotation=rot);o=bpy.context.object;o.name=name;o.data.materials.append(mat);return o
def torus(name,loc,major,minor,mat,rot=(0,0,0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=40,minor_segments=10,location=loc,rotation=rot);o=bpy.context.object;o.name=name;o.data.materials.append(mat);return o

for i in range(1,11):
    faceroot=bpy.data.objects.new(f'Face.face-{i:02d}',None);bpy.context.collection.objects.link(faceroot);faceroot.parent=rig
    spacing=.044+(i%3)*.004;eye_z=1.680+(i%2)*.004
    uv(f'Face.face-{i:02d}.pupil.L',(spacing,-.238,eye_z),(.014,.008,.012),eye,faceroot)
    uv(f'Face.face-{i:02d}.pupil.R',(-spacing,-.238,eye_z),(.014,.008,.012),eye,faceroot)
    uv(f'Face.face-{i:02d}.brow.L',(spacing,-.234,eye_z+.043),(.038,.006,.007),hairmat,faceroot)
    uv(f'Face.face-{i:02d}.brow.R',(-spacing,-.234,eye_z+.043),(.038,.006,.007),hairmat,faceroot)

# Ten actual meshes in every equipment category. Names are the browser slot contract.
accent=[teal,material('Steel',(.34,.42,.50),.8,.25),material('Gold',(.85,.47,.05),.82,.22),material('Crimson',(.52,.025,.04),.35,.32),material('Arcane',(.18,.035,.55),.45,.25)]
for i in range(1,11):
    c=accent[(i-1)%len(accent)]
    # Head accessories: bands, horns, halos and visors.
    if i<=3:torus(f'HeadAccessory.head-{i:02d}',(0,0,1.80),.145,.012,c,(math.pi/2,0,0))
    elif i<=5:
        cyl(f'HeadAccessory.head-{i:02d}.L',(.09,0,1.86),.025,.18,c,(0,.32,0));cyl(f'HeadAccessory.head-{i:02d}.R',(-.09,0,1.86),.025,.18,c,(0,-.32,0))
    elif i<=7:torus(f'HeadAccessory.head-{i:02d}',(0,0,1.88),.17,.012,c)
    else:cube(f'HeadAccessory.head-{i:02d}',(0,-.22,1.70),(.15,.018,.035),c,bevel=.015)
    # Shoes use the same item id on both feet.
    cube(f'Shoes.shoes-{i:02d}.L',(.105,-.07,.065),(.105,.17,.065),c,bevel=.035);cube(f'Shoes.shoes-{i:02d}.R',(-.105,-.07,.065),(.105,.17,.065),c,bevel=.035)
    # Hand items: alternating blade, tool, bow and orb silhouettes.
    for side,s,prefix in [('L',1,'LeftHand.left'),('R',-1,'RightHand.right')]:
        x=s*.57
        if i%4==1:
            cyl(f'{prefix}-{i:02d}.grip',(x,-.02,1.02),.025,.22,black)
            cube(f'{prefix}-{i:02d}.blade',(x,-.02,1.30),(.045,.018,.28),c,bevel=.018)
        elif i%4==2:torus(f'{prefix}-{i:02d}.bow',(x,-.02,1.18),.22,.018,c,(0,math.pi/2,0))
        elif i%4==3:cube(f'{prefix}-{i:02d}.tool',(x,-.02,1.15),(.065,.045,.24),c,rot=(0,0,s*.15),bevel=.035)
        else:uv(f'{prefix}-{i:02d}.orb',(x,-.04,1.10),(.085,.085,.085),c)
    # Effects surround the character but remain off by default.
    if i%2:torus(f'Effect.effect-{i:02d}',(0,0,.95),.48+.015*i,.009,c)
    else:
        for a in range(6):
            ang=a*math.pi/3;uv(f'Effect.effect-{i:02d}.{a}',(.42*math.cos(ang),.15*math.sin(ang),.35+a*.23),(.025,.025,.065),c)

def bind_to_bone(obj,bone_name):
    world=obj.matrix_world.copy();obj.parent=rig;obj.parent_type='BONE';obj.parent_bone=bone_name;obj.matrix_world=world
for obj in list(bpy.context.scene.objects):
    if obj.name.startswith('HeadAccessory'):bind_to_bone(obj,'head')
    elif obj.name.startswith('LeftHand'):bind_to_bone(obj,'hand.L')
    elif obj.name.startswith('RightHand'):bind_to_bone(obj,'hand.R')
    elif obj.name.startswith('Shoes') and obj.name.endswith('.L'):bind_to_bone(obj,'foot.L')
    elif obj.name.startswith('Shoes') and obj.name.endswith('.R'):bind_to_bone(obj,'foot.R')

# Stable equipment sockets.
for name,bone_name in [('Socket.Head','head'),('Socket.Hand.L','hand.L'),('Socket.Hand.R','hand.R')]:
    e=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(e);e.parent=rig;e.parent_type='BONE';e.parent_bone=bone_name

# Ground plate is actually below the soles.
bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=.55,depth=.018,location=(0,0,.008));ground=bpy.context.object;ground.name='Stage.Ground';ground.data.materials.append(black)
bpy.ops.mesh.primitive_torus_add(major_radius=.46,minor_radius=.006,major_segments=64,minor_segments=10,location=(0,0,.019));bpy.context.object.name='Stage.Glow';bpy.context.object.data.materials.append(teal)

# Ten real armature actions available to the browser animation mixer.
def action(name,frames):
    act=bpy.data.actions.new(name);rig.animation_data_create();rig.animation_data.action=act
    for frame,poses in frames.items():
        for bname,rot in poses.items():
            pb=rig.pose.bones.get(bname)
            if pb:pb.rotation_mode='XYZ';pb.rotation_euler=rot;pb.keyframe_insert('rotation_euler',frame=frame,group=bname)
    act.frame_start=min(frames);act.frame_end=max(frames)
action('Idle',{1:{'chest':(0,0,0)},30:{'chest':(.018,0,0)},60:{'chest':(0,0,0)}})
action('Salute',{1:{'upperArm.R':(0,0,0),'forearm.R':(0,0,0)},18:{'upperArm.R':(.15,-.15,1.0),'forearm.R':(0,0,1.2)},45:{'upperArm.R':(0,0,0),'forearm.R':(0,0,0)}})
for i in range(2,10):
    s=-1 if i%2 else 1;action(f'Action{i+1:02d}',{1:{'chest':(0,0,0)},18:{'chest':(0,0,s*.08),'upperArm.L':(0,0,-s*.25),'upperArm.R':(0,0,s*.25)},42:{'chest':(0,0,0),'upperArm.L':(0,0,0),'upperArm.R':(0,0,0)}})
rig.animation_data.action=None
for pb in rig.pose.bones:
    pb.rotation_mode='XYZ';pb.rotation_euler=(0,0,0);pb.location=(0,0,0);pb.scale=(1,1,1)
bpy.context.scene.frame_set(1)

bpy.ops.export_scene.gltf(filepath=str(OUT),export_format='GLB',export_yup=True,export_apply=True,export_materials='EXPORT',export_animations=True,export_animation_mode='ACTIONS',export_cameras=False,export_lights=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
print('EXPORTED',OUT,OUT.stat().st_size)
