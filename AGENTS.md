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
  - Indeling op lengte van de controllerkabel: de kortste kabels het dichtst bij de speler (binnenste kolommen), dan de buitenste kolommen, de langste bedrade in de onderste kaas van de hoge kolom, draadloos bovenin. Kabels (±): Atari 2600 1,2–1,5 m (aansluiting achter), Mega Drive 1,2–1,8 m, PS1 1,8–2,0, N64 1,9, GameCube 2,0, Dreamcast 2,0, NES 2,3, SNES 2,3, PS2 2,4–2,5, Xbox 2,7–3,0 m; Xbox 360 (aangenomen), Wii (Wii Remote), PS3, Wii U, PS4 en Switch draadloos.
  - Links: Atari 2600 (50) en Mega Drive + Mega CD (18) binnen, Dreamcast (50) en NES (18) buiten, hoog van boven naar beneden Wii U, Xbox 360, Wii, PS2. Rechts: PS1 (50) en N64 (18) binnen, GameCube (50) en SNES (18) buiten, hoog Switch, PS4, PS3, Xbox.
  - Speelplek voor de CRT is de poef (±1,3 m van de muur); vanaf de bank (±2,4 m) halen alleen PS2, SNES en Xbox het zonder verlengkabel. Atari en Mega Drive hebben altijd een DB9-verlengkabel nodig.
- Mega Drive + Mega CD is de tweede versie: Mega Drive 2 (22 × 21 × 5,5 cm) op de koppelplaat met de Mega-CD 2 (25,2 × 21,5 × 6,3 cm) ernaast, samen 47,2 cm breed; zelf gemodelleerd omdat 3D Warehouse geen model van deze versies heeft.
- De consoles staan als bron in de laag Kallax (in de vakken of op het blad); de kazen krijgen er een kopie van. Nieuwe consoles: 3D Warehouse-model (`glb`, zoeken via `https://3dwarehouse.sketchup.com/warehouse/v1.0/entities?q=...`), op ware grootte, voorkant naar +z, textures in `textures/`.

## Wandkast (laag "Wandkast", alternatief voor de kazen)

- Kast op maat over de hele tv-muur, op de vloer (1 cm) en vóór de plinten: achterkant z −2,982 (plint tv-muur), linkerzijde x 0,068 (plint zijmuur), rechts tot x 3,093; bovenkant 2,29 m (plafond 2,32). Plaat 18 mm in de muurkleur (Skimming Stone), plint 6 cm (4 cm terug), lades 9 cm met walnoten fronten.
- Zo ondiep mogelijk: 33 cm = randje + diepste console schuin (PS3, 29 cm × cos 15°) + 3 cm voor stekkers (die gaan de muur in). Alleen de onderkant van het Sony-vak (de plank waar hij op staat, met lade en plint eronder) komt naar voren, tot 45 cm; zijkanten en bovenkant liggen gelijk met de rest. Sony 3 cm van de achterkant, ±6,5 cm overstek over het voetstuk (een beeldbuis is voorzwaar).
- Kolommen (binnenmaat): zijkolommen 46 cm (breedste groep Xbox + spellen 38 cm), naast de Sony 62,4 cm (Mega Drive 2 + Mega-CD 2 met spellen 54,6 cm), Sony-vak 75 cm (±9 cm lucht aan elke kant, 4 cm erboven). Tv-opening 2,03 × 1,10 m (ruim genoeg voor een grotere tv).
- Planken overal op hetzelfde ritme van 28 cm (bovenkant 0,178, 0,458, 0,738, ... 2,138); onder de tv-opening 0,738, erboven 1,858.
- Alle consolevakken hebben een schuine vloer van 15° met randje (zoals de kazen); niet het Sony-vak en de lage vakjes bovenin. Consoles schuin tegen het randje, 3 spellen ernaast; indeling op kabellengte (naast de Sony Atari, Mega Drive, PS1, N64; zijkolommen onderin Dreamcast, NES, GameCube, SNES, dan PS2 en Xbox, draadloos hoger).
