/* ============================================================================
   TRAITOR — a joint operation for every agency. Neo France, Paris, 2150.
   Written from the author's unfinished module: the hotel L'Horizon d'Acier, the
   rooftop, floors 16 to 18, District 55 and the objectives are the author's.
   The module breaks off at the Café du Sillage, the Garage Vitesse Rouge and the
   Clinique Sainte-Helix; those three, and the confrontation with Agent Seline
   Moreau, are finished here from the briefing, and marked as such in the text
   so the author can replace them.
   ========================================================================== */
(function () {
  const A = window.ART, ADV = window.ADV;
  const F = (s, hc, h, o, x = "none", more = {}) => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg: "#2b2f3a", ...more });
  const N = (name, tag, look, face) => ({ name, tag, look, face });
  const NOISE = [{ inc: "reports" }];

  ADV.register({
    id: "traitor", title: "Traitor", setting: "Neo France, Paris · 2150", year: 2150, level: [1, 9], agencies: ["WCA", "NSBD", "BFV", "EHG", "OID"], region: "europe", theme: "future",
    summary: "A WCA agent has gone rogue and stolen the Wicked Dredge, a hook-like device worn as a backpack that pulls things out of the Beyond and tears Ruptures in the world. Every agency has been summoned. Team Dragon takes the hotel. Do it quickly, and don't be seen.",
    objectives: [
      { id: "po1", kind: "primary", t: "Collect the Artifact", done: "The Wicked Dredge is out of Agent Moreau's hands and in WCA custody." },
      { id: "po2", kind: "primary", t: "Remain elusive: keep reports of your presence below 5", done: "Paris woke up the next morning and saw nothing." },
      { id: "po3", kind: "primary", t: "Secure every zone", done: "The hotel, District 55, the café, the garage and the clinique are yours." },
      { id: "so1", kind: "secondary", t: "Hold the rooftops", done: "The roof stays in your hands, and you have the high ground.", benefit: { label: "The high ground", text: "+2 to your attacks while you hold the roof.", combat: { attack: 2 } } },
      { id: "so2", kind: "secondary", t: "Find evidence of the cult's ambush", done: "A local terrorist cult has planned an ambush for you on the street.", benefit: { label: "Forewarned", text: "You will not be stunned in the firefight in the street.", flag: "no_stun", bonus: { tags: ["ambush"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Find the gas masks", done: "A crate of gas masks in one of the rooms.", benefit: { label: "Gas masks", text: "You can resist what the building breathes out.", bonus: { tags: ["gas"], value: 4 } } }
    ],
    clues: {
      c_brief: { t: "The briefing", s: "Agent Hugo", x: "Agent Seline Moreau has taken the Wicked Dredge from WCA custody. She is believed to be working with a Beyond entity. Teams Dragon, Witch and Ogre will take the surrounding area, then the Hospital Clinique Sainte-Helix." },
      c_relay: { t: "A relay still sending", s: "The rooftop", x: "The relay tower on the roof was shut off, and is still sending without any power. The hotel was meant to be deactivated." },
      c_scramble: { t: "The signal is scrambled", s: "The hotel", x: "The interior is invisible to surveillance. Lower floors read higher than normal tremors." },
      c_cult: { t: "A cult's plan", s: "Suite 13", x: "A local terrorist cult, with Dredge Agents' help, plans an ambush in District 55 to pin the teams down." },
      c_seline: { t: "Moreau was not alone", s: "The garage", x: "Seline Moreau was taken in, not driven out. Someone offered her what the Dredge can make." }
    },
    npcs: {
      hugo: N("Agent Hugo", "WCA handler · Neo France", "Tall, with dark skin and a sleek blue suit that doesn't crease. He holds a cup of tea as if it were a weapon.", F(2, 5, "short", 7, "none", { sex: "m" })),
      seline: N("Agent Seline Moreau", "WCA agent · gone rogue", "A woman in a pale coat with a hooked metal rig strapped across her back like a backpack, and eyes that are not quite focussed on you.", F(0, 4, "bun", 7, "none", { sex: "f" })),
      operator: N("The Relay Operator", "Dredge Agent · technomancer", "Hooded, wired to the wall, with a crown of small drones circling the top of his head.", F(1, 5, "short", 7, "none", { sex: "m" }))
    },
    companions: {
      hugo: { npc: "hugo", name: "Agent Hugo", attack: 4, build: { difficulty: "medium", mods: ["Ranged"], bonus: { health: 5 } }, nothing: "You have what you need. Make it quick, and don't be seen.",
        hints: [{ text: "That relay has no power and it is still sending. Don't think machine. Think Beyond.", if: { clue: "c_relay" } }, { text: "Turrets are loud. Every shot reports you.", if: "turrets_on" }, { text: "She was one of ours. If she can be talked down, I want her alive.", if: { clue: "c_seline" } }] }
    },
    enemies: {
      dredge: { build: { name: "Dredge Agent", type: "Human", difficulty: "medium", sprite: "humanoid", hue: 190, dtype: "health", mods: ["Speech", "Ranged", "Quick Draw", "Night Vision"], core: { body: 2, mind: 1, spirit: 3 }, dies: "drops, still holding the weapon that is not from this world" } },
      operator: { build: { name: "Dredge Relay Operator", type: "Human", difficulty: "medium", sprite: "humanoid", hue: 200, dtype: "sanity", mods: ["Speech", "Beyond Control"], core: { body: 2, mind: 1, spirit: 3 }, bonus: { health: 20, sanity: 40, stability: 15 }, text: "Relay: lightning chains between agents (Agility CR 14, +2 for each one hit). Technomancy: drones sacrifice themselves to protect him.", dies: "falls into his own wires, and the drones fall with him" } },
      drone: { build: { name: "Drone", type: "Swarm", difficulty: "easy", sprite: "construct", hue: 200, dtype: "sanity", mods: ["Swarm"], core: { body: 1, mind: 2, spirit: 3 }, dies: "drops, sparking" } },
      turret: { build: { name: "Building turret", type: "Construct", difficulty: "easy", sprite: "construct", hue: 190, dtype: "health", attack: 3, core: { body: 1, mind: 0, spirit: 0 } } },
      swarm: { build: { name: "Rupture swarm", type: "Swarm", difficulty: "easy", sprite: "construct", hue: 280, dtype: "health", mods: ["Swarm"], core: { body: 1, mind: 1, spirit: 1 }, bonus: { health: -10, sanity: -5, stability: -5 }, dies: "comes apart into static" } },
      seline: { build: { name: "Agent Seline Moreau", type: "Human", difficulty: "challenging", sprite: "humanoid", hue: 280, dtype: "stability", mods: ["Speech", "Occult", "Ranged"], core: { body: 2, mind: 2, spirit: 3 }, attack: 1,
        text: "The Wicked Dredge: opens a Rupture in her zone each round (a Rupture swarm arrives). Take it from her, or break it.", dies: "falls to her knees with the rig still humming on her back" } }
    },
    encounters: {
      roof: { name: "The rooftop", theme: "future", severity: 1, fightText: "A small transport drone sets down at the edge of the roof. Four armed men step off, already pointing.", zones: [{ id: "a", name: "The landing", col: 0, row: 0 }, { id: "b", name: "The relay tower", col: 1, row: 0 }, { id: "c", name: "The fire escape", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "dredge", zone: "b" }, { t: "dredge", zone: "b", name: "Dredge Agent (2)" }, { t: "dredge", zone: "c", name: "Dredge Agent (3)" }] },
      f18: { name: "Floor 18", theme: "future", lit: false, fightText: "In the pitch dark, five lasers wake up at once, and you can hear them breathing.", zones: [{ id: "a", name: "The stair well", col: 0, row: 0 }, { id: "b", name: "The hallway", col: 1, row: 0 }, { id: "c", name: "The maintenance room", col: 2, row: 0 }, { id: "d", name: "The suite", col: 1, row: 1 }],
        edges: [["a", "b"], ["b", "c"], ["b", "d"]], start: "a", foes: [{ t: "dredge", zone: "b" }, { t: "dredge", zone: "b", name: "Dredge Agent (2)" }, { t: "dredge", zone: "b", name: "Dredge Agent (3)" }, { t: "dredge", zone: "d", name: "Dredge Agent (4)" }, { t: "dredge", zone: "d", name: "Dredge Agent (5)" }] },
      f18t: { name: "Floor 18, the lights on", theme: "future", fightText: "The lights come up on five Dredge Agents, and two turrets swivel to face them.", zones: [{ id: "a", name: "The stair well", col: 0, row: 0 }, { id: "b", name: "The hallway", col: 1, row: 0 }, { id: "c", name: "The maintenance room", col: 2, row: 0 }, { id: "d", name: "The suite", col: 1, row: 1 }],
        edges: [["a", "b"], ["b", "c"], ["b", "d"]], start: "a", foes: [{ t: "dredge", zone: "b" }, { t: "dredge", zone: "b", name: "Dredge Agent (2)" }, { t: "dredge", zone: "b", name: "Dredge Agent (3)" }, { t: "dredge", zone: "d", name: "Dredge Agent (4)" }, { t: "dredge", zone: "d", name: "Dredge Agent (5)" }],
        allies: [{ t: "turret", zone: "b", name: "Turret" }, { t: "turret", zone: "b", name: "Turret (2)", stay: true }] },
      f17: { name: "Floor 17", theme: "future", fightText: "Four more Dredge Agents, in the doorways of the rented rooms.", zones: [{ id: "a", name: "The stair well", col: 0, row: 0 }, { id: "b", name: "The hallway", col: 1, row: 0 }, { id: "c", name: "The rooms", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "dredge", zone: "b" }, { t: "dredge", zone: "b", name: "Dredge Agent (2)" }, { t: "dredge", zone: "c", name: "Dredge Agent (3)" }, { t: "dredge", zone: "c", name: "Dredge Agent (4)" }] },
      f16: { name: "Floor 16: the relay room", theme: "future", fightText: "At the end of the hall a man is wired into the wall, with a crown of small drones circling his head. Two Dredge Agents flank him. Somewhere below, something very large turns over in its sleep.", zones: [{ id: "a", name: "The stair well", col: 0, row: 0 }, { id: "b", name: "The hallway", col: 1, row: 0 }, { id: "c", name: "The relay room", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "operator", zone: "c" }, { t: "dredge", zone: "b" }, { t: "dredge", zone: "b", name: "Dredge Agent (2)" }, { t: "drone", zone: "c" }, { t: "drone", zone: "c", name: "Drone (2)" }, { t: "drone", zone: "c", name: "Drone (3)" }, { t: "drone", zone: "c", name: "Drone (4)" }, { t: "drone", zone: "c", name: "Drone (5)" }] },
      street: { name: "District 55", theme: "future", fightText: "Every light on the street comes on at once. Out of the empty cars and the dead shopfronts, they come.", zones: [{ id: "a", name: "The street", col: 0, row: 0 }, { id: "b", name: "The convenience store", col: 1, row: 0 }, { id: "c", name: "The garage mouth", col: 1, row: 1 }],
        edges: [["a", "b"], ["a", "c"]], start: "a", foes: [{ t: "swarm", zone: "a" }, { t: "swarm", zone: "a", name: "Rupture swarm (2)" }, { t: "swarm", zone: "a", name: "Rupture swarm (3)" }, { t: "swarm", zone: "c", name: "Rupture swarm (4)" }, { t: "dredge", zone: "b" }] },
      clinique: { name: "Clinique Sainte-Helix", theme: "future", fightText: "She turns, with the hook across her back humming, and opens the air beside her like a curtain.", zones: [{ id: "a", name: "The lobby", col: 0, row: 0 }, { id: "b", name: "The ward", col: 1, row: 0 }, { id: "c", name: "The surgical theatre", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "seline", zone: "c" }, { t: "dredge", zone: "b" }, { t: "dredge", zone: "b", name: "Dredge Agent (2)" }, { t: "swarm", zone: "c" }] }
    },
    start: "debrief",
    scenes: {
      debrief: { name: "WCA headquarters, Neo France", theme: "future", mood: "tense", lighting: "glow", weather: "none", cast: ["hugo"],
        onEnter: [{ once: "in", steps: [
          { say: "Wherever and however you got here didn't matter much: most of you might not make it home, but that was how the job normally went. You were brought into WCA headquarters in Neo France to be debriefed by Agent Hugo, a tall man with dark skin and a sleek blue suit. The office, modern in technology, still had that old Victorian elegance the WCA was known for: classical art, vintage hand-crafted furniture." },
          { talk: { npc: "hugo", text: "An agent has gone rogue. It isn't unusual for an agent to lose their mind and become a threat, but this one is different. Agent Seline Moreau has taken a very powerful Beyond Artifact: the Wicked Dredge. It is a hook-like machine worn as a backpack, capable of opening Ruptures anywhere. She must be stopped at all costs, and the Artifact retrieved." } },
          { say: "Make it quick, and don't be seen. Something with this many agents on it will draw attention. Local surveillance will be shut down in the area, but that doesn't stop locals from being nosey. It doesn't mean you need to keep it quiet or clean: just don't get caught doing anything that would need an explanation." },
          { clue: "c_brief" },
          { say: "All agents from every agency were split into three teams: Dragon, Witch and Ogre. You are Team Dragon. You will infiltrate and secure L'Horizon d'Acier, a hotel for foreign tourists. It should have been deactivated, but it is giving off strong relay signals, pumping out reconnaissance coordinates and agent locations. Team Dragon will be dropped on the roof by jump-copter. Lower floors show higher than normal tremor readings: avoid them." },
          { say: "Finish locking down the surrounding area, and then the assault on the Hospital Clinique Sainte-Helix can begin. Witch and Ogre will converge on the hospital when they are done." }] }],
        options: [
          { label: "Take Agent Hugo along", hint: "A local handler who gives guidance: he is not a fighter", once: true, steps: [{ join: "hugo" }, { say: "\"I will be on the line, and in the second copter.\" He sets his tea down." }] },
          { label: "Board the jump-copter", steps: [{ goto: "roof" }] }] },
      roof: { name: "The rooftop of L'Horizon d'Acier", theme: "future", mood: "tense", lighting: "glow", weather: "wind",
        onEnter: [{ once: "in", steps: [
          { say: "You rappel from the jump-copter and land firmly on the rooftop. A great view of the city below: its normal LED glow and monolithic structures, a flood of adware billboards. The sun, just setting, barely peeks above the city and gives off its last natural light, leaving only the artificial hum. The relay tower atop the roof has clearly been shut off, but it is still giving out a signal without a power source." },
          { clue: "c_relay" },
          { say: "Mission modifier: agents cannot Hide. The enemy is getting constant updates on your locations." }] }],
        options: [
          { label: "Hold the rooftop and wait for the patrol", hint: "Terrorists will land on the roof by transport drone", if: { not: "roof_held" }, steps: [{ combat: "roof", win: [{ set: "roof_held" }, { objective: "so1" }, { say: "The transport drone limps off the roof. The roof is yours." }] }] },
          { label: "Take the fire escape and look through the windows", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Look into the hotel from outside", investigate: true,
            ok: [{ say: "From the fire escape you can see most of the hotel's floors: lights out on 18, a figure moving on 17, and the 16th-floor windows are full of small drones." }, { clue: "c_scramble" }],
            fail: [{ say: "The glass is mirrored. You see yourselves." }] } }] },
          { label: "Go in by the roof access door", steps: [{ goto: "f18" }] }] },
      f18: { name: "Floor 18", theme: "future", mood: "boss", lighting: "pitch", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Pitch black, and something is hunting here. There are five Dredge Agents with night vision and they are happy to take down any intruders. The only way to turn the lights on is to return power to the building in the maintenance room." }] }],
        options: [
          { label: "Go to the maintenance room and restore power", hint: "Intelligence Easy 7", once: true, steps: [{ check: { aspect: "iq", cr: "easy", label: "Restore the floor's power", who: "choose",
            ok: [{ say: "The lights come up. The floor's cameras and turret controls are on the screens in front of you." }, { set: "power18" }],
            fail: [{ say: "The terminal is a bad copy of one you know. It takes you a long time." }, { set: "power18" }] } }] },
          { label: "Switch on the turrets", hint: "Intelligence Challenging 14: 2 turrets help, and every shot reports you", if: "power18", once: true, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Wake the cameras and turrets", who: "choose",
            ok: [{ say: "Two ceiling turrets wake and swing toward the hallway." }, { set: "turrets_on" }, { inc: "reports" }], fail: [{ say: "The system refuses, twice." }] } }] },
          { label: "Fight the Dredge Agents", if: { not: "f18_clear" }, steps: [{ if: { flag: "turrets_on" }, then: [{ combat: "f18t", win: [{ set: "f18_clear" }] }], else: [{ combat: "f18", win: [{ set: "f18_clear" }] }] }] },
          { label: "Search the suite", hint: "Room 13, a suite with a locked drone cache", if: "f18_clear", once: true, steps: [{ say: "The suite has room to rest, and a locked cache on the table." },
            { check: { aspect: "iq", cr: "challenging", label: "Open the drone cache", who: "choose",
              ok: [{ say: "The drone inside comes to life, glyphs on its data pad, and becomes loyal to whoever opened it. Beneath it, a data slate: a plan to pin the teams down in the street, signed with a local terrorist cult's mark." }, { clue: "c_cult" }, { objective: "so2" }],
              fail: [{ say: "The cache does not open. You can see what is inside: a drone, and a slate." }] } }] },
          { label: "Look through the crates in the rooms", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Search the rooms", investigate: true,
            ok: [{ say: "A crate of gas masks, sealed, with the building's mark on it. Someone knew what the lower floors give off." }, { objective: "so3" }], fail: [{ say: "Beds, bathrooms, vidscreens. Modest." }] } }] },
          { label: "Go down to Floor 17", if: "f18_clear", steps: [{ goto: "f17" }] }] },
      f17: { name: "Floor 17", theme: "future", mood: "tense", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Four more Dredge Agents hold this floor, and each floor has its own power source and maintenance room." }] }],
        options: [
          { label: "Fight the Dredge Agents", if: { not: "f17_clear" }, steps: [{ combat: "f17", win: [{ set: "f17_clear" }] }] },
          { label: "Go down to Floor 16", if: "f17_clear", steps: [{ goto: "f16" }] }] },
      f16: { name: "Floor 16: the relay room", theme: "future", mood: "boss", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "This is where the signal comes from. The air tastes of metal, and the vents breathe out something that makes your teeth ache. Something massive lurks below, slithering and streaking, a mass of flesh with scales along its skin. It is best not to go below unless absolutely necessary." }] }],
        options: [
          { label: "Resist what the building breathes", hint: "Durability Medium 10", once: true, steps: [{ check: { aspect: "durability", cr: "medium", label: "Hold your breath and go on", who: "choose", tags: ["gas"],
            ok: [{ say: "You keep your head." }], fail: [{ say: "Something in the air gets into you, and you spend a minute not being quite yourself." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Take the relay room", if: { not: "f16_clear" }, steps: [{ combat: "f16", win: [{ set: "f16_clear" }, { set: "hotel_secured" }, { say: "The Relay Operator falls into his own wires. The relay tower on the roof, at last, goes dead. You have secured the hotel." }, { inc: "secured" }] }] },
          { label: "Out into District 55", if: "f16_clear", steps: [{ goto: "street" }] }] },
      street: { name: "District 55", theme: "future", mood: "tense", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "The streets are empty: piles of waste, vacant buildings, unattended vehicles. Something tells you the streets still have life in them, even if you cannot see it. It is about midday and the sun is starting to set behind the towering buildings. That is when all the lights come on: LEDs from every corner, adverts on every building, begging for attention. The light pollution is a boon: it will make it hard for anything to hide from you. All zones in the street count as Glow, whatever the time." }] }],
        options: [
          { label: "Make your way through the street, expecting an ambush", hint: "A cult is waiting for you", if: { not: "street_clear" }, steps: [{ check: { aspect: "agility", cr: "medium", label: "Avoid being pinned down in the first volley", who: "choose", tags: ["ambush"],
            ok: [{ say: "You break cover before the first volley, and the street's lights burst around you." }], fail: [{ say: "The first volley pins the team down for a long minute." }, { if: { flag: "no_stun" }, then: [{ say: "You expected it. You are not stunned." }], else: [{ damage: { pool: "health", amount: 3 } }] }] } },
            { combat: "street", win: [{ set: "street_clear" }, { inc: "reports" }, { set: "street_secured" }, { inc: "secured" }] }] },
          { label: "Close the Portal in the warehouse (zone 17)", hint: "Ancient, Occult or Faith Medium 10", if: "street_clear", once: true, steps: [{ check: { aspect: "occult", cr: "medium", label: "Close the Portal", who: "choose",
            ok: [{ say: "The Portal closes with a sound like a slammed door, and no more swarm come out." }, { set: "portal_closed" }], fail: [{ say: "It does not close. Something comes out, and goes for the street." }, { inc: "reports" }] } }] },
          { label: "Close the Endless loop in the warehouse (zones 15-16)", hint: "Ancient, Occult or Faith Medium 10", if: "street_clear", once: true, steps: [{ check: { aspect: "ancient", cr: "medium", label: "Break the loop", who: "choose",
            ok: [{ say: "The corridor behind you no longer folds back. You can walk through it." }], fail: [{ say: "You are back where you started, and so is everyone else." }] } }] },
          { label: "Stop the possessed vehicle in the garage (zone 7)", hint: "Awareness Medium 10", if: "street_clear", once: true, steps: [{ check: { aspect: "occult", cr: "medium", label: "Close the possession", who: "choose",
            ok: [{ say: "The engine coughs and dies. A shape in the driver's seat goes with it." }, { set: "garage_secured" }, { inc: "secured" }, { clue: "c_seline" }], fail: [{ say: "The car roars out of the garage and tries to run you down." }, { damage: { pool: "health", amount: 4 } }, { inc: "reports" }, { set: "garage_secured" }, { inc: "secured" }] } }] },
          { label: "Eat something in the convenience store", hint: "Heals 3 Health", once: true, steps: [{ say: "An action eating food here heals 3 Health. Everyone eats." }] },
          { label: "Go on to the Café du Sillage", if: "street_clear", steps: [{ goto: "cafe" }] }] },
      cafe: { name: "Café du Sillage", theme: "future", mood: "weird", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "[Written from your briefing; the module stops here.] The café has been serving coffee on this corner for two hundred and fifty years, and today the chairs are stacked, the sign is dark and the espresso machine is still warm. Someone has been using it as a staging post. A cloth on the bar is stained with something that is not coffee." }] }],
        options: [
          { label: "Search the café", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Search the back room", investigate: true,
            ok: [{ say: "A back room with a map of District 55 pinned to the wall, each zone marked in marker pen. Seline's hand. At the bottom: Clinique, 3rd floor, then a line of times." }, { set: "map_found" }, { set: "cafe_secured" }, { inc: "secured" }],
            fail: [{ say: "It is a café. You are sure it has more to tell you. You leave it, secured, but poorer in knowledge." }, { set: "cafe_secured" }, { inc: "secured" }] } }] },
          { label: "On to the Clinique Sainte-Helix", if: "cafe_secured", steps: [{ goto: "clinique" }] }] },
      clinique: { name: "Hospital Clinique Sainte-Helix", theme: "future", mood: "boss", lighting: "shadow", weather: "none", cast: ["seline"],
        onEnter: [{ once: "in", steps: [{ say: "[Written from your briefing; the module stops here.] Witch and Ogre are already at the doors, and Dragon is the last to arrive. Inside, the air is wrong: cold in a way the building cannot be, and the long corridor ahead is slightly too long. The surgical theatre is at the end, and the lights are on. Agent Seline Moreau stands in the middle of it, with the Wicked Dredge across her back, humming." }] }],
        options: [
          { label: "Try to talk her down", hint: "She was one of you. Charisma Challenging 14", if: { not: { obj: "po1" } }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Reach the agent under the Dredge", who: "choose", tags: ["ambush"],
            ok: [{ talk: { npc: "seline", text: "I didn't mean... it said it would show me where they all went. Every agent we ever lost. All I had to do was open the door." } }, { say: "She takes the rig off her back with shaking hands, and puts it in yours." }, { objective: "po1" }, { set: "seline_alive" }],
            fail: [{ say: "She shakes her head. She does not hear you any more." }, { combat: "clinique", win: [{ objective: "po1" }, { inc: "reports" }] }] } }] },
          { label: "Disable the Artifact before it opens another Rupture", hint: "Occult Medium 10", if: { not: { obj: "po1" } }, steps: [{ check: { aspect: "occult", cr: "medium", label: "Cut the Dredge's hook", who: "choose",
            ok: [{ say: "The hum drops an octave and stops. She falls to her knees as the weight comes off her." }, { objective: "po1" }, { set: "seline_alive" }],
            fail: [{ say: "The hook swings round on its own, and tears open the air." }, { combat: "clinique", win: [{ objective: "po1" }, { inc: "reports" }] }] } }] },
          { label: "Take the Artifact by force", if: { not: { obj: "po1" } }, steps: [{ combat: "clinique", win: [{ objective: "po1" }, { inc: "reports" }] }] },
          { label: "Finish the operation", if: { obj: "po1" }, steps: [{ set: "clinique_secured" }, { inc: "secured" }, { goto: "end" }] }] },
      end: { name: "Neo France, after dark", theme: "future", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { if: { lt: ["reports", 5] }, then: [{ objective: "po2" }, { say: "By morning there is no trace of an operation. The surveillance came back online at dawn with nothing to show." }], else: [{ say: "The news feeds are full of it by breakfast: gunfire in District 55, lights in the sky over the Horizon d'Acier. WCA will spend a month explaining it." }] },
          { if: { ge: ["secured", 5] }, then: [{ objective: "po3" }, { say: "All five zones are yours." }], else: [{ say: "Some zones were left unsecured. Hugo makes a note." }] },
          { if: { flag: "seline_alive" }, then: [{ say: "Seline Moreau is taken into WCA custody alive. She will tell them what the Dredge offered her, and what it showed her." }], else: [{ say: "Agent Seline Moreau does not leave the theatre. What she was working with has not left Paris." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
