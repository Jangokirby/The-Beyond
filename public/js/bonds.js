/* ============================================================================
   BONDS — who each Bond is, and how a day with them goes.

   A Bond has a type (parent, partner, old friend, mentor...). The type
   decides how a visit can be spent: three choices, each with its own
   scenes. The rules effect of a visit is the book's and doesn't change
   (Sanity back, the Bond firmed up); this is only what the day looks like.
   Lines use the hideout's words: {a} the agent, {b} the Bond's first name,
   {rel} what they are to the agent, {food} {drink} {street} {music} {news}
   {game} {light} from the era.
   Bonds also get a face (BONDS.face) so the visit shows who you're with.
   ========================================================================== */
(function () {
  const T = {
    parent: { label: "Parent", age: "old", rels: ["Mother", "Father", "Stepmother", "Stepfather"], acts: [
      { id: "dinner", label: "Sunday dinner", lines: [
        "{b} has cooked enough for six. {a} eats until it hurts, and {b} watches every mouthful as if counting them. Nobody mentions the bandage.",
        "Dinner at {b}'s table, the same chipped plates as always. {b} talks about the neighbours, the roof, a cousin's wedding. {a} lets every word land like rain on a dry field." ] },
      { id: "fix", label: "Fix something around the house", lines: [
        "The back step has been loose since spring. {a} fixes it while {b} supervises from the doorway with {drink}, telling {a} it's being done wrong. It's being done exactly right.",
        "{a} spends the afternoon on a ladder clearing the gutters. When {a} comes down, {b} is holding the ladder with both hands, the way {b} did when {a} was nine." ] },
      { id: "sit", label: "Just sit with them", lines: [
        "They sit by the window with {music} on low. {b} falls asleep halfway through a sentence. {a} stays until the light goes, watching {b} breathe.",
        "{b} gets out the old photographs again. {a} has seen every one a hundred times and asks about each one anyway." ] } ] },
    sibling: { label: "Brother or sister", age: "adult", rels: ["Sister", "Brother", "Twin", "Half-brother", "Half-sister"], acts: [
      { id: "old", label: "Do what you did as kids", lines: [
        "{a} and {b} end up playing {game} at the kitchen table like they're twelve again. {b} still cheats. {a} still lets it go, and still pretends not to.",
        "They walk the old route along {street}, past the corner where {b} broke an arm and the wall {a} once fell off. They argue about who dared who. They both remember it wrong." ] },
      { id: "drink", label: "Get a drink and talk straight", lines: [
        "Two glasses of {drink}, then three. {b} says, 'You look like death,' and {a} laughs for the first time in a week. {b} doesn't ask what happened. {b} knows not to.",
        "{b} talks about money trouble and a bad landlord, and {a} listens, glad of a problem small enough to solve. {a} leaves some cash under the sugar bowl." ] },
      { id: "help", label: "Help with their trouble", lines: [
        "{b} needs a hand moving house. {a} carries boxes all day and is grateful for the honest ache of it.",
        "{b} has a fight brewing with someone at work. {a} talks it through with {b} for an hour and feels, for once, like the sensible one." ] } ] },
    partner: { label: "Partner or spouse", age: "adult", rels: ["Wife", "Husband", "Partner", "Fiancée", "Fiancé", "Sweetheart"], acts: [
      { id: "home", label: "A whole day at home", lines: [
        "No alarms, no telephone. {b} makes {food} and they eat it in bed. {a} sleeps through the afternoon with {b}'s hand on {a}'s back, and doesn't dream at all.",
        "They do nothing on purpose: the crossword, {music}, the cat. When {b} finds the new scar, {b} just kisses it and says nothing, and that is the kindest thing anyone has done in months." ] },
      { id: "out", label: "Go out somewhere", lines: [
        "{a} takes {b} dancing, badly. They walk home along {street} with {b}'s coat over both their shoulders, and for an hour {a} forgets the job entirely.",
        "A cheap dinner somewhere with candles. {b} talks about the future as if there will definitely be one, and {a} decides to believe it, just for tonight." ] },
      { id: "tell", label: "Tell them some of the truth", lines: [
        "{a} tells {b} a little. Not the worst of it. {b} goes very quiet, then says, 'Come home in one piece. That's all I'm asking.' {a} promises. They both know what a promise is worth.",
        "{a} starts to explain and can't. {b} waits. In the end {b} just holds {a} until the shaking stops, and that says everything that needed saying." ] } ] },
    child: { label: "Child", age: "child", rels: ["Son", "Daughter", "Child you don't see enough", "Ward", "Godchild"], acts: [
      { id: "play", label: "Play together", lines: [
        "{b} wants to play {game} and wins, honestly, three times. {a} complains loudly. {b} is delighted. It's the best day {a} has had all year.",
        "They build a fort out of every chair in the house. {b} declares it a castle and {a} its knight. {a} defends it fiercely against the dog." ] },
      { id: "walk", label: "Take them out", lines: [
        "A walk along {street}, {b}'s hand small and sticky in {a}'s. {b} asks a hundred questions and {a} answers every one, even the impossible ones.",
        "{a} buys {b} something sweet and they share it on a bench. {b} says, 'Will you be here next week?' {a} says yes, and means to make it true." ] },
      { id: "story", label: "Tell them a story", lines: [
        "At bedtime {b} asks for a story about monsters. {a} tells one where the monster loses, every time. {b} is asleep before the end. {a} finishes it anyway.",
        "{a} reads to {b} until {b}'s breathing slows. Then {a} sits in the dark doorway for a long time, listening to the house being safe." ] } ] },
    grand: { label: "Grandparent", age: "old", rels: ["Grandmother", "Grandfather", "Great-aunt", "Old uncle"], acts: [
      { id: "stories", label: "Listen to the old stories", lines: [
        "{b} tells the story about the winter of the wolves again, and this time {a} listens properly. Some of the details sound very much like the job. {a} doesn't say so.",
        "{b} talks about people fifty years dead as if they were in the next room. {a} finds it comforting: the dead, staying where they're put." ] },
      { id: "chores", label: "Do their errands", lines: [
        "Coal, bread, the doctor, the post. {a} runs {b}'s errands up and down {street} and is scolded for the wrong change at every stop. It is wonderful.",
        "{a} reads {b} the {news} because {b}'s eyes aren't what they were. {b} has opinions about all of it, loudly." ] },
      { id: "cook", label: "Cook the old recipes", lines: [
        "{b} teaches {a} the family recipe, the one nobody else got. The kitchen fills with steam. {b} says {a} has the hands for it, which is a lie, and a gift.",
        "They cook together, and {b} hums something {a} hasn't heard since childhood. {a} memorises the tune, just in case." ] } ] },
    friend: { label: "Old friend", age: "adult", rels: ["Best friend", "Old friend from school", "Childhood friend", "Friend who knew you before"], acts: [
      { id: "night", label: "A night out like the old days", lines: [
        "{a} and {b} close the bar. {b} tells the same three jokes, and they're still funny. Walking home, {b} says, 'You're different lately.' {a} says, 'Older.' It's nearly true.",
        "They end up singing on {street} at two in the morning. Someone shouts from a window. {b} shouts back. {a} laughs so hard it hurts the ribs." ] },
      { id: "quiet", label: "Something quiet", lines: [
        "A long walk out of town, no particular reason. {b} doesn't fill the silences, which is why {a} can stand it.",
        "{b} has a new hobby and wants to show it off. {a} spends the day being shown, and enjoys every minute of something that matters to nobody but {b}." ] },
      { id: "favour", label: "Ask a small favour", lines: [
        "{a} asks {b} to keep a sealed envelope, 'just in case.' {b} puts it in the biscuit tin without a word, and that trust is worth more than {a} can say.",
        "{b} lets {a} sleep on the sofa. In the morning there's {drink} and a note: 'Whatever it is, I'm here.' {a} keeps the note." ] } ] },
    mentor: { label: "Mentor or teacher", age: "old", rels: ["Mentor who trained you", "Teacher who believed in you", "Old master", "Professor"], acts: [
      { id: "advice", label: "Ask their advice", lines: [
        "{a} lays out the last case, carefully, leaving out the impossible parts. {b} listens, then asks exactly the question {a} had been avoiding. Annoying. Useful.",
        "{b} says, 'You're carrying it wrong. Put it down for a day. It'll still be there.' {a} tries. It nearly works." ] },
      { id: "practise", label: "Practise together", lines: [
        "{b} runs {a} through the old drills until {a} is sweating and furious and better. {b} says nothing kind. {b} doesn't need to.",
        "Hours at the table going over {a}'s notes. {b} crosses out half of them in red ink. The half that's left is right." ] },
      { id: "thank", label: "Just thank them", lines: [
        "{a} tries to say thank you properly and makes a mess of it. {b} waves it away and pours {drink}. They both understand.",
        "{b} is older than {a} remembered. {a} stays longer than planned, and on the way out says the things there might not be another chance to say." ] } ] },
    comrade: { label: "Comrade", age: "adult", rels: ["Old army buddy", "Fellow agent who covers for you", "Partner from your old unit", "Someone who was there"], acts: [
      { id: "remember", label: "Remember the ones who aren't here", lines: [
        "{b} lays out a glass for each name. There are too many glasses. They drink to every one, and by the end neither of them is crying, quite.",
        "They tell the stories nobody else would believe, and {b} believes every one. It's the only place {a} doesn't have to edit." ] },
      { id: "range", label: "Keep sharp together", lines: [
        "An afternoon at the range or the gym, side by side, not talking. {b}'s grouping is still better. {a} says so. {b} pretends not to be pleased.",
        "{b} runs {a} through a few old moves on the back lot. They end up laughing on the ground, out of breath, too old for this and doing it anyway." ] },
      { id: "watch", label: "Let them keep watch", lines: [
        "{a} sleeps for twelve hours on {b}'s couch, knowing someone who understands is sitting up by the door. It's the deepest sleep in months.",
        "{b} says, 'Go on. I've got the watch.' {a} goes. Some debts are paid in exactly this coin." ] } ] },
    faith: { label: "Priest or confessor", age: "old", rels: ["Priest or confessor", "Rabbi", "Imam", "Monk who writes to you", "Old wise woman"], acts: [
      { id: "confess", label: "Confess", lines: [
        "{a} talks for an hour in the dark. {b} doesn't flinch at any of it. At the end {b} says, 'You did what you could,' and {a} nearly believes it.",
        "{a} tells {b} the one thing {a} has told nobody. {b} is quiet for a long time, then says a prayer {a} doesn't know the words to. It helps anyway." ] },
      { id: "work", label: "Help with their work", lines: [
        "{a} spends the day helping {b}: soup for the poor, a roof to patch, a funeral to set out. Simple work that does simple good. {a} needed that.",
        "{b} has {a} copy out old records by {light}. The quiet of it, the plain mattering of it, settles something in {a}." ] },
      { id: "ask", label: "Ask the hard question", lines: [
        "{a} asks {b} whether anything is really listening. {b} says, 'Something is. Whether it's kind is a separate question.' {a} has no answer to that and is oddly comforted.",
        "'Why do you keep going?' {a} asks. {b} says, 'Because someone has to stand in the doorway.' {a} thinks about doorways all the way home." ] } ] },
    ex: { label: "Old flame", age: "adult", rels: ["Ex-lover you never got over", "First love", "The one who left"], acts: [
      { id: "coffee", label: "Meet for a coffee", lines: [
        "One coffee becomes three hours. {b} laughs at the same things as always. Neither of them says the obvious thing. Both of them hear it.",
        "{b} looks well. Happier, maybe. {a} is glad, mostly, and goes home lighter for having seen it." ] },
      { id: "letter", label: "Write them a letter", lines: [
        "{a} writes {b} six pages and sends one paragraph. The reply comes the next day: short, warm, and signed the old way.",
        "{a} writes a letter that will never be sent and burns it in the grate. Some things only need saying once, even to nobody." ] },
      { id: "help", label: "Help when they need it", lines: [
        "{b} calls, in trouble, and {a} drops everything. Afterwards they stand on {street} not touching, and {b} says, 'You always came.' It's enough.",
        "{a} quietly sorts out a problem for {b} and never mentions it. {b} finds out anyway, and sends a note with one word: 'Thank you.'" ] } ] },
    neighbour: { label: "Neighbour or landlady", age: "old", rels: ["Landlady", "Childhood neighbour", "Neighbour across the hall", "Shopkeeper downstairs"], acts: [
      { id: "tea", label: "Tea and gossip", lines: [
        "{b} knows everything about everyone on {street} and tells {a} all of it over {drink}. Who's courting, who's owing, who's been seen where. It is gloriously ordinary.",
        "{b} feeds {a} until {a} can't move and complains that {a} is too thin. {a} doesn't argue. {a} is too thin." ] },
      { id: "mend", label: "Mend something for them", lines: [
        "{b}'s window has been sticking for a month. {a} fixes it in ten minutes and is treated like a conquering hero for the rest of the day.",
        "{a} carries {b}'s coal up three flights and is rewarded with {food} and a blessing in a language {a} doesn't speak." ] },
      { id: "listen", label: "Let them talk", lines: [
        "{b} is lonely and shows it by talking without stopping. {a} listens to every word and finds it restful, like rain on a roof.",
        "{b} tells {a} about a husband, long gone, and a war, long over. {a} recognises the look in {b}'s eyes and stays for another cup." ] } ] },
    confidant: { label: "Confidant", age: "adult", rels: ["Bartender who listens", "Doctor who patched you up", "Informant you trust", "Rival turned friend", "Cousin who writes to you"], acts: [
      { id: "talk", label: "Talk it all through", lines: [
        "{b} pours {drink} and says, 'Go on, then.' {a} talks for an hour. {b} interrupts exactly twice, both times to say something true.",
        "{b} has heard worse, or says so. {a} chooses to believe it and feels the weight of the last job shift a little." ] },
      { id: "games", label: "A game and no questions", lines: [
        "{game} until late. {b} plays to win and doesn't let {a} sulk. By the end {a} is thinking about nothing but the next move, which was the point.",
        "They sit over {game} and talk about nothing: weather, prices, a dog. {a} goes home with a head that feels rinsed out." ] },
      { id: "news", label: "Catch up on the neighbourhood", lines: [
        "{b} fills {a} in on {street}: who's sick, who's in trouble, what the {news} got wrong. {a} realises how long it's been since anything was this small.",
        "{b} passes on a rumour, idly, about lights in an empty house. {a} files it away and, for today, doesn't follow it." ] } ] }
  };
  const ORDER = ["parent", "sibling", "partner", "child", "grand", "friend", "mentor", "comrade", "faith", "ex", "neighbour", "confidant"];
  const TEST = [[/mother|father|parent|step/i, "parent"], [/sister|brother|sibling|twin/i, "sibling"], [/wife|husband|spouse|partner or spouse|fianc|sweetheart|^partner$/i, "partner"],
    [/\b(son|daughter|child|ward|godchild)\b/i, "child"], [/grand|great-aunt|old uncle/i, "grand"], [/mentor|teacher|master|professor/i, "mentor"],
    [/army|comrade|unit|fellow agent|was there/i, "comrade"], [/priest|confessor|rabbi|imam|monk|wise woman/i, "faith"], [/ex-lover|first love|flame|who left/i, "ex"],
    [/landlady|neighbour|shopkeeper/i, "neighbour"], [/friend/i, "friend"]];
  const B = (window.BONDS = { TYPES: T, ORDER });
  B.typeOf = (b) => (b && T[b.type] ? b.type : (TEST.find(([re]) => re.test((b && b.rel) || "")) || [null, "confidant"])[1]);
  B.def = (b) => T[B.typeOf(b)];
  B.acts = (b) => B.def(b).acts;
  B.lines = (b, actId, pick) => { const act = B.acts(b).find((x) => x.id === actId) || pick(B.acts(b)); return [pick(act.lines)]; };
  /* a face for the Bond: same in every visit, matching what they are to the agent */
  const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  B.face = (a, b) => {
    const ART = window.ART; if (!ART || !ART.portrait) return null;
    const d = B.def(b), h = hash(a.id + b.name);
    const female = /mother|sister|wife|daughter|grandmother|aunt|landlady|fiancée|stepmother|half-sister|wise woman/i.test(b.rel || "");
    const male = /father|brother|husband|\bson\b|grandfather|uncle|fiancé\b|stepfather|half-brother|monk|priest|rabbi|imam/i.test(b.rel || "");
    const sex = b.sex || (female ? "f" : male ? "m" : h % 2 ? "f" : "m");
    const origin = b.origin || a.origin;
    const age = d.age === "child" ? "child" : d.age === "old" ? "old" : "adult";
    const S = ART.SKIN || [], skin = window.PEOPLE && origin ? PEOPLE.skinFor(origin) : S[h % S.length];
    const look = { seed: b.name, sex, age, skin: (window.PEOPLE && PEOPLE.get(origin) && S.length) ? S[PEOPLE.get(origin).skin[h % PEOPLE.get(origin).skin.length]] : skin,
      hairC: age === "old" ? "#c9c9c9" : (ART.HAIRC || [])[h % 4], facial: sex === "f" || age === "child" ? "none" : ["none", "none", "moustache", "beard"][h % 4],
      hair: sex === "f" ? ["long", "bun", "bob", "ponytail"][h % 4] : ["short", "parted", "slicked", "bald"][h % 4], tags: window.PEOPLE ? PEOPLE.heritageOf(origin) : [],
      era: window.CAMP && CAMP.camp && window.CDATA ? CDATA.eraOf(CAMP.camp.year).id : undefined };
    try { const key = ART.portrait(look); return { short: b.name.split(" ")[0], src: (window.ASSETS.portraits || {})[key] || "" }; } catch (e) { return null; }
  };
})();
