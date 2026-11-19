# Convert a folder of .fbx files (for example from a Unity asset pack) to .glb, ready for import_models.
# Needs Blender (free). Run:
#   blender -b -P studio/convert/fbx_to_glb.py -- <folder with fbx files> <output folder>
# Not tested by the author (no Blender where this was written): if a model comes out the wrong size or sideways,
# check the unit scale in Blender, then use import_models height=..., or kit rot/offset.
import bpy, sys, os, glob
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
if len(argv) < 2:
    print("usage: blender -b -P fbx_to_glb.py -- <fbx folder> <output folder>"); sys.exit(1)
src, dst = os.path.abspath(argv[0]), os.path.abspath(argv[1])
files = sorted(glob.glob(os.path.join(src, "**", "*.fbx"), recursive=True)); print("found", len(files), "fbx files")
for f in files:
    try:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.fbx(filepath=f, use_custom_normals=True)
        bpy.ops.object.select_all(action="SELECT")
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)        # bake the FBX unit scale and rotation
        out = os.path.join(dst, os.path.relpath(f, src).rsplit(".", 1)[0] + ".glb"); os.makedirs(os.path.dirname(out), exist_ok=True)
        bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True, export_yup=True, export_image_format="AUTO")
        print("ok  ", out)
    except Exception as e:
        print("FAIL", f, e)
