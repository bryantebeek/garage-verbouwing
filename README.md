# Garage verbouwing

3D-model van de garage-verbouwing om doorheen te lopen: raamwerk, stucplaten, elektra en deur.

**Bekijken:** https://bryantebeek.github.io/garage-verbouwing/

Lokaal: `python3 serve.py` en open http://localhost:8765/.

Het model staat in `kelder.gltf` (+ `kelder.bin`, `textures/`), oorspronkelijk uit een SketchUp-tekening.

## Realistische renders

`render.py` rendert het model met Blender Cycles: de afgewerkte ruimte (verf, vloer, meubels, schakelmateriaal, inbouwspots), overdag met zon door het voorkozijn of 's avonds met de 28 spots aan.

```sh
blender -b -P render.py -- --draft                 # snel, 960x600, om licht en kader te checken
blender -b -P render.py -- --mode avond --views kamer,hal
```

De afbeeldingen komen in `renders/` (niet in git). Standpunten, lagen, zon en spots staan bovenin `render.py`.
