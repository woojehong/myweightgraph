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
skin=material('Skin',(0.58,.30,.18),0,.72); white=material('Basic White Tee',(.78,.84,.88),0,.72); black=material('Black Training Pants',(.018,.025,.035),.05,.48)
hairmat=material('Natural Black Hair',(.012,.018,.025),.04,.52); eye=material('Eyes',(.015,.025,.03),.05,.24); teal=material('Maweg Teal',(0,.72,.58),.35,.28)

with bpy.data.libraries.load(str(SOURCE),link=False) as (src,dst):
    dst.objects=[n for n in src.objects if n=='GEO-body_male_stylized']
for o in dst.objects:
    if o:bpy.context.collection.objects.link(o)
base=bpy.data.objects['GEO-body_male_stylized'];base.name='BodySource';base.data.materials.clear();base.data.materials.append(skin)
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
            x*=1.30;y*=1.25;z=1.50+(z-1.50)*1.15
        elif z<.88:
            z=.88+(z-.88)*.82
        if kind=='basic':
            if 1.22<z<1.52:x*=.94
            if .82<z<1.24:y*=1.13;x*=1.025
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
    sol=o.modifiers.new('Garment thickness','SOLIDIFY');sol.thickness=thickness;sol.offset=1
    return o
for kind,body in variants.items():
    clothing_shell(body,f'TopBody.{kind}',.91,1.50,white,.014,'top')
    clothing_shell(body,f'BottomBody.{kind}',.10,.97,black,.016,'bottom')

def uv(name,loc,scale,mat,parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=20,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
    for p in o.data.polygons:p.use_smooth=True
    if parent:o.parent=parent
    return o

# Hair silhouettes; the default uses layered, overlapping scalp forms rather than a single helmet sphere.
hairroot=bpy.data.objects.new('Hair.hair-01',None);bpy.context.collection.objects.link(hairroot);hairroot.parent=rig;hairroot.parent_type='OBJECT'
uv('Hair.hair-01.crown',(0,.005,1.765),(.175,.135,.082),hairmat,hairroot)
uv('Hair.hair-01.fringe.L',(.064,-.137,1.724),(.078,.032,.052),hairmat,hairroot)
uv('Hair.hair-01.fringe.R',(-.064,-.137,1.724),(.078,.032,.047),hairmat,hairroot)
faceroot=bpy.data.objects.new('Face.face-01',None);bpy.context.collection.objects.link(faceroot);faceroot.parent=rig
uv('Face.face-01.pupil.L',(.065,-.162,1.685),(.022,.012,.018),eye,faceroot)
uv('Face.face-01.pupil.R',(-.065,-.162,1.685),(.022,.012,.018),eye,faceroot)

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
