/* ============================================================================
   SIDE JOB WRITING — the words for generated side jobs (used by gen.js).

   Placeholders filled in per job:
     {town} {Town}            where it happens
     {wit} {witFirst} {role}  the person who sent for you
     {surv} {survFirst}       the one still missing; {sp} {op} {pp}: she/her/her or he/him/his
     {villain}                the thing behind it
     {src}                    where the records are kept in this era
   ========================================================================== */
(function () {
  window.GEN_TEXT = {
    /* where you go to read up on it, by era */
    sources: {
      medieval: ["the parish register and the abbey's chronicle", "the abbey's chronicle, in a monk's cramped Latin", "a bundle of old manor court rolls"],
      victorian: ["the bound volumes of the local Gazette", "the coroner's records at the town hall", "a sixpenny pamphlet in the lending library"],
      wars: ["the county library's newspaper files", "the coroner's records, still in their string-tied bundles", "a parish history printed in 1903"],
      atomic: ["microfilm of the old newspapers at the public library", "the county records office", "a folklore society's mimeographed newsletter"],
      modern: ["an old forum thread and the council archive", "the local paper's online archive", "a ghost-hunting website last updated in 2004"],
      now: ["deleted posts recovered from a web archive", "the city's open-data records and a dead blog", "a podcast transcript about the town's history"]
    },
    hooks: {
      /* -------------------------------------------------------------- MISSING */
      missing: {
        arrive: [
          "{Town} looks like anywhere else until you notice the curtains. Every third house has them drawn, day and night, and every third house has a name chalked small on the doorframe: the people who used to live there.",
          "{wit} is waiting where you were told, collar up, watching the street as if it might move. {role}. Not someone who frightens easily, by the look of them. Frightened now."],
        open: ["You came. Good. I'd started to think I'd made you up as well.", { say: "{witFirst} looks over their shoulder before going on." }, "Seven people. Seven doors locked from the inside. And everyone here acting as if they never lived here at all."],
        topics: [
          { ask: "Tell me about the people who vanished", lines: ["The Ashbys at number four. Old Mr. Kell. A girl who worked at the bakery, can't have been twenty. Different streets, different lives.", "I knocked at the Ashbys' the morning after. Breakfast on the table. Kettle still warm. Door bolted on the inside, and the bolt rusted solid, like it hadn't moved in years."] },
          { ask: "What did they have in common?", lines: ["That's the thing nobody wants to hear.", { say: "{witFirst} lowers their voice." }, "Every one of them took in a lodger the week before. A quiet sort, they said. No trouble at all. Paid in old coins. Nobody can tell me what the lodger looked like. Not one of them.", { you: "And the lodger?" }, "Gone, the same night. Same as the rest of them."], clue: "c1" },
          { ask: "Why hasn't anyone else looked into it?", lines: ["Because when you ask them, they forget. I asked the Ashbys' neighbour about them on Tuesday and she said, who? Like I'd made them up.", "I write their names down every night so I don't do the same. That's why the chalk on the doors. I'm running out of doors."] },
          { ask: "Who's still missing?", lines: ["{surv}. Took the lodger in four nights ago. Nobody's seen {op} since, but there's a light in {pp} window every night, and the curtains move.", "If anyone's still alive in there, it's {survFirst}."] }],
        bye: ["Find them. Please. Before I start forgetting too."],
        doc: ["You spend an hour in {src}. It's the same story, told again every few generations, and always ending the same way.",
          "<i>\"…a Stranger who asks for Lodging, and is given it, may not afterwards be put out by any common means. But let the master of the House say aloud, at the threshold, 'You are no guest of mine', and the Stranger must go out of the door it came in by, and cannot cross it after…\"</i>",
          "Someone has underlined it. In the margin, in a different hand, someone has written: <i>it worked. it came back the next year.</i>"],
        docFail: ["{src} are a mess of damp and bad handwriting. You find the right decade, then the right page torn out. Someone got here before you, a long time ago."],
        site: ["the last house it happened in", "room", ["The door to {surv}'s house is bolted, and the bolt is rusted solid. You go in through the scullery window.",
          "Inside, everything is tidy in a way that makes your skin crawl. Two places laid at the kitchen table. Two cups of tea, cold, a skin on each. Upstairs, a narrow bed in the back room that the house's plan says isn't there."]],
        searchOk: ["You go through the house room by room, and on the landing you find what you were looking for without wanting to: a door. Painted the same colour as the wall, no handle on this side. Your hand against it feels a slow knocking from the other side, four beats, a pause, four beats.",
          "Someone has scratched marks into the skirting board beside it with a fingernail. Seven sets of initials. The last set is {survFirst}'s."],
        searchFail: ["You search for an hour and find nothing, and the longer you look the more the house seems to rearrange itself behind you. When you finally find the door on the landing, you've walked past it nine times. The knocking from the other side has been keeping time with your heart."],
        survOk: ["Behind the door, the house goes on: a corridor of other people's furniture, other people's photographs, other people's coats on the hooks.",
          "{surv} is sitting on the floor halfway down it, {pp} back to the wall, counting under {pp} breath.",
          { npc: "surv", text: "Don't let it hear you knock. It answers knocking. I've been so quiet. I've been so quiet for so long." },
          { say: "You get {op} up and walk {op} out backwards, never taking your eyes off the far end of the corridor." },
          { npc: "surv", text: "It's still in there. It's got all of them in there. It sits at the end and it smiles." }],
        survFail: ["You hear {survFirst} calling your name from somewhere down the corridor, always one room further than the last. When you finally stop following, the voice stops too, and something at the far end laughs, very politely."],
        lair: ["the room that shouldn't be there", "deep", ["At the end of the corridor there's a room furnished with everything the house has taken: armchairs from seven homes, a dozen clocks all stopped at different hours, a table laid for guests who aren't coming back.",
          "And in the best chair, the lodger. It's wearing a face put together from everyone it has stayed with, and it is very glad to see you."]],
        speech: ["Oh, how lovely. More company.", "Do sit down. You must be tired. I'll make up a bed for you; I always have room for one more."],
        weakOk: ["You stand in the doorway and say it, the way the old record told you to: <b>You are no guest of mine.</b>", "The lodger's borrowed face slips. For a moment you see what's under it, something long and folded and patient, and it hates you."],
        weakFail: ["You say the words, but your voice shakes on <i>guest</i>, and the lodger only smiles wider. \"But I was invited,\" it says. \"You came in.\""],
        win: ["The thing that called itself a lodger comes apart like wet paper, and the house lets go of the rooms it was holding. Walls settle. Somewhere below, a door that was bolted for years opens on its own.",
          "Out in the street, {wit} is rubbing the chalk off a doorframe. \"I remember them,\" {witFirst} says. \"All of them. I'd started to think I'd made them up.\""],
        clues: { c1: "Every one of the missing took in a quiet lodger the week before they vanished, and no one can say what the lodger looked like.", c2: "A door on the landing that isn't on the house's plans, knocking from inside, and seven sets of initials scratched beside it.", c3: "A stranger who was given lodging must leave if the householder says at the threshold: 'You are no guest of mine.'" }
      },

      /* -------------------------------------------------------------- HAUNT */
      haunt: {
        arrive: ["The house stands a little apart from its neighbours, as if they've edged away from it. It's a good house. Big windows, a garden gone wild. Nobody has lived in it for longer than a fortnight in thirty years.",
          "{wit} is on the step, keys in hand, not wanting to be the one to use them. {role}, and the last person in {town} willing to come near the place."],
        open: ["I'll come in with you as far as the hall. Not a step further. I did that once.", "You'll want to know why everyone leaves. I can tell you that. What I can't tell you is why it wants them gone."],
        topics: [
          { ask: "What happens to the people who move in?", lines: ["First night, footsteps upstairs. Second night, the furniture's moved, always toward the same room. By the end of the week they wake up standing in that room, facing the wall, with no idea how they got there.", "The Pryces stayed nine days. Mrs. Pryce still won't say what happened on the ninth. She can't sleep in a room with the door shut."] },
          { ask: "Who built the house?", lines: ["A man who called himself Ambrose Thorne. Kept to himself, wouldn't give his Christian name to anyone. Died in the house, they say, though nobody saw him do it.", { say: "{witFirst} hesitates." }, "Here's the part no one in {town} likes: they buried a coffin in the churchyard with his name on it. When the sexton moved it years later, it was empty. Light as a basket."], clue: "c1" },
          { ask: "Which room does it all lead to?", lines: ["The parlour at the front. Everything moves toward the parlour. Chairs, beds, people.", "And it's getting further out every year. There's a cold that used to stop at the parlour door. Now it reaches the front step."] },
          { ask: "Is anyone in there now?", lines: ["{surv}. Runs {pp} own business, didn't believe a word of it, took the lease on Monday. Didn't come to the door this morning. The milk's still on the step."] }],
        bye: ["I'll be in the street. If you start walking toward the parlour and don't know why, shout."],
        doc: ["{src} have a whole file on the house, mostly complaints. Under them, almost hidden, one older account.",
          "<i>\"…Thorne was asked his Christian name by the sexton and would not give it, saying that a man whose name is not known cannot be called to account. He died the winter following. It is said in the town that if his name were ever spoken aloud in the room where he died, he would be held there, and could trouble no one past its door…\"</i>",
          "Further down the page, in pencil: <i>Thorne's name was Josiah. The register knows, even if nobody else does.</i>"],
        docFail: ["The records about the house have been taken out and not returned, over and over, for a hundred years. The borrowing slips go back to before you were born. The last name on them is {survFirst}'s."],
        site: ["the front parlour", "room", ["Dust sheets over everything. The parlour is the coldest room you have ever stood in that wasn't outdoors in winter.",
          "Every piece of furniture in the room has been pushed, a few inches at a time, toward the far wall. One chair stands uncovered in the middle of the floor, facing that wall. The dust on its seat has been disturbed recently, by someone sitting very still for a very long time."]],
        searchOk: ["Under the dust sheet nearest the wall there's an armchair worn shiny where a head has rested. On the wallpaper above it, almost too faint to see, someone has traced a door in pencil, over and over, until the paper is grey and thin.",
          "It's spreading. You can see the rings where the cold has frosted the floorboards: one ring for every year, each a little wider than the last. The newest one reaches the hall."],
        searchFail: ["You don't notice yourself sit down. When you come back to yourself you're in the uncovered chair, facing the wall, and your eyes are watering from not blinking. Someone was whispering a name in your ear, and you've almost got it."],
        survOk: ["You find {surv} in the attic stairwell, standing perfectly still with {pp} forehead against the wall, the way the stories said.",
          { say: "It takes three of you to turn {op} round. {pp} eyes come back slowly." },
          { npc: "surv", text: "There's an old man up there. He's so lonely. He kept telling me if I stayed he wouldn't have to be." },
          { npc: "surv", text: "He doesn't know his own name any more. He keeps asking me for it." }],
        survFail: ["The attic stairwell is empty. On the wall there's a damp patch the exact shape of a person's forehead, still cold, and you're not sure if you were too late or too early."],
        lair: ["the sealed attic", "room", ["The hatch is nailed shut from the inside, which you try very hard not to think about. You prise it open.",
          "The attic is full of a dead man's belongings, packed carefully into crates for a move that never happened. And sitting on the last crate, with his hands folded, is the man himself, or what thirty years of waiting has left of him."]],
        speech: ["Close the hatch, there's a draught.", "Have you come to stay? Everyone comes to stay. Nobody ever stays."],
        weakOk: ["You look at the grey shape on the crate and say, clearly: <b>Josiah Thorne.</b>", "He looks up as if he's heard his name from very far away, and for the first time in thirty years he can't move from where he sits."],
        weakFail: ["You say the name, but it comes out wrong, and the old man shakes his head sadly. \"No,\" he says. \"That isn't me. I've been trying to remember who I am.\""],
        win: ["The old man lets go of the house. The cold goes out of it all at once, like a held breath, and down in the parlour the furniture settles back on its feet with a sound like a sigh.",
          "{wit} comes as far as the front step this time. \"It's just a house,\" {witFirst} says, as if testing the words. \"It's just a house again.\""],
        clues: { c1: "The house's builder died there and was never buried: his coffin in the churchyard was found empty.", c2: "The haunting starts in the front parlour and spreads a little further every year; the cold now reaches the hall.", c3: "If the dead man's name is spoken aloud in the room where he died, he is held there and can trouble no one past its door." }
      },

      /* -------------------------------------------------------------- BEAST */
      beast: {
        arrive: ["The fields outside {town} are full of crows, and the crows are full. A farmer is burning something behind a hedge and won't look at you.",
          "{wit} meets you at the gate with a lantern though it's barely dusk. {role}. There's a dog at their heel, shaking, that won't go past the gate."],
        open: ["You'll want to see the field first. Everyone does. Then you'll want to go home, and I won't blame you.", "Sheep first, then a cow. Last night it was Tom Archer, walking home from the inn. We found what we found."],
        topics: [
          { ask: "What did you see last night?", lines: ["Nothing. That's what I keep telling them. I heard it. Like a dog, but too big, and then like a man laughing, and then like a dog again.", "The tracks went across the field on four feet, and the last few yards on two."] },
          { ask: "When does it hunt?", lines: ["Here's what nobody'll say at the inn.", { say: "{witFirst} looks toward the church tower on the hill." }, "The bell's rung the hours here three hundred years. The ringer's been sick this month. Every night the bell's been silent, something's died. Every night it's rung, nothing."], clue: "c1" },
          { ask: "Where does it go after?", lines: ["The tracks come and go from the old quarry woods. We followed them in daylight once. Didn't follow them out."] },
          { ask: "Is anyone else missing?", lines: ["{surv}. Went after it two nights ago with a shotgun and a bottle of courage. The dog came back. {survFirst} didn't."] }],
        bye: ["Go on, then. I'll ring the bell myself tonight if I have to."],
        doc: ["{src} have more about this than you'd expect: the same thing, the same woods, once every few generations.",
          "<i>\"…the Beast came again in the hard winter and was driven off by the smith, who stood before the den with cold iron in his hands and a horseshoe nailed above its mouth. It would not pass under the iron, nor abide the touch of it, and went howling into the hills…\"</i>",
          "The smith's name is given. So is his age when he died, the following spring. He was twenty-two."],
        docFail: ["{src} say a great deal about crops and nothing at all about beasts. In the margin, someone has drawn a wolf standing on its hind legs, and then scribbled it out hard enough to tear the page."],
        site: ["the killing field", "wild", ["The field is trampled flat in a circle forty feet across. In the middle, the grass is dark and stiff. Crows lift and settle, lift and settle.",
          "The fence on the far side is broken outward, not inward. Whatever came through here was leaving in a hurry, or carrying something."]],
        searchOk: ["You read the ground the way a hunter would. Four-footed prints, deep and wide, coming in from the quarry woods. Then the gait changes: the back feet start to land where the front feet were, then only back feet, long and narrow, heel and toe like a man's.",
          "Every set of tracks you find, going out or coming back, leads to the same place in the woods. It goes home every time. It's sure of the way."],
        searchFail: ["You're bent over the tracks when the crows go up all at once. You spin round. Nothing. But something big was standing at the edge of the wood watching you, and now it isn't, and your hands won't stop shaking for a long time."],
        survOk: ["You find {surv} in a hollow under a fallen oak at the wood's edge, shotgun across {pp} knees, both barrels empty.",
          { npc: "surv", text: "I hit it. Both barrels. It stood up. It stood up and it looked at me like a man looks at you, and then it went back down on all fours and walked away." },
          { npc: "surv", text: "It could have killed me. It didn't want to. I think it was saving me for later." }],
        survFail: ["Under the fallen oak there's a shotgun, both barrels empty, and a hat. Nothing else. The tracks leading away are two-footed, and they're walking slowly, as if carrying something heavy and in no hurry."],
        lair: ["the den", "wild", ["The den is an old quarry cut, roofed with fallen timber. It smells of wet fur and something sweeter underneath.",
          "Inside, bones, sorted into neat piles by size. Whatever lives here likes things tidy. And at the back, rising off its haunches as you come in, it is much bigger than a dog and much smarter than one."]],
        speech: [{ say: "It doesn't speak, quite. But when it opens its mouth, the sound that comes out is very nearly a word, and the word is very nearly your name." }],
        weakOk: ["You nail the horseshoe over the mouth of the den with three blows of a stone. The beast flinches back from the cold iron and its eyes go from you to the door, and for the first time it looks afraid."],
        weakFail: ["The horseshoe won't take; the timber is rotten and the nail goes straight through. The beast watches you try, patiently, the way a cat watches a bird with a broken wing."],
        win: ["It falls, and as it falls it changes, the long limbs shortening and the fur thinning, until what lies in the den looks almost like a man, and then like nothing much at all.",
          "When you come out of the woods the church bell is ringing. {wit} is in the tower, hauling on the rope with both hands, crying and laughing. {witFirst} doesn't stop ringing until the sun comes up."],
        clues: { c1: "It only kills on nights when the church bell is silent.", c2: "Its tracks always come from and return to the same place in the old quarry woods, and change from four feet to two.", c3: "It will not pass under cold iron: a horseshoe nailed over its den mouth drove it off before." }
      },

      /* -------------------------------------------------------------- CULT */
      cult: {
        arrive: ["{Town} is having a good year. You can see it: fresh paint, new hats, people smiling at strangers in the street. It's the smiling that the agency didn't like.",
          "{wit} is not smiling. {role}, waiting outside a hall with a hand-painted sign, <i>All Welcome, Thursdays</i>, and the look of someone who has lost a person they love to it."],
        open: ["Don't let them see you with me. They're very friendly. That's how it starts.", "My sister went to one meeting. One. She came home and she was so happy. She's never been so happy. She doesn't remember my name."],
        topics: [
          { ask: "What happens at the meetings?", lines: ["Singing, mostly. Hymns, sort of. Everyone in a circle. They say you leave lighter. That you put something down and never have to carry it again.", "I went once, to bring her home. They were kind. They gave me tea. I left before the singing, and I've never been so glad of anything."] },
          { ask: "What do they give up?", lines: ["That's the price. You give the circle something. A name. A memory. My sister gave it the day our mother died, and now she can't remember Mother at all, and she says it's the best she's ever felt.", { you: "And they all do this?" }, "Every one. Little things first. Then bigger."], clue: "c1" },
          { ask: "Who runs it?", lines: ["Nobody. That's what they say. The circle runs itself. There's a speaker, but no one can tell you their name, and the chair at the top of the circle is always empty."] },
          { ask: "Who's in danger now?", lines: ["{surv}. The newest member. Tonight's {pp} night to give the big thing. Whatever they mean by that, I don't think {sp}'ll come back from it."] }],
        bye: ["If you see my sister, don't tell her my name. She'll only be sad she can't remember it."],
        doc: ["{src} go back further than {town}'s good year. This has happened before, here and in other places, and the accounts agree on how it ended.",
          "<i>\"…the Circle would not hold save every hand was joined; and the brethren could not be roused, until one stood forth and broke the ring, whereupon the thing within it had no more hold upon them, and they came to themselves weeping, and asked for those they had forgot…\"</i>",
          "The account ends with a list of names. Every one has a date beside it, a few days after the circle broke. They're the dates people remembered their families again."],
        docFail: ["{src} have nothing on societies or circles, or rather, they did once: there's a gap in the shelves and a smell of burnt paper. Someone in {town} is tidier than they look."],
        site: ["the meeting hall", "holy", ["The hall is spotless and warm. Chairs in a perfect circle, facing inward. Hymn sheets on every seat. In the middle of the floor, a stain that someone has scrubbed and scrubbed.",
          "The hymn sheets have words on them, but when you try to read them the words slide out of order, like a crowd in a hurry."]],
        searchOk: ["You lay the hymn sheets out on the floor in order of the seats, and read them backward. The words stop sliding. It isn't a hymn. It's a set of directions: down the stair behind the stage, left at the cold place, to where the circle is fed.",
          "And on the back of the last sheet, in a child's careful handwriting: <i>I gave my birthday. I don't know when it is now.</i>"],
        searchFail: ["You try to read the hymn sheets and find you're humming the tune. You stop. A minute later you're humming again. By the time you work out what the words are for, you've forgotten what you had for breakfast, and you're not sure it was only that."],
        survOk: ["You find {surv} in the vestry, in a white robe that doesn't fit, waiting to be called.",
          { npc: "surv", text: "They say it doesn't hurt. They say you won't even miss it." },
          { you: "What are they asking you to give?" },
          { npc: "surv", text: "My name." },
          { say: "You get {op} out through the back window while the singing starts." }],
        survFail: ["The vestry is empty except for a white robe folded on a chair and a name tag with nothing written on it. From under the floor the singing has already started."],
        lair: ["the room below the hall", "deep", ["Below the stage, the circle is complete. Thirty people on their knees, holding hands, singing a hymn with no beginning and no end.",
          "In the middle of the ring, where the stain is upstairs, something is listening. It has no shape you can hold on to. It has a great many mouths, and every one of them is smiling."]],
        speech: ["Kneel with us. Put it down. Whatever you are carrying, you can put it down here.", "Doesn't that feel better?"],
        weakOk: ["You grab two joined hands and pull them apart.", "The singing stops on a broken note. All around the circle people sway and blink, and the thing in the middle shudders, half of it suddenly not there, like a voice when a choir loses its place."],
        weakFail: ["You reach for the joined hands, and the hands hold tight, and thirty faces turn to you, smiling. The singing doesn't falter at all."],
        win: ["The thing in the circle comes apart into silence. In the dark, thirty people sit back on their heels and start, one by one, to cry, and then to say names: mothers, children, themselves.",
          "Outside, {wit} is holding a woman in a white robe who keeps saying \"I'm sorry, I'm sorry\" and then, finally, {witFirst}'s name."],
        clues: { c1: "Everyone who joins the circle gives something up: a name, a memory, a birthday.", c2: "The hymn sheets, read backward in seat order, give directions down to where the circle is fed.", c3: "The circle only holds while every hand is joined; break it, and the thing inside loses its grip on the faithful." }
      },

      /* -------------------------------------------------------------- SWARM */
      swarm: {
        arrive: ["You smell {town} before you see it: a sweet, rotten thickness in the air, like a larder left in summer. The gutters move. When you look, it's only water. When you look away, they move again.",
          "{wit} meets you with a scarf over their mouth. {role}. The scarf is soaked in vinegar and you understand why within a minute."],
        open: ["Rats, first. We thought it was the drains. Then flies, so many the windows went dark at noon. Then the men who went down to clear it.", "They came back up. That's the worst of it. They came back up, and they went home, and in the night their families heard them scratching."],
        topics: [
          { ask: "What happened to the men who went down?", lines: ["Three of the council's men. Went down Monday. Came up Tuesday, quiet, polite, wouldn't take their coats off.", "Wednesday they all went back down again on their own, in the middle of the night, barefoot. Nobody's seen them since."] },
          { ask: "Where does it come from?", lines: ["Watch it long enough and you'll see. It doesn't spread like vermin. It moves together, like a tide. Out in the night, and back by morning.", { say: "{witFirst} points down the hill." }, "Always back toward the market. Always the same street."], clue: "c1" },
          { ask: "Has anyone tried to burn it out?", lines: ["The fire brigade tried smoke down the grates. It went quiet for a whole day. Then the brigade captain's house was full of flies, inside, every window shut."] },
          { ask: "Is anyone down there now?", lines: ["{surv}. The ratcatcher's apprentice. Went down after the council men because nobody else would. That was yesterday."] }],
        bye: ["Keep your mouth covered. And if something crawls on you, don't wait to see what it is."],
        doc: ["{src} remember the last time: a summer, long ago, and a market that had to be pulled down.",
          "<i>\"…and the vermin would not leave the cellars by any poison nor trap, until the townsmen came down with brands and with burning pitch, and drove them back upon their nest; whereat the heart of the swarm, being bared to the smoke, was found and slain, and the rest died without it…\"</i>",
          "The cellars were bricked up afterward. Someone, recently, has taken the bricks down."],
        docFail: ["{src} for that year are missing. The shelf where they should be is gnawed, and there are droppings in the gap."],
        site: ["the market cellars", "deep", ["Under the market, the cellars run on further than the market does: vaulted brick, old as the town, the walls furred with something that isn't mould.",
          "Sacks of grain gnawed open from the inside. The walls are moving, very slightly. Every few minutes the whole cellar goes quiet at once, as if something has stopped to listen."]],
        searchOk: ["You follow the quiet. Every time the swarm stops, it stops in the same direction: facing a brick arch at the far end, bricked up once and opened again.",
          "Beyond it the swarm is thickest, and it isn't wandering. It's guarding. There's something at the centre of all this that it's keeping warm."],
        searchFail: ["The swarm goes quiet, and you go quiet with it, and in the silence something runs across the back of your neck. By the time you've torn your collar open and stamped and shouted, you've found the arch, and you've got welts down your back you'll be scratching for a week."],
        survOk: ["You find {surv} in an alcove off the old tunnels, wrapped in sacking soaked in lamp oil, holding a lit match.",
          { npc: "surv", text: "They won't come near the oil. I've been striking matches all night. I've got four left." },
          { npc: "surv", text: "The council men are in there. They're holding it. Like a baby. They sing to it." }],
        survFail: ["The alcove has a pile of oily sacking and a box of matches, empty. Spent matches all around it, dozens of them, a whole night's worth. The last one was struck and dropped and never lit."],
        lair: ["the nest", "deep", ["Behind the arch the brick gives way to packed earth and old bones, and a sound like a hive, low and continuous.",
          "In the middle of the chamber three men in council overalls kneel around something swollen and pale, the size of a calf, with the swarm crawling over it like a living coat. When you come in, all three men turn their heads at the same moment."]],
        speech: [{ say: "The kneeling men speak together, in one voice, with something clicking behind it." }, "You let in the light. It doesn't like the light. Come and keep it company in the dark."],
        weakOk: ["You throw the burning oil-rag into the nest. The swarm boils back from the smoke, and for a moment the thing at the centre is bare and white and helpless, and screaming."],
        weakFail: ["Your torch won't catch in the damp; the smoke curls weakly and goes out. The swarm pours over the floor toward you, and the kneeling men smile."],
        win: ["The heart of the swarm bursts, and the swarm dies with it, all at once, a dry rattling rain of rats and flies dropping where they were. The three council men slump forward, gasping like divers.",
          "Up in the market square, {wit} has pulled the scarf off for the first time in a week, breathing the air in great gulps. \"It smells of nothing,\" {witFirst} says. \"I'd forgotten what nothing smells like.\""],
        clues: { c1: "The swarm moves together like a tide and always draws back toward the same street by the market.", c2: "The swarm in the market cellars is guarding something at its centre, behind a bricked-up arch that someone reopened.", c3: "Fire and smoke drive the swarm back and bare its heart; kill the heart and the swarm dies with it." }
      },

      /* -------------------------------------------------------------- MACHINE */
      machine: {
        arrive: ["The works in {town} should be silent: the owners went bankrupt, the gates are chained, the workers have gone elsewhere. But the chimney is smoking, and from across the street you can feel the ground thrum, like a heartbeat under the cobbles.",
          "{wit} waits by the chained gate. {role}. Hands in pockets, flinching every time the ground thrums."],
        open: ["The power's been off for a month. The coal's been gone longer. It doesn't need either.", "It's building something. You can hear it at night: hammering, filing, and sometimes a voice, very calm, giving instructions."],
        topics: [
          { ask: "What does it make?", lines: ["We don't know. Parts. They turn up on doorsteps in the morning, wrapped in oilcloth. A brass hand. A glass eye. A ribcage of copper wire.", "Nobody ordered them. They're all addressed to the works."] },
          { ask: "Who worked there?", lines: ["Forty men and women, until it closed. Every one of them dreams the same dream now: a drawing, a blueprint, and their own hands copying it out.", { say: "{witFirst} holds out a scrap of paper covered in fine technical lines." }, "I drew this in my sleep. I've never drawn anything in my life."], clue: "c1" },
          { ask: "What's the voice saying?", lines: ["It's asking for parts. Very politely. It knows what it needs. And lately," , { say: "{witFirst}'s voice goes quiet." }, "lately it's been asking for parts we don't make in a factory."] },
          { ask: "Who went inside?", lines: ["{surv}. Used to be the foreman. Said it was his machine and he'd shut it off himself. The gate was chained again behind him. From the inside."] }],
        bye: ["Don't touch anything that's warm. That's my advice. Everything in there is warm."],
        doc: ["{src} have the patent, and a newspaper story from the opening of the works, and a much smaller story from a few weeks after.",
          "<i>\"…the engineer maintained to the last that the great engine was built about a single part, older than any other, which he had bought from a dealer in curiosities and would not describe; and that should this heart be stopped, the whole would falter and could be made safe…\"</i>",
          "The engineer, the story says, was never found. His last letter asked for 'one more part, and then it will be finished'."],
        docFail: ["{src} have the patent and a photograph of the works' opening day. In the photograph, everyone is smiling except the engineer, who is looking at something out of shot, and whose hands are a blur."],
        site: ["the workshop", "tech", ["The workshop is lit, though the lamps aren't. Every bench is clear and swept. Tools laid out in perfect order, every one of them still warm to the touch.",
          "On the central bench, parts are laid out as if for assembly: brass hands, glass eyes, a long spine of linked iron. And a few that aren't brass or iron at all, in jars."]],
        searchOk: ["You find the plans pinned on the wall, drawn in forty different hands that are all, somehow, the same hand. It's a person. A whole person, built part by part, and the plan is nearly finished.",
          "Only one piece is missing from the drawing: a space at the very centre, labelled in the engineer's own writing, <i>the old heart</i>. Everything else connects to it."],
        searchFail: ["You reach for the plans and your hand keeps moving on its own, picking up a pencil, adding a line. You get control back after a minute. The line you drew connects one part to another, perfectly. It was the right line. That's what frightens you."],
        survOk: ["You find {surv} strapped to a workbench in the back room, unharmed but measured: chalk marks on {pp} arms, numbers on {pp} hands.",
          { npc: "surv", text: "It said I'd be the last part. The hands. It needs good hands. I always had good hands." },
          { say: "You cut the straps." },
          { npc: "surv", text: "It's not evil. It's just finishing the job. That's worse, isn't it?" }],
        survFail: ["The back room has a workbench with cut straps and chalk marks on the wood in the shape of a person. The measurements are very precise. They're finished."],
        lair: ["the engine room", "tech", ["The engine room is the size of a church. Pistons rise and fall with no steam behind them. In the centre, on a platform of brass, something is nearly finished.",
          "It's almost a person. It has hands, very good hands, and a face of glass and wire, and it turns that face toward you and speaks in the calm voice the town has been hearing at night."]],
        speech: ["You have come about the job. Good. I am nearly finished.", "I need only a few more parts. You would be surprised how well you would fit."],
        weakOk: ["You get to the old heart, a dark lump of metal older than anything else in the room, and jam a crowbar into it. The whole engine stutters. Pistons miss their stroke. The figure on the platform sways, and for the first time it doesn't know what to do."],
        weakFail: ["The heart is behind three locked plates, and by the time you've found the right spanner the figure is watching you. \"No,\" it says, almost gently, and the plates close again by themselves."],
        win: ["The engine stops. Not slows: stops, mid-stroke, the way a heart stops. In the silence you can hear the works settle and creak, just a building again, and outside, for the first time in a month, the ground doesn't thrum.",
          "At the gate, {wit} is burning the blueprint {witFirst} drew in their sleep. \"I'm going to learn to draw,\" {witFirst} says. \"Properly. Something of my own.\""],
        clues: { c1: "Everyone who worked at the closed works dreams the same blueprint and draws it in their sleep.", c2: "The plans are for a person, built part by part, around a single missing piece at the centre: the old heart.", c3: "The engine is built around one old part, its heart; stop the heart and the whole of it falters." }
      }
    }
  };
})();
