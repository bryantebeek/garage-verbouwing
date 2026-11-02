# Agents

- Na elke wijziging: altijd committen en pushen naar `main`. GitHub Pages publiceert `main` direct op https://bryantebeek.github.io/garage-verbouwing/.

## Model-conventies (`kelder.gltf`)

- Coördinaten in meters, glTF y omhoog (zoals de positie onderin de viewer). Tv-muur (verf VF3): z −2,994, x 0,056–3,093, midden x 1,5745. Voorgevel x 5,858.
- Lagen zijn de top-level nodes; `extras.visible: false` = standaard uit. Een nieuwe laag ook in `GROUPS` in `index.html` zetten, anders komt hij onder "Overig".
- Namen met nummer krijgen een label: S staander, V/B onder-/bovenregel, P plafondbalk, L plafondlat, K klos, W wandcontactdoos (met "Wn inbouwdozen", "Wn draden" en "Leiding n"), SP inbouwspot, CD centraaldoos, PL plint, SW stucwerk, VF verf. Kies voor iets nieuws een vrij voorvoegsel (L en SP zijn bezet).
- Inspector: `extras.omschrijving` en `extras.product` (`winkel`, `naam`, `artikel`, `url`). Favicons staan in `favicons/<host>.png`, één keer ophalen.
- Varianten (bijv. de slaapbank): beide objecten krijgen `extras.wissel` (label van de schakelaar) en `extras.stand` `dicht` of `open`; de viewer maakt er een schakelaar onder Weergave van.
- Inbouwdozen: de buiktuit (uitgang naar de leiding) midden op de doos; de leiding sluit daar precies op aan. Een doos zo hoog mogelijk = buiktuit tegen de onderkant van de bovenregel.
- Bij verwijderen ook de hele subboom weghalen (geen losse knooppunten achterlaten) en node-indexen in `children` en `scenes` omnummeren.

## Tv-muur (laag "Consoles aan de muur")

- LG midden op de tv-muur, onderkant 79 cm (midden ±1,20 m: kijkhoogte vanaf de bank). Beamer en W8 op dezelfde middellijn.
- Sony KV-X2501D (beeldbuis) midden onder de LG op een walnoten verhoging van 70 × 50 × 20 cm, vóór de plint; 8 cm tussen de Sony en de LG.
- **Kazen** zijn de schuine walnoten wandplankjes voor de consoles (`Kaas <console>` in het model):
  - Console links, rechts 3 spellen rechtop met de rug naar voren, in de verpakking van het platform: cartridge (Atari 2600, NES, SNES, N64), cd (PS1, Dreamcast), Mega Drive-doosje, dvd (PS2, GameCube, Xbox, Xbox 360, Wii, Wii U), blu-ray (PS3, PS4), Switch-doosje.
  - Breedte: 10 mm + console + 10 mm + spellen (2 mm ertussen) + 10 mm.
  - Diepte per kaas: ±30 mm vrij achter de console, of achter de spellen als die dieper zijn (op de vloer van de kaas gemeten); elke kaas is dus zo diep als nodig.
  - Schuin vlak 15° (bovenkant van de console naar de kamer), 2 cm hoog aan de voorkant, randje van 2 cm hoog en 15 mm dik; onzichtbaar bevestigd (blinde plankdragers).
- Indeling per kant van de Sony: 2 × 2 kazen naast de Sony (onderkant 18 en 50 cm) en een hoge kolom erboven naast de LG (82, 114, 146 en 178 cm); rijen om de 32 cm.
  - Binnenste kolommen: links en rechts even ver van de verhoging (60 mm), kazen uitgelijnd op hun kant naar de Sony.
  - Buitenste kolom naast de Sony en de hoge kolom erboven: uitgelijnd op hun binnenkant, gespiegeld rond het midden van de muur, 10 cm naast de breedste binnenste kolom.
  - Alles onder de LG blijft onder de 79 cm.
  - Links: Atari 2600, NES, Mega Drive + Mega CD en SNES (hoog, van boven naar beneden), PS1 en Dreamcast, N64 en PS2. Rechts: Xbox, Wii U, PS4 en Switch (hoog), Xbox 360 en PS3, GameCube en Wii.
- De consoles staan als bron in de laag Kallax (in de vakken of op het blad); de kazen krijgen er een kopie van. Nieuwe consoles: 3D Warehouse-model (`glb`, zoeken via `https://3dwarehouse.sketchup.com/warehouse/v1.0/entities?q=...`), op ware grootte, voorkant naar +z, textures in `textures/`.
