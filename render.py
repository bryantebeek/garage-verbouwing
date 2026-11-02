# Realistic renders of kelder.gltf with Blender Cycles.
#
#   blender -b -P render.py -- [--draft] [--mode dag|avond|beide] [--views tv-muur,voorkozijn,...] [--tv-muur Wandkast]
#
# Shows the finished room (paint, floor, furniture, fittings; no framework, plates or wiring), lights it as day
# (sky and sun through the front frame) or evening (the 21 recessed spots, 2700 K), and writes renders/<view>-<mode>.png.
# Positions below are glTF coordinates (y up), as in the viewer's position readout.
import argparse, math, pathlib, sys, time
import bpy
from mathutils import Vector

ROOT = pathlib.Path(__file__).resolve().parent
args = argparse.ArgumentParser()
args.add_argument('--draft', action='store_true', help='small and quick, for checking light and framing')
args.add_argument('--mode', default='beide', choices=['dag', 'avond', 'beide'])
args.add_argument('--views', default='all')
args.add_argument('--tv-muur', default='Consoles aan de muur', help='tv-wall layer(s) to show, comma-separated (e.g. Wandkast,Kallax)')
opt = args.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])

SHOW = {'Vloer, muren, plafond', 'Verf', 'Vloer (visgraat)', 'Plint', 'Trap', 'Deur', 'Meubels', 'Elektra materiaal', 'Tv', *opt.tv_muur.split(',')}
VIEWS = {                                    # name: (eye, look at[, modes]), glTF coordinates
    'kamer': ((5.55, 1.55, -3.35), (0.4, 1.05, -1.0)),
    'tv-muur': ((1.75, 1.25, -0.25), (1.6, 1.0, -3.0)),
    'voorkozijn': ((0.45, 1.45, -2.6), (5.8, 1.2, -1.1)),
    'hal': ((3.95, 1.5, -4.75), (0.6, 1.6, -3.9), ('avond',)),   # no windows: by day it looks the same, lights on
}
SPOT_WATT = 20                               # per spot (Blender watts), warm white
PUCK_WATT = 6                                # per Cefrank puck (2 W, 200 lm), cool white
SUN = dict(elevation=28, azimuth=-25, strength=5)   # azimuth 0 = straight in through the front frame (+x)

def to_blender(p): x, y, z = p; return Vector((x, -z, y))

# --- scene
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(ROOT / 'kelder.gltf'))
for root in [o for o in bpy.data.objects if o.parent is None]:
    hidden = root.name not in SHOW
    for o in [root, *root.children_recursive]:
        o.hide_render = o.hide_viewport = hidden
for o in bpy.data.objects:                     # extras.zonder: only without that layer (the plint behind the Wandkast)
    if o.get('zonder') in SHOW:
        for x in [o, *o.children_recursive]: x.hide_render = x.hide_viewport = True
for o in bpy.data.objects:                     # Tv layer: only the 55 inch (the other sizes are options in the viewer)
    if o.get('tvmaat') not in (None, '55 inch'):
        for x in [o, *o.children_recursive]: x.hide_render = x.hide_viewport = True

# The floor above isn't modelled: close the stairwell above the ceiling (a box without bottom over the opening, glTF x 0-2.06,
# z -6.04..-4.98), or daylight pours into the hall from above.
bpy.ops.mesh.primitive_cube_add(size=1, location=(1.03, 5.51, 2.965))
cap = bpy.context.object; cap.name = 'Trapgat afgesloten'; cap.scale = (2.2, 1.2, 1.27)    # z 2.33 (in the ceiling) .. 3.6
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='DESELECT'); bpy.ops.object.mode_set(mode='OBJECT')
for f in cap.data.polygons: f.select = f.normal.z < -0.9
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.delete(type='FACE'); bpy.ops.object.mode_set(mode='OBJECT')
cap_mat = bpy.data.materials.new('Trapgat'); cap_mat.diffuse_color = (0.6, 0.58, 0.55, 1); cap.data.materials.append(cap_mat)

# --- screens: schermen/crt.* on the Sony, schermen/tv.* on the LG (local only, not in git: game screenshots are copyrighted)
def screen(name, lo, hi, image, strength):
    bpy.ops.mesh.primitive_plane_add(size=1, location=((lo.x + hi.x) / 2, lo.y - 0.0005, (lo.z + hi.z) / 2), rotation=(math.pi / 2, 0, 0))
    p = bpy.context.object; p.name = name; p.scale = (hi.x - lo.x, hi.z - lo.z, 1)
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = bpy.data.images.load(str(image)); tex.interpolation = 'Closest'
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Strength'].default_value = strength
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(tex.outputs['Color'], em.inputs['Color']); nt.links.new(em.outputs['Emission'], out.inputs['Surface'])
    p.data.materials.append(m)
def world_box(objs, keep=lambda o, poly: True):
    pts = [o.matrix_world @ o.data.vertices[v].co for o in objs if o.type == 'MESH' for poly in o.data.polygons if keep(o, poly) for v in poly.vertices]
    return Vector([min(p[k] for p in pts) for k in range(3)]), Vector([max(p[k] for p in pts) for k in range(3)])
shots = {k: next(iter(sorted((ROOT / 'schermen').glob(k + '.*'))), None) for k in ('crt', 'tv')}
if shots['crt']:
    for o in [o for o in bpy.data.objects if o.type == 'MESH' and not o.hide_render and 'Beeldbuis glas' in [m.name for m in o.data.materials if m]]:
        slot = [m.name if m else '' for m in o.data.materials].index('Beeldbuis glas')
        screen('CRT beeld', *world_box([o], lambda o, poly: poly.material_index == slot), shots['crt'], 2.0)
if shots['tv']:
    for o in [o for o in bpy.data.objects if o.get('tvmaat') and not o.hide_render]:
        lo, hi = world_box([o, *o.children_recursive])
        c, w = (lo + hi) / 2, (hi.x - lo.x) * 0.985                # active area: nearly the whole OLED front, 16:9
        screen('Tv beeld', Vector((c.x - w / 2, lo.y, c.z - w * 9 / 32)), Vector((c.x + w / 2, lo.y, c.z + w * 9 / 32)), shots['tv'], 2.5)

# --- materials: glass lets light through, the spot lenses glow when the spots are on
def principled(mat):
    return next((n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None) if mat and mat.use_nodes else None
for mat in bpy.data.materials:
    p = principled(mat)
    if not p:
        continue
    if mat.name in ('Glas', 'Getint glas'):  # thin pane: mostly see-through, and it doesn't block the sun
        p.inputs['Alpha'].default_value = 0.08 if mat.name == 'Glas' else 0.25
        p.inputs['Roughness'].default_value = 0.0
lens = principled(bpy.data.materials.get('Spot lens'))

# --- lights
scene = bpy.context.scene
world = bpy.data.worlds.new('Lucht'); scene.world = world; world.use_nodes = True
wn = world.node_tree.nodes; bg = wn['Background']
sky = wn.new('ShaderNodeTexSky')
for kind in ('MULTIPLE_SCATTERING', 'NISHITA', 'HOSEK_WILKIE'):
    try: sky.sky_type = kind; break
    except TypeError: pass
if hasattr(sky, 'sun_disc'): sky.sun_disc = False
if hasattr(sky, 'sun_elevation'): sky.sun_elevation = math.radians(SUN['elevation'])
if hasattr(sky, 'sun_rotation'): sky.sun_rotation = math.radians(SUN['azimuth'])
world.node_tree.links.new(sky.outputs['Color'], bg.inputs['Color'])

sun_data = bpy.data.lights.new('Zon', 'SUN'); sun_data.angle = math.radians(0.6)
sun = bpy.data.objects.new('Zon', sun_data); scene.collection.objects.link(sun)
el, az = math.radians(SUN['elevation']), math.radians(SUN['azimuth'])
direction = Vector((-math.cos(el) * math.cos(az), -math.cos(el) * math.sin(az), -math.sin(el)))  # sun travels into the room (-x)
sun.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

spots, hall = [], []                         # the hall has no windows: its spots are on by day too
for o in [o for o in bpy.data.objects if o.name.startswith('SP') and o.name[2:].isdigit()]:
    d = bpy.data.lights.new(o.name + ' licht', 'SPOT')
    d.energy, d.spot_size, d.spot_blend, d.shadow_soft_size = SPOT_WATT, math.radians(80), 0.6, 0.03
    d.color = (1.0, 0.78, 0.56)                                                       # ±2700 K
    lamp = bpy.data.objects.new(d.name, d); scene.collection.objects.link(lamp)
    c = o.matrix_world @ (sum((Vector(v) for v in o.bound_box), Vector()) / 8)
    lamp.location = (c.x, c.y, min(Vector(o.matrix_world @ Vector(v)).z for v in o.bound_box) - 0.002)   # just below the lens
    spots.append(lamp)
    if '(hal' in o.get('omschrijving', ''): hall.append(lamp)

for o in [o for o in bpy.data.objects if o.name.startswith('Puck ')]:     # Cefrank puck lights under the Wandkast shelves
    d = bpy.data.lights.new(o.name + ' licht', 'SPOT')
    d.energy, d.spot_size, d.spot_blend, d.shadow_soft_size = PUCK_WATT, math.radians(120), 0.8, 0.02
    d.color = (0.95, 0.97, 1.0)                                                       # 6000K
    lamp = bpy.data.objects.new(d.name, d); scene.collection.objects.link(lamp)
    lamp.location = o.matrix_world.translation + Vector((0, 0, -0.0095)); lamp['watt'] = PUCK_WATT
    spots.append(lamp)

def set_mode(mode):
    day = mode == 'dag'
    bg.inputs['Strength'].default_value = 1.0 if day else 0.015
    sun_data.energy = SUN['strength'] if day else 0
    for s in spots: s.data.energy = s.get('watt', SPOT_WATT) if not day or s in hall else 0
    if lens:
        lens.inputs['Emission Strength'].default_value = 0 if day else 6
    scene.view_settings.exposure = 2.0 if day else 1.4
    if hasattr(scene.view_settings, 'use_white_balance'):    # like a camera: daylight from the sky is blue, white-balance it
        scene.view_settings.use_white_balance = day
        scene.view_settings.white_balance_temperature = 8000

# --- render settings
scene.render.engine = 'CYCLES'
cyc = scene.cycles
cyc.device = 'CPU'
cyc.samples = 48 if opt.draft else 256
cyc.use_adaptive_sampling = True
cyc.use_denoising = True
cyc.max_bounces, cyc.diffuse_bounces, cyc.glossy_bounces, cyc.transmission_bounces = 10, 6, 4, 8
cyc.caustics_reflective = cyc.caustics_refractive = False
scene.render.resolution_x, scene.render.resolution_y = (960, 600) if opt.draft else (1920, 1200)
scene.view_settings.view_transform = 'AgX'
scene.render.image_settings.file_format = 'PNG'

cam_data = bpy.data.cameras.new('Camera'); cam_data.lens = 18; cam_data.clip_start = 0.05
cam = bpy.data.objects.new('Camera', cam_data); scene.collection.objects.link(cam); scene.camera = cam

out = ROOT / 'renders'; out.mkdir(exist_ok=True)
views = VIEWS if opt.views == 'all' else {k: VIEWS[k] for k in opt.views.split(',')}
for mode in (['dag', 'avond'] if opt.mode == 'beide' else [opt.mode]):
    set_mode(mode)
    for name, (eye, at, *modes) in views.items():
        if modes and mode not in modes[0]:
            continue
        cam.location = to_blender(eye)
        cam.rotation_euler = (to_blender(at) - to_blender(eye)).to_track_quat('-Z', 'Y').to_euler()
        variant = '' if opt.tv_muur == 'Consoles aan de muur' else '-' + opt.tv_muur.lower().replace(' ', '-').replace(',', '-')
        scene.render.filepath = str(out / f'{name}{variant}-{mode}{"-draft" if opt.draft else ""}.png')
        t = time.time()
        bpy.ops.render.render(write_still=True)
        print(f'RENDER {scene.render.filepath} {time.time() - t:.0f}s', flush=True)
