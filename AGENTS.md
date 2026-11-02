# Agents

- Na elke wijziging: altijd committen en pushen naar `main`. GitHub Pages publiceert `main` direct op https://bryantebeek.github.io/garage-verbouwing/.
- Na elke wijziging in het model: een testrender maken en die in je antwoord laten zien (als afbeelding), met het standpunt waar de wijziging te zien is: `blender -b -P render.py -- --draft --mode avond --views tv-muur` (±10 s per beeld). Een render in volle kwaliteit (±3 min per beeld) alleen op verzoek.

## Model-conventies (`kelder.gltf`)

- Coördinaten in meters, glTF y omhoog (zoals de positie onderin de viewer). Tv-muur (verf VF3): z −2,994, x 0,056–3,093, midden x 1,5745. Voorgevel x 5,858.
- Lagen zijn de top-level nodes; `extras.visible: false` = standaard uit. Een nieuwe laag ook in `GROUPS` in `index.html` zetten, anders komt hij onder "Overig".
- Namen met nummer krijgen een label: S staander, V/B onder-/bovenregel, P plafondbalk, L plafondlat, K klos, W wandcontactdoos (met "Wn inbouwdozen", "Wn draden" en "Leiding n"), SP inbouwspot, CD centraaldoos, PL plint, SW stucwerk, VF verf. Kies voor iets nieuws een vrij voorvoegsel (L en SP zijn bezet).
- Inspector: `extras.omschrijving` en `extras.product` (`winkel`, `naam`, `artikel`, `url`). Favicons staan in `favicons/<host>.png`, één keer ophalen.
- Varianten (bijv. de slaapbank): beide objecten krijgen `extras.wissel` (label van de schakelaar) en `extras.stand` `dicht` of `open`; de viewer maakt er een schakelaar onder Weergave van.
- Inbouwdozen: de buiktuit (uitgang naar de leiding) midden op de doos; de leiding sluit daar precies op aan. Een doos zo hoog mogelijk = buiktuit tegen de onderkant van de bovenregel.
- Bij verwijderen ook de hele subboom weghalen (geen losse knooppunten achterlaten) en node-indexen in `children` en `scenes` omnummeren.

## Tv-muur (laag "Consoles aan de muur")

- Laag "Tv" (eigen groep in de zijbalk, met een keuzelijst "Formaat" zoals de beamer-animatie): drie objecten met `extras.tvmaat`, er is er steeds één zichtbaar; de keuze blijft bewaard (localStorage) en het zwarte vlak in de beamerprojectie volgt het gekozen formaat. 55 inch = `TV` (LG OLED CS, OLED55CS6LA, 122,8 × 70,8 × 4,7 cm, mijn eigen tv), 65 inch (OLED65CS6LA, 144,9 × 83,2 cm), 75 inch (75QNED82A6B, 167,7 × 96,5 cm; een LG OLED bestaat niet in 75 inch). Midden op de tv-muur, het midden van het scherm op 1,24 m (ooghoogte van iemand van 1,80 m op de GRUNNARP is ±1,20 m; op verzoek 4 cm hoger). Dat is leidend; kasten en de Sony passen zich aan de tv aan, niet andersom. Beamer en W8 op dezelfde middellijn. `render.py` toont de 55 inch.
- Sony KV-X2501D (beeldbuis) midden onder de LG op een walnoten verhoging van 70 × 50 × 30 cm, vóór de plint (Sony 0,31–0,81 m); ±8 cm tussen de Sony en de LG (55 inch), de 65 inch past net, de 75 inch zakt op de Sony.
- **Kazen** zijn de schuine walnoten wandplankjes voor de consoles (`Kaas <console>` in het model):
  - Alleen de console, geen spellen.
  - Breedte: 10 mm + console + 10 mm.
  - Diepte per kaas: ±30 mm vrij achter de console (op de vloer van de kaas gemeten); elke kaas is dus zo diep als de console nodig heeft.
  - Schuin vlak 15° (bovenkant van de console naar de kamer), 2 cm hoog aan de voorkant, randje van 2 cm hoog en 15 mm dik; onzichtbaar bevestigd (blinde plankdragers).
- Indeling per kant van de Sony: 2 × 2 kazen naast de Sony (onderkant 18 en 50 cm) en een hoge kolom erboven naast de LG (82, 114, 146 en 178 cm); rijen om de 32 cm.
  - Elke kolom: kazen met hun midden onder elkaar (niet op een zijkant uitgelijnd).
  - Binnenste kolommen: zo dicht mogelijk bij de buitenste kolom. Alleen de kaas in dezelfde rij telt (de PS2 hangt erboven): links 6 cm tussen Mega Drive + Mega CD en SNES, rechts gespiegeld (Atari 9,6 cm van de NES); midden links x 0,828, rechts x 2,321.
  - Buitenste kolom naast de Sony en de hoge kolom erboven: één kolom, gespiegeld rond het midden van de muur (x 0,412 en 2,737), de breedste kaas minstens 10 cm naast de binnenste kolom.
  - Alles onder de LG blijft onder de onderkant van de LG (55 inch: 84,6 cm).
  - Indeling op lengte van de controllerkabel: de kortste kabels het dichtst bij de speler (binnenste kolommen), dan de buitenste kolommen, de langste bedrade in de onderste kaas van de hoge kolom, draadloos bovenin. Kabels (±): Atari 2600 1,2–1,5 m (aansluiting achter), Mega Drive 1,2–1,8 m, PS1 1,8–2,0, N64 1,9, GameCube 2,0, Dreamcast 2,0, NES 2,3, SNES 2,3, PS2 2,4–2,5, Xbox 2,7–3,0 m; Xbox 360 (aangenomen), Wii (Wii Remote), PS3, Wii U, PS4 en Switch draadloos.
  - Links: N64 (50) en Mega Drive + Mega CD (18) binnen, Dreamcast (50) en SNES (18) buiten, hoog van boven naar beneden Wii U, Xbox 360, Wii, PS2. Rechts: PS1 (50) en Atari 2600 (18) binnen, GameCube (50) en NES (18) buiten, hoog Switch, PS4, PS3, Xbox (op verzoek NES/SNES en Atari/N64 gewisseld).
  - Speelplek voor de CRT is de poef (±1,3 m van de muur); vanaf de bank (±2,4 m) halen alleen PS2, SNES en Xbox het zonder verlengkabel. Atari en Mega Drive hebben altijd een DB9-verlengkabel nodig.
- Mega Drive + Mega CD is de tweede versie: Mega Drive 2 (22 × 21 × 5,5 cm) op de koppelplaat met de Mega-CD 2 (25,2 × 21,5 × 6,3 cm) ernaast, samen 47,2 cm breed; zelf gemodelleerd omdat 3D Warehouse geen model van deze versies heeft.
- De consoles staan als bron in de laag Kallax (in de vakken of op het blad); de kazen krijgen er een kopie van. Nieuwe consoles: 3D Warehouse-model (`glb`, zoeken via `https://3dwarehouse.sketchup.com/warehouse/v1.0/entities?q=...`), op ware grootte, voorkant naar +z, textures in `textures/`.

## Wandkast (laag "Wandkast", alternatief voor de kazen)

- Kast op maat over de hele tv-muur, op de vloer (1 cm) en vóór de plinten: achterkant z −2,982 (plint tv-muur), linkerzijde x 0,068 (plint zijmuur), rechts tot x 3,093; zijkolommen tot 1,82 m; boven de tv-opening niets (geen plank, tv vrij op de muur; plafond 2,32). Plaat 18 mm in de muurkleur (Skimming Stone); onderin geen lat maar 3 greeploze rolladen op wieltjes (voorkant 12 mm boven de vloer, rijden naar voren uit): links (onder de linkerzijkolom en het vak ernaast, ±14 cm hoog), onder de Sony (±24 cm hoog, 54 cm diep) en rechts.
- Zo ondiep mogelijk: 33 cm = randje + diepste console schuin (PS3, 29 cm × cos 15°) + 3 cm voor stekkers (die gaan de muur in).
- Kolommen (binnenmaat): zijkolommen 52 cm (breedste console Xbox 32,4 cm), naast de Sony 56,4 cm (Mega Drive 2 + Mega-CD 2 47,2 cm), Sony-vak 75 cm. Geen spellen in de kast.
- Planken in 6 gelijke stappen van 27,3 cm van 0,18 tot 1,82 (bovenkant 0,18, 0,453, 0,727, 1,0, 1,273, 1,547, 1,82); op 1,82 de bovenplaat van de zijkolommen; boven de tv geen plank. De vakken naast de Sony hebben bovenin de plank op 0,727; boven de Sony geen plank, zijn vak loopt door in de tv-opening. 55, 65 en 75 inch passen.
- Sony: recht (niet kantelen: Sony vraagt 10 cm ventilatie rondom en kantelen verschuift het beeld door het aardmagnetisch veld), hoger dan de rest: op een eigen plank op 0,28 m (Sony 0,28–0,78, onder de 55 inch), 3 cm van de achterkant voor stekkers; erboven open. Alleen het voetstuk onder de Sony (plank met de rollade eronder) komt naar voren tot 54 cm, 2 cm voorbij de voorkant van de Sony; zijkanten van het vak blijven 33 cm.
- Alle consolevakken hebben een schuine vloer van 15° met randje (zoals de kazen); niet het Sony-vak. Plank, schuine vloer en randje zijn één stuk met één doorlopende voorkant (anders tekent de viewer 3–4 lijnen per vak). Consoles schuin tegen het randje, midden in het vak; indeling op kabellengte (naast de Sony Atari, Mega Drive, PS1, N64; zijkolommen onderin Dreamcast, NES, GameCube, SNES, dan PS2 en Xbox, draadloos hoger).

## Consoletrap (laag "Consoletrap", alternatief voor de kazen en de wandkast)

- Eén doorlopend meubel over de hele tv-muur (x 0,068–3,093), vóór de plint (achterkant z −2,982), ±60 cm diep, in de muurkleur (Skimming Stone).
- Twee treden, beide 15° schuin met randje, elk zo diep als de diepste console erop + 3 cm: trede 1 voor (27,9 cm, voorkant 0,12 m), trede 2 achter (32,5 cm, voorkant 0,285 m; begint 9 cm boven de achterkant van trede 1). Hoogste console ±0,62 m, onder de tv.
- Consoles die rechtop horen (PS2, Xbox 360, PS4, Wii, Wii U) staan rechtop op hun zijkant; de Switch in zijn dock. Zo passen alle 16 op twee treden met 6 cm ertussen (4 cm van de nis).
- Midden een nis van 70 cm met een voetstuk van 29 cm hoog dat maar tot 2 cm vóór de Sony loopt (nis ±7 cm terug ten opzichte van de trap). De Sony staat zo ver mogelijk naar achteren: 3 cm van de muur voor stekkers (0,29–0,79 m; de taps toelopende achterkant komt tot ±0,69 m en past onder elke tv).
- Van de Sony naar buiten. Trede 1 (kortste kabels): Mega Drive + Mega CD, NES, SNES links; Atari, PS1, N64 rechts. Trede 2: Dreamcast, PS2, Xbox, Xbox 360, Wii links; GameCube, PS3, PS4, Wii U, Switch rechts (bedraad naar binnen, draadloos naar buiten).

## Kallax tv-meubel (laag "Kallax tv-meubel", alternatief)

- IKEA KALLAX 2x4 liggend (146,8 × 76,6 × 39 cm) midden onder de tv, met tegen beide kanten een staande KALLAX 1x4 (41,5 × 146,8 cm); samen x 0,425–2,724, achterkant tegen de plint (z −2,982). Echte maten: vakken 33,5 × 33,5 cm, buitenrand 40 mm, tussenschotten 16 mm, wit.
- Eén console per vak (16 vakken), plat, 2 cm achter de voorkant. 2x4 (onder, kortste kabels): NES, Mega Drive + Mega CD, Atari, SNES | Dreamcast, PS1, N64, GameCube. 1x4 links van onder naar boven: PS2, Wii, Xbox 360, Wii U; rechts: Xbox, PS3, PS4, Switch.
- Atari (34,6 cm) en Mega Drive + Mega CD (47,2 cm) zijn breder dan een vak en liggen een kwartslag gedraaid; de Mega Drive + Mega CD steekt dan 8,7 cm uit. De Sony heeft in deze opstelling (nog) geen plek.
- Tv past tussen de 1x4's: 55 inch met 12 cm aan elke kant, 65 inch met ±1 cm; de 75 inch valt achter de 1x4's.
