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

  window.PACKS.define({
    format: "beyond-pack", id: "quiet-front", name: "The Quiet Front", version: "1", author: "Gage Lee", builtIn: true,
    description: "A seven-part campaign through the World Wars era, 1916 to 1945. Something follows the great events of the age, because it feeds on the moment after the guns stop.",
    cases,
    arcs: [{ id: "quiet-front", title: "The Quiet Front", agencies: AG, villain: "The Hush, a silence that listens", parts: cases.map((c) => c.id),
      summary: "Seven jobs, thirty years, one listener. It is in the trench, the grey ward, the broadcast and the blackout, and it learns a little more of what it hears each time. The people you meet come back." }]
  });
})();
