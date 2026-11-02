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

- Tv (`TV`): LG OLED CS 55 inch (OLED55CS6LA, 122,8 × 70,8 × 4,7 cm), midden op de tv-muur en verticaal midden in de opening van de wandkast (0,77–1,872 m): midden 1,32 m. Beamer en W8 op dezelfde middellijn.
- Grotere tv's als losse lagen (standaard uit), op hetzelfde midden en net vóór de 55 inch zodat ze hem afdekken: "LG 65 inch" (OLED65CS6LA, 144,9 × 83,2 cm, 2 mm ervoor) en "LG 75 inch" (75QNED82A6B, 167,7 × 96,5 cm, 4 mm ervoor; een LG OLED bestaat niet in 75 inch). Lagen na de 20e hebben geen sneltoets.
- Sony KV-X2501D (beeldbuis) midden onder de LG op een walnoten verhoging van 70 × 50 × 20 cm, vóór de plint; ±26 cm tussen de Sony en de LG (55 inch).
- **Kazen** zijn de schuine walnoten wandplankjes voor de consoles (`Kaas <console>` in het model):
  - Console links, rechts 3 spellen rechtop met de rug naar voren, in de verpakking van het platform: cartridge (Atari 2600, NES, SNES, N64), cd (PS1, Dreamcast), Mega Drive-doosje, dvd (PS2, GameCube, Xbox, Xbox 360, Wii, Wii U), blu-ray (PS3, PS4), Switch-doosje.
  - Breedte: 10 mm + console + 10 mm + spellen (2 mm ertussen) + 10 mm.
  - Diepte per kaas: ±30 mm vrij achter de console, of achter de spellen als die dieper zijn (op de vloer van de kaas gemeten); elke kaas is dus zo diep als nodig.
  - Schuin vlak 15° (bovenkant van de console naar de kamer), 2 cm hoog aan de voorkant, randje van 2 cm hoog en 15 mm dik; onzichtbaar bevestigd (blinde plankdragers).
- Indeling per kant van de Sony: 2 × 2 kazen naast de Sony (onderkant 18 en 50 cm) en een hoge kolom erboven naast de LG (82, 114, 146 en 178 cm); rijen om de 32 cm.
  - Binnenste kolommen: links en rechts even ver van de verhoging (60 mm), kazen uitgelijnd op hun kant naar de Sony.
  - Buitenste kolom naast de Sony en de hoge kolom erboven: uitgelijnd op hun binnenkant, gespiegeld rond het midden van de muur, 10 cm naast de breedste binnenste kolom.
  - Alles onder de LG blijft onder de onderkant van de LG (55 inch: 96,7 cm).
  - Indeling op lengte van de controllerkabel: de kortste kabels het dichtst bij de speler (binnenste kolommen), dan de buitenste kolommen, de langste bedrade in de onderste kaas van de hoge kolom, draadloos bovenin. Kabels (±): Atari 2600 1,2–1,5 m (aansluiting achter), Mega Drive 1,2–1,8 m, PS1 1,8–2,0, N64 1,9, GameCube 2,0, Dreamcast 2,0, NES 2,3, SNES 2,3, PS2 2,4–2,5, Xbox 2,7–3,0 m; Xbox 360 (aangenomen), Wii (Wii Remote), PS3, Wii U, PS4 en Switch draadloos.
  - Links: Atari 2600 (50) en Mega Drive + Mega CD (18) binnen, Dreamcast (50) en NES (18) buiten, hoog van boven naar beneden Wii U, Xbox 360, Wii, PS2. Rechts: PS1 (50) en N64 (18) binnen, GameCube (50) en SNES (18) buiten, hoog Switch, PS4, PS3, Xbox.
  - Speelplek voor de CRT is de poef (±1,3 m van de muur); vanaf de bank (±2,4 m) halen alleen PS2, SNES en Xbox het zonder verlengkabel. Atari en Mega Drive hebben altijd een DB9-verlengkabel nodig.
- Mega Drive + Mega CD is de tweede versie: Mega Drive 2 (22 × 21 × 5,5 cm) op de koppelplaat met de Mega-CD 2 (25,2 × 21,5 × 6,3 cm) ernaast, samen 47,2 cm breed; zelf gemodelleerd omdat 3D Warehouse geen model van deze versies heeft.
- De consoles staan als bron in de laag Kallax (in de vakken of op het blad); de kazen krijgen er een kopie van. Nieuwe consoles: 3D Warehouse-model (`glb`, zoeken via `https://3dwarehouse.sketchup.com/warehouse/v1.0/entities?q=...`), op ware grootte, voorkant naar +z, textures in `textures/`.

## Wandkast (laag "Wandkast", alternatief voor de kazen)

- Kast op maat over de hele tv-muur, op de vloer (1 cm) en vóór de plinten: achterkant z −2,982 (plint tv-muur), linkerzijde x 0,068 (plint zijmuur), rechts tot x 3,093; bovenkant 2,29 m (plafond 2,32). Plaat 18 mm in de muurkleur (Skimming Stone); onderin een gesloten lat van 5 cm in dezelfde kleur, gelijk met de voorkant.
- Zo ondiep mogelijk: 33 cm = randje + diepste console schuin (PS3, 29 cm × cos 15°) + 3 cm voor stekkers (die gaan de muur in).
- Kolommen (binnenmaat): zijkolommen 46 cm (breedste groep Xbox + spellen 38 cm), naast de Sony 62,4 cm (Mega Drive 2 + Mega-CD 2 met spellen 54,6 cm), Sony-vak 75 cm.
- Planken op een ritme van 34 cm (bovenkant 0,06, 0,40, 0,74, 1,08, 1,42, 1,76), daarboven één vak tot de bovenplaat. Boven de Sony (0,74) een greeploze lade over de hele tv-opening (12 cm hoog); de tv-opening loopt van de lade (0,86) tot de plank op 1,76 (onderkant 1,742), de tv hangt daar verticaal in het midden (midden 1,30 m). De 65 inch past nog (2,5 cm ruimte), de 75 inch niet meer.
- Sony: op een eigen plank 2 cm lager (bovenkant 0,04, op een plint die 3 cm terugligt), op een wig 17,9° achterover zodat het scherm recht naar de ogen van iemand van 1,80 m op de bank kijkt (ooghoogte ±1,20 m, z −0,35). Gekanteld leunt de bovenkant naar achter: Sony 2 cm van de muur, dus het voetstuk onder de Sony komt tot 58 cm (rest 33 cm); zijkanten en bovenkant van het vak blijven 33 cm.
- Alle consolevakken hebben een schuine vloer van 15° met randje (zoals de kazen); niet het Sony-vak, de lade en het bovenste vak in het midden. Consoles schuin tegen het randje, 3 spellen ernaast; indeling op kabellengte (naast de Sony Atari, Mega Drive, PS1, N64; zijkolommen onderin Dreamcast, NES, GameCube, SNES, dan PS2 en Xbox, draadloos hoger).
