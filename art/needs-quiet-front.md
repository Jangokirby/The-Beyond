# Asset needs: quiet-front

Made from the maps in the game (`node tools/room3d/campaign-needs.js quiet-front qf-1-hush qf-2-grey-ward qf-3-listening qf-4-last-broadcast qf-5-blackout-choir qf-6-silent-convoy qf-7-zero-hour`). 48 maps (35 indoor, 13 outdoor) and 38 different props.

## Rules for every model (so any software can feed the map tool)
- Units: **metres**. A standing person is about 1.7 m and a token is drawn about 1.1 m wide, so a bed is about two tokens long.
- Origin on the floor at the middle of the base; **+Z is the front**; Y up. One file per prop, `.glb` (binary glTF 2.0), static mesh, no rig.
- Name materials `skin`, `hair`, `cloth`, `cloth2` or `trim` only where the colour should be changeable (people and clothes); props can keep their own colours.
- Keep each prop under about 5,000 triangles. File name = the prop id below (for example `bed_iron.glb`).
- Then: `import_models { dir, pack, licensed: true }` (or the Map Builder) to bring them in. See `CHARACTER-IMPORT.md` for people.

## Maps (48)
| Part | Scene | Size (m) | Look | Exits | People | Marks |
|---|---|---|---|---|---|---|
| qf-1-hush | A support trench, Thiepval sector | 20 × 11 | outdoor, dirt, dim | 3 | Captain Anselm Roe | 5 |
| qf-1-hush | A signals dugout | 14 × 10 | stone floor, brick walls, night | 1 | Private Tommy Gill; Sapper Orme | 4 |
| qf-1-hush | The dressing station | 14 × 10 | stone floor, brick walls, night | 1 | Nurse Edith Marlow | 3 |
| qf-1-hush | The listening post, Sap 9 | 20 × 11 | outdoor, dirt, dim | 2 | Leutnant Karl Brandt | 5 |
| qf-1-hush | No man's land, 3:07 | 20 × 11 | outdoor, dirt, dim | 1 | none | 4 |
| qf-1-hush | The support trench, dawn | 20 × 11 | outdoor, dirt, dim | 1 | none | 0 |
| qf-2-grey-ward | The sisters' room, Étaples | 14 × 9 | wood floor, plaster walls, dim | 4 | Sister Edith Marlow | 6 |
| qf-2-grey-ward | Dr. Cole's office | 12 × 9 | wood floor, plaster walls, dim | 1 | Dr. Hamish Cole | 3 |
| qf-2-grey-ward | The orderlies' lamp room | 14 × 10 | stone floor, brick walls, night | 1 | Henri Duval | 3 |
| qf-2-grey-ward | Corporal Dunn's bed | 10 × 8 | wood floor, plaster walls, dim | 1 | Corporal Dunn | 3 |
| qf-2-grey-ward | The chaplain's hut | 14 × 10 | wood floor, wood walls, dim | 2 | Father Adair | 5 |
| qf-2-grey-ward | Ward 9, 4 a.m. | 20 × 12 | wood floor, plaster walls, dim | 1 | none | 4 |
| qf-2-grey-ward | The sisters' room, dawn | 12 × 9 | wood floor, plaster walls, dim | 1 | none | 0 |
| qf-3-listening | The Brandt Institute, Charlottenburg | 14 × 9 | wood floor, plaster walls, dim | 4 | Dr. Ilse Brandt | 6 |
| qf-3-listening | The Stille Stunde, before the doors | 14 × 10 | stone floor, brick walls, night | 1 | Frau Lindqvist | 3 |
| qf-3-listening | Magda's dressing room | 12 × 9 | wood floor, plaster walls, dim | 1 | Magda Weiss | 3 |
| qf-3-listening | Kessler's office | 12 × 9 | wood floor, plaster walls, dim | 1 | Herr Kessler | 3 |
| qf-3-listening | The recording lathe | 12 × 9 | wood floor, plaster walls, dim | 2 | Anton Meier | 5 |
| qf-3-listening | The Stille Stunde, eleven o'clock | 16 × 11 | wood floor, brick walls, dim | 1 | none | 3 |
| qf-3-listening | The Stille Stunde, after midnight | 14 × 10 | stone floor, brick walls, night | 1 | none | 0 |
| qf-4-last-broadcast | Station XQHA, the lobby, Shanghai | 20 × 11 | tile floor, concrete walls, day | 4 | Mr. Holt | 6 |
| qf-4-last-broadcast | The monitoring room | 12 × 9 | wood floor, plaster walls, dim | 1 | Mieko Tanaka | 3 |
| qf-4-last-broadcast | Studio A | 12 × 9 | wood floor, plaster walls, dim | 1 | Lin Yuhua | 3 |
| qf-4-last-broadcast | The transmitter hall | 18 × 11 | tile floor, concrete walls, day | 2 | Konstantin Volkov | 5 |
| qf-4-last-broadcast | A lane behind the Settlement | 20 × 12 | outdoor, cobble, dim | 1 | Auntie Wen | 3 |
| qf-4-last-broadcast | The aerial roof, 11:00 p.m. | 20 × 12 | outdoor, cobble, dim | 1 | none | 3 |
| qf-4-last-broadcast | Station XQHA, the lobby, dawn | 18 × 11 | tile floor, concrete walls, day | 1 | none | 0 |
| qf-5-blackout-choir | Marlowe Road deep shelter, London | 16 × 10 | stone floor, brick walls, night | 4 | Matron Edith Marlow | 6 |
| qf-5-blackout-choir | The long gallery, the choir | 16 × 10 | marble floor, plaster walls, dim | 1 | Mr. Pike | 3 |
| qf-5-blackout-choir | The warden's post | 14 × 10 | stone floor, brick walls, night | 1 | Mrs. Dobbs | 3 |
| qf-5-blackout-choir | The third tier | 14 × 10 | stone floor, brick walls, night | 1 | Tommy | 3 |
| qf-5-blackout-choir | A requisitioned flat in Whitehall | 10 × 8 | wood floor, plaster walls, dim | 2 | Dr. Ilse Brandt | 4 |
| qf-5-blackout-choir | The unopened tunnel, All Clear minus one minute | 14 × 10 | stone floor, brick walls, night | 1 | none | 4 |
| qf-5-blackout-choir | Marlowe Road shelter, the morning | 14 × 10 | stone floor, brick walls, night | 1 | none | 0 |
| qf-6-silent-convoy | The bridge of HMCS Larkspur | 21 × 10 | outdoor, wood, dim | 4 | Lieutenant Commander Rhodes | 6 |
| qf-6-silent-convoy | The Asdic hut | 14 × 10 | wood floor, wood walls, dim | 1 | Able Seaman Delorme | 3 |
| qf-6-silent-convoy | The Commodore's cabin, SS Empire Garland | 12 × 9 | wood floor, plaster walls, dim | 1 | Commodore Haldane | 3 |
| qf-6-silent-convoy | The deck of the SS Anneliese Holt | 19 × 10 | outdoor, wood, dim | 1 | Mrs. Annie Reilly | 3 |
| qf-6-silent-convoy | The hydrophone table | 12 × 9 | wood floor, plaster walls, dim | 2 | Dr. Ilse Brandt | 4 |
| qf-6-silent-convoy | The deck of the Anneliese Holt, 3:07 | 19 × 10 | outdoor, wood, dim | 1 | none | 3 |
| qf-6-silent-convoy | The bridge of the Larkspur, dawn | 19 × 10 | outdoor, wood, dim | 1 | none | 0 |
| qf-7-zero-hour | Charlottenburg, in the ruins | 22 × 12 | outdoor, cobble, dim | 4 | Dr. Ilse Brandt | 6 |
| qf-7-zero-hour | A ruined street, Charlottenburg | 20 × 12 | outdoor, cobble, dim | 1 | Magda Weiss | 3 |
| qf-7-zero-hour | The lathe room, half-roofed | 12 × 9 | wood floor, plaster walls, dim | 1 | Anton Meier | 3 |
| qf-7-zero-hour | A British medical post | 12 × 9 | wood floor, plaster walls, dim | 1 | Matron Edith Marlow | 3 |
| qf-7-zero-hour | The corner by the Institute | 12 × 9 | wood floor, plaster walls, dim | 2 | Frau Lindqvist | 4 |
| qf-7-zero-hour | The Institute cellar, 3:06 | 14 × 10 | stone floor, brick walls, night | 1 | Dr. Ilse Brandt | 4 |
| qf-7-zero-hour | Charlottenburg, the ruins, dawn | 20 × 12 | outdoor, cobble, dim | 1 | none | 0 |

## Props (38), most used first
| Prop id | Name | Size W × D (m) | Blocks walking | Used | Where (first 3) |
|---|---|---|---|---|---|
| `bookshelf` | Bookshelf | 1.4 × 0.4 | no | 100× | qf-2-grey-ward/office, qf-2-grey-ward/cole, qf-2-grey-ward/end |
| `bench` | Bench | 1.8 × 0.45 | no | 51× | qf-2-grey-ward/chaplain, qf-4-last-broadcast/lobby, qf-4-last-broadcast/hall |
| `barrel` | Barrel | 0.7 × 0.7 | no | 49× | qf-1-hush/trench, qf-1-hush/dugout, qf-1-hush/station |
| `sandbags` | Sandbag wall | 2 × 0.6 | no | 43× | qf-1-hush/trench, qf-1-hush/post, qf-1-hush/noman |
| `crate` | Crate | 0.8 × 0.8 | no | 39× | qf-1-hush/trench, qf-1-hush/post, qf-1-hush/noman |
| `pillar` | Pillar | 0.6 × 0.6 | no | 25× | qf-1-hush/dugout, qf-1-hush/station, qf-2-grey-ward/henri |
| `house_front` | House front (4 m) | 4 × 1.4 | no | 21× | qf-4-last-broadcast/lane, qf-4-last-broadcast/roof, qf-7-zero-hour/ruins |
| `lamp_post` | Street lamp | 0.4 × 0.4 | no | 18× | qf-1-hush/trench, qf-1-hush/post, qf-1-hush/noman |
| `crate_stack` | Stacked crates | 1.6 × 0.8 | no | 18× | qf-1-hush/dugout, qf-1-hush/station, qf-2-grey-ward/henri |
| `table_long` | Long table | 2.4 × 0.9 | no | 18× | qf-4-last-broadcast/lobby, qf-4-last-broadcast/hall, qf-4-last-broadcast/end |
| `desk` | Desk | 1.8 × 0.9 | no | 17× | qf-2-grey-ward/office, qf-2-grey-ward/cole, qf-2-grey-ward/chaplain |
| `lamp_table` | Lamp on a table | 0.5 × 0.5 | no | 17× | qf-2-grey-ward/dunn, qf-2-grey-ward/chaplain, qf-2-grey-ward/ward |
| `chair` | Chair | 0.5 × 0.5 | no | 16× | qf-2-grey-ward/office, qf-2-grey-ward/cole, qf-2-grey-ward/dunn |
| `rug` | Rug | 2.4 × 1.6 | no | 16× | qf-2-grey-ward/office, qf-2-grey-ward/cole, qf-2-grey-ward/end |
| `candle` | Candle | 0.3 × 0.3 | no | 15× | qf-1-hush/dugout, qf-1-hush/station, qf-2-grey-ward/henri |
| `fireplace` | Fireplace | 1.8 × 0.6 | no | 15× | qf-2-grey-ward/office, qf-2-grey-ward/cole, qf-2-grey-ward/end |
| `lamp_floor` | Standing lamp | 0.4 × 0.4 | no | 14× | qf-2-grey-ward/office, qf-2-grey-ward/cole, qf-2-grey-ward/end |
| `stool` | Stool | 0.4 × 0.4 | no | 12× | qf-3-listening/stage |
| `rock` | Boulder | 1.1 × 1 | no | 9× | qf-1-hush/trench, qf-1-hush/post, qf-1-hush/noman |
| `bed_iron` | Iron bed | 1 × 2.1 | no | 9× | qf-2-grey-ward/ward |
| `tree_dead` | Dead tree | 1.2 × 1.2 | no | 8× | qf-1-hush/trench, qf-1-hush/post, qf-1-hush/noman |
| `bollard` | Mooring post | 0.4 × 0.4 | no | 7× | qf-6-silent-convoy/bridge, qf-6-silent-convoy/drifter_deck, qf-6-silent-convoy/fight_deck |
| `market_stall` | Market stall | 2.4 × 1.2 | no | 5× | qf-4-last-broadcast/lane, qf-4-last-broadcast/roof, qf-7-zero-hour/ruins |
| `cart` | Cart | 2.2 × 1.2 | no | 5× | qf-4-last-broadcast/lane, qf-4-last-broadcast/roof, qf-7-zero-hour/ruins |
| `counter` | Counter / bar | 2.6 × 0.7 | no | 4× | qf-3-listening/stage, qf-4-last-broadcast/lobby, qf-4-last-broadcast/hall |
| `table_round` | Round table | 1.1 × 1.1 | no | 4× | qf-3-listening/stage |
| `statue` | Statue | 1 × 1 | no | 4× | qf-5-blackout-choir/choir |
| `candelabra` | Candelabra | 0.5 × 0.5 | no | 4× | qf-5-blackout-choir/choir |
| `ship_mast` | Mast | 0.8 × 0.8 | no | 4× | qf-6-silent-convoy/bridge, qf-6-silent-convoy/drifter_deck, qf-6-silent-convoy/fight_deck |
| `deck_gun` | Deck gun | 1.6 × 1 | no | 4× | qf-6-silent-convoy/bridge, qf-6-silent-convoy/drifter_deck, qf-6-silent-convoy/fight_deck |
| `anchor` | Anchor | 1 × 0.5 | no | 4× | qf-6-silent-convoy/bridge, qf-6-silent-convoy/drifter_deck, qf-6-silent-convoy/fight_deck |
| `boiler` | Boiler | 2.2 × 1.2 | no | 4× | qf-6-silent-convoy/bridge, qf-6-silent-convoy/drifter_deck, qf-6-silent-convoy/fight_deck |
| `life_raft` | Life raft | 1.6 × 1 | no | 3× | qf-6-silent-convoy/drifter_deck, qf-6-silent-convoy/fight_deck, qf-6-silent-convoy/end |
| `bed_double` | Double bed | 1.7 × 2.1 | no | 2× | qf-2-grey-ward/dunn, qf-5-blackout-choir/admiralty |
| `wardrobe` | Wardrobe | 1.2 × 0.6 | no | 2× | qf-2-grey-ward/dunn, qf-5-blackout-choir/admiralty |
| `plant` | Plant | 0.5 × 0.5 | no | 2× | qf-5-blackout-choir/choir |
| `stove` | Stove | 0.9 × 0.9 | no | 1× | qf-2-grey-ward/ward |
| `crate_med` | Medical crate | 0.9 × 0.6 | no | 1× | qf-2-grey-ward/ward |

## Story objects that only have a plain stand-in today (63): worth a real model
| Part | Scene | The story's object | Stand-in now |
|---|---|---|---|
| qf-1-hush | A support trench, Thiepval sector | Read the company's casualty returns | Crate |
| qf-1-hush | A signals dugout | Search Orme's slate | Barrel |
| qf-1-hush | A signals dugout | Look at the dugout's telephone log | Stacked crates |
| qf-1-hush | The dressing station | Read the dressing-station ledger | Pillar |
| qf-1-hush | The listening post, Sap 9 | Read the listening-post log | Dead tree |
| qf-1-hush | The listening post, Sap 9 | Examine the shell-hole from the sap, with a periscope | Barrel |
| qf-1-hush | No man's land, 3:07 | Lead the line in song, and drown it out | Sandbag wall |
| qf-1-hush | No man's land, 3:07 | Make a truce across the wire, and sing from both sides | Sandbag wall |
| qf-1-hush | No man's land, 3:07 | Face it at the shell-hole | Crate |
| qf-2-grey-ward | The sisters' room, Étaples | Read the ward's death register | Bookshelf |
| qf-2-grey-ward | Dr. Cole's office | Read the doctor's graphs | Bookshelf |
| qf-2-grey-ward | The orderlies' lamp room | Read the rounds book | Barrel |
| qf-2-grey-ward | Corporal Dunn's bed | Sit by the bed, and listen | Double bed |
| qf-2-grey-ward | The chaplain's hut | Read the half-sentences | Desk |
| qf-2-grey-ward | The chaplain's hut | Say the whole office for the dying, from memory | Pillar |
| qf-2-grey-ward | Ward 9, 4 a.m. | Fill the ward with noise: a gramophone, a song, and every voice | Lamp on a table |
| qf-2-grey-ward | Ward 9, 4 a.m. | Open every window and door, and let the night in | Lamp on a table |
| qf-2-grey-ward | Ward 9, 4 a.m. | Speak Heal over the dying, and let each one finish | Iron bed |
| qf-2-grey-ward | Ward 9, 4 a.m. | Face it at the end of the ward | Lamp on a table |
| qf-3-listening | The Brandt Institute, Charlottenburg | Listen to last night's cylinder | Desk |
| qf-3-listening | The Stille Stunde, before the doors | Read the handbill and the door-list | Pillar |
| qf-3-listening | Magda's dressing room | Read the dressing-room notes | Bookshelf |
| qf-3-listening | Kessler's office | Open the ledger on the desk | Bookshelf |
| qf-3-listening | The recording lathe | Play the backwards cylinder | Bookshelf |
| qf-3-listening | The recording lathe | Set the lathe to run backwards | Bookshelf |
| qf-3-listening | The Stille Stunde, eleven o'clock | Run Ilse's recording backwards through a horn, and break the silence | Fireplace |
| qf-3-listening | The Stille Stunde, eleven o'clock | Win the audience: stand and make the whole room speak | Stool |
| qf-3-listening | The Stille Stunde, eleven o'clock | Face it on the stage | Stool |
| qf-4-last-broadcast | Station XQHA, the lobby, Shanghai | Read the programme sheet | Bench |
| qf-4-last-broadcast | The monitoring room | Read the carrier log | Bookshelf |
| qf-4-last-broadcast | Studio A | Search the announcer's script file | Bookshelf |
| qf-4-last-broadcast | The transmitter hall | Examine the valve | Counter / bar |
| qf-4-last-broadcast | The transmitter hall | Read the code etched into the valve's base | Bench |
| qf-4-last-broadcast | The transmitter hall | Up to the roof, at eleven | Long table |
| qf-4-last-broadcast | A lane behind the Settlement | Look at the radio on her knee | Crate |
| qf-4-last-broadcast | The aerial roof, 11:00 p.m. | Break the valve and ground the aerial | Barrel |
| qf-4-last-broadcast | The aerial roof, 11:00 p.m. | Face it in the transmitter hall | Bench |
| qf-5-blackout-choir | Marlowe Road deep shelter, London | Read the first-aid post's night register | Pillar |
| qf-5-blackout-choir | The long gallery, the choir | Watch the choir through the end of a raid | Statue |
| qf-5-blackout-choir | The warden's post | Read the warden's log | Barrel |
| qf-5-blackout-choir | The third tier | Look at the end of the gallery from his bunk | Pillar |
| qf-5-blackout-choir | A requisitioned flat in Whitehall | Read Ilse's notes on the timetable | Wardrobe |
| qf-5-blackout-choir | The unopened tunnel, All Clear minus one minute | Bring the whole shelter into the tunnel, singing | Pillar |
| qf-5-blackout-choir | The unopened tunnel, All Clear minus one minute | Sound the siren by hand, early, from the top of the lift | Stacked crates |
| qf-6-silent-convoy | The bridge of HMCS Larkspur | Read the night's log | Barrel |
| qf-6-silent-convoy | The Asdic hut | Read the paper trace | Desk |
| qf-6-silent-convoy | The Commodore's cabin, SS Empire Garland | Read the signal book | Bookshelf |
| qf-6-silent-convoy | The deck of the SS Anneliese Holt | Search the chart room for the last log | Anchor |
| qf-6-silent-convoy | The hydrophone table | Calibrate the hydrophone | Bookshelf |
| qf-6-silent-convoy | The hydrophone table | Aboard the Anneliese Holt, at 3:07 | Chair |
| qf-6-silent-convoy | The deck of the Anneliese Holt, 3:07 | Sing it down: forty ships, forty lamps, one song | Anchor |
| qf-6-silent-convoy | The deck of the Anneliese Holt, 3:07 | Throw a depth-charge pattern, and ping the cylinder into the sea | Mast |
| qf-6-silent-convoy | The deck of the Anneliese Holt, 3:07 | Face it on the foredeck | Mast |
| qf-7-zero-hour | Charlottenburg, in the ruins | Read the Institute's plans | Crate |
| qf-7-zero-hour | A ruined street, Charlottenburg | Listen to the street | Street lamp |
| qf-7-zero-hour | The lathe room, half-roofed | Play one cylinder at half speed | Bookshelf |
| qf-7-zero-hour | A British medical post | Read the unit's casualty returns | Bookshelf |
| qf-7-zero-hour | The corner by the Institute | Search the old woman's coat | Bookshelf |
| qf-7-zero-hour | The corner by the Institute | Down into the Institute cellar | Chair |
| qf-7-zero-hour | The Institute cellar, 3:06 | Hear all of it, and say that you heard | Pillar |
| qf-7-zero-hour | The Institute cellar, 3:06 | Fill the chamber with everyone who ever heard it, and give the names back | Pillar |
| qf-7-zero-hour | The Institute cellar, 3:06 | Seal the chamber, and leave it in the room that was built for it | Barrel |
| qf-7-zero-hour | The Institute cellar, 3:06 | Face it in the chamber | Pillar |
