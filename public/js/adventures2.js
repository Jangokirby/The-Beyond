/* ============================================================================
   MORE CASES — written in the same data format as adventures.js (see adv.js).
   Optional fields used here:
     flavor:   "jp" turns on Japanese labels while the case runs (none of these do)
     downtime: how many downtime actions each agent gets in the break AFTER this case
   ========================================================================== */
(function () {
  const A = window.ART, ADV = window.ADV;
  const F = (s, hc, h, o, x = "none", bg = "#2b2f3a") => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg });
  const N = (name, tag, look, face) => ({ name, tag, look, face });

  /* ---------------------------------------------------------------- 1349 · OID */
  ADV.register({
    id: "bread-for-the-dead", title: "Bread for the Dead", setting: "Hollebeke, Flanders · 1349", year: 1349, level: [1, 3], agencies: ["OID"],
    summary: "The plague took half of Hollebeke in a month. Now, every night, the buried come home and sit at their family tables, and every morning the living are weaker. The village keeps setting out bread. Nobody will say who told them to.",
    objectives: [
      { id: "po1", kind: "primary", t: "Learn why the dead come home", done: "Widow Aleidis bargained with the Hungering Guest to bring her children back. The whole village pays the price." },
      { id: "po2", kind: "primary", t: "Break the bargain", done: "The Hungering Guest is gone, and the dead stay in the ground." },
      { id: "so1", kind: "secondary", t: "Give the plague dead a proper rite", done: "The pit is blessed. The dead go to their rest named and prayed for." }],
    clues: {
      c_tables: { t: "The dead keep their places", s: "The village", x: "At the evening bell the dead walk in from the plague pit and sit at their old places. They don't eat. The living who sit with them wake up grey and weak." },
      c_bread: { t: "Bread left uneaten, then gone", s: "Father Wouter", x: "The village leaves a loaf at each place for the dead. By morning the loaves are hollow: the crust intact, the inside gone." },
      c_mill: { t: "It started at the mill", s: "Grietje", x: "The first of the dead came home to the mill: the widow Aleidis's two boys. Only after that did the others follow." },
      c_guest: { t: "A Guest who must be fed", s: "The mill loft", x: "Chalk on the mill's grain floor: a table set for one more than the family. The old Flemish rhyme says the Hungering Guest will bring back the dead if you feed it at your own table. It never says it stops being hungry." },
      c_rite: { t: "No priest blessed the pit", s: "The churchyard", x: "The dead went into the pit in a hurry, by night, without rites. Father Wouter was sick with the fever then. Nobody ever prayed over them." }
    },
    npcs: {
      wouter: N("Father Wouter", "Parish priest · recovering", "Thin as a rake, fever-scarred. He keeps lists of the dead in a ledger he won't put down.", F(0, 4, "bald", 5)),
      aleidis: N("Aleidis", "The miller's widow", "Floury hands, a calm face, eyes that keep sliding to the stairs. She sets four places at her table, and her family is two.", F(1, 2, "bun", 3)),
      grietje: N("Grietje", "Goose girl · 11", "Mud to the knees, a goose under one arm. She has decided you are probably not the plague, and that's enough for her.", F(2, 1, "long", 2)),
      boys: N("Jan and Pieter", "The widow's sons · returned", "Two small boys at the end of the table, perfectly still, soil in their hair. They watch the bread.", F(1, 2, "short", 0))
    },
    enemies: {
      guest: { build: { name: "The Hungering Guest", type: "Folklore", difficulty: "challenging", sprite: "beyond", hue: 30, dtype: "health", core: { body: 2, mind: 1, spirit: 3 }, mods: ["Soul Feed", "Tanky"], dies: "folds up like an empty sack and is gone" } },
      returned: { build: { name: "Returned dead", type: "Undead", difficulty: "easy", sprite: "undead", hue: 90, attack: 1, hitSfx: "blade_hit", dies: "lies down, finally still" } }
    },
    encounters: {
      loft: { name: "The mill loft", theme: "interior", fightText: "The sails turn with no wind. The Guest sits at the head of the table, and it is very tall sitting down.", zones: [
        { id: "a", name: "The ladder", col: 0, row: 0 }, { id: "b", name: "Grain floor", col: 1, row: 0 }, { id: "c", name: "The long table", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "guest", zone: "c" }, { t: "returned", zone: "b", name: "Jan" }, { t: "returned", zone: "b", name: "Pieter" }] }
    },
    start: "road",
    scenes: {
      road: { name: "The road into Hollebeke", theme: "village", mood: "dread", weather: "rain", onEnter: [{ once: "arrive", steps: [
        { say: "Flanders, the plague summer of 1349. The road from Ypres is empty of everything but crows. Half the farms you passed had a white cross daubed on the door, and the other half had no one left to daub it." },
        { say: "A plague cart stands abandoned at the crossroads, its horse long gone, its load covered with straw and lime. Beyond it lies Hollebeke: thatch, chimney smoke, and a square church tower. The Order's letter came from the parish priest. It said only: <i>Our dead will not stay where we put them.</i>" }] }],
        options: [
          { label: "Walk into the village", steps: [{ goto: "square" }] },
          { label: "Search the plague cart", once: true, steps: [{ check: { aspect: "awareness", cr: "easy", label: "Search the cart", ok: [{ say: "Under the straw: a heel of bread, hollowed out, crust whole. Something ate the inside and left the shell, neat as a snail." }, { clue: "c_bread" }], fail: [{ say: "Straw, lime, and the smell. Nothing useful." }, { damage: { pool: "sanity", amount: 1 } }] } }] }] },
      square: { name: "Hollebeke square", theme: "village", mood: "dread", weather: "rain", cast: ["grietje"],
        onEnter: [{ once: "sq", steps: [
          { say: "You reach the square as the evening bell rings for Vespers. All along the street, doors open. Inside every house you can see a table laid for supper, bread cut, ale poured, and the families standing back from it against the walls, very quiet, the way people stand when a lord comes in." },
          { say: "And from the direction of the churchyard, without hurry, the dead walk home. A weaver in his burial shroud. A girl with lime on her hair. An old man leaning on nothing. They walk into the open doors, and sit down at the tables, and the families serve them, and nobody screams." },
          { say: "From the well, a small voice: \"Don't stare. They don't like it when you stare at their food.\"" }, { clue: "c_tables" }] }],
        options: [
          { label: "Talk to the goose girl", hint: "Eleven, and fearless", steps: [{ converse: { npc: "grietje", id: "main",
            open: [{ say: "A girl of eleven sits on the well's edge with a grey goose under one arm, mud to the knees, eating an apple. She looks at you as if you're the strangest thing she's seen all week, which is saying something." }, "You're not from the bishop. The bishop wouldn't come here. Are you from God?"],
            topics: [
              { ask: "When did the dead start coming home?", lines: ["After the second burying, at Saint John's. Father Wouter was sick with the fever and couldn't say the words, so they just put everybody in the pit with lime and went home.", "That night the mill boys came first. Jan and Pieter, the widow's sons. They walked right in and sat down at supper, and their mam just cut the bread like nothing was wrong. Then everyone's came back."], then: [{ clue: "c_mill" }] },
              { ask: "Did yours come back?", lines: [{ say: "She strokes the goose's neck and doesn't look at you." }, "My da. No. He didn't.", "I'm glad. He wasn't nice when he was alive. I don't want him at the table being not-nice and dead."] },
              { ask: "What do the dead do?", lines: ["They sit. They look at the bread. They don't eat it, not with their mouths. But in the morning the bread's hollow. Just the crust left, like a shell.", "And every week there's more of them, and less food, and people are getting thin, and nobody says anything because it's their mams and their husbands."] },
              { ask: "Who's not afraid of them?", lines: ["The widow at the mill. She's happy. She's the only happy person in Hollebeke.", "She sets four places at supper. There's only three of them, with the boys. I've counted. I count everything."] }],
            bye: ["If you're from God, tell Him to hurry up. We're running out of bread."] } }] },
          { label: "Sit at a table with the dead", once: true, steps: [{ check: { aspect: "willpower", cr: "medium", label: "Hold a dead man's gaze", ok: [{ say: "You sit across from a dead weaver. His eyes are on the bread, not on you. When you move it toward him, the corner of his mouth moves too. It is hunger, but it isn't his." }, { set: "saw_hunger" }], fail: [{ say: "You get up too fast and knock the bench over. The dead don't look at you. That's worse." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Go to the church", steps: [{ goto: "church" }] },
          { label: "Go to the mill", steps: [{ goto: "mill" }] }] },
      church: { name: "Saint Medard's church", theme: "church", mood: "calm", cast: ["wouter"], lighting: "shadow",
        onEnter: [{ once: "ch", steps: [
          { say: "Saint Medard's is cold and smells of damp straw and tallow. The candles on the altar have been left to burn down to puddles. There's no one at prayer." },
          { say: "One man sits in a chair by the altar rail, wrapped in blankets, a ledger open in his lap: Father Wouter, thin as a rake, the fever-marks still dark on his neck. He's reading the same page over and over, moving his lips." }] }],
        options: [
          { label: "Question Father Wouter", hint: "The priest who wrote to the Order", steps: [{ converse: { npc: "wouter", id: "main",
            open: ["The Order came. I prayed you would and I was afraid you would. Both, God forgive me."],
            topics: [
              { ask: "What's in the ledger?", lines: [{ say: "He turns it toward you. Columns of names in a careful clerk's hand, each with a date." }, "Forty-one names. Every soul we buried this summer. I keep it so I won't forget them.", "Every one of them sits at supper in Hollebeke tonight."] },
              { ask: "Why didn't they stay buried?", lines: ["Because I never buried them. Not truly. I was in the fever when they went into the pit; I couldn't stand, let alone say the Office.", "They went into the earth with lime and no words. No rite. Nobody told them they were dead and that they could rest. Perhaps that is my fault.", { say: "His voice cracks." }, "If someone read the names over the pit, with the proper words, perhaps they would know to stay."], then: [{ clue: "c_rite" }] },
              { ask: "Where did it begin?", lines: ["At the mill. The widow Aleidis lost her husband in June and both her boys in July. She came to me after and asked if there was any way to have them home.", "I told her to pray. I think she found someone else to pray to. Ask her why she sets four places."], then: [{ clue: "c_mill" }] },
              { ask: "Will you help us?", lines: ["I can barely stand. But give me your arm, and I'll come to the pit, and I'll read every name if it kills me. It may."] }],
            bye: ["Go with God. And be careful at the mill. The widow is the kindest woman in Hollebeke, and that's what frightens me."] } }] },
          { label: "Go to the churchyard", steps: [{ goto: "pit" }] },
          { label: "Back to the square", steps: [{ goto: "square" }] }] },
      pit: { name: "The plague pit", theme: "forest", mood: "dread", weather: "rain", lighting: "shadow",
        onEnter: [{ say: "Behind the churchyard wall the earth has been turned over in a long, ugly scar. It is turned over again every night, from below." }],
        options: [
          { label: "Bless the pit with Father Wouter's ledger", if: { clue: "c_rite" }, once: true, steps: [
            { say: "You read the forty-one names aloud in the rain, one by one. The others answer the responses." },
            { group: { aspect: "faith", cr: "medium", label: "The rite for the dead", intro: "Everyone keeps the rite going. A voice that falters breaks it.", ok: [{ say: "On the last name the rain softens. The scar in the earth looks, for the first time, like a grave." }, { objective: "so1" }, { set: "pit_blessed" }], fail: [{ say: "Someone stumbles on a name. The earth shifts under your feet, impatient." }, { damage: { pool: "stability", amount: 2 } }] } }] },
          { label: "Look for tracks", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Read the turned earth", investigate: true, ok: [{ say: "Most tracks go to the village and back. Two small sets go only one way, toward the mill, and never come back to the pit at all." }, { clue: "c_mill" }], fail: [{ say: "Mud, rain and footprints over footprints." }] } }] },
          { label: "Back to the church", steps: [{ goto: "church" }] }] },
      mill: { name: "The widow's mill", theme: "interior", mood: "weird", cast: ["aleidis", "boys"], lighting: "shadow",
        onEnter: [{ once: "mill", steps: [
          { say: "The mill wheel turns in the stream with a sound like slow breathing. Inside it's warm and floury and far too tidy: floor swept, pots scoured, flowers in a jug on the table." },
          { say: "The table is set for four. Two small boys sit at it, perfectly still, soil in their hair, hands folded. The widow Aleidis stands behind them with a bread knife, calm and pleasant, and smiles at you as if you're neighbours dropping by." },
          { say: "The fourth place is at the head of the table. It has the best bread on it, the white loaf, and the best cup. Nobody sits there. Every few seconds the widow's eyes go to the loft ladder, and back." }] }],
        options: [
          { label: "Ask Aleidis about the empty place", steps: [
            { talk: { npc: "aleidis", text: "That place? That's for my husband. He'll be home soon. He's always home for supper." } },
            { say: "She cuts a slice of bread for each of the boys and sets it in front of them. They don't move. She smooths Pieter's hair, and soil falls out of it onto the cloth." },
            { read: { cr: "medium", lying: true, liar: "She's lying, and she knows you know. Her eyes go to the loft ladder and back.", ok: [{ set: "aleidis_caught" }] } }] },
          { label: "Tell her what it costs the village", if: "aleidis_caught", once: true, steps: [
            { say: "You tell her about the hollow loaves, the thin children, the forty-one at forty-one tables. She listens with the knife in her hand. Then she puts it down very carefully, and sits, for the first time, at her own table." },
            { talk: { npc: "aleidis", text: "My mother taught me a rhyme. For the hungry times. You set a place for the Guest, the one who comes when the dead are hungry, and you say the words, and it brings them home to eat with you." } },
            { talk: { npc: "aleidis", text: "I said the rhyme. I fed the Guest at my own table, and it gave me my boys. Look at them. Look how good they are." } },
            { talk: { npc: "aleidis", text: "I didn't know it would want more. It always wants one more place set. One more village. It's up there in the loft now, waiting for its supper. It's been waiting all day." } },
            { clue: "c_guest" }, { objective: "po1" }] },
          { label: "Climb to the loft", steps: [{ goto: "loft" }] },
          { label: "Back to the square", steps: [{ goto: "square" }] }] },
      loft: { name: "The mill loft", theme: "interior", mood: "boss", lighting: "shadow",
        onEnter: [{ say: "Up the ladder, the grain floor is chalked with a table plan: one long table, one more place than there are people. At the head of it sits something wearing a miller's coat. It is waiting to be served." }, { clue: "c_guest" }],
        options: [
          { label: "Refuse it bread and name it out loud", if: { clue: "c_guest" }, once: true, steps: [
            { check: { aspect: "willpower", cr: "challenging", label: "Deny the Hungering Guest", ok: [{ say: "'You are not invited.' The words land like a slammed door. The Guest flinches, and for a heartbeat it is smaller." }, { set: "guest_denied" }], fail: [{ say: "Your voice dries up. The Guest smiles and pulls out a chair for you." }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Fight the Guest", steps: [{ combat: "loft", surpriseIf: "guest_denied", win: [
            { say: "The sails stop. Below, Aleidis screams once and then just cries. Jan and Pieter are lying side by side on the grain floor, small and still and finally asleep." }, { objective: "po2" },
            { if: "pit_blessed", then: [{ say: "At dawn the village wakes to empty chairs and full loaves. The pit stays closed. Father Wouter closes his ledger." }], else: [{ say: "At dawn the dead are back in the pit. It will take a priest and a long rite to keep them there, but the hunger is gone." }] },
            { end: "win" }] }] },
          { label: "Back down the ladder", steps: [{ goto: "mill" }] }] }
    }
  });

  /* ---------------------------------------------------------------- 1935 · NSBD */
  ADV.register({
    id: "black-roller", title: "The Black Roller", setting: "Cimarron County, Oklahoma · 1935", year: 1935, level: [2, 4], agencies: ["NSBD"], downtime: 2,
    summary: "Every Sunday at four the same black dust storm rolls over the Pruitt farm. When it passes, someone in the county is gone, and something wearing their face comes walking out of the dust, saying their prayers a little wrong.",
    intro: "The NSBD is stretched thin: you're the only team within five hundred miles. And the storm comes again on Sunday, so the break after this one will be short.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find what is making the storm", done: "A dowser drilled the Pruitts' new well into something that breathes. The storm is its breath." },
      { id: "po2", kind: "primary", t: "Seal the well", done: "The well is capped and buried. Sunday comes and the sky stays clear." },
      { id: "so1", kind: "secondary", t: "Bring Ruth Pruitt back out of the dust", done: "Ruth walks out of the storm herself, coughing and furious and alive." }],
    clues: {
      c_sunday: { t: "Sunday at four", s: "Hollis at the filling station", x: "The storm comes every Sunday at four o'clock sharp, out of a clear sky, and it only ever starts over the Pruitt place." },
      c_double: { t: "The copies are made of dust", s: "Tom Pruitt", x: "The thing that came home as Ruth leaves fine black dust on everything it touches. It doesn't sleep. When it says grace, it says it backwards." },
      c_well: { t: "The new well", s: "The Pruitt farm", x: "The old well went dry in '33. In the spring a travelling dowser drilled a new one, three hundred feet, out past the barn. The storms started the next Sunday." },
      c_breath: { t: "The well breathes out", s: "The well", x: "Cold air flows out of the well and rises in a column you can see if you look sideways. At the bottom, far down, something exhales." },
      c_ruth: { t: "Ruth is still in there", s: "Pastor Jessup's cellar", x: "The people who vanish are not dead. Those caught in a storm cellar during one heard them calling from inside the dust, still trying to find their way home." }
    },
    npcs: {
      hollis: N("Hollis Bray", "Filling station · owner", "Bandana around his neck, goggles on his hat, and a shotgun he wants you to see.", F(2, 1, "short", 6, "hat")),
      tom: N("Tom Pruitt", "Farmer · widowed, he thinks", "Sun-black, gaunt, polite. He hasn't let the thing that looks like his wife into the house in a week.", F(1, 2, "short", 3, "beard")),
      ruth: N("'Ruth'", "Something wearing Ruth Pruitt", "A woman in a feed-sack dress standing at the fence, smiling. Dust falls from her hair when she tilts her head.", F(1, 3, "bun", 7)),
      jessup: N("Pastor Jessup", "Baptist preacher · storm cellar", "Bible in one hand, kerosene lamp in the other. He has moved his whole congregation underground.", F(4, 4, "short", 5, "glasses"))
    },
    enemies: {
      roller: { build: { name: "The Black Roller", type: "Beyond", difficulty: "challenging", sprite: "swarm", hue: 25, dtype: "health", range: 1, core: { body: 3, mind: 1, spirit: 2 }, mods: ["Aura of Damage", "Elusive"], dies: "collapses into ordinary dirt and blows away east" } },
      double: { build: { name: "Dust double", type: "Construct", difficulty: "easy", sprite: "humanoid", hue: 30, attack: 1, hitSfx: "health_hit", mods: ["Mimic"], dies: "comes apart in a puff of black dust" } }
    },
    encounters: {
      storm: { name: "Inside the Black Roller", theme: "desert", fightText: "Day goes to midnight. The wind is a wall. Shapes walk in it with your faces.", zones: [
        { id: "a", name: "The barn", col: 0, row: 0 }, { id: "b", name: "Open field", col: 1, row: 0 }, { id: "c", name: "The wellhead", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "roller", zone: "c" }, { t: "double", zone: "b", name: "'Ruth'" }, { t: "double", zone: "b", name: "'Hollis'" }] }
    },
    start: "station",
    scenes: {
      station: { name: "Bray's filling station", theme: "desert", mood: "calm", cast: ["hollis"], onEnter: [{ once: "arrive", steps: [
        { say: "Boise City, Oklahoma, 1935. The Dust Bowl. Fences buried to the top wire in drifts of fine red-brown dirt, a sky the colour of an old bruise, and the wind never quite stopping. Everything you touch is gritty. Your teeth are gritty." },
        { say: "Bray's filling station stands alone on the county road, one pump, a Coca-Cola sign, and wet bedsheets hung over every window to keep the dust out. Hollis Bray watches you pull in through a gap in the sheets with a shotgun across his knees, and doesn't get up until he's sure of your faces." }] }],
        options: [
          { label: "Talk to Hollis Bray", hint: "Filling station owner", steps: [{ converse: { npc: "hollis", id: "main",
            open: ["You're the government people. Don't look like government. Look like folks who've seen a thing or two. Coffee's got dust in it. Everything's got dust in it."],
            topics: [
              { ask: "Tell me about the storms", lines: ["We get dusters all spring. Everybody does. But this one's different. Sunday, four o'clock, regular as church.", "Starts right over the Pruitt place, out of a sky you could paint blue. Black as the inside of a cow. Rolls a mile wide and moves like it knows where it's going."], then: [{ clue: "c_sunday" }] },
              { ask: "What happened to your brother?", lines: [{ say: "He takes his hat off and turns it in his hands." }, "Earl went out to bring the cows in two Sundays back. Storm come over. We found the cows in the morning, smothered, every one.", "Earl came home Monday. Walked in the door and sat down and asked for supper. Talked just like Earl. Smiled just like Earl.", "That wasn't Earl. Earl never smiled at me in his life."] },
              { ask: "Where's the thing that came back?", lines: ["Gone back into it. Next Sunday, when the storm came, it walked out into the field to meet it, smiling. Left a little pile of dust on the porch where it'd been standing.", "Ruth Pruitt's the same. Tom's got her stood at his fence right now. He won't let her in. Good for Tom."] },
              { ask: "Who else might know something?", lines: ["Pastor Jessup's moved his whole flock into the storm cellar under the church. Says he's heard voices in the dust.", "And Tom Pruitt dug a new well this spring. Deeper than anybody ever dug in this county. Storms started the week after."] }],
            bye: ["Today's Sunday. You've got till four. I'd be indoors by then, if I were you."] } }] },
          { label: "Drive out to the Pruitt farm", steps: [{ goto: "farm" }] },
          { label: "Go to the Baptist church", steps: [{ goto: "cellar" }] }] },
      farm: { name: "The Pruitt farm", theme: "desert", mood: "dread", cast: ["tom", "ruth"],
        onEnter: [{ once: "farm", steps: [
          { say: "The Pruitt place is half buried: dust drifted up to the windowsills on the west side, the barn roof sagging under its weight, a tractor nose-down in a dune like a drowned animal." },
          { say: "Out by the fence a woman stands in a feed-sack dress, perfectly still, smiling at the house. The wind blows dust through her hair and she doesn't blink. Every so often a little trickle of dust runs out of her sleeve." },
          { say: "Tom Pruitt sits on his porch with a rifle across his knees, watching her. He hasn't slept, by the look of him, since she came back." }] }],
        options: [
          { label: "Talk to Tom Pruitt", hint: "Widowed, he thinks", steps: [{ converse: { npc: "tom", id: "main",
            open: [{ say: "He doesn't take his eyes off the woman at the fence." }, "You come about Ruth. That's not Ruth. I want that said first."],
            topics: [
              { ask: "How do you know it isn't her?", lines: ["Ruth hums when she's nervous. Hymns, mostly. Hummed all through our wedding. That thing doesn't hum.", "It leaves dust on the doorknob, fine as flour, every time it tries the door. And when I let it in the first night, it said grace backwards. Every word, backwards, smiling."], then: [{ clue: "c_double" }] },
              { ask: "When did she go?", lines: ["Three Sundays back. Storm come over at four, and she was out at the new well, drawing water. I yelled for her to come in. She looked up at the sky like it was calling her name.", "Then it was dark as midnight, and when it cleared there was a little pile of dust by the well, and her bucket, and nothing else."], then: [{ clue: "c_well" }] },
              { ask: "Tell me about the new well", lines: ["Dug it in March. Two hundred and forty feet, deeper than anybody ever dug around here. We were desperate. Hit water at two-forty, and something else.", { say: "His knuckles go white on the rifle." }, "Cold air came up out of it. Still does. You can stand by the casing in August and see your breath. And the storms started the week after."] },
              { ask: "Why not shoot it?", lines: ["Because it's got her face.", { say: "He says it very quietly." }, "I've had it in my sights forty times. It looks at me with her face, and I can't."] }],
            bye: ["If you go out to the well, go before four. Please. I don't want another one of you at my fence."] } }] },
          { label: "Speak to 'Ruth' at the fence", once: true, steps: [
            { talk: { npc: "ruth", text: "Tom won't let me in. Won't you tell him, mister? I just want to come home. It's so dry out here." } },
            { read: { cr: "medium", lying: true, liar: "Every word is wrong somehow, like a song you know sung in the wrong key. It isn't her. It's a very good guess at her.", fail: [{ damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Walk out to the new well", steps: [{ goto: "well" }] },
          { label: "Back to the filling station", steps: [{ goto: "station" }] }] },
      cellar: { name: "The church storm cellar", theme: "cellar", mood: "tense", cast: ["jessup"], lighting: "shadow",
        onEnter: [{ once: "cel", steps: [
          { say: "Under the Baptist church on Main Street, a storm cellar dug for tornadoes now holds forty people: cots in rows, crates of canned peaches, a washtub of drinking water with a cloth over it, children reading by kerosene lamp. Somebody has pinned a hymn sheet to the earth wall." },
          { say: "Pastor Jessup meets you at the bottom of the steps with a Bible in one hand and a lamp in the other. A big man gone thin, with a voice made for revival tents and eyes that haven't slept." }] }],
        options: [
          { label: "Talk to Pastor Jessup", hint: "He's moved his flock underground", steps: [{ converse: { npc: "jessup", id: "main",
            topics: [
              { ask: "Why move everyone underground?", lines: ["Because the storm takes them that are out in it, and gives back something wearing their skin. I won't lose another soul from this flock to that.", "We come up for water and to bury the stock. Otherwise we stay below, and we sing, loud, so the children don't hear it pass."] },
              { ask: "What do you hear when it passes?", lines: [{ say: "He sits down heavily on a crate." }, "Voices. When it rolls over the church, you can hear them through the boards, plain as I hear you. Earl Bray. The Henley girl. Ruth Pruitt.", "Calling for each other. Lost in it. Like folks in a blizzard who can't find the barn rope.", "They aren't in heaven, friend. They're in the storm. They're lost, and it keeps them."], then: [{ clue: "c_ruth" }] },
              { ask: "Do you think they can be saved?", lines: ["I've preached forty years that nothing is beyond saving. I'd like to go on believing it.", "If you can find where that storm comes from and stop it up, I believe they'll come down. Like rain."] }],
            bye: ["God be with you out there. Be back underground by four, whatever you do."] } }] },
          { label: "Steady the frightened congregation", once: true, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Give them some hope", ok: [{ say: "You tell them it can be fought. A few look at you like you're mad. More look at you like they want to believe it." }, { heal: { pool: "sanity", amount: 3 } }], fail: [{ say: "Nobody believes you. You aren't sure you do." }] } }] },
          { label: "Back to the filling station", steps: [{ goto: "station" }] }] },
      well: { name: "The new well", theme: "desert", mood: "weird",
        onEnter: [{ once: "wl", steps: [
          { say: "Out past the barn, the new well: a steel casing a foot across, a windmill above it with its vanes still in the hot wind, and Ruth's bucket on its side in the dust where she left it." },
          { say: "A column of cold air stands up out of the ground. You can feel it on your face from ten yards off, like opening an icebox. Down the casing, very far below, you hear the wind, and in the wind, faintly, someone humming a hymn." }] }],
        options: [
          { label: "Lower a lantern and listen", once: true, steps: [{ check: { aspect: "awareness", cr: "challenging", label: "Listen down the well", investigate: true, ok: [{ say: "Three hundred feet down, past the water table, past the rock, something slow and huge breathes out. Each breath lifts the dust a little higher." }, { clue: "c_breath" }, { objective: "po1" }], fail: [{ say: "The lantern goes out halfway down. Something below breathes in, and your lungs go with it. You come to on your knees by the casing, coughing black dust, sure now of what lives down there." }, { damage: { pool: "health", amount: 5 } }, { clue: "c_breath" }, { objective: "po1" }] } }] },
          { label: "Cap the well before Sunday", if: { clue: "c_breath" }, once: true, steps: [
            { say: "You haul cement and scrap iron from the barn. Tom Pruitt works beside you without a word. It's Sunday when you finish. It is five minutes to four." },
            { group: { aspect: "strength", cr: "medium", label: "Seal the casing as the wind rises", intro: "Everyone hauls, braces and pours while the sky turns black.", ok: [{ say: "The cap goes on. The column of air is cut in half and the dust stumbles." }, { set: "well_capped" }], fail: [{ say: "The cap slips. The wind takes the cement right out of the bucket." }, { damage: { pool: "health", amount: 3 } }] } },
            { goto: "storm" }] },
          { label: "Wait for Sunday at the barn", steps: [{ goto: "storm" }] },
          { label: "Back to the farmhouse", steps: [{ goto: "farm" }] }] },
      storm: { name: "The Black Roller", theme: "desert", mood: "boss",
        onEnter: [{ say: "Four o'clock. A wall of black dust a thousand feet high rolls over the field, and day goes to midnight. Shapes walk in it. One of them is wearing Hollis Bray's goggles." }, { sfx: "shift_walls" }],
        options: [
          { label: "Call Ruth's name into the storm", if: { clue: "c_ruth" }, once: true, steps: [
            { check: { aspect: "charisma", cr: "challenging", label: "Guide the lost home", ok: [{ say: "You shout until your throat bleeds. Somewhere in the dark a woman starts humming, nervous and off-key. Tom Pruitt is running toward it before you can stop him." }, { set: "ruth_called" }], fail: [{ say: "The wind takes your voice and gives it back to you from the wrong direction." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Fight your way to the wellhead", steps: [{ combat: "storm", surpriseIf: "well_capped", win: [
            { say: "The roller tears itself apart on the capped well, and what's left is just Oklahoma dirt, falling." }, { objective: "po2" },
            { if: "ruth_called", then: [{ say: "Ruth Pruitt walks out of the last of the dust, coughing, hands on her hips, demanding to know why the supper isn't on." }, { objective: "so1" }], else: [{ say: "When the air clears, the field is empty. Pastor Jessup says the voices have stopped. He doesn't say whether that's a mercy." }] },
            { end: "win" }] }] }] }
    }
  });

  /* ---------------------------------------------------------------- 2016 · WCA */
  ADV.register({
    id: "vacancy", title: "Vacancy", setting: "Edinburgh, Old Town · 2016", year: 2016, level: [2, 5], agencies: ["WCA", "NSBD", "OID"],
    summary: "Flat 4, 9 Candlemaker Row. Five stars, two hundred reviews, always available. There is no Flat 4 at 9 Candlemaker Row, and nobody who has stayed there has been seen since. The reviews keep coming in.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out who runs the listing", done: "Nobody runs it. The flat lists itself. Mr. Calder downstairs just collects the keys." },
      { id: "po2", kind: "primary", t: "Close Flat 4 for good", done: "The door on the fourth landing is plaster again. The listing says: no longer available." },
      { id: "so1", kind: "secondary", t: "Get Priya Nair out alive", done: "Priya checks out with her suitcase and a one-star review she intends to write in person." }],
    clues: {
      c_reviews: { t: "The reviews change", s: "The listing", x: "The early reviews say lovely flat, great location. Later ones from the same guests, months on, say 'still here, lovely, can't find the door' and then just 'please'." },
      c_floors: { t: "Three floors, four landings", s: "The stairwell", x: "Number 9 has three floors. Going up at night, you count four landings. The fourth has one door, freshly painted, with a brass 4." },
      c_calder: { t: "Calder takes the keys back", s: "Mr. Calder", x: "The man in Flat 1 has a drawer full of identical keys on cheap fobs, one for every guest. He says he 'just tidies up' after the guests check out." },
      c_hour: { t: "Check-in is 3:33", s: "The booking emails", x: "Every confirmation email gives the same check-in time, 3:33 a.m., however the guest booked." },
      c_priya: { t: "Priya is still answering", s: "The messages", x: "Priya Nair checked in nine days ago. She's still replying to the host's messages. Her last one: 'there are more rooms every night. the others are in the far ones.'" }
    },
    npcs: {
      calder: N("Mr. Calder", "Flat 1 · 'caretaker'", "Cardigan, slippers, a smile like a hotel lobby. He's happy to help with anything at all, except questions.", F(0, 4, "short", 6, "glasses")),
      morag: N("Morag Lindsay", "WCA handler", "Rain jacket, two phones, and the tired calm of someone who has done this for twenty years.", F(1, 6, "bun", 0)),
      priya: N("Priya Nair", "Guest · day nine", "Hoodie, a dead phone, a suitcase she won't let go of. She's been walking a corridor that's longer every time.", F(3, 0, "long", 2))
    },
    enemies: {
      host: { build: { name: "The Host", type: "Spirit", difficulty: "challenging", sprite: "spirit", hue: 260, dtype: "sanity", range: 1, core: { body: 0, mind: 3, spirit: 2 }, mods: ["Psychological Attacks", "Elusive"], dies: "folds away into a five-star rating and is gone" } },
      guest: { build: { name: "Long-stay guest", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 200, attack: 0, hitSfx: "health_hit", dies: "sits down on the carpet and starts to cry, themselves again" } }
    },
    encounters: {
      corridor: { name: "The far rooms", theme: "modern", fightText: "The hallway keeps going. So does the smile.", zones: [
        { id: "a", name: "The front door", col: 0, row: 0 }, { id: "b", name: "The corridor", col: 1, row: 0 }, { id: "c", name: "The room at the end", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "host", zone: "c" }, { t: "guest", zone: "b", name: "Guest from March" }, { t: "guest", zone: "b", name: "Guest from June" }] }
    },
    start: "briefing",
    scenes: {
      briefing: { name: "A car on Candlemaker Row", theme: "modern", mood: "calm", weather: "rain", cast: ["morag"], onEnter: [{ once: "brief", steps: [
        { say: "Edinburgh, November 2016. Rain on the windscreen of a hire car parked on Candlemaker Row, the Old Town climbing away above you in black stone, the railings of Greyfriars kirkyard dripping on your left. Somewhere a piper is busking for nobody." },
        { say: "In the driver's seat, Morag Lindsay of the WCA: rain jacket, two phones, and the tired calm of someone who has done this for twenty years. She hands you one of the phones. On it, a holiday listing: a sunny Old Town flat with fairy lights, a welcome basket, and two hundred five-star reviews." }] }],
        options: [
          { label: "Talk to Morag", hint: "Your WCA handler", steps: [{ converse: { npc: "morag", id: "main",
            open: ["Right. Here's what we've got, which isn't much, and none of it makes sense, which is why it's ours."],
            topics: [
              { ask: "Who's gone missing?", lines: ["Eleven people since April. All tourists, all booked through this listing. Flat 4, 9 Candlemaker Row. A Canadian couple, two students from Lyon, a retired dentist from Leeds, a hen party of four.", "Police went in after the third. Number 9 has three floors and three flats. There is no Flat 4. They knocked on every door and the man in Flat 1 made them tea."] },
              { ask: "Why hasn't the listing been shut down?", lines: ["It has. Six times. The platform deletes it and it comes back next morning, same photos, reviews intact. Even the new ones.", { say: "She scrolls with her thumb." }, "There's one from yesterday. The Leeds dentist. Missing since August. <i>Still lovely. Still here. Can't find the door.</i>"] },
              { ask: "Is anyone still alive?", lines: ["Maybe. Priya Nair, twenty-three, backpacker from Leicester. Checked in nine days ago. She's still answering the host's messages.", "Her last one, this morning: <i>there are more rooms every night. the others are in the far ones.</i>"], then: [{ clue: "c_priya" }] },
              { ask: "Anything odd about the bookings?", lines: ["Everything. But here's the thing I can't stop looking at.", { say: "She holds up a printout of a booking confirmation." }, "Every confirmation email gives the same check-in time. Book for a Tuesday afternoon, book for a Saturday night, doesn't matter. Check-in is 3:33 a.m."], then: [{ clue: "c_hour" }] }],
            bye: ["Go in, have a look, come back and tell me I'm wrong. I'd love to be wrong."] } }] },
          { label: "Read through the reviews", once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "Read two hundred reviews", investigate: true, ok: [{ say: "Sort them by guest instead of date and the pattern jumps out: everybody writes twice. Once to say it's lovely, and once, much later, to say they're still there." }, { clue: "c_reviews" }, { clue: "c_hour" }], fail: [{ say: "Lovely flat. Great location. Lovely flat. The words start to swim." }, { damage: { pool: "sanity", amount: 1 } }] } }] },
          { label: "Go into number 9", steps: [{ goto: "stairwell" }] }] },
      stairwell: { name: "9 Candlemaker Row", theme: "interior", mood: "tense", weather: "building", lighting: "shadow",
        onEnter: [{ once: "sw", steps: [
          { say: "The street door of number 9 is open, as Old Town stair doors always are. Inside: a worn stone turnpike stair spiralling up, a timer light that clicks off too soon, three doors on three landings, and the smell of other people's dinners." },
          { say: "There's a bike chained to the banister and a pile of junk mail on the bottom step. You pick some up. Half of it is addressed to Flat 4." }] }],
        options: [
          { label: "Knock at Flat 1", steps: [{ goto: "calder" }] },
          { label: "Climb the stair at 3:33 a.m.", if: { clue: "c_hour" }, steps: [
            { say: "Your phone says 3:33. You start climbing. First landing. Second. Third. The stair keeps turning." },
            { group: { aspect: "willpower", cr: "medium", label: "Keep counting the landings", intro: "Everyone counts out loud. Lose count and you lose each other.", ok: [{ say: "Four. A landing that isn't there in daylight, a fresh coat of paint, and a brass number 4 on a door." }, { clue: "c_floors" }, { goto: "flat4" }], fail: [{ say: "Someone says 'five' when it should be 'four'. When you look back down, the street door is very far away." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Climb the stair now", once: true, steps: [{ say: "Three floors, three landings, a skylight full of rain. Nothing odd at all, which somehow makes your skin crawl." }] },
          { label: "Back to the car", steps: [{ goto: "briefing" }] }] },
      calder: { name: "Flat 1", theme: "interior", mood: "weird", cast: ["calder"],
        onEnter: [{ once: "cal", steps: [
          { say: "Mr. Calder opens the door of Flat 1 before you knock. Cardigan, slippers, reading glasses on a chain, and a smile like a hotel lobby: warm, bright, and with nobody behind the desk." },
          { talk: { npc: "calder", text: "You'll be here about the flat upstairs. Everyone is. Come in, come in. Tea? I've always got the kettle on. You never know who'll be arriving." } },
          { say: "His hall is lined with hooks, and on the hooks hang coats. Far too many coats, for one old man. A child's anorak. A pink feather boa. A dentist's tunic." }] }],
        options: [
          { label: "Ask who owns Flat 4", steps: [
            { talk: { npc: "calder", text: "Oh, I just look after things. Keys, linens, the welcome baskets. The owner's very hands-off. Very generous." } },
            { talk: { npc: "calder", text: "I've never actually met them, now you mention it. Isn't that funny? Thirty years. It leaves notes. Lovely handwriting." } },
            { read: { cr: "challenging", lying: false, ok: [{ say: "Everything he's said is true, and that's what frightens him. He's never met them either." }, { set: "calder_honest" }] } }] },
          { label: "Look in his hall drawer", once: true, steps: [{ check: { aspect: "agility", cr: "medium", label: "Open the drawer while he makes tea", ok: [{ say: "Forty identical keys on cheap plastic fobs, every one marked 4. Some are still warm." }, { clue: "c_calder" }, { if: "calder_honest", then: [{ objective: "po1" }] }], fail: [{ say: "The drawer squeaks. Mr. Calder smiles at you from the kitchen doorway and says nothing at all." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Tell him the truth about the guests", if: "calder_honest", once: true, steps: [
            { talk: { npc: "calder", text: "They check out. That's what it tells me. I bring the keys down and it says they've checked out. I'm so sorry. Here: take a key. It'll let you in. It always lets people in." } },
            { objective: "po1" }, { set: "have_key" }] },
          { label: "Back to the stairwell", steps: [{ goto: "stairwell" }] }] },
      flat4: { name: "Flat 4", theme: "modern", mood: "weird", lighting: "normal",
        onEnter: [{ say: "Fairy lights. A welcome basket. A handwritten card: 'Make yourself at home. Stay as long as you like.' Beyond the cosy living room a corridor runs much further back than the building does." }],
        options: [
          { label: "Search for Priya", if: { clue: "c_priya" }, once: true, steps: [{ check: { aspect: "awareness", cr: "challenging", label: "Find the right door in the corridor", ok: [{ say: "Room 31, a suitcase wheel sticking out under the door. Priya Nair is sitting on the bed in her hoodie, eating the last biscuit from a welcome basket. 'Oh thank god. Are you real? Please be real.'" }, { set: "priya_found" }], fail: [{ say: "Every door is the same. You open eleven of them. The rooms are all made up, all waiting, all empty." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Get Priya to the front door", if: "priya_found", once: true, steps: [{ say: "She leaves her suitcase. You go back down the corridor holding hands like children. The front door is where it should be. You put her out on the landing and she's gone down the stairs before the Host notices." }, { objective: "so1" }] },
          { label: "Go to the room at the end", steps: [{ goto: "end" }] },
          { label: "Leave while you still can", steps: [{ goto: "stairwell" }] }] },
      end: { name: "The room at the end", theme: "modern", mood: "boss",
        onEnter: [{ say: "The last room is the nicest. Plants, a view of a city that isn't Edinburgh, and someone standing by the window with a host's smile and no face behind it. 'Is everything to your liking? I do so want you to stay.'" }],
        options: [
          { label: "Leave a review it can't ignore", once: true, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Write the truth about this place", ok: [{ say: "You type it out on your phone and post it: every name, every date, every missing guest. One star. The Host's smile slips. Things like this live on being liked." }, { set: "host_shaken" }], fail: [{ say: "Your thumbs keep typing 'lovely flat, great location'. You delete it three times." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Check out, by force", steps: [{ combat: "corridor", surpriseIf: "host_shaken", win: [
            { say: "The corridor folds up behind you like a map. You're standing on the third-floor landing of 9 Candlemaker Row, at dawn, with a set of keys that no longer open anything." }, { objective: "po2" },
            { if: { obj: "so1" }, then: [{ say: "Priya is sitting on the bottom step with Morag, wrapped in a foil blanket, already drafting her review." }], else: [{ say: "Morag says the listing went offline at 4:12. The other guests are still missing. Maybe the far rooms emptied out when the flat closed. Maybe not." }] },
            { end: "win" }] }] },
          { label: "Back down the corridor", steps: [{ goto: "flat4" }] }] }
    }
  });
})();
