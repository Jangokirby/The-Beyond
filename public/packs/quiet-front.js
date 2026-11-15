/* ============================================================================
   THE QUIET FRONT: a seven-part campaign through the World Wars era, 1916 to 1945,
   for the OID, the WCA and the NSBD. One thing, the Hush, follows the great events
   of the age, because it feeds on the moments when everything goes quiet. The agents
   were there for the big days; the jobs are about what was under them.
   Choices carry forward with {arcSet}; the people met come back.
   ========================================================================== */
(function () {
  const K = window.CASEKIT, F = K.face, N = K.person;
  const AG = ["OID", "WCA", "NSBD"];
  const cases = [], reg = (a) => (cases.push(a), a);

  /* ======================================================================= 1916 · I */
  reg({
    id: "qf-1-hush", title: "The Quiet Front I: No Man's Hush", setting: "The Somme, near Thiepval, France · September 1916", year: 1916, level: [1, 4], agencies: AG, region: "europe", theme: "trench",
    summary: "September 1916. On one stretch of the line, at 3:07 every morning, every sound stops: the guns, the wind, a man's own breath. For eleven minutes. Forty soldiers have walked out into no man's land in it, calmly, and not come back. Two came back. Neither can hear. Their captain has asked, off the record, for someone who is not in the army.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what takes the sound, and why at 3:07", done: "The silence is not an absence. It is a thing, and it comes to where the most men have died in the least time, and it listens." },
      { id: "po2", kind: "primary", t: "Stop it taking the men", done: "The 3:07 silence ends, or is turned away, and nobody else walks out. The line is loud again." },
      { id: "so1", kind: "secondary", t: "Hear what Private Gill saw in the quiet", done: "Gill walked out and came back. He says the quiet has a shape standing at its middle, with its head tilted, listening to him.", benefit: { label: "Knowing it listens", text: "You know it is drawn to sound it cannot hear. A bonus on every roll to resist it.", bonus: { tags: ["hush"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Read the listening-post log", done: "The sappers' log counts eleven minutes, every night, to the second, and notes that the German side goes quiet at the same time.", benefit: { label: "A true clock", text: "You can be ready at 3:07. A bonus on every roll made on the night of the Hush.", bonus: { tags: ["night"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Learn the hand-talk from the dressing station", done: "Nurse Marlow has taught the deaf survivors to talk with their hands. You learn enough to ask them what they heard when the sound went.", benefit: { label: "A language without sound", text: "You can speak in the Hush. A bonus on every roll to talk to the men it has taken.", bonus: { tags: ["talk"], value: 2 } } }
    ],
    clues: {
      c_walk: { t: "They walked out in step", s: "Captain Roe's report", x: "The forty who went did not run, or crawl. The sentries all say the same: they stood up, in a line, at 3:07, and walked out over the parapet at a march, with their rifles slung, towards the middle of no man's land." },
      c_time: { t: "Eleven minutes, to the second", s: "The listening-post log", x: "The sappers' log has the Hush at 3:07 every night, for eleven minutes exactly, for twenty-three nights. Wherever the guns are, the silence is the same size: a circle two hundred yards across, centred on a shell-hole in no man's land." },
      c_deaf: { t: "The two who came back cannot hear", s: "Nurse Marlow", x: "Gill and a sapper called Orme returned from the silence stone deaf. The doctor says nothing is wrong with their ears. They say it does not matter: they gave their hearing in, to be allowed to leave." },
      c_hole: { t: "A shell-hole with nothing in it", s: "The trench map", x: "The middle of the silence is one shell-hole, from a shell that fell on the first of July. A whole company died in the wire around it in the first ten minutes of the Somme. The hole is the only part of that field the grass has not grown over." },
      c_german: { t: "The other side loses men too", s: "Leutnant Brandt", x: "Across the wire, the Germans lose men to the same quiet, on the same nights. Their leutnant has written to his sister, an acoustician in Berlin, about it. They have not shot at each other at 3:07 for three weeks." },
      c_loud: { t: "It cannot take what is loud", s: "Gill's account", x: "Gill, before the Hush took his hearing, was singing. He says the thing stood very still and tilted its head. It could not hear him singing. It was only the singing that let him turn round." },
      c_roll: { t: "It collects the last thing a man hears", s: "The dressing-station ledger", x: "Every man who walked out had, in the hour before, been at the same place: a listening post at the head of Sap 9, where they heard the guns stop for a moment before the dawn stand-to. The Hush takes what a man has been listening for." }
    },
    npcs: {
      roe: N("Captain Anselm Roe", "Company commander", "Thirties, in a muddy officer's greatcoat and a steel helmet, with a neat moustache, a map case and the stillness of a man who has not slept in three weeks and has stopped noticing.", F(1, 2, "short", 0, "none", { sex: "m" })),
      gill: N("Private Tommy Gill", "A sentry who came back", "Early twenties, in a mud-grey tunic with a blanket round his shoulders, who watches your lips with great attention, and does not hear you.", F(1, 1, "short", 5, "none", { sex: "m" })),
      edith: N("Nurse Edith Marlow", "Dressing-station sister", "Twenties, in a grey nursing uniform under a rubber apron, with a Red Cross band and a very steady pair of hands, who has been teaching the deaf to talk with their fingers.", F(1, 3, "bun", 4, "none", { sex: "f" })),
      karl: N("Leutnant Karl Brandt", "German officer, across the wire", "Late twenties, in a field-grey greatcoat and a spiked-less helmet, with a pale tired face and a notebook full of numbers, who speaks very good English with a Berlin lilt.", F(1, 2, "short", 0, "none", { sex: "m" })),
      orme: N("Sapper Orme", "The other who came back", "Thirties, a tunneller in a clay-stained shirt, with a slate and a stub of chalk on a string round his neck, writing very small and very fast.", F(2, 1, "short", 5, "none", { sex: "m" }))
    },
    enemies: {
      hush: { build: { name: "The Hush", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 210, dtype: "sanity", core: { body: 2, mind: 3, spirit: 3 }, mods: ["Occult", "Tanky"],
        text: "A silence that listens. Hush: each round all sound stops in its zone (agents cannot call to one another: Mindfulness Medium, or lose the next action and 3 Sanity as it listens to the thing they were about to say). It cannot hear loud noise: a song, a drum, a whistle or a shout makes it flinch and take double damage. Only Sanity harms it.", dies: "the circle of silence shrinks to a point, and a single distant gun speaks, and then all of them" } },
      walker: { build: { name: "A walker", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 200, attack: 1, dtype: "health", dies: "stops, and turns, and asks what day it is" } }
    },
    encounters: {
      hole: { name: "The shell-hole", theme: "trench", fightText: "A shell-hole in the middle of no man's land, in a circle of dead grass two hundred yards wide. There is no sound at all. Forty men stand in a ring round the hole with their rifles slung, facing it, and at the middle, over the hole, something stands very still with its head tilted, listening.", zones: [{ id: "a", name: "The wire", col: 0, row: 0 }, { id: "b", name: "The ring of men", col: 1, row: 0 }, { id: "c", name: "The hole", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "hush", zone: "c" }, { t: "walker", zone: "b" }, { t: "walker", zone: "b", name: "A walker (2)" }] }
    },
    start: "trench",
    scenes: {
      trench: { name: "A support trench, Thiepval sector", theme: "trench", mood: "tense", lighting: "normal", weather: "rain", cast: ["roe"],
        onEnter: [{ once: "in", steps: [
          { say: "The Somme, in September 1916. A line of trenches cut in white chalk and brown mud, duckboards, sandbags and the long grey slope of no man's land beyond, scored with wire. For ten weeks the guns have not stopped. At 3:07 every morning, for eleven minutes, they do." },
          { talk: { npc: "roe", text: "I did not request a chaplain, and I did not request the Royal Engineers. I requested someone who is not in the army and does not report to it. Forty of my men have walked into the dark. I would like to know why before I write forty more letters." } }] }],
        options: [
          K.ask("roe", [
            K.t("What happens at 3:07?", ["Everything stops. The guns, the wind, a man's own breath. For eleven minutes. Not a shell, not a rifle. At the end of it the stand-to begins, and we count heads, and we are short."], { free: true, clue: "c_walk" }),
            K.t("Who can we talk to?", "Private Gill and Sapper Orme, who came back and cannot hear. Nurse Marlow at the dressing station, who has been teaching them to talk. And a listening post at the head of Sap 9, which is where all the forty were.", { free: true, set: "contacts_known" }),
            K.t("What do you think it is?", [{ say: "He looks at the white parapet." }, "I think the dead are very many and very quick, here. And that something has noticed the silence after a battle, and learned to stand in it."], { cha: 7, clue: "c_hole" }),
            K.t("What would you do?", "I would end it before anyone else walks out. I would not fire on a thing that does not exist. I would, God help me, sing, if I thought it would stop them.", { cha: 10, clue: "c_loud", set: "roe_help" })
          ], { label: "Talk to Captain Roe", name: "Captain Roe", bye: ["Keep your head down at 3:07. Especially then."] }),
          K.find("Read the company's casualty returns", "iq", "easy", "A column of forty names under 'Missing', each with the same note in the same hand: 'Stood. Walked. Not observed to return.' None is marked killed, or wounded, or deserted.", "A very long column of names.", { clue: "c_walk", hint: "Easy" }),
          K.go("To the dugout, to see Gill and Orme", "dugout", { if: "contacts_known" }),
          K.go("To the dressing station", "station", { if: "contacts_known" }),
          K.go("To the listening post at Sap 9", "post", { if: "contacts_known" })] },
      dugout: { name: "A signals dugout", theme: "cellar", mood: "weird", lighting: "shadow", weather: "none", cast: ["gill", "orme"],
        onEnter: [{ once: "in", steps: [{ say: "A cramped timber dugout, a candle in a bottle, a telephone with its bell muffled in a sock, and two men on the bunks who watch your faces as you come down the steps, and do not look up at the sound." }] }],
        options: [
          K.ask("gill", [
            K.t("What did you see?", ["Nothing, at first. Then everything very clear. A shell-hole, and over it a shape, standing with its head on one side, like a man listening at a door."], { free: true, clue: "c_loud", obj: "so1" }),
            K.t("How did you get back?", "I was singing. I sang all the way out. It could not hear me, and it did not like it. I came home on 'Roses of Picardy', and I gave it my ears for the favour.", { free: true, clue: "c_deaf" }),
            K.t("Will you go out again with us?", [{ say: "He reads your lips, and thinks, and nods very slowly." }, "If someone sings. I cannot. I would only be walking."], { cha: 8, set: "gill_help" })
          ], { label: "Talk to Gill, by hand and lip", name: "Gill", bye: ["Sing. Whatever you do. Sing."] }),
          K.find("Search Orme's slate", "awareness", "easy", "A slate covered in a tunneller's small clear writing: 'Nothing wrong with the ears. I let it have them. It was listening to me. I thought: I would like to be heard, once, by something, before I die.'", "Chalk dust.", { clue: "c_deaf", hint: "Easy" }),
          K.find("Look at the dugout's telephone log", "iq", "medium", "A signaller's ledger of calls: every night at 3:06, the line from Sap 9 to the battery rings once. At 3:07 it goes dead. At 3:18 it rings again, and there is no one on it, and it hisses very softly, like a held breath.", "A very long ledger.", { clue: "c_roll", hint: "Intelligence, Medium", tags: ["night"] }),
          K.go("Back to the trench", "trench")] },
      station: { name: "The dressing station", theme: "cellar", mood: "calm", lighting: "normal", weather: "none", cast: ["edith"],
        onEnter: [{ once: "in", steps: [{ say: "A long chalk cellar with hurricane lamps, rows of stretchers, the smell of carbolic and iodine, and, in the corner, a grey-uniformed nurse sitting with six men on a bench, all talking with their hands." }] }],
        options: [
          K.ask("edith", [
            K.t("What is wrong with their hearing?", ["Nothing. The doctors cannot find a thing. They hear the guns, and the telephone, and each other, perfectly well, until three in the morning. After the silence, nothing. Not even the guns."], { free: true, clue: "c_deaf" }),
            K.t("Can you teach us?", "I can teach you enough. Twenty signs. Yes, no, who, where, how many, afraid. It is quicker than you think. They have been very patient with me.", { free: true, obj: "so3", set: "signs_known" }),
            K.t("What have they told you?", [{ say: "Her hands stop moving." }, "That it is not cruel. That it is only very attentive. That if you give it something to listen to, it lets you go. And that it has not stopped being hungry."], { cha: 7, clue: "c_roll" }),
            K.t("Will you come out with us?", "I am a nurse. I do not go out. But I will wait at the wire with a lamp and a blanket. Someone should.", { cha: 10, set: "edith_help" })
          ], { label: "Talk to Nurse Marlow", name: "Nurse Marlow", bye: ["Bring them back warm."] }),
          K.find("Read the dressing-station ledger", "iq", "medium", "A ledger in a neat nurse's hand. Down the margin: the men who walked out, and the place each was last heard: Sap 9, the same listening post, in the hour before the stand-to, listening for the guns to stop.", "A very long ledger.", { clue: "c_roll", hint: "Intelligence, Medium" }),
          K.go("Back to the trench", "trench")] },
      post: { name: "The listening post, Sap 9", theme: "trench", mood: "dread", lighting: "dark", weather: "fog", cast: ["karl"],
        onEnter: [{ once: "in", steps: [{ say: "A narrow sap running out under the wire in the dark, with a flap of oilcloth at the end, a listening-trumpet on a stand and a log on a nail. In front of you, a gap in the wire. Across it, a man in field-grey kneels at the edge of the German sap with his hands raised, and calls softly in English." }] }],
        options: [
          K.ask("karl", [
            K.t("Who are you?", ["Karl Brandt, Leutnant, Infantry Regiment 180. I have been waiting for someone to answer my signal for a month. I do not want to shoot you. I would like us not to lose any more men."], { free: true, clue: "c_german" }),
            K.t("You lose men at 3:07?", "Thirty-one. The same quiet. The same walk. I wrote to my sister, who is an acoustician. She says it is a resonance. I think it is something that has learned a place.", { free: true, clue: "c_time" }),
            K.t("Would you stop firing, if we did?", [{ say: "He looks across the wire at the dark." }, "I would stop firing, and I would sing, if you did. I am told it cannot stand a noise made together."], { cha: 8, set: "karl_help", clue: "c_loud" })
          ], { label: "Talk to Leutnant Brandt, across the wire", name: "Leutnant Brandt", bye: ["Auf Wiedersehen. Not yet. Please."] }),
          K.find("Read the listening-post log", "iq", "easy", "A log in a sapper's neat hand: 'Twenty-three nights. 3:07. 3:18. A circle two hundred yards wide, centred on shell-hole 114. The Germans stop at the same time. We have not been shot at in the quiet for three weeks.'", "A log of tiny numerals.", { clue: "c_time", obj: "so2", hint: "Easy", tags: ["night"] }),
          K.find("Examine the shell-hole from the sap, with a periscope", "awareness", "medium", "Shell-hole 114. A circle of dead grass, and a single shape in the middle, standing, with its head tilted to one side. Even through the periscope you feel it notice you.", "Mud and wire.", { clue: "c_hole", hint: "Awareness, Medium", tags: ["hush"] }),
          K.go("Out into no man's land, at 3:07", "noman", { if: { all: [{ clue: "c_loud" }, { clue: "c_hole" }, { clue: "c_time" }] } }),
          K.go("Back to the trench", "trench")] },
      noman: { name: "No man's land, 3:07", theme: "trench", mood: "boss", lighting: "dark", weather: "fog",
        onEnter: [{ once: "in", steps: [
          { say: "3:07. The guns stop. Then the wind stops, and then your own pulse. You are standing in a circle of silence two hundred yards across, in dead grass, with forty men in a ring round a shell-hole, and at its middle a figure with its head tilted, listening to a sound you are no longer making." },
          { objective: "po1" }] }],
        options: [
          { label: "Lead the line in song, and drown it out", hint: "Needs Roe, Gill or Edith", if: { any: ["roe_help", "gill_help", "edith_help"] }, steps: [{ check: { aspect: "willpower", cr: "medium", label: "Start the song, and carry the whole company with it", who: "choose", tags: ["hush", "night"],
            ok: [{ say: "You start 'Roses of Picardy'. It is a dreadful voice. Forty men in a ring turn their heads, and one by one they open their mouths. The Hush, that has never in all its life been sung at by a company, flinches. It tilts its head the other way. The grey silence tears, like a sheet, from the top. The guns begin again, all along the line." }, { set: "res_song" }, { objective: "po2" }, { arcSet: "sang" }, { goto: "end" }],
            fail: [{ say: "Your voice goes down into the silence like a stone." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Make a truce across the wire, and sing from both sides", hint: "Needs Karl and the log", if: { all: ["karl_help", { obj: "so2" }] }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Get both lines to stand and shout at 3:07", who: "choose", tags: ["talk", "night"],
            ok: [{ say: "At 3:06 you raise a white rag. At 3:07 two hundred men on two sides of the wire stand up and shout, in two languages, at nothing. The Hush turns its head from one side to the other, and cannot choose, and cannot hear either. By 3:18 the line is quiet, and for the first time in three weeks, it is only the ordinary sort of quiet. Karl waves his helmet, once, across the wire." }, { set: "res_truce" }, { objective: "po2" }, { arcSet: "truce" }, { goto: "end" }],
            fail: [{ say: "The shout dies in the silence, and the silence notices." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Face it at the shell-hole", steps: [{ set: "res_fight" }, { combat: "hole", win: [{ say: "The circle of silence shrinks to a point, and a single distant gun speaks, and then all of them." }, { objective: "po2" }, { arcSet: "fought" }, { goto: "end" }] }] }] },
      end: { name: "The support trench, dawn", theme: "trench", mood: "calm", lighting: "normal", weather: "rain",
        onEnter: [{ once: "in", steps: [
          { say: "Dawn on the Somme, with a thin rain and a long line of mud, and, at last, noise: wheels, mess tins, men swearing, a distant shell. It is the loudest, most ordinary morning you have ever heard. Roe stands on the fire-step with his hat off and listens to it." },
          { if: { flag: "res_song" }, then: [{ say: "You sang it down. The company that walked out were walked back by the ones who had never stopped listening for them, and some of them are still hoarse." }] },
          { if: { flag: "res_truce" }, then: [{ say: "You made a truce, and it held for one morning only. A letter in a German envelope, signed Karl Brandt, comes through the lines a week later: his sister would like to meet you." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke it at its own shell-hole. It was not killed. Where it stood, a very little grass has started to grow." }] },
          { if: { obj: "so1" }, then: [{ say: "Gill goes home on the hospital train, deaf, with a mouth organ. He plays loudly." }] },
          { if: { obj: "so2" }, then: [{ say: "The listening-post log goes to the Royal Engineers, who file it, and to a woman in Berlin, who does not." }] },
          { if: { obj: "so3" }, then: [{ say: "Nurse Marlow writes to say the hand-talk has spread along the line. She has put your names in her ledger, at the bottom, in ink." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1918 · II */
  reg({
    id: "qf-2-grey-ward", title: "The Quiet Front II: The Grey Ward", setting: "No. 24 General Hospital, Étaples, France · October 1918", year: 1918, level: [2, 5], agencies: AG, region: "europe", theme: "interior",
    summary: "October 1918. The influenza is killing more soldiers at Étaples than the Germans are. On Ward 9 the patients do not cough or cry out. They stop talking, one after another, in the night, and then they stop breathing. The orderlies say the ward goes very quiet before each one goes. Sister Edith Marlow, who you may remember, has written to the only people she thinks will believe her.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out how the silence is moving through Ward 9", done: "The Hush is not in the ward. It is in each bed, one at a time, in the hush a dying man makes. It has learned to hide in a sound the world already allows." },
      { id: "po2", kind: "primary", t: "Close the ward to it, without losing more men", done: "The nightly silence ends. The ward is loud, and busy, and alive, and the dying are heard to the end." },
      { id: "so1", kind: "secondary", t: "Hear what a patient says in the last hour", done: "Corporal Dunn, who is not going to live, says that at the end the ward starts to repeat things back to you, in the voices of men who are already gone.", benefit: { label: "Knowing its trick", text: "You know it mimics the dying. A bonus on every roll to tell its voice from a real one.", bonus: { tags: ["voice"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Read the night orderly's rounds", done: "Henri's rounds show the silence arrives at a different bed each night, always the one where somebody was last spoken to kindly.", benefit: { label: "The path of the quiet", text: "You know which bed is next. A bonus on every roll made at a bedside.", bonus: { tags: ["bed"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Open the windows, and be right", done: "Dr. Cole, who has argued all month for fresh air, finally has the ward doors propped open. Forty men breathe easier before dawn.", benefit: { label: "Fresh air", text: "A ward that is not sealed in. A bonus on every roll to rally the sick.", bonus: { tags: ["rally"], value: 2 } } }
    ],
    clues: {
      c_stop: { t: "They stop speaking before they stop breathing", s: "Sister Marlow's chart", x: "Every death on Ward 9 for three weeks has the same note in the sister's hand: the patient stopped speaking an hour before the end, between one sentence and the next, in the middle of a word. The ward noticed. The ward went quiet." },
      c_bed: { t: "The quiet visits the bed where someone was last kind", s: "Henri's rounds", x: "The night orderly's rounds show the silence reaches one bed a night. It is always the bed where somebody sat longest, held a hand, said something gentle. It is drawn to a quiet that has been made on purpose, as to a lit window." },
      c_echo: { t: "It repeats what you say, in other voices", s: "Corporal Dunn", x: "In the last hour the ward begins to repeat things. A word, a name, a phrase of a song. In the voice of someone who is not in the room, and usually not alive. Dunn says the thing at the end of the ward is learning to talk." },
      c_air: { t: "The shut ward is a held breath", s: "Dr. Cole's notes", x: "Ward 9 has been sealed since August against the cold and the gas rumour. Dr. Cole's notes show the sealed wards lose men at twice the rate of the ones with open windows. The Hush thrives in shut air: a held breath is the only silence it cannot make itself." },
      c_hush: { t: "It is the same silence as the Somme", s: "Sister Marlow", x: "The sister has seen this silence before, on the Somme, in a dressing station, two years ago. It is the same patient, tilted head. It followed the dying from the trench to the ward, as a rat follows a ship." },
      c_loud: { t: "A ward full of noise gives it nothing to listen to", s: "The matron's order book", x: "In the first week of September the matron ordered a gramophone for Ward 6. Nobody on Ward 6 has died in the night since. The sister has been trying to get one for Ward 9 for a month, and has been told it is not regulation." },
      c_last: { t: "It wants the last word", s: "The chaplain's notes", x: "The chaplain, Father Adair, notes that each dying man begins to say a last thing, and is stopped. The thing at the end of the ward is collecting last words. It is not clear whether it wants to know them or to keep them from being heard." }
    },
    npcs: {
      edith: N("Sister Edith Marlow", "Ward sister", "Late twenties, in a starched grey uniform and a white veil, with a watch pinned to her apron and a tired, very upright carriage, who has not slept properly in a month.", F(1, 3, "bun", 4, "none", { sex: "f" })),
      cole: N("Dr. Hamish Cole", "Medical officer", "Forties, in a white coat over khaki, with a stethoscope round his neck and the ruddy stubbornness of a man who has been told no by three committees.", F(1, 2, "short", 1, "none", { sex: "m" })),
      henri: N("Henri Duval", "Night orderly", "Fifties, a French orderly in a long grey apron with a lantern, a limp and a quiet way of walking down a ward at night so as not to wake the living.", F(2, 4, "short", 5, "none", { sex: "m" })),
      dunn: N("Corporal Dunn", "A patient, dying", "Twenties, propped on three pillows in a grey flannel nightshirt, flushed and very clear-eyed, with a cigarette he is not allowed and a very steady voice.", F(1, 1, "short", 2, "none", { sex: "m" })),
      adair: N("Father Adair", "Chaplain", "Fifties, in a surplice over khaki, with a stole in one hand and a notebook in the other, who has said more last rites this month than in his whole life.", F(1, 3, "short", 0, "none", { sex: "m" }))
    },
    enemies: {
      voice: { build: { name: "The Voice at the End of the Ward", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 200, dtype: "sanity", core: { body: 2, mind: 3, spirit: 4 }, mods: ["Occult", "Tanky"],
        text: "The Hush in a sickbed's quiet. Echo: each round it speaks a dying man's last words in the voice of someone you know (Morality Medium, or lose the next action and 3 Sanity). It is hurt by noise and by an open window: a gramophone, a song or fresh air lets everyone take double damage against it. Only Sanity harms it.", dies: "a last word is spoken, aloud, in a living voice, and the ward breathes out" } },
      sleeper: { build: { name: "A silent patient", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 195, attack: 1, dtype: "health", dies: "sits up, and asks for tea" } }
    },
    encounters: {
      ward9: { name: "Ward 9, in the night", theme: "interior", fightText: "A long hut of whitewashed boards, forty beds in two rows under the hurricane lamps. Every patient lies perfectly still, with their eyes open. At the end of the ward, between the last two beds, a tall quiet shape stands, with its head tilted, listening to the last word of a man who is trying very hard to say it.", zones: [{ id: "a", name: "The doors", col: 0, row: 0 }, { id: "b", name: "The beds", col: 1, row: 0 }, { id: "c", name: "The end of the ward", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "voice", zone: "c" }, { t: "sleeper", zone: "b" }, { t: "sleeper", zone: "b", name: "A silent patient (2)" }] }
    },
    start: "office",
    scenes: {
      office: { name: "The sisters' room, Étaples", theme: "interior", mood: "tense", lighting: "normal", weather: "rain", cast: ["edith"],
        onEnter: [{ once: "in", steps: [
          { say: "Étaples, in October 1918. A camp of grey huts, hospital tents and wooden wards stretched along a long beach of dunes, sixty thousand men in it and one in five of them sick. The rain, the khaki smell of wet wool, the coughing from every door." },
          { if: { arc: "sang" }, then: [{ say: "Sister Marlow wrote on the back of an envelope: 'You made them sing. I have been trying to remember how. Come quickly.'" }] },
          { if: { arc: "truce" }, then: [{ say: "Sister Marlow has enclosed a German letter, with a Berlin postmark: a woman named Ilse Brandt has asked to be told, if you come to Étaples, what her brother's war was like. You will want to answer her." }] },
          { if: { arc: "fought" }, then: [{ say: "Sister Marlow's note says only: 'It is not dead. I know its quiet. It has come here after the dying, as I thought.'" }] },
          { talk: { npc: "edith", text: "Forty-one men on Ward 9 in three weeks. The flu does that, I am told. But the flu does not make a ward go quiet one hour before each one goes. I have only ever seen that once. I would rather be wrong." } }] }],
        options: [
          K.ask("edith", [
            K.t("What is happening?", ["They stop speaking. Between one sentence and the next, as if somebody had taken the sound out of the room. Then they go. It is not painful. It is not even frightening. It is only very, very quiet. And the whole ward knows."], { free: true, clue: "c_stop" }),
            K.t("Do you think it is the same thing?", "I know it is. The same patience. The same head on one side. It followed them from the line to the ward, and this is the first place it has found where a great many people are quiet on purpose.", { free: true, clue: "c_hush" }),
            K.t("Who can we talk to?", [{ say: "She counts them on her fingers." }, "Dr. Cole, who wants the windows open. Henri, the night orderly. Corporal Dunn, who is dying, and will not mind. And Father Adair, who has been writing them all down."], { cha: 6, set: "contacts_known" }),
            K.t("What would you do?", "Make a noise. All night, every night. I have been trying to get a gramophone. I would take a brass band, if there were one in France.", { cha: 10, clue: "c_loud", set: "edith_plan" })
          ], { label: "Talk to Sister Marlow", name: "Sister Marlow", bye: ["Keep your voice up. Please."] }),
          K.find("Read the ward's death register", "iq", "easy", "Forty-one names in three weeks, each with a time. Beside each, in the sister's hand, a note: 'Quiet from' and a time an hour earlier. The notes are the same length, down the page, like a column of stitches.", "A very long register.", { clue: "c_stop", hint: "Easy" }),
          K.go("To Dr. Cole's office", "cole", { if: "contacts_known" }),
          K.go("To the night orderly", "henri", { if: "contacts_known" }),
          K.go("To Corporal Dunn's bed", "dunn", { if: "contacts_known" }),
          K.go("To the chaplain's hut", "chaplain", { if: "contacts_known" })] },
      cole: { name: "Dr. Cole's office", theme: "interior", mood: "calm", lighting: "normal", weather: "none", cast: ["cole"],
        onEnter: [{ once: "in", steps: [{ say: "A cramped office in a hut at the end of the lines, with a stove, a very tall pile of forms and a blackboard covered in a doctor's graphs: the death rates of every ward, in coloured chalk, with Ward 9 in a violent red." }] }],
        options: [
          K.ask("cole", [
            K.t("What do the numbers say?", ["That the sealed wards lose twice as many men as the ones with open windows. It is not a secret. It is not even new. But Ward 9 was sealed in August against the cold, by order of a colonel, and I am only a major."], { free: true, clue: "c_air" }),
            K.t("Is it only the flu?", "It is the flu. And it is something else. I do not like the other thing's habits. The flu kills at all hours. This kills at four in the morning, politely.", { free: true, set: "cole_noted" }),
            K.t("Will you open the windows?", [{ say: "He looks at the chalk." }, "On my authority, tonight, if you will carry the paper to the colonel in the morning. I will lose my commission, and forty men will breathe."], { cha: 8, set: "cole_help", obj: "so3" })
          ], { label: "Talk to Dr. Cole", name: "Dr. Cole", bye: ["Air. Tell them: air."] }),
          K.find("Read the doctor's graphs", "iq", "medium", "A bar for every ward, and every bar is shorter with an open window. Ward 9's is not a bar but a stripe, running off the board. In the corner, in a very small hand: 'Not the flu alone. See the sister's notes.'", "Coloured chalk.", { clue: "c_air", hint: "Intelligence, Medium", failClue: "c_air" }),
          K.go("Back to the sisters' room", "office")] },
      henri: { name: "The orderlies' lamp room", theme: "cellar", mood: "weird", lighting: "normal", weather: "none", cast: ["henri"],
        onEnter: [{ once: "in", steps: [{ say: "A little brick lamp room with a rack of hurricane lanterns, a smell of paraffin, a tin of coffee on a stove, and a limping orderly in a grey apron who turns a lamp very low as you come in." }] }],
        options: [
          K.ask("henri", [
            K.t("What do you see at night?", ["A ward that holds its breath. Each night one bed. I walk the rows with my lamp, and at one bed the light goes very small, as if it were listening. That is the bed. By four, it is empty."], { free: true, clue: "c_bed", obj: "so2" }),
            K.t("Why that bed?", "It is always the one where someone sat the longest. Held a hand. Spoke gently. I think it likes where a quiet has been made with love. It takes the kind with the quiet.", { free: true, clue: "c_bed" }),
            K.t("Will you walk the ward with us?", [{ say: "He lifts the lamp." }, "I will walk it. I always do. But if it speaks to me in my wife's voice again, please, someone, answer first."], { cha: 7, set: "henri_help" })
          ], { label: "Talk to Henri", name: "Henri", bye: ["Bonne nuit. Do not answer anyone you do not see."] }),
          K.find("Read the rounds book", "iq", "easy", "A grubby book of times in a French hand: bed numbers, times, a tally of lamp-oil. The quiet's bed is circled each night, and each circled bed is, a day earlier, marked with a small cross: 'sat with'.", "A book of oil measures.", { clue: "c_bed", obj: "so2", hint: "Easy", tags: ["bed"] }),
          K.go("Back to the sisters' room", "office")] },
      dunn: { name: "Corporal Dunn's bed", theme: "interior", mood: "dread", lighting: "shadow", weather: "none", cast: ["dunn"],
        onEnter: [{ once: "in", steps: [{ say: "Ward 9, at dusk. Forty beds in two rows under hurricane lamps, the coughing at every pillow, a smell of Condy's crystals and boiled linen. At the far end, a corporal in a nightshirt, propped on three pillows, who raises a cigarette in welcome." }] }],
        options: [
          K.ask("dunn", [
            K.t("What do you hear at the end?", ["The ward starts to say things back. Not mine. Other men's. A name, a line of a hymn. Someone's mother calling someone to supper. In the voice of someone who is not in the room. It is learning to talk."], { free: true, clue: "c_echo", obj: "so1" }),
            K.t("Are you afraid?", "Not of dying. Of the quiet. I would rather go with the whole ward shouting. Do you think they would, if I asked?", { free: true, clue: "c_last" }),
            K.t("Would you let us try something?", [{ say: "He smiles, and a little colour comes back." }, "I would let you read me the football results at the top of your voice, if you had them."], { cha: 7, set: "dunn_help" })
          ], { label: "Talk to Corporal Dunn", name: "Corporal Dunn", bye: ["Make a noise. For me."] }),
          K.find("Sit by the bed, and listen", "awareness", "medium", "The ward has gone very quiet around you, and a small, faint, oddly kind voice, on your left, says your name, and then the name of someone you have lost. It is not coming from anywhere.", "Coughing, and a distant gramophone.", { clue: "c_echo", hint: "Awareness, Medium", tags: ["bed", "voice"] }),
          K.go("Back to the sisters' room", "office")] },
      chaplain: { name: "The chaplain's hut", theme: "interior", mood: "calm", lighting: "normal", weather: "none", cast: ["adair"],
        onEnter: [{ once: "in", steps: [{ say: "A hut with a camp bed, a field altar made of two ammunition boxes and a cloth, a candle in a bully-beef tin, and a clergyman in a surplice who is writing, very fast, in a notebook already near full." }] }],
        options: [
          K.ask("adair", [
            K.t("What are you writing?", ["Their last words. I did not mean to. But each of them begins a sentence, at the end, and is stopped before the end of it. I write down where they stopped. Forty-one men. Forty-one half-sentences."], { free: true, clue: "c_last" }),
            K.t("Can they be finished?", "I have tried. I read the half-sentence aloud, and finish it, and say a prayer for the end of it. The thing does not like it. It goes very still. I think it was never meant to be a quiet thing.", { free: true, clue: "c_loud" }),
            K.t("Will you read them aloud, in the ward?", [{ say: "He closes the notebook on his thumb." }, "At full voice, at 4 a.m.? I have never done a more ungodly thing in my life. Yes."], { cha: 8, set: "adair_help" })
          ], { label: "Talk to Father Adair", name: "Father Adair", bye: ["Go with God. And a loud voice."] }),
          K.find("Read the half-sentences", "faith", "medium", "Forty-one entries, each one a sentence cut off at the same point, a word short of its end. Put together, in order, they make a single sentence, written in forty-one hands. It is a very ordinary sentence, and it is a plea: 'Please. Somebody. Hear me say it.'", "A notebook of broken prayers.", { clue: "c_last", hint: "Faith, Medium", tags: ["voice"] }),
          K.go("Down to Ward 9, tonight", "ward", { if: { all: [{ clue: "c_air" }, { clue: "c_bed" }, { clue: "c_echo" }] } }),
          K.go("Back to the sisters' room", "office")] },
      ward: { name: "Ward 9, 4 a.m.", theme: "interior", mood: "boss", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Four in the morning. The ward's lamps burn very small. Every patient lies perfectly still, with their eyes open. At the far end, between the last two beds, a tall quiet shape stands with its head on one side, collecting the last word of a man who is trying very hard to say it. The silence is the same silence, and it has learned to wear a ward like a coat." },
          { objective: "po1" }] }],
        options: [
          { label: "Fill the ward with noise: a gramophone, a song, and every voice", hint: "Needs Edith, and a plan", if: { all: ["edith_plan", { any: ["henri_help", "dunn_help", "adair_help"] }] }, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Get every nurse, orderly and walking patient shouting at once", who: "choose", tags: ["talk", "voice"],
            ok: [{ say: "At 4:00 the gramophone goes on, at full volume, and Sister Marlow stands on a chair and sings. Henri bangs his lamp on a bucket. Father Adair reads forty-one half-sentences aloud and finishes each. The ward, which had been waiting for a silence, finds it has none. The tall thing at the end turns its head left, and right, and cannot choose. Then it stops being tall." }, { set: "res_noise" }, { objective: "po2" }, { arcSet: "noise" }, { goto: "end" }],
            fail: [{ say: "The gramophone sticks. In the gap, a kind voice says your name." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Open every window and door, and let the night in", hint: "Needs Dr. Cole, and the air", if: { all: ["cole_help", { obj: "so3" }] }, steps: [{ check: { aspect: "strength", cr: "medium", label: "Drag the shutters off and prop the doors with a stretcher each", who: "choose", tags: ["rally"],
            ok: [{ say: "You throw the shutters off, one after another, down the whole long hut. The wet, cold, ordinary night comes through the ward like a tide. The held breath of the room goes out of it. The tall thing at the end is made of the stillness, and the stillness is gone. The patients begin to cough, and to swear, and to ask for tea." }, { set: "res_air" }, { objective: "po2" }, { arcSet: "aired" }, { goto: "end" }],
            fail: [{ say: "The last shutter is nailed shut. The silence closes round the lamp." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face it at the end of the ward", steps: [{ set: "res_fight" }, { combat: "ward9", win: [{ say: "A last word is spoken, aloud, in a living voice, and the ward breathes out." }, { objective: "po2" }, { arcSet: "fought2" }, { goto: "end" }] }] }] },
      end: { name: "The sisters' room, dawn", theme: "interior", mood: "calm", lighting: "normal", weather: "rain",
        onEnter: [{ once: "in", steps: [
          { say: "Dawn at Étaples, with the rain on the huts, the coughing starting up in every ward, the first gramophone of the morning, a long way off, playing something dreadful and glorious. Nobody has died on Ward 9 since midnight. Sister Marlow sits at her table with her cap off and sleeps with her head on her arms." },
          { if: { flag: "res_noise" }, then: [{ say: "You drowned it. The ward has a gramophone now, by order of a matron who has no idea why. Every dying man on Ward 9 is heard to the last word." }] },
          { if: { flag: "res_air" }, then: [{ say: "You let the night in. The sealed ward is open, and the death rate halves in a week. The colonel never learns who gave the order." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You faced it at the end of the ward. It was not killed. It went, as the gas goes out of a room, down the long hut and out into the rain." }] },
          { if: { obj: "so1" }, then: [{ say: "Corporal Dunn died at noon, in full voice, finishing a sentence." }] },
          { if: { obj: "so2" }, then: [{ say: "Henri keeps his rounds book. He has underlined the last page twice." }] },
          { if: { obj: "so3" }, then: [{ say: "Dr. Cole is reprimanded, and not removed, and his chalk graphs are copied to every hospital in the sector." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1923 · III */
  reg({
    id: "qf-3-listening", title: "The Quiet Front III: Lessons in Listening", setting: "Berlin, Germany · November 1923", year: 1923, level: [3, 6], agencies: AG, region: "europe", theme: "street",
    summary: "Berlin, November 1923. A loaf of bread costs a hundred billion marks. In a cellar club called the Stille Stunde, hungry people pay their last coins to sit for eleven minutes in a perfect silence, performed by a singer who does not sing. Dr. Ilse Brandt, an acoustician, has been recording it. She writes to you, because the recordings have started to answer.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out how the club makes its silence", done: "The Stille Stunde is not making silence. It is hosting it. The singer is a door, and the audience, eleven minutes at a time, is the price of keeping it open." },
      { id: "po2", kind: "primary", t: "Close the door without hurting the people behind it", done: "The silence is turned away, or answered, or cut. Magda is free of it, and the club is just a club." },
      { id: "so1", kind: "secondary", t: "Hear the singer's story", done: "Magda says it began the night she stopped being able to sing, and a stranger in the front row said it did not matter, that she had the best silence in Berlin.", benefit: { label: "A way to refuse it", text: "You know what it said to her. A bonus on every roll to turn down its offers.", bonus: { tags: ["refuse"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Get Ilse's recordings", done: "Ilse's wax cylinders capture the eleven minutes. On playback the silence is not empty: there is a very faint breathing, and under it a voice repeating a sentence you almost know.", benefit: { label: "A recorded silence", text: "You can hear it coming. A bonus on every roll to catch it out.", bonus: { tags: ["record"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Find the owner's ledger", done: "Kessler's books show the club grew from nothing in a month, on coins the audience had no business having, from people who then lost every other thing they had.", benefit: { label: "Follow the money", text: "You know what the club takes. A bonus on every roll to bargain with the owner.", bonus: { tags: ["bargain"], value: 2 } } }
    ],
    clues: {
      c_club: { t: "A cellar club that sells silence", s: "The street handbill", x: "A hand-lettered poster on a lamp-post: 'Stille Stunde. Every night at eleven. Admission one million marks. Silence guaranteed.' People queue down the stairs for it in the rain, in the one winter when nobody in Berlin can afford to eat." },
      c_eleven: { t: "Eleven minutes, the same eleven", s: "Ilse's records", x: "Ilse's cylinders time the silence at exactly eleven minutes, every night, like the quiet on the Somme. The audience leaves very calm, and very light, and, she has found, very slightly deaf to the voices of the people they love." },
      c_door: { t: "The singer is a door", s: "Magda", x: "Magda stands at the front of the little stage in a black dress and does not sing. She says she is not holding the silence. She is only the shape it uses to come into the room, the way a draught uses a keyhole." },
      c_price: { t: "It takes the last thing a person has said", s: "Kessler's ledger", x: "The club's books show every regular customer has, within a fortnight of their first visit, lost something that was theirs: a trade, a marriage, a pension, a friend. The silence is not free. It collects the one conversation people would otherwise have used to save themselves." },
      c_record: { t: "Silence recorded is silence stored", s: "Ilse's lab", x: "A wax cylinder of the eleven minutes, played back very loudly in a closed room, does what the original does: it empties the room of sound. But the machine can be run backwards, and a backwards silence, Ilse thinks, is a noise it cannot stand." },
      c_karl: { t: "Her brother wrote of it", s: "Ilse's letter", x: "Ilse's brother Karl wrote to her from the Somme in 1916 about the silence at 3:07. She did not believe him. After the war, when he did not come home, she built a laboratory to hear what he had heard. It has been the work of seven years." },
      c_same: { t: "The Somme thing, wearing a ballroom", s: "The agents' own file", x: "Compare the silence at the Stille Stunde with the silence at shell-hole 114 and Ward 9. It is the same size. It has the same tilt of the head, in the dark, in the middle. It is following the quiet after wars, and the quiet after wars, in Berlin in 1923, is everywhere." }
    },
    npcs: {
      ilse: N("Dr. Ilse Brandt", "Acoustician", "Thirties, in a white laboratory coat over a tweed skirt, with a headband of black wire and a very still, very precise face, and a small photograph of a soldier pinned over her desk.", F(1, 2, "bun", 2, "none", { sex: "f" })),
      magda: N("Magda Weiss", "The singer who does not sing", "Late twenties, in a black cabaret dress and long gloves, with bobbed dark hair, very pale powder and a mouth that opens, sometimes, on nothing.", F(1, 2, "bob", 4, "none", { sex: "f" })),
      kessler: N("Herr Kessler", "Club owner", "Fifties, in a loud check suit and a very new watch-chain, with a cigar and a cheerful, hungry smile and the fidgeting fingers of a man who counts constantly.", F(1, 3, "short", 0, "none", { sex: "m" })),
      anton: N("Anton Meier", "Ilse's assistant", "Early thirties, in a lab apron, who lost a hand and an ear in the war, and works the recording lathe with the one he has left, and does not look at the doorway.", F(1, 1, "short", 5, "none", { sex: "m" })),
      frau: N("Frau Lindqvist", "A regular", "Forties, in a threadbare fur-collared coat and a hat with a veil, very upright, who has been to the club every night for a month and does not remember why.", F(1, 3, "bun", 2, "none", { sex: "f" }))
    },
    enemies: {
      guest: { build: { name: "The Guest of the Stille Stunde", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 40, dtype: "sanity", core: { body: 2, mind: 4, spirit: 3 }, mods: ["Occult", "Tanky"],
        text: "The Hush, at home. Invitation: each round it offers one agent a quiet they have wanted (Morality Hard, or lose the next action and 3 Sanity, and the agent's next roll is made in silence). It is hurt by a recording played backwards, and by a crowd that will not be quiet: a song, a heckle, or a run of the machine backwards gives everyone double damage against it. Only Sanity harms it.", dies: "the room breathes in, and out, and the whole audience claps, uncertainly, and then does not stop" } },
      patron: { build: { name: "A quiet patron", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 45, attack: 1, dtype: "health", dies: "sits down, blinking, and asks for the bill" } }
    },
    encounters: {
      club: { name: "The Stille Stunde", theme: "interior", fightText: "A low cellar club, red lamps, round tables, a hundred silent faces turned to a small stage. On it a woman in black stands with her mouth open on nothing. Behind her in the dark, at the edge of the light, a tall quiet shape stands with its head on one side, listening to the audience for the last thing it will ever say.", zones: [{ id: "a", name: "The stairs", col: 0, row: 0 }, { id: "b", name: "The tables", col: 1, row: 0 }, { id: "c", name: "The stage", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "guest", zone: "c" }, { t: "patron", zone: "b" }, { t: "patron", zone: "b", name: "A quiet patron (2)" }] }
    },
    start: "lab",
    scenes: {
      lab: { name: "The Brandt Institute, Charlottenburg", theme: "interior", mood: "tense", lighting: "normal", weather: "rain", cast: ["ilse"],
        onEnter: [{ once: "in", steps: [
          { say: "Berlin, November 1923. A city of hungry people with trillions in their pockets and nothing to buy: women pushing prams full of banknotes, men with armfuls of paper in the rain. In Charlottenburg, in a lab full of wax cylinders, copper horns and humming lathes, a tall woman in a white coat is waiting for you with a letter in her hand." },
          { if: { arc: "truce" }, then: [{ say: "Ilse has your letter from the Somme on her desk, with the note she wrote back: 'Karl lived to write to you. He did not live to come home. Thank you for the quiet that was an honest one.'" }] },
          { if: { arc: "sang" }, then: [{ say: "Ilse says: 'My brother wrote that a captain made them sing. I am told it was you. I am sorry I did not know, at the time, how much the singing mattered.'" }] },
          { talk: { npc: "ilse", text: "The cylinders answer back. That is what I wanted to tell someone. I record the silence at the Stille Stunde, every night, for eleven minutes. Last week, on playback, there was a voice in it. It said my brother's name." } }] }],
        options: [
          K.ask("ilse", [
            K.t("What is the Stille Stunde?", ["A cellar club in Kreuzberg, with a singer who does not sing, and a silence people pay to sit in. Eleven minutes. It has been open a month, and half Berlin has been. It is the most successful thing that has happened in this city since the mark fell."], { free: true, clue: "c_club" }),
            K.t("Who can we talk to?", "Magda Weiss, the singer. Kessler, who owns the club. Anton, my assistant, who has seen too much of the recordings. And Frau Lindqvist, who goes every night, and cannot say why.", { free: true, set: "contacts_known" }),
            K.t("What do the cylinders show?", [{ say: "She turns the horn towards you." }, "The silence is not empty. It is full of the audience's last remarks. Everything a person might have said, and did not, that night. It keeps them. It is collecting them, I think, the way you collect pressed flowers."], { cha: 7, clue: "c_eleven" }),
            K.t("Is this about Karl?", "It was always about Karl. I built all of this to hear what he heard. And now I have heard it, and it is not what I expected.", { cha: 10, clue: "c_karl", set: "ilse_help" })
          ], { label: "Talk to Dr. Brandt", name: "Dr. Brandt", bye: ["Be careful with sound. It remembers."] }),
          K.find("Listen to last night's cylinder", "awareness", "medium", "Eleven minutes of apparent nothing, then a faint sound under it, like a held breath, and a voice, slow and gentle, repeating a sentence you almost know. You realise it is the last sentence you said to someone you have lost.", "Eleven minutes of wax hiss.", { clue: "c_eleven", hint: "Awareness, Medium", tags: ["record"] }),
          K.go("To the Stille Stunde, in Kreuzberg", "club", { if: "contacts_known" }),
          K.go("To Magda's dressing room", "dressing", { if: "contacts_known" }),
          K.go("To Kessler's office", "office", { if: "contacts_known" }),
          K.go("To Anton, at the recording lathe", "lathe", { if: "contacts_known" })] },
      club: { name: "The Stille Stunde, before the doors", theme: "interior", mood: "weird", lighting: "shadow", weather: "none", cast: ["frau"],
        onEnter: [{ once: "in", steps: [{ say: "A low cellar in Kreuzberg, red lamps, round tables, a little stage with a black curtain. At a table near the door, before the doors have even opened, a woman in a fur-collared coat and a veiled hat is sitting very straight, with a full glass of nothing in front of her." }] }],
        options: [
          K.ask("frau", [
            K.t("Why do you come here?", ["I do not know. I have not known for a month. It is so very peaceful. I used to talk a great deal, you see. To my husband. I find I cannot remember what about."], { free: true, clue: "c_price" }),
            K.t("Do you remember what happens?", "Eleven minutes. Then we all go home, and sleep. It is the best sleep I have had since the war. I am not sure what I leave behind. I think it is only noise.", { free: true, clue: "c_door" }),
            K.t("Would you stay away tonight?", [{ say: "She looks at the stage curtain for a long time." }, "If someone spoke to me. Loudly. Until I remembered what I was going to say."], { cha: 8, set: "frau_help" })
          ], { label: "Talk to Frau Lindqvist", name: "Frau Lindqvist", bye: ["I will see you inside. I think."] }),
          K.find("Read the handbill and the door-list", "iq", "easy", "A door-list of regulars, in a clerk's copperplate. Beside each name, a date they first came, and, in a second column in a different ink, a note of what they lost the month after: 'Employment', 'Wife', 'Voice'.", "A very long door-list.", { clue: "c_price", hint: "Easy" }),
          K.go("Back to the Institute", "lab")] },
      dressing: { name: "Magda's dressing room", theme: "interior", mood: "calm", lighting: "normal", weather: "none", cast: ["magda"],
        onEnter: [{ once: "in", steps: [{ say: "A cramped dressing room behind the stage, a mirror ringed with bulbs, a rail of black dresses, a jar of white powder, and a woman sitting very still in front of the glass with her gloves off and her mouth very slightly open." }] }],
        options: [
          K.ask("magda", [
            K.t("What do you do on stage?", ["Nothing. That is the act. I stand, and I open my mouth, and the room does the rest. Eleven minutes. I used to sing, before. Then I stopped, and a man in the front row said it did not matter. That I had the best silence in Berlin."], { free: true, clue: "c_door", obj: "so1" }),
            K.t("Who was the man?", "I never saw his face. He was very still, and he listened. Everyone is so grateful to be listened to. I do not know if he was a man.", { free: true, clue: "c_same" }),
            K.t("Do you want to stop?", [{ say: "She picks up a glove and puts it down." }, "More than anything. But if I stop, the room will be full of people who have nowhere to put their silence. They will take it home."], { cha: 7, set: "magda_help" })
          ], { label: "Talk to Magda", name: "Magda", bye: ["Do not clap. It frightens it."] }),
          K.find("Read the dressing-room notes", "iq", "medium", "A pile of letters from regulars. A pattern in the dates: each began coming, within a week of losing something dear, and each said the same thing in their first letter: 'It was the first quiet that did not feel like being alone.'", "A pile of fan letters.", { clue: "c_price", hint: "Intelligence, Medium", tags: ["refuse"] }),
          K.go("Back to the Institute", "lab")] },
      office: { name: "Kessler's office", theme: "interior", mood: "tense", lighting: "normal", weather: "none", cast: ["kessler"],
        onEnter: [{ once: "in", steps: [{ say: "A cluttered back office with a safe, three telephones and a desk heaped with banknotes in bundles, and a stout man in a check suit who rises and holds out his arms as if you were an old friend and a creditor." }] }],
        options: [
          K.ask("kessler", [
            K.t("How did you open so fast?", ["A friend lent me the cellar. Another friend lent me the singer. The coins, I will confess, I found on the doorstep. Gold. Pre-war. I did not ask. In this city, my dear, one does not ask."], { free: true, clue: "c_price" }),
            K.t("What does the club take?", "From the audience? A little something. They leave lighter. I think of it as a laundry service. Eleven minutes, and they go away with nothing on their minds.", { free: true, clue: "c_door", set: "kessler_talked" }),
            K.t("Will you close it?", [{ say: "He laughs, and stops." }, "If you can show me where the gold goes. I do not like a friend who does not come for dinner."], { cha: 9, set: "kessler_help", obj: "so3" })
          ], { label: "Talk to Herr Kessler", name: "Herr Kessler", bye: ["A pleasure. Do come to a show."] }),
          K.find("Open the ledger on the desk", "iq", "easy", "A ledger of the club's money. Every night, the same coins, pre-war gold, in the same number, come in by the box office, and go out the same way, to a name that is only a mark: a small circle, with a line through it. The books balance perfectly.", "A tidy ledger.", { clue: "c_price", obj: "so3", hint: "Easy", tags: ["bargain"] }),
          K.go("Back to the Institute", "lab")] },
      lathe: { name: "The recording lathe", theme: "interior", mood: "weird", lighting: "normal", weather: "none", cast: ["anton"],
        onEnter: [{ once: "in", steps: [{ say: "A soundproofed lab room lined with felt, a recording lathe, a copper horn, a stack of wax cylinders each labelled with a date, and a one-handed man in an apron who is running a cylinder backwards and watching the needle with great care." }] }],
        options: [
          K.ask("anton", [
            K.t("What are you playing?", ["Last night's silence, backwards. It does something to the room. Not quite a sound. A sort of pressure, as if the wall were being very politely pushed. I think it hurts it. I think it is the only thing I have found that does."], { free: true, clue: "c_record", obj: "so2" }),
            K.t("Could we use it in the club?", "With a big enough horn, yes. And with someone running the lathe who does not mind the thing noticing. I would do it. I lost my ear to the war. I have nothing left to listen with that it can take.", { free: true, set: "anton_help" }),
            K.t("What did you hear in the war?", [{ say: "He lifts the needle." }, "The Hush, at Ypres. I gave it my hand to let go of me. I think it was the one it wanted. I have been waiting seven years for it to come and finish the job."], { cha: 8, clue: "c_same" })
          ], { label: "Talk to Anton", name: "Anton", bye: ["Keep the horn pointing at it."] }),
          K.find("Play the backwards cylinder", "awareness", "medium", "The needle runs the wax in reverse, and the room does something you cannot name. A pressure on the eardrums, a roughness in the quiet, like a hand against a pane of glass. Somewhere in the walls, for a second, something steps back.", "Hiss, and a faint hum.", { clue: "c_record", hint: "Awareness, Medium", tags: ["record"] }),
          K.go("To the Stille Stunde, tonight", "stage", { if: { all: [{ clue: "c_record" }, { clue: "c_door" }, { clue: "c_price" }] } }),
          K.go("Back to the Institute", "lab")] },
      stage: { name: "The Stille Stunde, eleven o'clock", theme: "interior", mood: "boss", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Eleven o'clock. The red lamps dim. A hundred faces turn to the little stage. Magda steps out in her black dress, and opens her mouth, and the sound goes out of the room like water out of a basin. At the edge of the light, behind her, something tall and attentive stands with its head on one side." },
          { objective: "po1" }] }],
        options: [
          { label: "Run Ilse's recording backwards through a horn, and break the silence", hint: "Needs Ilse, Anton and the cylinder", if: { all: ["ilse_help", "anton_help", { obj: "so2" }] }, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Rig the horn, and run the cylinder backwards at the exact moment the silence begins", who: "choose", tags: ["record"],
            ok: [{ say: "Anton starts the lathe backwards. The horn, hidden in the stage curtain, sends a roughness out into the quiet. The tall shape flinches. The audience, who have not heard anything for a month, hear something. A woman laughs. A man swears. In the third row, Frau Lindqvist stands up and says, very clearly, her husband's name. The silence tears like a sheet." }, { set: "res_record" }, { objective: "po2" }, { arcSet: "recorded" }, { goto: "end" }],
            fail: [{ say: "The horn feeds back. For a second, the silence is complete." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Win the audience: stand and make the whole room speak", hint: "Needs Magda or Frau Lindqvist", if: { any: ["magda_help", "frau_help"] }, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Stand up in the silence, and get a hundred people to say what they did not say", who: "choose", tags: ["talk", "refuse"],
            ok: [{ say: "You stand in the dark, and in the silence, and say aloud the last thing you did not say to someone. It costs you something. Magda, on the stage, begins to sing, badly. A woman in the third row says her husband's name. A man laughs. In a minute the whole cellar is speaking, all at once, about nothing, and the tall quiet thing at the edge of the light has nothing left to listen for." }, { set: "res_speak" }, { objective: "po2" }, { arcSet: "spoke" }, { goto: "end" }],
            fail: [{ say: "Your voice is the only sound in the room, and it is gone in a breath." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Face it on the stage", steps: [{ set: "res_fight" }, { combat: "club", win: [{ say: "The room breathes in, and out, and the whole audience claps, uncertainly, and then does not stop." }, { objective: "po2" }, { arcSet: "fought3" }, { goto: "end" }] }] }] },
      end: { name: "The Stille Stunde, after midnight", theme: "interior", mood: "calm", lighting: "normal", weather: "rain",
        onEnter: [{ once: "in", steps: [
          { say: "After midnight, the cellar is empty and loud with the sound of chairs. Somewhere down the street a drunk is singing. Kessler counts the till and finds, for the first time, only paper. Magda sits on the edge of the stage with her gloves off and her feet bare, and hums a tune you do not recognise." },
          { if: { flag: "res_record" }, then: [{ say: "You ran it backwards. Ilse keeps the cylinder in a lead case. She says the silence on it is the only one in Berlin that has ever been afraid." }] },
          { if: { flag: "res_speak" }, then: [{ say: "You made the room speak. It was not a miracle. It was a hundred people, saying a hundred ordinary things. The club reopens as a cabaret, and Magda sings." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke it on the stage. It did not die. It went out through the cellar door, into the rain, and the whole street went quiet as it passed." }] },
          { if: { obj: "so1" }, then: [{ say: "Magda tells her story, and the second night she refuses the front row, and sings." }] },
          { if: { obj: "so2" }, then: [{ say: "Ilse's cylinders are copied for every agency's archive. One of them is labelled in a tidy hand: 'For K.'" }] },
          { if: { obj: "so3" }, then: [{ say: "Kessler burns his ledger, and starts a bakery, to the astonishment of everyone, including himself." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1937 · IV */
  reg({
    id: "qf-4-last-broadcast", title: "The Quiet Front IV: The Quiet Hour", setting: "Radio Station XQHA, Shanghai · August 1937", year: 1937, level: [3, 7], agencies: AG, region: "asia-east", theme: "street",
    summary: "Shanghai, August 1937. The city is under bombardment, and the people of the International Settlement have found one comfort: the Quiet Hour, eleven minutes at eleven each night when Station XQHA broadcasts nothing at all, and the neighbours in every flat, in every language, sit down together and are still. The announcer swears there is no such programme. The engineers say the carrier is on. Something is using the wireless to reach everyone at once.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find the source of the Quiet Hour", done: "The carrier wave of Station XQHA is being held open from somewhere that is not in the building: a loop of silence, sent out through the aerial, that every set in the city has begun to tune to by itself." },
      { id: "po2", kind: "primary", t: "Take the silence off the air", done: "The eleven o'clock quiet ends, and the radios of Shanghai are only radios again." },
      { id: "so1", kind: "secondary", t: "Hear the wireless operator's account", done: "Mieko Tanaka, who has listened to the carrier for six weeks, says the hush has a rhythm, a slow count, and that it is not counting seconds.", benefit: { label: "A true count", text: "You know its rhythm. A bonus on every roll to time your move.", bonus: { tags: ["carrier"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Get the announcer to read the true news", done: "Lin Yuhua agrees, once, to read a live bulletin in three languages at eleven, and finds the hush will not take a voice it cannot predict.", benefit: { label: "A trusted voice", text: "A voice the city listens to. A bonus on every roll to rally a crowd.", bonus: { tags: ["voice"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Find the tube that is not on the schematic", done: "Konstantin, the station's White Russian engineer, shows you a valve in the transmitter hall that nobody installed.", benefit: { label: "A foreign part", text: "You know where it is anchored. A bonus on every roll to cut or jam it.", bonus: { tags: ["jam"], value: 2 } } }
    ],
    clues: {
      c_hour: { t: "Eleven minutes, every night, on the dot", s: "The programme sheet", x: "The station's programme sheet shows no Quiet Hour. The announcer's logbook shows the microphone switched off at 10:59 and on at 11:11. In between, the carrier is open, and every receiver in the settlement is playing something that is not music, and not static, and not nothing." },
      c_count: { t: "It is counting, not timing", s: "Mieko's log", x: "Mieko's receiver log has a pencilled tally of the carrier's tiny fluctuations: a slow, steady count of what might be heartbeats. Forty thousand in eleven minutes. Every listener's, she thinks. Added up, and held." },
      c_tube: { t: "A valve that nobody installed", s: "Konstantin", x: "In the middle of the transmitter hall, between two perfectly standard rectifiers, a thermionic valve glows with a faint blue light. It is not on any schematic. It is warm to the touch when the carrier is open, and cold at all other times, and nobody on the staff remembers its being fitted." },
      c_loop: { t: "The silence arrives from outside, and goes round", s: "The aerial log", x: "The station's own aerial log shows the quiet coming in on the receiving side, not leaving on the sending side. It arrives from the harbour, in the dark, from a ship or a pole or a roof; the station only repeats it. It is not the transmitter. It is the receiver that is being listened through." },
      c_voice: { t: "It cannot predict a live human voice", s: "Lin's experiment", x: "Lin Yuhua, last Thursday, ad-libbed a lullaby into the open microphone at 11:02, as a joke. For four seconds, every radio in the settlement played it. For four seconds, the hush did not know what a song would do." },
      c_cut: { t: "The valve can be broken, and the aerial grounded", s: "The engineer's notes", x: "Konstantin's notes: break the valve, and ground the long-wire aerial for a minute, and the loop opens. It is not hard, he says. It is only that the hall is full, between 10:55 and 11:15, of men who no longer know why they are standing there." },
      c_same: { t: "It is the same silence, learning a wider room", s: "The agents' file", x: "Berlin, the Somme, Ward 9 and now a radio. The Hush has learned a trick: do not go to the quiet; make the quiet come to you. A broadcast reaches forty thousand homes, and a silence delivered to them is a larger feast than a shell-hole." }
    },
    npcs: {
      mieko: N("Mieko Tanaka", "Wireless operator", "Late twenties, a Japanese-born operator in a white blouse and a headset, with an inky pencil behind one ear and a carefully neutral face, who has been listening to the carrier for six weeks.", F(2, 1, "bob", 4, "none", { sex: "f" })),
      lin: N("Lin Yuhua", "Announcer", "Thirties, in a silk qipao and a fox-fur stole, with a silver microphone-brooch and a velvet, practised voice that has comforted the city every night for years.", F(2, 1, "bun", 2, "none", { sex: "f" })),
      konstantin: N("Konstantin Volkov", "Chief engineer", "Fifties, a White Russian in a stained cardigan over a collar and tie, with a soldering iron in his hand and a very dry sense of humour, who has been through two revolutions and does not scare easily.", F(1, 2, "short", 5, "none", { sex: "m" })),
      holt: N("Mr. Holt", "Station manager", "Forties, an Englishman in a tropical-weight suit and a club tie, with a ledger of advertising rates, a glass of whisky, and the brittle courtesy of a man who is certain this will all be settled by Friday.", F(0, 2, "short", 0, "none", { sex: "m" })),
      wen: N("Auntie Wen", "A listener", "Sixties, in a quilted jacket, sitting on a doorstep with a little wooden radio on her knees, perfectly still, with her eyes open and her teacup cold.", F(2, 4, "bun", 3, "none", { sex: "f" }))
    },
    enemies: {
      carrier: { build: { name: "The Carrier", type: "Beyond", difficulty: "dangerous", sprite: "spirit", hue: 215, dtype: "sanity", core: { body: 2, mind: 4, spirit: 4 }, mods: ["Occult", "Tanky"],
        text: "The Hush riding a wave. Broadcast: each round it hushes one zone of the field entirely (Willpower Medium, or lose the next action and 3 Sanity as your heartbeat is counted). It is hurt by a live voice and by a broken valve: a song, a shout or a cut wire gives everyone double damage against it. Only Sanity harms it.", dies: "the blue light goes out of the valve, and ten thousand radios across the city crackle, and play, very faintly, a waltz" } },
      hushed: { build: { name: "A hushed listener", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 210, attack: 1, dtype: "health", dies: "blinks, and puts down the receiver, and looks at the clock" } }
    },
    encounters: {
      hall: { name: "The transmitter hall", theme: "interior", fightText: "A long hall of racks and humming transformers, with thick cables overhead and the blue glow of a single valve in the middle. A dozen of the staff stand in a ring round the rack with their heads tilted, listening. In the glow of the valve, something tall and attentive stands with its head on one side.", zones: [{ id: "a", name: "The door", col: 0, row: 0 }, { id: "b", name: "The racks", col: 1, row: 0 }, { id: "c", name: "The valve", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "carrier", zone: "c" }, { t: "hushed", zone: "b" }, { t: "hushed", zone: "b", name: "A hushed listener (2)" }] }
    },
    start: "lobby",
    scenes: {
      lobby: { name: "Station XQHA, the lobby, Shanghai", theme: "interior", mood: "tense", lighting: "normal", weather: "rain", cast: ["holt"],
        onEnter: [{ once: "in", steps: [
          { say: "Shanghai, in August 1937. The Bund is a wall of gunboats and sandbags; across the Soochow Creek, Chapei burns. In the International Settlement, the cafés are full of every nation in the world, all pretending it is only weather. In a pale marble lobby on Avenue Edward VII, under a brass sunburst clock, a man in a tropical suit tries very hard to look unflustered." },
          { if: { arc: "recorded" }, then: [{ say: "In your case, wrapped in a handkerchief, Ilse Brandt's wax cylinder of the Berlin silence. She wrote on the label: 'In case it comes to a larger room.'" }, { clue: "c_count" }] },
          { if: { arc: "spoke" }, then: [{ say: "In your pocket, a note in Magda Weiss's hand, forwarded from Berlin: 'If you meet it in a wider room, speak, and make them speak. It cannot bear to be answered.'" }, { clue: "c_voice" }] },
          { talk: { npc: "holt", text: "There is no Quiet Hour. I should like that on the record. Every listener in the Settlement swears by it and I have the programme sheet to prove it does not exist. Nevertheless, our advertising revenue has doubled." } }] }],
        options: [
          K.ask("holt", [
            K.t("What is the Quiet Hour?", ["Eleven minutes at eleven. The microphone is off, and the carrier is on, and every set in the city plays something. Not music. Not static. Something so still it makes a room feel looked after. People write to thank us. I have no idea what to thank them for."], { free: true, clue: "c_hour" }),
            K.t("Who runs the station?", "Mr. Konstantin Volkov, my engineer. Miss Lin, my announcer. And Miss Tanaka, who monitors the carrier, and who, I am told, has the most unsettling log in the building.", { free: true, set: "contacts_known" }),
            K.t("Have you looked at the transmitter?", [{ say: "He glances at the lift." }, "Konstantin has. He says there is a valve in it that should not be. I told him to put it in the report. He told me what I could do with the report."], { cha: 7, clue: "c_tube" }),
            K.t("Will you help us?", "I will give you the run of the building. I will not give you the aerial. That is Konstantin's and he is armed.", { cha: 10, set: "holt_help" })
          ], { label: "Talk to Mr. Holt", name: "Mr. Holt", bye: ["Do mind the carpet."] }),
          K.find("Read the programme sheet", "iq", "easy", "A neat sheet of nightly programmes, from a Chopin recital to the shipping forecasts. At 11:00 every night, a blank. And in the margin beside the blank, in several different hands, in several different languages: 'Do not touch.'", "A very tidy sheet.", { clue: "c_hour", hint: "Easy" }),
          K.go("To the monitoring room", "monitor", { if: "contacts_known" }),
          K.go("To the studio, and Miss Lin", "studio", { if: "contacts_known" }),
          K.go("To the transmitter hall", "hall", { if: "contacts_known" }),
          K.go("To Auntie Wen's doorstep, in the lane", "lane", { if: "contacts_known" })] },
      monitor: { name: "The monitoring room", theme: "interior", mood: "weird", lighting: "normal", weather: "none", cast: ["mieko"],
        onEnter: [{ once: "in", steps: [{ say: "A small soundproofed room lined with felt and receivers, a ticking oscilloscope, a stack of logbooks, and a young woman in a headset who does not look up until the clock reaches the quarter-hour." }] }],
        options: [
          K.ask("mieko", [
            K.t("What do you hear?", ["A carrier with nothing on it, which is wrong by itself. And a count. A slow, regular fluctuation, like a heartbeat held very carefully. Forty thousand beats in eleven minutes. It is the whole settlement, I think. It is counting us."], { free: true, clue: "c_count", obj: "so1" }),
            K.t("Where does it come from?", "From outside the building. It comes in, on the receiving side, from somewhere in the harbour. We only repeat it. We are not the voice. We are the ear.", { free: true, clue: "c_loop" }),
            K.t("Why have you kept listening?", [{ say: "She takes off the headset, and holds it." }, "Because someone should. Because in this city every voice is shouting, and for eleven minutes, one thing is perfectly attentive. I have never been listened to like it. I am ashamed how much I like it."], { cha: 8, set: "mieko_help" })
          ], { label: "Talk to Miss Tanaka", name: "Miss Tanaka", bye: ["If you hear the count, do not count with it."] }),
          K.find("Read the carrier log", "iq", "medium", "A column of numbers in a careful hand, three weeks of nights. The heartbeats average seventy-one a minute, which is a living person's. It is the same average every night, to a decimal, however many are listening. It has learned the city's pulse, and it has set it as its own.", "A great many numerals.", { clue: "c_count", obj: "so1", hint: "Intelligence, Medium", tags: ["carrier"] }),
          K.go("Back to the lobby", "lobby")] },
      studio: { name: "Studio A", theme: "interior", mood: "calm", lighting: "normal", weather: "none", cast: ["lin"],
        onEnter: [{ once: "in", steps: [{ say: "A velvet-hung studio with a standing microphone, a baby grand, a shelf of gramophone records, and a glamorous woman in a fox-fur stole who is smoking, very elegantly, at an open window, and does not turn round when you come in." }] }],
        options: [
          K.ask("lin", [
            K.t("What do you know about the Quiet Hour?", ["That I do not read it. That I am told, every night at ten fifty-nine, to take my hand off the switch, and every night I have the strangest feeling that I should not be told. I have been announcing for nine years. I know when a room is listening."], { free: true, clue: "c_hour" }),
            K.t("Have you tried to speak into it?", "Once. Thursday. A joke, a lullaby, at 11:02. For four seconds the radios of Shanghai played it. Then it was gone. I have not been able to stop thinking how the silence went, for a moment, like a child.", { free: true, clue: "c_voice", obj: "so2" }),
            K.t("Would you read the news at eleven?", [{ say: "She stubs out the cigarette." }, "In three languages, live, with my own mouth. If Holt will let me. If he will not, I will do it from the roof."], { cha: 8, set: "lin_help" })
          ], { label: "Talk to Miss Lin", name: "Miss Lin", bye: ["Tune in. Tonight, if you can."] }),
          K.find("Search the announcer's script file", "awareness", "easy", "Folders of nightly scripts, annotated in a firm hand. The last folder is Thursday's. In the margin, in lipstick: 'It laughed.' And underneath, in a different pen: 'Do it again.'", "A file of scripts.", { clue: "c_voice", hint: "Easy" }),
          K.go("Back to the lobby", "lobby")] },
      hall: { name: "The transmitter hall", theme: "interior", mood: "dread", lighting: "shadow", weather: "none", cast: ["konstantin"],
        onEnter: [{ once: "in", steps: [{ say: "A long hall of racks and humming transformers, thick cables overhead, the smell of hot dust, and in the very middle, between two perfectly standard rectifiers, a single valve with a blue glow that does not match anything else in the room. A tall man in a cardigan sits beside it with a soldering iron and a pistol." }] }],
        options: [
          K.ask("konstantin", [
            K.t("What is the valve?", ["Not mine. Not anyone's. It is a thermionic valve, a very good one, better than any I have seen. It grew out of the rack like a mushroom out of a log, six weeks ago, the night the Quiet Hour began."], { free: true, clue: "c_tube", obj: "so3" }),
            K.t("Can it be broken?", "It can be broken, and the aerial grounded for a minute. Between ten fifty-five and eleven fifteen the hall is full of men who do not know why they are standing here. I have sat with them. They are very kind. They will not let me near.", { free: true, clue: "c_cut", set: "cut_known" }),
            K.t("Will you do it with us?", [{ say: "He puts down the iron, and picks up the pistol, and puts that down too." }, "I have been through two revolutions and I cannot stand a quiet room. Yes."], { cha: 8, set: "konstantin_help" })
          ], { label: "Talk to Konstantin", name: "Konstantin", bye: ["Bring a crowbar. And your voice."] }),
          K.find("Examine the valve", "iq", "medium", "A thermionic valve of an unfamiliar make, hot, with a blue glow, on no schematic. Etched into the glass in tiny characters, in no language, a single repeated mark: a head, tilted to one side. It is fed by a wire that runs not to the rack but up through the roof, to the long-wire aerial.", "A glowing glass bulb.", { clue: "c_tube", hint: "Intelligence, Medium", tags: ["jam"] }),
          K.go("Up to the roof, at eleven", "roof", { if: { all: [{ clue: "c_loop" }, { clue: "c_cut" }, { clue: "c_voice" }] } }),
          K.go("Back to the lobby", "lobby")] },
      lane: { name: "A lane behind the Settlement", theme: "street", mood: "weird", lighting: "normal", weather: "rain", cast: ["wen"],
        onEnter: [{ once: "in", steps: [{ say: "A narrow lane of tiled roofs and drying washing, a door with a red paper charm, and an old woman on the step in a quilted jacket with a wooden radio on her knees. She is perfectly still. She has been still, her neighbour says, since last night." }] }],
        options: [
          K.ask("wen", [
            K.t("Can you hear me?", ["Yes. I can hear you. I can hear everything. It is only that I do not need to answer. It is so quiet. It is the quietest I have been since the war began."], { free: true, clue: "c_hour" }),
            K.t("What do you hear in the quiet?", "Everyone. All of us. Breathing. One breath, in the whole city. It is the kindest thing I have ever heard. I do not think it wants anything. I think it only likes us.", { free: true, clue: "c_count" }),
            K.t("Will you speak tonight?", [{ say: "A faint smile." }, "If the girl on the wireless does. I always answer her."], { cha: 7, set: "wen_help" })
          ], { label: "Talk to Auntie Wen", name: "Auntie Wen", bye: ["Do not wake the neighbours."] }),
          K.find("Look at the radio on her knee", "awareness", "easy", "A small wooden radio, switched off at the wall. It is playing, in a very low voice, at no station, the sound of eleven minutes of listening. When you turn the dial, it follows.", "A small wooden radio.", { clue: "c_loop", hint: "Easy" }),
          K.go("Back to the lobby", "lobby")] },
      roof: { name: "The aerial roof, 11:00 p.m.", theme: "street", mood: "boss", lighting: "dark", weather: "rain",
        onEnter: [{ once: "in", steps: [
          { say: "Eleven at night, the roof of Station XQHA, the long-wire aerial stretched between two masts against a sky lit by distant fire. Below, in the hall, the blue glow of the valve. Across the city, in forty thousand rooms, the microphone is off and every wireless is playing eleven minutes of attention, and the whole of Shanghai holds its breath." },
          { objective: "po1" }] }],
        options: [
          { label: "Break the valve and ground the aerial", hint: "Needs Konstantin, the cut and the count", if: { all: ["konstantin_help", "cut_known", { obj: "so3" }] }, steps: [{ check: { aspect: "agility", cr: "challenging", label: "Swing across the mast, ground the aerial and break the valve before the quarter-hour", who: "choose", tags: ["jam", "carrier"],
            ok: [{ say: "Konstantin breaks the valve with a spanner. You swing out along the long-wire and ground it against the mast. The blue light goes out. In forty thousand rooms, in six languages, ten thousand radios crackle, and play, very faintly, a waltz. On the doorstep in the lane, Auntie Wen puts her cup down, and sneezes." }, { set: "res_cut" }, { objective: "po2" }, { arcSet: "cut" }, { goto: "end" }],
            fail: [{ say: "The aerial arcs. The wire sings, then falls silent, all at once." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Go on the air live, in three languages, at eleven", hint: "Needs Lin and the voice", if: { all: ["lin_help", { obj: "so2" }] }, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Get a live voice into every set before the hush closes", who: "choose", tags: ["voice", "talk"],
            ok: [{ say: "Lin Yuhua steps up to the microphone at 11:00 and reads the news, in three languages, in her own slightly shaking voice, and then, because she cannot help it, a lullaby. In every room in the settlement, the neighbours hear one real voice, and begin to answer it. By 11:08 there are forty thousand people talking. The carrier, which has never been spoken to by its listeners, does not know what to do." }, { set: "res_voice" }, { objective: "po2" }, { arcSet: "voiced" }, { goto: "end" }],
            fail: [{ say: "Your voice is a single thread in a very large silence." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Face it in the transmitter hall", steps: [{ set: "res_fight" }, { combat: "hall", win: [{ say: "The blue light goes out of the valve, and ten thousand radios across the city crackle, and play, very faintly, a waltz." }, { objective: "po2" }, { arcSet: "fought4" }, { goto: "end" }] }] }] },
      end: { name: "Station XQHA, the lobby, dawn", theme: "interior", mood: "calm", lighting: "normal", weather: "rain",
        onEnter: [{ once: "in", steps: [
          { say: "Dawn over the Bund, with the distant guns on the other side of the river, and, in the lobby of Station XQHA, the unfamiliar sound of an ordinary radio playing a very bad band. Holt pours the first whisky of the morning and looks at it for a long time." },
          { if: { flag: "res_cut" }, then: [{ say: "You cut it off at the root. The valve is in a jar on Konstantin's desk, and has not glowed since. The Quiet Hour never returns, and some people write to ask for it back." }] },
          { if: { flag: "res_voice" }, then: [{ say: "You answered it, with a city. Lin Yuhua's bulletin is repeated on every station, and the Quiet Hour is replaced, at eleven, with a lullaby, which all of Shanghai knows." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You faced it in the hall. It was not killed. It slid out through the aerial in the dark, towards the sea." }] },
          { if: { obj: "so1" }, then: [{ say: "Mieko Tanaka keeps the log. She learned something about herself in the carrier, and does not say what." }] },
          { if: { obj: "so2" }, then: [{ say: "Lin Yuhua is offered a new contract in three languages, and signs in all of them." }] },
          { if: { obj: "so3" }, then: [{ say: "Konstantin says he will install a loud valve, to keep the quiet one company." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1940 · V */
  reg({
    id: "qf-5-blackout-choir", title: "The Quiet Front V: The Blackout Choir", setting: "Marlowe Road deep shelter, London · December 1940", year: 1940, level: [4, 7], agencies: AG, region: "europe", theme: "cellar",
    summary: "London, December 1940. In the Marlowe Road deep shelter, four thousand people sleep on bunks between the raids. The shelter has a choir, because someone started singing on the first night and nobody has been able to stop. But between the Raiders Passed and the All Clear there are eleven minutes of perfect quiet, and in them, one bunk at a time, people stop singing and do not wake. The matron on the first-aid post is a woman you have met before.",
    objectives: [
      { id: "po1", kind: "primary", t: "Learn why it comes between the sirens", done: "The Hush has found the one place where the world holds its breath on a timetable: the minutes after the raiders pass and before the all-clear sounds. Everyone waits. It waits with them." },
      { id: "po2", kind: "primary", t: "Make the shelter safe from the quiet", done: "The eleven minutes are filled, or taken, or turned. Nobody sleeps through them who will not wake." },
      { id: "so1", kind: "secondary", t: "Hear the choirmaster's secret", done: "Mr. Pike, who has led the shelter in song for ninety nights, is going deaf. The Hush has been taking a little of his hearing every night in exchange for the choir's survival, and he agreed.", benefit: { label: "A bargain known", text: "You know what it has been given. A bonus on every roll to refuse it.", bonus: { tags: ["refuse"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Get the warden's torch and her log", done: "Mrs. Dobbs, the warden, logs every siren to the second. Her log shows the quiet is not eleven minutes but is stretching: three more seconds a night.", benefit: { label: "Light and time", text: "A torch, and a clock. A bonus on every roll made in the dark tunnels.", bonus: { tags: ["dark"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Persuade Ilse Brandt to come down", done: "Dr. Ilse Brandt, who works for the Admiralty now, brings her field recorder to the shelter and sits through the quiet with it, for the first time in her life not afraid of what it will hear.", benefit: { label: "An ear", text: "A scientist who has heard it before. A bonus on every roll to read the quiet.", bonus: { tags: ["listen"], value: 2 } } }
    ],
    clues: {
      c_gap: { t: "It comes between Raiders Passed and All Clear", s: "Mrs. Dobbs' log", x: "The warden's log shows the quiet starts at the moment the sirens give Raiders Passed, and ends when the All Clear sounds. It used to be eleven minutes. It is now eleven minutes and fifty-one seconds. It has been growing, by three seconds a night, since the first of October." },
      c_choir: { t: "The choir is the only thing it respects", s: "Edith's post notes", x: "No one who stood with the choir in the quiet has been lost. Everyone lost slept on the far side of the shelter, away from the singing. The Hush cannot be where a hundred people are making noise on purpose. It is gathering where they have stopped." },
      c_deaf: { t: "Pike has been going deaf", s: "Mr. Pike", x: "Pike, the choirmaster, has been losing his hearing a little each night. He says he made a bargain on the first night of the raids: the choir would live if he gave it his ears, a little at a time. It agreed, and it has been very patient." },
      c_sleep: { t: "They do not die, they fall asleep for ever", s: "Matron Marlow", x: "The ones lost in the quiet have no injury, no sign of gas or fire. They lie smiling on their bunks with their hands folded. Matron Marlow has seen it in a field hospital in France, twenty-two years ago, and again in a lecture hall. She says it is not a death. It is a kind of listening that never stops." },
      c_tunnel: { t: "It lives in the disused tunnel", s: "The warden", x: "Beyond the last bunk, behind a sandbagged door, is a half-finished tunnel never opened to the public. The quiet seems to come from it, and return to it. At All Clear, it is always the last thing left, faintly, down there in the dark." },
      c_siren: { t: "The sirens are the clock it keeps", s: "Ilse's notes", x: "Ilse, in a note, says the Hush is not tied to the shelter but to the sirens. It is learning the signal that tells four thousand people to hold their breath together, on a timetable. A siren can be sounded early, or late, or by hand, and she thinks that would break its reckoning." },
      c_same: { t: "It has followed the same people for twenty-four years", s: "The agents' file", x: "The Somme, the grey ward, Berlin, Shanghai, London. It is always in the moment a great crowd holds still. It is learning how many it can take at once. Every year the quiet is a little bigger. This winter, it has four thousand in a single room, on a timetable, and nothing to do but wait." }
    },
    npcs: {
      edith: N("Matron Edith Marlow", "First-aid post matron", "Fifty, in a navy matron's uniform with a Red Cross armband and a tin hat on a peg, grey at the temples, very upright, with the same steady hands and an expression of enormous, tested kindness.", F(1, 3, "bun", 4, "none", { sex: "f" })),
      pike: N("Mr. Pike", "The choirmaster", "Sixties, a bus conductor in his old uniform with a ticket punch on a string, conducting with a rolled-up newspaper, with a great gentle voice and a hand cupped, now and then, to one ear.", F(2, 3, "short", 5, "none", { sex: "m" })),
      dobbs: N("Mrs. Dobbs", "ARP warden", "Forties, in a boiler suit and a white tin helmet marked W, with a whistle, a clipboard and a torch the size of a rolling pin, who has not lost an air-raid since the first night and does not intend to.", F(1, 3, "short", 3, "none", { sex: "f" })),
      ilse: N("Dr. Ilse Brandt", "Admiralty acoustician", "Forty, in a tweed coat and a headscarf, with a field recorder in a leather case, a very precise manner, a new accent and a photograph she keeps in a pocket.", F(1, 2, "bun", 2, "none", { sex: "f" })),
      tommy: N("Tommy", "A child, awake", "Nine, in a jersey and short trousers and a gas-mask case on a string, sitting up very straight on a bunk, wide-eyed, who has noticed what the grown-ups have decided not to.", F(1, 1, "short", 5, "none", { sex: "m" }))
    },
    enemies: {
      interval: { build: { name: "The Interval", type: "Beyond", difficulty: "dangerous", sprite: "spirit", hue: 220, dtype: "sanity", core: { body: 2, mind: 4, spirit: 4 }, mods: ["Occult", "Tanky"],
        text: "The Hush between the sirens, with a whole shelter to hold. Wait: each round it makes one sleeper smile and lie down (Willpower Medium, or lose the next action and 3 Sanity as the listening takes hold). It is hurt by a choir and by an early siren: a song, a rung bell or a hand-sounded alarm gives everyone double damage against it. Only Sanity harms it.", dies: "the long quiet breaks off, mid-breath, and somewhere above, very faintly, the All Clear begins to sound" } },
      sleeper: { build: { name: "A smiling sleeper", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 215, attack: 1, dtype: "health", dies: "wakes, and says sorry for the trouble, and asks for a cup of tea" } }
    },
    encounters: {
      tunnel: { name: "The unopened tunnel", theme: "cellar", fightText: "A long, half-finished tunnel in the dark, bare concrete and exposed rock, with bunks laid out in rows that nobody put there. Hundreds of sleepers lie on them in perfect rows, smiling, their hands folded. At the far end, under a single bare bulb, something tall and still stands with its head tilted, waiting for the All Clear.", zones: [{ id: "a", name: "The sandbagged door", col: 0, row: 0 }, { id: "b", name: "The bunks", col: 1, row: 0 }, { id: "c", name: "The far end", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "interval", zone: "c" }, { t: "sleeper", zone: "b" }, { t: "sleeper", zone: "b", name: "A smiling sleeper (2)" }] }
    },
    start: "shelter",
    scenes: {
      shelter: { name: "Marlowe Road deep shelter, London", theme: "cellar", mood: "tense", lighting: "normal", weather: "none", cast: ["edith"],
        onEnter: [{ once: "in", steps: [
          { say: "London, in December 1940. Ninety nights of the Blitz. In a deep shelter under a Tube station, four thousand people sleep on triple-tiered bunks under bare bulbs, with the thump of the bombs coming faintly down through eighty feet of earth, and a smell of tea, damp wool and disinfectant." },
          { if: { arc: "noise" }, then: [{ say: "Matron Marlow has put a gramophone on the first-aid post, 'in memory of Ward 9, and the man who got it for us'. She nods to you, and very slightly smiles." }] },
          { if: { arc: "voiced" }, then: [{ say: "On the shelter's tannoy, someone has been playing, every night at eleven, a lullaby in three languages. It is from a station in Shanghai. Nobody knows how it got here." }] },
          { if: { arc: "cut" }, then: [{ say: "In Matron Marlow's drawer there is a small glass valve, labelled in Konstantin's hand: 'Warm, even now.'" }] },
          { talk: { npc: "edith", text: "I did not think I should see you again. I hoped not. Every night, between Raiders Passed and All Clear, my shelter goes quiet. And every night, one or two of my people do not wake. I would not have written, if I did not know exactly what it was." } }] }],
        options: [
          K.ask("edith", [
            K.t("What is happening?", ["They fall asleep in the quiet between the sirens, and do not wake. Smiling. No injury. No gas. Nine this week. It is so gentle that nobody has made a fuss. That is the worst of it. They think it is a good way to go."], { free: true, clue: "c_sleep" }),
            K.t("Who can we talk to?", "Mr. Pike, who runs the choir. Mrs. Dobbs, the warden, who knows every minute of every raid. Dr. Brandt at the Admiralty, if she will come. And Tommy, a child on the third tier, who has noticed.", { free: true, set: "contacts_known" }),
            K.t("Is it the same thing?", [{ say: "She folds her hands, and the tremor stops." }, "Yes. It has followed us for twenty-four years, I think. It is always where a crowd stops to wait."], { cha: 7, clue: "c_same" }),
            K.t("What do you need from us?", "Do not make a speech. Do not make a fuss. Keep my people singing, and keep my shelter from learning why.", { cha: 10, clue: "c_choir", set: "edith_help" })
          ], { label: "Talk to Matron Marlow", name: "Matron Marlow", bye: ["Mind the sleepers. Do not wake the ones who smile."] }),
          K.find("Read the first-aid post's night register", "iq", "easy", "A register of every night since September. A column of 'Lost' beside the date, in numbers climbing slowly: 1, 1, 2, 2, 3. And beside each, a small clock, drawn in the matron's hand, with its hands set to the same time: the end of the quiet.", "A very long register.", { clue: "c_sleep", hint: "Easy" }),
          K.go("To the choir, in the long gallery", "choir", { if: "contacts_known" }),
          K.go("To the warden's post", "warden", { if: "contacts_known" }),
          K.go("To the third-tier bunks, and the child", "bunk", { if: "contacts_known" }),
          K.go("To the Admiralty, to fetch Dr. Brandt", "admiralty", { if: "contacts_known" })] },
      choir: { name: "The long gallery, the choir", theme: "cellar", mood: "calm", lighting: "normal", weather: "none", cast: ["pike"],
        onEnter: [{ once: "in", steps: [{ say: "A long arched gallery of whitewashed brick, rows of bunks, and a hundred people in dressing-gowns and overcoats sitting up in the lamplight singing 'Roll Out the Barrel', conducted with a rolled-up Daily Mirror by a very old bus conductor, who turns, with a tilted head, to listen to you." }] }],
        options: [
          K.ask("pike", [
            K.t("How did the choir begin?", ["The first night. The ceiling shook, and a woman started to cry, and I could not think of anything to do but sing. It worked. It kept the whole gallery together. We have not missed a night since."], { free: true, clue: "c_choir" }),
            K.t("What do you hear at the end of the raid?", "Less every night. I will tell you plainly: I am going deaf. A little each night. I made a bargain the first night, in the dark. I did not know who with.", { free: true, clue: "c_deaf", obj: "so1" }),
            K.t("Will you keep the choir singing through the quiet?", [{ say: "He cups a hand to his ear, and nods very slowly." }, "If they sing in the quiet, it cannot have them. That is what I was given to understand. I would give the rest of my hearing, for that."], { cha: 8, set: "pike_help" })
          ], { label: "Talk to Mr. Pike", name: "Mr. Pike", bye: ["Sing up! Sing up!"] }),
          K.find("Watch the choir through the end of a raid", "awareness", "medium", "As the sirens give Raiders Passed, the choir falters, and falls silent, and at the far end of the gallery, where nobody is singing, one by one the sleepers lie back. Where the singing continues, nobody lies back. It is the clearest line you have ever seen drawn in a room.", "A choir of a hundred voices.", { clue: "c_choir", hint: "Awareness, Medium", tags: ["listen"] }),
          K.go("Back to the first-aid post", "shelter")] },
      warden: { name: "The warden's post", theme: "cellar", mood: "tense", lighting: "shadow", weather: "none", cast: ["dobbs"],
        onEnter: [{ once: "in", steps: [{ say: "A small brick cubby by the lift shaft, with a telephone, a map of the borough, a clipboard hung on a nail, a gas rattle on a hook and a woman in a boiler suit and a white helmet, writing in a log without looking at the page." }] }],
        options: [
          K.ask("dobbs", [
            K.t("You log every siren?", ["To the second. The Raiders Passed signal. The All Clear. I know the lot. The quiet in between was eleven minutes in October. It is eleven minutes and fifty-one seconds now. Three seconds more each night. I do not like arithmetic that goes the wrong way."], { free: true, clue: "c_gap", obj: "so2" }),
            K.t("Where does the quiet go?", "Down the tunnel. The half-finished one, past the last bunk. I have been down there. It is not empty. There are bunks. Rows of bunks. Nobody put them there.", { free: true, clue: "c_tunnel" }),
            K.t("Can we sound the siren early?", [{ say: "She taps her whistle." }, "By hand? There is a hand-siren at the top of the lift. Against regulations. I will go to prison, I expect. I will do it."], { cha: 8, set: "dobbs_help", clue: "c_siren" })
          ], { label: "Talk to Mrs. Dobbs", name: "Mrs. Dobbs", bye: ["Mind the dark. Take a torch."] }),
          K.find("Read the warden's log", "iq", "easy", "A log of ninety nights, in a neat blunt hand. 'Raiders Passed 11.41. All Clear 11.53 and 51 seconds.' Down the page, the gap grows by three seconds each night, in a column that ends, a week hence, in a number she has circled in red: the end of the year.", "A very long log.", { clue: "c_gap", obj: "so2", hint: "Easy", tags: ["dark"] }),
          K.go("Back to the first-aid post", "shelter")] },
      bunk: { name: "The third tier", theme: "cellar", mood: "weird", lighting: "shadow", weather: "none", cast: ["tommy"],
        onEnter: [{ once: "in", steps: [{ say: "A third-tier bunk under the curve of the roof, a blanket pulled up to the chin, a gas-mask case, and a small boy sitting very upright, wide awake, with his eyes fixed on the dark gap at the end of the gallery." }] }],
        options: [
          K.ask("tommy", [
            K.t("What have you seen?", ["It stands at the end. When the siren stops. It is tall, and it is not a man. It listens. And the people who stop singing go to it, in their sleep, a little. Like when you go to the sweet shop, but slower."], { free: true, clue: "c_tunnel" }),
            K.t("Why aren't you asleep?", "I sing. Under the blanket. Very quiet, so the grown-ups do not mind. Mummy said it keeps the bombs off, and she was right, and I think she meant something else.", { free: true, clue: "c_choir" }),
            K.t("Will you help us?", [{ say: "He thinks about it very seriously." }, "I will tell the others to sing. If it is only me, they will say I am a baby. If you tell them, they will."], { cha: 7, set: "tommy_help" })
          ], { label: "Talk to Tommy", name: "Tommy", bye: ["Do not look at the end of the gallery. It looks back."] }),
          K.find("Look at the end of the gallery from his bunk", "awareness", "medium", "From the top bunk, at the very end of the long dark, past the last row of sleepers, a doorway with sandbags, and a very faint movement, like someone breathing in. You realise you are being counted.", "Bunks, and a long dark gallery.", { clue: "c_tunnel", hint: "Awareness, Medium", tags: ["dark", "listen"] }),
          K.go("Back to the first-aid post", "shelter")] },
      admiralty: { name: "A requisitioned flat in Whitehall", theme: "interior", mood: "calm", lighting: "normal", weather: "none", cast: ["ilse"],
        onEnter: [{ once: "in", steps: [{ say: "A drab second-floor flat above a chemist's, the blackout curtains drawn, wires and hydrophone cables across the carpet, a field recorder open on the table and a woman in a tweed coat and a headscarf who looks up with a start, and then, slowly, with relief." }] }],
        options: [
          K.ask("ilse", [
            K.t("You came to London?", ["In thirty-eight. It was time. I work for the Admiralty now, on hydrophones: listening for submarines in the dark. It is, I am aware, a very silly joke. I spent seven years listening to nothing. Now I listen to the sea."], { free: true, clue: "c_siren" }),
            K.t("Is it the same thing?", "It is the same animal, and it has learned to read a timetable. It is not hunting the dead any more. It is hunting the waiting. The thing that holds a city's breath is the thing it likes best.", { free: true, clue: "c_same" }),
            K.t("Will you come to the shelter?", [{ say: "She closes the recorder, and opens it again." }, "I have never once been afraid of what I would hear. I am afraid now. Yes. I will come."], { cha: 7, set: "ilse_help", obj: "so3" })
          ], { label: "Talk to Dr. Brandt", name: "Dr. Brandt", bye: ["Do not let them stop singing."] }),
          K.find("Read Ilse's notes on the timetable", "iq", "medium", "Ilse's notes: the Hush is not a place but a rhythm. It keeps time with whatever a crowd does together. A siren, a bell, a broadcast, a march. If the signal comes early, or late, or from the wrong place, it loses count, and it loses the room.", "A great deal of shorthand.", { clue: "c_siren", hint: "Intelligence, Medium", tags: ["listen"] }),
          K.go("Down to the unopened tunnel, tonight", "dark", { if: { all: [{ clue: "c_gap" }, { clue: "c_tunnel" }, { clue: "c_choir" }] } }),
          K.go("Back to the first-aid post", "shelter")] },
      dark: { name: "The unopened tunnel, All Clear minus one minute", theme: "cellar", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Raiders Passed. The sirens fall away, and the choir, in the gallery behind, stops. Beyond the sandbagged door, in the half-finished tunnel, the bare bulbs burn very small, and in rows on the bunks nobody put there, hundreds of sleepers lie smiling with their hands folded, and at the far end something tall stands, with its head tilted, waiting for the All Clear." },
          { objective: "po1" }] }],
        options: [
          { label: "Bring the whole shelter into the tunnel, singing", hint: "Needs Pike, Tommy and Edith", if: { all: ["pike_help", "tommy_help", "edith_help"] }, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Lead four thousand people down the tunnel in song", who: "choose", tags: ["talk"],
            ok: [{ say: "Tommy starts it, under his breath. Pike picks it up. Matron Marlow leads the first-aid post. In the gallery, a hundred voices, then a thousand, then four thousand, come down the long concrete tunnel together, in the dark, singing, and they walk past the sleepers, and every sleeper they pass, one by one, opens their eyes. The tall quiet thing at the end of the tunnel has nothing to wait for. It has been out-waited." }, { set: "res_choir" }, { objective: "po2" }, { arcSet: "choir" }, { goto: "end" }],
            fail: [{ say: "Two verses in, the song falters. The quiet closes round the lamp." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Sound the siren by hand, early, from the top of the lift", hint: "Needs Mrs. Dobbs, and the timetable", if: { all: ["dobbs_help", { clue: "c_siren" }] }, steps: [{ check: { aspect: "strength", cr: "challenging", label: "Wind the hand-siren in the dark, and sound the All Clear a minute early", who: "choose", tags: ["dark"],
            ok: [{ say: "Mrs. Dobbs winds the old hand-siren at the top of the lift. The All Clear, a minute early, wails out across the borough. The Hush, which has been counting seconds for ninety nights, loses its reckoning. In the tunnel, the sleepers wake in the middle of a yawn, and swear, and look for their shoes. At the far end, the tall thing finds itself waiting for a moment that has already gone by." }, { set: "res_siren" }, { objective: "po2" }, { arcSet: "siren" }, { goto: "end" }],
            fail: [{ say: "The siren rasps, and sticks. The quiet goes on." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Go to the end of the tunnel, and face it", steps: [{ set: "res_fight" }, { combat: "tunnel", win: [{ say: "The long quiet breaks off, mid-breath, and somewhere above, very faintly, the All Clear begins to sound." }, { objective: "po2" }, { arcSet: "fought5" }, { goto: "end" }] }] }] },
      end: { name: "Marlowe Road shelter, the morning", theme: "cellar", mood: "calm", lighting: "normal", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Morning, and the first grey light coming down the lift-shaft. Four thousand people queue for tea, wash in a bucket and fold their blankets, and grumble about a long night. Matron Marlow stands on the top step with her cap off and counts them as they go up the stairs. Nobody is missing." },
          { if: { flag: "res_choir" }, then: [{ say: "You walked the choir down the tunnel. It has a name now, the Blackout Choir, and it sings in the shelter until the war is over." }] },
          { if: { flag: "res_siren" }, then: [{ say: "You sounded the All Clear early, and broke its reckoning. Mrs. Dobbs is fined five shillings, and has it framed." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You faced it in the dark. It was not killed. It went out through the end of the tunnel, into the earth, and the sleepers woke, every one, and wanted breakfast." }] },
          { if: { obj: "so1" }, then: [{ say: "Mr. Pike stays deaf. The choir has learned to conduct itself." }] },
          { if: { obj: "so2" }, then: [{ say: "Mrs. Dobbs has the log typed, and sent to the Ministry, who file it as 'Morale'." }] },
          { if: { obj: "so3" }, then: [{ say: "Ilse Brandt writes: 'I was not afraid. That is what I wanted to tell you. I was not afraid.'" }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1942 · VI */
  reg({
    id: "qf-6-silent-convoy", title: "The Quiet Front VI: The Silent Convoy", setting: "HMCS Larkspur, mid-Atlantic · March 1942", year: 1942, level: [4, 8], agencies: AG, region: "americas-north", theme: "sea",
    summary: "The North Atlantic, March 1942. Convoy ON-71 has been under wireless silence for nine days, to hide it from the U-boats. On the tenth night, in the air gap where no aircraft can reach, every ship in the convoy goes silent at 3:07: engines, screws, voices, the sea itself. In the morning a merchantman is found out of line with every man aboard sitting at his post, smiling, listening to nothing. Dr. Ilse Brandt's hydrophones are aboard the escort. She has recognised it.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find what is hiding in the convoy's silence", done: "The Hush has found the largest quiet in the world, a thousand miles of ocean, forty ships, and an order from the Admiralty that every one of them keep very still and say nothing. It is at home." },
      { id: "po2", kind: "primary", t: "Break the silence without sinking the convoy", done: "The ships hear one another again. The convoy keeps its station, and the sea, for the first time in nine nights, makes a noise." },
      { id: "so1", kind: "secondary", t: "Hear the sonar operator's night", done: "Able Seaman Delorme, the Asdic operator, has heard the quiet from the inside: a single enormous attentive ping, from below, answering the convoy's pings with its own silence.", benefit: { label: "A trained ear", text: "You know the shape of what answers. A bonus on every roll to read the sea.", bonus: { tags: ["sea"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Get the commodore's secret order book", done: "Commodore Haldane's order book shows the wireless silence was not the Admiralty's idea. It was suggested, in a very polite signal, by a station that does not appear on any chart.", benefit: { label: "A true order of battle", text: "You know who suggested the silence. A bonus on every roll to give orders.", bonus: { tags: ["order"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Bring the stewardess back from the drifter", done: "Mrs. Reilly, the stewardess of the drifting merchantman, is found awake in the galley, pouring tea for the silent crew. She is the only one who can say what they were told.", benefit: { label: "Someone who came back", text: "A witness. A bonus on every roll to talk the crew round.", bonus: { tags: ["talk"], value: 2 } } }
    ],
    clues: {
      c_gap: { t: "The silence began where the aircraft stop", s: "The commodore's plot", x: "The silence reached the convoy on the night it entered the mid-ocean air gap: eight hundred miles from any airfield on either side. For the first time in the war, no friendly ear above or below. It is only here that the Hush can reach the whole convoy at once." },
      c_station: { t: "The silence was suggested", s: "The signal log", x: "The Admiralty's order for complete wireless silence arrived in a signal with no originator, in a perfect hand, at the stroke of 3:07, nine nights ago. It did not come from London. It was written in the cipher, correctly, by someone who knew every key, and the cipher clerks all say it was very polite." },
      c_ping: { t: "The sea answers pings with a silence", s: "Delorme's Asdic log", x: "The Asdic ping goes out, as always, and instead of an echo, there is a space, shaped like a ship, and then like a larger ship, and then like the entire convoy. The sea is not empty. It has an inside, and the inside is listening back." },
      c_drifter: { t: "The drifter's crew are seated at their posts", s: "The boarding report", x: "The SS Anneliese Holt was found drifting, all lights on, every man aboard at his post: wheel, engine room, wireless, galley. All alive, all smiling, all still, all listening. None had eaten for three days. The only one who moved was the stewardess." },
      c_loud: { t: "It cannot bear the escort's depth charges", s: "The captain's log", x: "On the fourth night, a depth-charge pattern thrown at a false contact broke the quiet over the stern of the Larkspur for forty seconds. Everyone aboard heard the sea. The Hush, which has no ear for violence, drew back, as if burned, and then returned." },
      c_song: { t: "The lamps could sing", s: "Ilse's notes", x: "Ilse's note: the Hush rides the order of silence. A signal lamp, flashing a tune in Morse across the convoy, is not wireless and not sound. It is an answer in another medium. Forty ships, each repeating a song in lights, is a noise the silence has no ear for." },
      c_same: { t: "It is the same thing, grown very large", s: "The agents' file", x: "A shell-hole, a ward, a cellar, a radio, a shelter. Now a whole ocean. Every quiet the world holds is a place it can hide. And it is learning how to ask us for the quiet, in our own handwriting, in our own cipher." }
    },
    npcs: {
      rhodes: N("Lieutenant Commander Rhodes", "Captain, HMCS Larkspur", "Thirties, a Canadian reservist in a duffle coat and a battered cap, with binoculars on a cord, a steaming mug and the gentle gravity of a former schoolmaster who has spent three years doing something he never wanted to learn.", F(1, 2, "short", 0, "none", { sex: "m" })),
      delorme: N("Able Seaman Delorme", "Asdic operator", "Twenties, a Québécois in a heavy sweater and headphones, with a hand on the dial and a very still, very slightly haunted face, who hums, always, without noticing.", F(1, 1, "short", 5, "none", { sex: "m" })),
      haldane: N("Commodore Haldane", "Convoy commodore", "Sixties, a retired admiral in a greatcoat and a white scarf on the bridge of the lead merchantman, with an old-fashioned pipe, an order book and the unshakeable courtesy of the very old Navy.", F(0, 4, "short", 0, "none", { sex: "m" })),
      reilly: N("Mrs. Annie Reilly", "Stewardess of the Anneliese Holt", "Forties, in a stewardess's apron and a boiler-room cardigan, with a tray of cold tea and warm, fierce eyes, standing in the galley of a ship full of smiling, listening men.", F(1, 3, "bun", 3, "none", { sex: "f" })),
      ilse: N("Dr. Ilse Brandt", "Admiralty scientist", "Forty-one, in an oilskin and a woollen cap, with a hydrophone case lashed to the chart table and a thermos, who has not been seasick once and is quietly pleased about it.", F(1, 2, "bun", 2, "none", { sex: "f" }))
    },
    enemies: {
      deep: { build: { name: "The Silence Below", type: "Beyond", difficulty: "dangerous", sprite: "spirit", hue: 205, dtype: "sanity", core: { body: 3, mind: 4, spirit: 4 }, mods: ["Occult", "Tanky"],
        text: "The Hush, grown to the size of an ocean. Order: each round it asks one crew member to hold still (Willpower Medium, or lose the next action and 3 Sanity as the silence is obeyed). It is hurt by noise and by an answer in another medium: a depth charge, a lit song or a ping cuts its hold, and everyone takes double damage against it. Only Sanity harms it.", dies: "the sea gives one enormous groan, and then, very close, an ordinary gull" } },
      listener: { build: { name: "A listening hand", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 200, attack: 1, dtype: "health", dies: "sits down, rubs his eyes and asks whose watch it is" } }
    },
    encounters: {
      drifter: { name: "The SS Anneliese Holt", theme: "sea", fightText: "A tramp steamer, dead in the water, every light burning on a calm black sea. On the bridge, in the engine room, along the rail, the crew stand at their posts with their heads tilted, smiling. In the middle of the foredeck, above the hatch, something tall and quiet stands with its head on one side, listening to a whole ship hold its breath.", zones: [{ id: "a", name: "The gangway", col: 0, row: 0 }, { id: "b", name: "The deck", col: 1, row: 0 }, { id: "c", name: "The hatch", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "deep", zone: "c" }, { t: "listener", zone: "b" }, { t: "listener", zone: "b", name: "A listening hand (2)" }] }
    },
    start: "bridge",
    scenes: {
      bridge: { name: "The bridge of HMCS Larkspur", theme: "sea", mood: "tense", lighting: "normal", weather: "wind", cast: ["rhodes"],
        onEnter: [{ once: "in", steps: [
          { say: "The North Atlantic, in March 1942. Convoy ON-71: forty ships in nine columns, a thousand miles from anywhere, steaming westward under a low grey sky at nine knots, dark ships on a grey sea, all lights out and every wireless silent. On the bridge of the corvette Larkspur, the escort commander turns away from the binoculars and looks, very steadily, at you." },
          { if: { arc: "choir" }, then: [{ say: "Ilse has sent a message by hand: 'The shelter sang. Make the convoy sing.'" }, { clue: "c_song" }] },
          { if: { arc: "siren" }, then: [{ say: "Mrs. Dobbs has sent, in a package, her old whistle. 'If it is the same thing, blow it early.'" }, { clue: "c_loud" }] },
          { if: { arc: "fought5" }, then: [{ say: "Matron Marlow has sent a note, folded into a Red Cross tin: 'It was not killed. It went into the earth. I think it went to sea.'" }] },
          { talk: { npc: "rhodes", text: "Nine days of wireless silence. The Admiralty has ordered it. I have not been able to find the signal. And then last night the whole convoy went quiet at once, engines and screws and the very sea. I am a schoolmaster, not a sailor. I believe that I am being listened to." } }] }],
        options: [
          K.ask("rhodes", [
            K.t("What happened last night?", ["At 3:07 everything stopped. The engines. The screws. The sound of the water on the plates. Eleven minutes. In the morning we found the Anneliese Holt out of line, her whole crew at their posts, smiling. She had been dead in the water for a day."], { free: true, clue: "c_drifter" }),
            K.t("Who can we talk to?", "Delorme, the Asdic man, who heard it first. Commodore Haldane, who ordered the silence. Mrs. Reilly, the stewardess of the drifter, who is awake. And Dr. Brandt, who has hydrophones and a very odd history.", { free: true, set: "contacts_known" }),
            K.t("Where did the silence start?", [{ say: "He taps the plot." }, "In the air gap. Eight hundred miles from any aircraft, on either side. For the first time in the war nobody can see us, or hear us, or find us. I thought it was a gift."], { cha: 7, clue: "c_gap" }),
            K.t("What will you let us do?", "Anything that does not sink my convoy. I will not break formation. I will not break silence. Beyond that, I am a man very glad to see you.", { cha: 10, set: "rhodes_help" })
          ], { label: "Talk to Lieutenant Commander Rhodes", name: "Commander Rhodes", bye: ["Mind the rail. It is a long way down."] }),
          K.find("Read the night's log", "iq", "easy", "A log in a tidy schoolmaster's hand: 'Convoy in station, columns dressed. 03.06 all quiet. 03.07: silence. 03.18: engines resumed. Ten ships out of position.' Beneath, in his own hand, one line: 'I have never been so afraid of a flat calm.'", "A very tidy log.", { clue: "c_gap", hint: "Easy" }),
          K.go("To the Asdic hut", "asdic", { if: "contacts_known" }),
          K.go("To the commodore's ship, by boat", "commodore", { if: "contacts_known" }),
          K.go("To the drifting Anneliese Holt", "drifter_deck", { if: "contacts_known" }),
          K.go("To the hydrophone table", "table", { if: "contacts_known" })] },
      asdic: { name: "The Asdic hut", theme: "interior", mood: "weird", lighting: "shadow", weather: "none", cast: ["delorme"],
        onEnter: [{ once: "in", steps: [{ say: "A tiny steel hut on the bridge deck, an oscillating dial, a paper trace unrolling, a hot-valve smell, and a young man in headphones who hums a Breton lullaby without noticing, and looks round, with a start, when you come in." }] }],
        options: [
          K.ask("delorme", [
            K.t("What do you hear?", ["The ping goes out. The ping should come back. It does not. Instead, there is a space in the sea, the shape of a ship. Then of a bigger ship. Then of the convoy. It is not empty. It is the shape of listening."], { free: true, clue: "c_ping", obj: "so1" }),
            K.t("Does it frighten you?", "It should. It does not. It is so kind, in a way. It does not want the ships. It wants us to keep still, and be heard.", { free: true, clue: "c_gap" }),
            K.t("Would you ping it, on our word?", [{ say: "He stops humming." }, "If I ping it, it will know I am here. It knows already. I would like to give it something to answer."], { cha: 8, set: "delorme_help" })
          ], { label: "Talk to Able Seaman Delorme", name: "Delorme", bye: ["Do not listen too hard."] }),
          K.find("Read the paper trace", "iq", "medium", "A reel of Asdic trace, every ping a clean black line, and every echo a gap: a clean white shape on the black, a ship, then ships, then the whole convoy. A drawn silhouette of a fleet in blank paper. And beneath, one line, as if written by someone drawing with a ruler: 'Hold still.'", "A reel of paper, ticking.", { clue: "c_ping", hint: "Intelligence, Medium", tags: ["sea"] }),
          K.go("Back to the bridge", "bridge")] },
      commodore: { name: "The Commodore's cabin, SS Empire Garland", theme: "interior", mood: "calm", lighting: "normal", weather: "none", cast: ["haldane"],
        onEnter: [{ once: "in", steps: [{ say: "A wood-panelled cabin on the lead merchantman, a brass lamp, a chart table, a framed Trafalgar print, and a white-haired old gentleman in a greatcoat, who rises, very correctly, and offers you a chair and a ship's biscuit." }] }],
        options: [
          K.ask("haldane", [
            K.t("Who ordered the wireless silence?", ["The Admiralty. By signal, nine nights ago. A very proper signal. Every group correct. I did not like it. I have never in my life received an order so politely worded."], { free: true, clue: "c_station", obj: "so2" }),
            K.t("Why did you obey?", "Because it was the right thing to do. Because it came in the right cipher. Because a convoy that does not speak is a convoy the enemy cannot find. Because I am sixty-three, and I want to go home.", { free: true, clue: "c_gap" }),
            K.t("Will you give us the order book?", [{ say: "He takes a small brass key from his watch-chain." }, "If you tell me how to get my ships home. I will give you everything. I would very much like to be disobeyed."], { cha: 8, set: "haldane_help" })
          ], { label: "Talk to Commodore Haldane", name: "Commodore Haldane", bye: ["Keep station. Keep faith."] }),
          K.find("Read the signal book", "iq", "medium", "The signal that ordered silence, in a flawless hand. No originator. No time of origin. Only a time of receipt: 03:07. And a small flaw in the cipher, deliberate, like a tiny, polite, affectionate signature: a cipher group that, spelt out, reads 'Thank you for keeping still.'", "A very long book of signals.", { clue: "c_station", obj: "so2", hint: "Intelligence, Medium", tags: ["order"] }),
          K.go("Back to the bridge", "bridge")] },
      drifter_deck: { name: "The deck of the SS Anneliese Holt", theme: "sea", mood: "dread", lighting: "normal", weather: "none", cast: ["reilly"],
        onEnter: [{ once: "in", steps: [{ say: "A dead-calm sea, a rusty tramp steamer with every light burning, and a deck full of men standing at their posts: the helmsman at the wheel, the lookout at the rail, the stokers at the hatch. All of them smile. None of them look at you. In the galley doorway, a woman in a stewardess's apron pours tea into a row of cups." }] }],
        options: [
          K.ask("reilly", [
            K.t("What happened to them?", ["They were told to keep still. Not by anyone I saw. It was in the air. Like the hush after a hymn. They did, the first night, and the second. They do not mind. They are very happy. I keep making tea, so they remember what it is for."], { free: true, clue: "c_drifter", obj: "so3" }),
            K.t("Why not you?", "Because I was talking. Always. To the cook. To myself. To my sister in Cork, in my head, the whole way across. It could not get a word in. I think I am very annoying to it.", { free: true, clue: "c_loud" }),
            K.t("Will you talk to them for us?", [{ say: "She picks up the teapot." }, "Every day for the rest of my life, if it brings them back. I would sooner shout than let them sit like that."], { cha: 7, set: "reilly_help" })
          ], { label: "Talk to Mrs. Reilly", name: "Mrs. Reilly", bye: ["Mind the tea. It is the only warm thing on the ship."] }),
          K.find("Search the chart room for the last log", "awareness", "easy", "The ship's log, in a mate's confident hand. Eleven days of clean entries, and then an entry that ends in the middle of a word. Underneath, in a different hand, very neatly: 'It was so beautiful that I forgot to write.'", "A very damp log.", { clue: "c_drifter", hint: "Easy" }),
          K.go("Back to the bridge", "bridge")] },
      table: { name: "The hydrophone table", theme: "interior", mood: "calm", lighting: "normal", weather: "none", cast: ["ilse"],
        onEnter: [{ once: "in", steps: [{ say: "A cramped charthouse aft, a chart table, a bundle of cables lashed with spun-yarn, a hydrophone case wedged against the roll, and a woman in an oilskin, with a thermos and a wax cylinder in a lead case, who rises when you come in." }] }],
        options: [
          K.ask("ilse", [
            K.t("What do you hear?", ["The same thing. At the largest scale I have ever heard. It is not in the water. It is in the order that the water is expected to keep. A thousand miles of sea, being asked, very kindly, to hold still."], { free: true, clue: "c_same" }),
            K.t("How do we stop it?", "We give it an answer in a medium it does not expect. Light. Forty ships each flashing the same song with an Aldis lamp. It has an ear for sound and for wireless. I do not think it has an eye.", { free: true, clue: "c_song", set: "song_known" }),
            K.t("What would you use the cylinder for?", [{ say: "She opens the lead case." }, "It is the Berlin silence, run backwards. I could play it through the Asdic projector, into the sea. It would say, to the thing below: I know your name."], { cha: 8, set: "ilse_help", clue: "c_ping" })
          ], { label: "Talk to Dr. Brandt", name: "Dr. Brandt", bye: ["Light, not sound. Always, light."] }),
          K.find("Calibrate the hydrophone", "awareness", "medium", "A low continuous murmur, exactly like the sea, and under it, the same slow count you have heard in a ward, and a cellar, and a transmitter hall, one pulse after another, forty thousand heartbeats and then forty. They have become one.", "Water, and a faint hum.", { clue: "c_ping", hint: "Awareness, Medium", tags: ["sea"] }),
          K.go("Aboard the Anneliese Holt, at 3:07", "fight_deck", { if: { all: [{ clue: "c_ping" }, { clue: "c_gap" }, { clue: "c_song" }] } }),
          K.go("Back to the bridge", "bridge")] },
      fight_deck: { name: "The deck of the Anneliese Holt, 3:07", theme: "sea", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "3:07. The engines stop. The screws stop. The water stops slapping on the plates. All around, in the dark, forty ships hold perfectly still, a black fleet on a black sea, and in the middle of the foredeck of the Anneliese Holt, something huge and quiet stands with its head tilted, taking the whole ocean's attention." },
          { objective: "po1" }] }],
        options: [
          { label: "Sing it down: forty ships, forty lamps, one song", hint: "Needs the song, Rhodes and Haldane", if: { all: ["song_known", "rhodes_help", "haldane_help"] }, steps: [{ check: { aspect: "agility", cr: "challenging", label: "Run the signal lamps down the line before the hush closes", who: "choose", tags: ["order", "talk"],
            ok: [{ say: "Commodore Haldane gives the order, in the old way, by flag. Forty lamps wink, down the whole length of the convoy, flashing the same slow tune in Morse: 'Roses of Picardy'. The Hush, which has an ear for every sound and every signal on the sea, finds itself being answered in a language it has no ear for. For the first time in its life, it is being sung to." }, { set: "res_lamps" }, { objective: "po2" }, { arcSet: "lamps" }, { goto: "end" }],
            fail: [{ say: "Two lamps flash, and fail. The silence waits." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Throw a depth-charge pattern, and ping the cylinder into the sea", hint: "Needs Delorme and Ilse", if: { all: ["delorme_help", "ilse_help"] }, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Time the pattern and the ping to the same ten seconds", who: "choose", tags: ["sea"],
            ok: [{ say: "Delorme pings the Berlin cylinder, backwards, into the dark. A depth-charge pattern follows it, throwing columns of white water into the black. The sea groans, and then roars. In the morning every ship in the convoy is intact, and for the first time in nine nights the sound of the water on the plates is the loudest thing in the world." }, { set: "res_ping" }, { objective: "po2" }, { arcSet: "pinged" }, { goto: "end" }],
            fail: [{ say: "The pattern falls short, and the ping falls flat. The hush closes." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face it on the foredeck", steps: [{ set: "res_fight" }, { combat: "drifter", win: [{ say: "The sea gives one enormous groan, and then, very close, an ordinary gull." }, { objective: "po2" }, { arcSet: "fought6" }, { goto: "end" }] }] }] },
      end: { name: "The bridge of the Larkspur, dawn", theme: "sea", mood: "calm", lighting: "normal", weather: "wind",
        onEnter: [{ once: "in", steps: [
          { say: "Dawn on the Atlantic: a grey sea, a pink sky, forty ships in nine columns, all with their lights out, all steaming west at nine knots, and every one of them, for the first time in nine days, making a noise. Commander Rhodes stands at the rail with his mug of tea and listens to the hiss of the bow-wave." },
          { if: { flag: "res_lamps" }, then: [{ say: "You sang it down with light. Forty lamps, one tune. The convoy reaches Halifax a day late, and the Admiralty records a signal discipline of unprecedented merriment." }] },
          { if: { flag: "res_ping" }, then: [{ say: "You answered it with its own name, and a depth-charge pattern. It is a thing the Admiralty does not record. Ilse keeps the cylinder warm in her bunk." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You faced it on the foredeck. It was not killed. It slid over the side into the sea like a long, slow sigh, and it is somewhere in the Atlantic still." }] },
          { if: { obj: "so1" }, then: [{ say: "Delorme hums in the Asdic hut, aloud, from now on, deliberately." }] },
          { if: { obj: "so2" }, then: [{ say: "Commodore Haldane burns the forged signal in the galley stove, and writes in his order book, in his own hand, a real one." }] },
          { if: { obj: "so3" }, then: [{ say: "Mrs. Reilly's tea is mentioned in dispatches. The crew of the Anneliese Holt wake, one by one, and ask whose watch it is." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1945 · VII */
  reg({
    id: "qf-7-zero-hour", title: "The Quiet Front VII: Zero Hour", setting: "The Brandt Institute, Berlin · 2 May 1945", year: 1945, level: [5, 9], agencies: AG, region: "europe", theme: "cellar",
    summary: "Berlin, 2 May 1945. The guns stop. After twelve days of the heaviest bombardment in history, the whole city goes quiet at once: a million people in cellars holding their breath. It is the largest silence the world has ever made, and the Hush, which has followed the quiet of a shell-hole, a ward, a club, a wireless, a shelter and an ocean for twenty-nine years, has come to hear it. Ilse Brandt has come back to the ruins of her Institute. She has been waiting for it, too.",
    objectives: [
      { id: "po1", kind: "primary", t: "Reach the Institute before the silence is complete", done: "The Brandt Institute is half-standing, its anechoic chamber intact, in the one ruined street in Charlottenburg where the guns have already stopped. At its centre the air is very still." },
      { id: "po2", kind: "primary", t: "End the Hush: finish what began at shell-hole 114", done: "The Hush is answered, or heard, or bound, or broken. When the silence ends, it ends in a city that has found its voice again, and remembers how to use it." },
      { id: "so1", kind: "secondary", t: "Find Karl Brandt's last letter", done: "Karl's letter, carried for years in a tunneller's boot, says only: 'It is not cruel. It is only very lonely. If you can, tell it it has been heard.'", benefit: { label: "A dead man's counsel", text: "You know what it is. A bonus on every roll to bargain with it.", bonus: { tags: ["bargain"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Gather the people who heard it before", done: "Magda, Anton, Frau Lindqvist and Edith Marlow, who each lost a piece of themselves to it, stand with you in the cellar. It will recognise them.", benefit: { label: "Old acquaintances", text: "You are not alone. A bonus on every roll to hold the line together.", bonus: { tags: ["together"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Carry out the cylinders", done: "Thirty-one wax cylinders of the Hush, from Berlin, Shanghai, London and the sea, are carried out of the ruins and hidden where the agencies can keep them.", benefit: { label: "The whole record", text: "The sum of everything recorded. A bonus on every roll to read the silence.", bonus: { tags: ["listen"], value: 2 } } }
    ],
    clues: {
      c_whole: { t: "The silence is a million people holding their breath", s: "The ruined streets", x: "At 03:07 the guns stop. Not by any order: they stop because there is nothing to hit. A million civilians sit in cellars not breathing, listening to the end of the world. It is the largest quiet the Hush has ever been offered, and it has been waiting for this one for twenty-nine years." },
      c_lonely: { t: "It is not cruel, only lonely", s: "Karl's letter", x: "Karl Brandt's last letter, never delivered, written in a Flanders sap in 1916: it is not hunting us. It is a listener that has never been listened to. All its attention goes out and nothing ever comes back. It takes what it hears because it has never been told what it is." },
      c_names: { t: "It has kept every name", s: "Ilse's cylinders", x: "Thirty-one cylinders of recorded silence, played at the right speed, are not silent. They are a list. Every man at shell-hole 114. Every patient on Ward 9. Every regular at the Stille Stunde. Forty thousand listeners in Shanghai. Four thousand in the Marlowe Road. It has kept them all, in order, with great care." },
      c_chamber: { t: "The chamber is a room made of silence", s: "The Institute plan", x: "In the heart of the Brandt Institute is an anechoic chamber Ilse built in 1931: a room with walls of wedges, which absorb every sound that enters. It is the quietest room in the world. It was built, she realises now, as a place for it to come to. She built it a home." },
      c_return: { t: "A sound it has never been given: its own name, back", s: "The agents' file", x: "A silence cannot be killed with noise, because noise is only its other half. But it has never been answered. Never once, in twenty-nine years, has anything said to it, in its own language: I heard you. I know what you are. The Hush has been taking and taking and no one has ever given it anything back." },
      c_cost: { t: "Hearing it will not be free", s: "Anton", x: "Anton lost an ear and a hand to it. To hear the whole of what it holds is to carry every one of those names, forever, as a faint continuous hum. One person can carry it. That person will never again be able to enter a quiet room without hearing everything that was ever said in it." },
      c_door: { t: "The chamber has a single door, and a single hour", s: "The Institute plan", x: "The chamber door opens inward, and closes with a seal. From the moment the silence is complete, at 3:07, to the moment the first gun speaks again, at 3:18, the chamber is the only place in the city the Hush can be. It has eleven minutes, and so do you." }
    },
    npcs: {
      ilse: N("Dr. Ilse Brandt", "Acoustician, returned", "Forty-five, in a British Army greatcoat over a tweed skirt, with a field recorder, a stack of lead cases and a face that has aged twenty years in six, and a small, defiant, unbroken smile.", F(1, 2, "bun", 2, "none", { sex: "f" })),
      anton: N("Anton Meier", "Engineer of the lathe", "Forty-three, in a grey overcoat with an empty sleeve pinned across his chest, a cap pulled low over his missing ear, a lathe-maker's patient hands, and a very tired, very calm manner.", F(1, 1, "short", 5, "none", { sex: "m" })),
      magda: N("Magda Weiss", "Cabaret singer", "Forty, in a patched black coat and a headscarf, with a singer's carriage and a hungry face, who sings for bread in the ruins, and has not been silent for twenty-two years.", F(1, 2, "bob", 4, "none", { sex: "f" })),
      edith: N("Matron Edith Marlow", "Field hospital matron", "Fifty-five, in a battledress jacket with the Red Cross on the sleeve and a nurse's white cap, with a Thermos of tea and an unbreakable calm, who has come to Berlin with the first British medical unit.", F(1, 3, "bun", 4, "none", { sex: "f" })),
      frau: N("Frau Lindqvist", "A survivor", "Sixty, in a threadbare fur-collared coat and a hat with a torn veil, upright and thin, very quiet, who says a name, now and then, aloud, to make sure that she still can.", F(1, 3, "bun", 2, "none", { sex: "f" }))
    },
    enemies: {
      hush: { build: { name: "The Hush, at full size", type: "Beyond", difficulty: "hopeless", sprite: "spirit", hue: 230, dtype: "sanity", core: { body: 3, mind: 5, spirit: 5 }, mods: ["Occult", "Tanky"],
        text: "Everything it has kept, in one room. Names: each round it speaks one name from its list in the voice of someone you lost (Morality Hard, or lose the next action and 4 Sanity as the name lands). It is hurt by being answered: a person who says, aloud, that they heard it, a song sung together, or a name given back, gives everyone double damage against it. Only Sanity harms it.", dies: "the last name is read aloud, and the whole chamber lets out a breath it has held for twenty-nine years" } },
      shade: { build: { name: "A kept one", type: "Human", difficulty: "medium", sprite: "humanoid", hue: 225, attack: 1, dtype: "sanity", dies: "says its own name, very clearly, and is a person again" } }
    },
    encounters: {
      chamber: { name: "The anechoic chamber", theme: "cellar", fightText: "A white room of foam wedges on every wall, floor and ceiling, a mesh floor over a pit of more wedges, and a hundred figures standing on the mesh, shoulder to shoulder, facing the middle. At the centre of the room, taller than the ceiling should allow, something stands with its head tilted, holding every name it has ever kept.", zones: [{ id: "a", name: "The door", col: 0, row: 0 }, { id: "b", name: "The mesh", col: 1, row: 0 }, { id: "c", name: "The centre", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "hush", zone: "c" }, { t: "shade", zone: "b" }, { t: "shade", zone: "b", name: "A kept one (2)" }] }
    },
    start: "ruins",
    scenes: {
      ruins: { name: "Charlottenburg, in the ruins", theme: "street", mood: "tense", lighting: "shadow", weather: "fog", cast: ["ilse"],
        onEnter: [{ once: "in", steps: [
          { say: "Berlin, the second of May, 1945. A city made of rubble, brick dust and smoke, the long skeleton of the Kaiser-Wilhelm church against a pink dawn, a million people in cellars. Twelve days of shelling have just stopped. A tall woman in a British greatcoat stands at the corner of a ruined street, with a field recorder in one hand and a lead case in the other." },
          { if: { arc: "choir" }, then: [{ say: "The Blackout Choir's old tune is whistled somewhere in the rubble: Mr. Pike's choir, in a new key, in Berlin. Someone has carried it east." }] },
          { if: { arc: "lamps" }, then: [{ say: "From a corner post, a signal lamp winks at you, once, in Morse: 'Roses of Picardy'. It is Commodore Haldane's old signalman, a long way from the sea." }] },
          { if: { arc: "recorded" }, then: [{ say: "Ilse's lead case contains the Berlin cylinder, the one run backwards. She has carried it for twenty-two years." }, { clue: "c_names" }] },
          { if: { arc: "spoke" }, then: [{ say: "At the foot of the Institute stair, Magda Weiss has chalked, in a bold hand: 'SPEAK UP.'" }] },
          { talk: { npc: "ilse", text: "I did not think I should live to do this. In a quarter of an hour it will be 3:07. Every gun in Berlin has stopped. A million people are holding their breath. It is the largest silence in history, and it has come for them all. I have built it a room. I would like you to help me decide what to say." } }] }],
        options: [
          K.ask("ilse", [
            K.t("What is it?", ["A listener. That is all. I have recorded it in seven cities and one ocean. It has never done anything but listen, and take, a little, the thing it listens to. It is not cruel. It was never taught to give."], { free: true, clue: "c_lonely" }),
            K.t("Who can help us?", "Magda is in the street, singing for bread. Anton is at the lathe. Matron Marlow has come with the first British medical unit. Frau Lindqvist is at the corner. And in my coat pocket, a letter from a man who has been dead twenty-nine years.", { free: true, set: "contacts_known" }),
            K.t("What have you built?", [{ say: "She taps the lead case." }, "A chamber. In 1931, I built a room which absorbs every sound that enters. I thought it was a laboratory. It is a house. It is the only room in Berlin where it can come tonight."], { cha: 7, clue: ["c_chamber", "c_door"] }),
            K.t("What do you want to do?", "I want to hear all of it. I do not think I can survive that. I would like you to tell me if there is another way.", { cha: 10, clue: "c_return", set: "ilse_plan" })
          ], { label: "Talk to Dr. Brandt", name: "Dr. Brandt", bye: ["Eleven minutes. Do not be late."] }),
          K.find("Read the Institute's plans", "iq", "easy", "The plans of the Brandt Institute, in a draughtsman's hand: the lab, the lathe room, and in the cellar, the anechoic chamber, drawn very precisely, with one door. In the margin, in a different hand, a small, unfamiliar note: 'Thank you for the room.'", "A great many blueprints.", { clue: ["c_chamber", "c_door"], hint: "Easy", failClue: "c_door" }),
          K.go("To Magda, in the street", "street", { if: "contacts_known" }),
          K.go("To Anton, at the lathe", "lathe", { if: "contacts_known" }),
          K.go("To Matron Marlow's aid post", "aid", { if: "contacts_known" }),
          K.go("To the corner, and Frau Lindqvist", "corner", { if: "contacts_known" })] },
      street: { name: "A ruined street, Charlottenburg", theme: "street", mood: "calm", lighting: "normal", weather: "none", cast: ["magda"],
        onEnter: [{ once: "in", steps: [{ say: "A street of burnt-out buildings and chalk-marked doors, a pile of bricks swept into a heap, a little crowd of hungry people on the kerb, and a woman in a patched black coat standing on an upturned crate, singing, loudly and not at all well, 'Lili Marleen'." }] }],
        options: [
          K.ask("magda", [
            K.t("You are singing again?", ["Since the day I walked out of the Stille Stunde. I have not stopped for twenty-two years. In cellars. In cafés. In the ruins. I sing for bread and people give it. I have never been so loud in my life. It is the best thing I ever did."], { free: true, clue: "c_return" }),
            K.t("Do you remember it?", "I remember the silence in my mouth. It was very kind. I did not want it to be anything else. I would like to say something to it, if I could. I think it might want to hear.", { free: true, clue: "c_lonely" }),
            K.t("Will you come to the Institute?", [{ say: "She steps down from the crate." }, "I will. I will bring the street. Every one of them knows what it is to be hungry, and silent. They will come, if I ask."], { cha: 7, set: "magda_help", obj: "so2" })
          ], { label: "Talk to Magda", name: "Magda", bye: ["Sing up. Sing up, Berlin."] }),
          K.find("Listen to the street", "awareness", "easy", "The street is full of small noises: a kettle, a child's cough, a shovel, a distant whistle, someone singing very softly in a cellar. The quiet hasn't reached here yet. In the distance, it is moving closer, a few doors at a time.", "A noisy street.", { clue: "c_whole", hint: "Easy" }),
          K.go("Back to the ruins", "ruins")] },
      lathe: { name: "The lathe room, half-roofed", theme: "interior", mood: "weird", lighting: "normal", weather: "none", cast: ["anton"],
        onEnter: [{ once: "in", steps: [{ say: "A half-roofed room open to the sky, the lathe bolted to a concrete bench, rows of wax cylinders on a rack under a tarpaulin, and a man with one hand and one ear working a hand-crank with great care and no hurry at all." }] }],
        options: [
          K.ask("anton", [
            K.t("You kept the cylinders?", ["All thirty-one. They were in the cellar through the whole siege. Berlin, Shanghai, London, the sea. Every one that Ilse ever recorded, and copies of the ones she did not. If we lose Berlin, I carry them out on my back."], { free: true, clue: "c_names", obj: "so3" }),
            K.t("What will it cost, to hear them all?", "To hear the whole of it, at the right speed, is to carry every name. For ever. As a hum. I have a little of it, from Ypres. I can tell you: it is bearable. It is also not quiet.", { free: true, clue: "c_cost" }),
            K.t("Will you carry them out for us?", [{ say: "He puts a hand on the rack." }, "I will carry them anywhere. It is the only thing I have ever been good for."], { cha: 7, set: "anton_help" })
          ], { label: "Talk to Anton", name: "Anton", bye: ["Mind the wax. It is very fragile."] }),
          K.find("Play one cylinder at half speed", "awareness", "medium", "At half speed, the silence is a voice: one name, repeated, low, in a flat gentle monotone: a man's name, then a woman's, then a child's, and on, and on, with great care, as a priest might read a roll of the dead. It is not threatening. It is only completely thorough.", "A hiss of wax.", { clue: "c_names", hint: "Awareness, Medium", tags: ["listen"] }),
          K.go("Back to the ruins", "ruins")] },
      aid: { name: "A British medical post", theme: "interior", mood: "calm", lighting: "normal", weather: "none", cast: ["edith"],
        onEnter: [{ once: "in", steps: [{ say: "A requisitioned shop with the windows sandbagged, a Red Cross flag, a queue of the wounded and the hungry of every nation, and a tall woman in battledress with a thermos and a cap who is pouring tea for a boy of fourteen with a bandaged head." }] }],
        options: [
          K.ask("edith", [
            K.t("You came to Berlin?", ["The first British medical unit in. I asked. I told them I had a quarrel to finish. They gave me a lorry. I have been awake for forty hours and I do not mind."], { free: true, clue: "c_whole" }),
            K.t("What do you think it wants?", "To be told it is not alone. That is all any of the dying ever wanted at the end. I think it is the dying of everyone, all at once, and it has been sitting with them all, and nobody has ever sat with it.", { free: true, clue: "c_lonely", set: "edith_talked" }),
            K.t("Will you come into the chamber?", [{ say: "She picks up her thermos." }, "I have sat with forty-one on Ward 9, and four thousand in a shelter. I do not see why I should not sit with one more."], { cha: 8, set: "edith_help" })
          ], { label: "Talk to Matron Marlow", name: "Matron Marlow", bye: ["Bring them back warm."] }),
          K.find("Read the unit's casualty returns", "iq", "easy", "The returns of the first week in Berlin: thousands of names, each with a time. In the margin, in the matron's hand, a count of the ones who stopped speaking in the quiet this morning, before dawn, smiling: forty-one, in one cellar. The same number.", "A great many names.", { clue: "c_whole", hint: "Easy" }),
          K.go("Back to the ruins", "ruins")] },
      corner: { name: "The corner by the Institute", theme: "street", mood: "weird", lighting: "shadow", weather: "fog", cast: ["frau"],
        onEnter: [{ once: "in", steps: [{ say: "The corner of a ruined street, a wall with a hole in it, a chalk arrow reading 'Institut', and, sitting on a milk crate with her hands folded, an old woman in a fur-collared coat, upright and thin, who says a name aloud, to the air, softly, and nods." }] }],
        options: [
          K.ask("frau", [
            K.t("You remember me?", ["I remember a voice, in a cellar, a very long time ago, saying my husband's name. I had forgotten it. I have said it every day since. I say it now, to make sure I still can."], { free: true, clue: "c_return" }),
            K.t("What do you remember of the quiet?", "That it was kind. That it wanted nothing. That if you gave it something, it kept it very safely. I do not think it knew it was stealing. I think it was only keeping.", { free: true, clue: "c_lonely" }),
            K.t("Will you speak, tonight?", [{ say: "She says a name, softly." }, "I will say them all. Every one I can remember. I will say them to it."], { cha: 7, set: "frau_help" })
          ], { label: "Talk to Frau Lindqvist", name: "Frau Lindqvist", bye: ["I will see you inside."] }),
          K.find("Search the old woman's coat", "awareness", "medium", "Sewn into the lining, a small oilskin packet. Inside, a letter in faded pencil on a scrap of sandbag cloth: Karl Brandt's last, from the sap at the head of shell-hole 114, written the night before he was killed. It is addressed to his sister, and to anyone else who finds it.", "A very old coat.", { clue: "c_lonely", obj: "so1", hint: "Awareness, Medium", tags: ["bargain"] }),
          K.go("Down into the Institute cellar", "cellar", { if: { all: [{ clue: "c_chamber" }, { clue: "c_names" }, { clue: "c_return" }, { clue: "c_door" }] } }),
          K.go("Back to the ruins", "ruins")] },
      cellar: { name: "The Institute cellar, 3:06", theme: "cellar", mood: "dread", lighting: "dark", weather: "none", cast: ["ilse"],
        onEnter: [{ once: "in", steps: [
          { say: "The Institute cellar. A flight of concrete stairs, a heavy door, a corridor lined with foam. Somewhere above, the last gun of the siege fires, and does not fire again. At 3:07, as if a hand had been laid over the city's mouth, the whole of Berlin goes quiet. In the chamber ahead, eleven minutes, and a single door." },
          { talk: { npc: "ilse", text: "It is here. Everyone, listen. Whatever we do, we do it in eleven minutes." } },
          { objective: "po1" }] }],
        options: [
          { label: "Hear all of it, and say that you heard", hint: "Needs the whole record, and a dead man's letter", if: { all: [{ obj: "so3" }, { obj: "so1" }] }, steps: [{ check: { aspect: "willpower", cr: "hard", label: "Sit in the chair, hear every name, and say aloud that it was heard", who: "choose", tags: ["listen", "bargain"],
            ok: [{ say: "You sit in the chamber, in the one chair, and the Hush reads you its list. Every man at shell-hole 114. Every patient on Ward 9. Every regular at the Stille Stunde. Forty thousand in Shanghai. Four thousand in the shelter. Forty ships. It takes eleven minutes, and it takes everything you have. At the end, you say, aloud, in a voice that shakes: I heard you. All of it. You are not alone. And the Hush, for the first time in twenty-nine years, is answered." }, { set: "res_witness" }, { objective: "po2" }, { arcSet: "witness" }, { goto: "end" }],
            fail: [{ say: "There are too many names. You come out of the chamber with a hum behind your eyes, and the Hush untouched." }, { damage: { pool: "sanity", amount: 5 } }] } }] },
          { label: "Fill the chamber with everyone who ever heard it, and give the names back", hint: "Needs Magda, Frau Lindqvist, Edith and the gathered", if: { all: ["magda_help", "frau_help", "edith_help", { obj: "so2" }] }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Bring in the whole street, and read every kept name aloud", who: "choose", tags: ["together", "talk"],
            ok: [{ say: "You open the door, and they come in: Magda and the hungry street, Frau Lindqvist, Matron Marlow and her wounded, Anton with the lathe. Ilse reads each name from the cylinders aloud, and each person in the chamber, one by one, answers: here. Here. I am here. The Hush stands in the middle of its own room and hears, for the first time, a roll call answered. It has nothing left to take." }, { set: "res_names" }, { objective: "po2" }, { arcSet: "answered" }, { goto: "end" }],
            fail: [{ say: "The names stick in the throat. The quiet takes the room." }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Seal the chamber, and leave it in the room that was built for it", hint: "Needs Ilse's plan, Anton and the cylinders", if: { all: ["ilse_plan", "anton_help", { clue: "c_door" }] }, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Seal the chamber door with the Institute's own lathe, before the first gun", who: "choose", tags: ["listen", "together"],
            ok: [{ say: "You close the door as the clock reaches 3:18, and Anton throws the seal. The first gun speaks. The Hush is in a room that cannot be heard from, a house built for it by a woman who loved it, with its own thirty-one cylinders for company. It will keep. It does not mind the dark. It has never minded it." }, { set: "res_seal" }, { objective: "po2" }, { arcSet: "sealed" }, { goto: "end" }],
            fail: [{ say: "The seal jams, an inch short. The silence is not contained." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face it in the chamber", steps: [{ set: "res_fight" }, { combat: "chamber", win: [{ say: "The last name is read aloud, and the whole chamber lets out a breath it has held for twenty-nine years." }, { objective: "po2" }, { arcSet: "broken" }, { goto: "end" }] }] }] },
      end: { name: "Charlottenburg, the ruins, dawn", theme: "street", mood: "calm", lighting: "normal", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Dawn over Berlin, and the first morning of the peace. It is not a silence. It is a hundred noises at once: a kettle, a whistle, a child shouting, a distant tractor, someone singing in a cellar, and a long, ragged, joyful, unrehearsed chorus of a million people who have, all at once, remembered how to speak." },
          { if: { flag: "res_witness" }, then: [{ say: "You heard it, all of it, and said so. The Hush is gone, not killed, but answered. You carry its names, as a faint, kind hum, and in every quiet room you ever enter, for the rest of your life, you hear everything that was ever said in it. It is bearable. It is not quiet." }] },
          { if: { flag: "res_names" }, then: [{ say: "You gave every name back, and each answered. The Hush stood in its own room, and was, at last, a thing among things, hearing a roll call. When the last name was read, it was gone, and the cylinders in the case were blank wax." }] },
          { if: { flag: "res_seal" }, then: [{ say: "You sealed it in the room that was built for it. The Institute stands, half-ruined, and its cellar door is welded shut by an engineer with one hand. Ilse keeps the key, round her neck, with Karl's letter. Some nights, she goes down, and sits outside, and talks to it." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke it. It did not die: a thing like that is not killed. But the quiet it kept for twenty-nine years went out into the world as a great deal of ordinary noise, and the names went home." }] },
          { if: { all: [{ arc: "choir" }, { arc: "lamps" }] }, then: [{ say: "Mr. Pike and Commodore Haldane both live to hear the news. A whistle, a lamp, a hundred voices: the choir sings in Berlin that morning, from a milk crate, in a ruined street." }] },
          { if: { all: [{ arc: "voiced" }, { arc: "spoke" }] }, then: [{ say: "Lin Yuhua's lullaby is played on the Berlin radio at noon, in three languages. Magda sings the fourth." }] },
          { if: { obj: "so1" }, then: [{ say: "Karl's letter is read aloud at the grave of an unknown tunneller in the Thiepval churchyard, in the autumn, by his sister." }] },
          { if: { obj: "so2" }, then: [{ say: "Magda, Anton, Frau Lindqvist and Matron Marlow have a cup of tea together in the sun on the Institute steps. It is the first time, in thirty years, any of them has sat in a quiet that was only quiet." }] },
          { if: { obj: "so3" }, then: [{ say: "The thirty-one cylinders go to the archives of three agencies. Each is labelled in a tidy hand: 'Heard.'" }] },
          { end: "win" }] }], options: [] }
    }
  });

  window.PACKS.define({
    format: "beyond-pack", id: "quiet-front", name: "The Quiet Front", version: "1", author: "Gage Lee", builtIn: true,
    description: "A seven-part campaign through the World Wars era, 1916 to 1945. Something follows the great events of the age, because it feeds on the moment after the guns stop.",
    cases,
    arcs: [{ id: "quiet-front", title: "The Quiet Front", agencies: AG, villain: "The Hush, a silence that listens", parts: cases.map((c) => c.id),
      summary: "Seven jobs, thirty years, one listener. It is in the trench, the grey ward, the broadcast and the blackout, and it learns a little more of what it hears each time. The people you meet come back." }]
  });
})();
