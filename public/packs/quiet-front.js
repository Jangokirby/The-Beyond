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

  window.PACKS.define({
    format: "beyond-pack", id: "quiet-front", name: "The Quiet Front", version: "1", author: "Gage Lee", builtIn: true,
    description: "A seven-part campaign through the World Wars era, 1916 to 1945. Something follows the great events of the age, because it feeds on the moment after the guns stop.",
    cases,
    arcs: [{ id: "quiet-front", title: "The Quiet Front", agencies: AG, villain: "The Hush, a silence that listens", parts: cases.map((c) => c.id),
      summary: "Seven jobs, thirty years, one listener. It is in the trench, the grey ward, the broadcast and the blackout, and it learns a little more of what it hears each time. The people you meet come back." }]
  });
})();
