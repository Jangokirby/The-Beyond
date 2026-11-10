/* ============================================================================
   HOW TO PLAY — the rules reference.
   One place to learn the game and to look things up mid-case:
     Quick start   the game in two minutes, and where to begin
     Chapters      every rule the game uses, in plain words, from the 2025
                   rulebook (house rules are marked "House rule")
     Lists         backgrounds, statuses, injuries, disorders, mutations, magic
                   words, weapon and armour Modifiers, zones: built from the
                   game's own data, so they always match what the game does
     Search        type a word (e.g. "bleed", "fate", "flee") to find every rule
   Opens from the title screen (How to play), the hub, and the ? button in a case.
   ========================================================================== */
(function () {
  const CAMP = window.CAMP, U = window.UI, el = U.el, R = window.R, C = window.CDATA, GD = window.GD;
  if (!CAMP || !CAMP.ui) return;
  const ui = CAMP.ui;
  const strip = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const cr = (k) => R.cr(k);

  /* ------------------------------------------------------------ the chapters (written) */
  const CH = [
    { id: "start", title: "Quick start", entries: [
      ["What the game is", `You play agents of a secret agency that fights the Beyond: a dimension that copies our fears and makes them real. You pick an era (from the Old Order to the Present) and an agency, build agents, and take cases. Between cases you heal, shop, see the people you love, and wonder what's watching.`],
      ["Your first evening", `<ol><li>On the title screen choose <b>Learn to play</b>: a short case that teaches checks, clues, talking and fighting.</li><li>Then <b>New campaign</b>: pick a time, an agency, and build (or roll) an agent.</li><li>In the hub, the <b>Missions</b> tab shows cases for your era and agency. Pick one, choose who goes, and begin. The <b>Hideout</b> is your base between cases.</li><li>Afterwards, the <b>Downtime</b> tab heals you and the <b>Quartermaster</b> sells gear.</li></ol>`],
      ["During a case", `Read the story, then choose what to do from the buttons at the bottom. Talk to people, search places, and collect <b>clues</b>: they go into the case file (top bar), with your <b>objectives</b>. When you know enough, act. Primary objectives must all be done for the case to count as solved.`],
      ["The one rule to remember", `Almost everything is <b>2d6 + an Aspect</b>, against a number. Meet or beat it and you succeed. Read the roll window: it shows every bonus and penalty, and your chance.`],
      ["Playing with friends", `<b>Live table</b> (title screen or hub) lets friends join from their own phones or computers and play their own agents. The host can turn on <b>GM tools</b> or run a whole game with <b>Run a game (GM)</b>.`]] },
    { id: "agents", title: "Making an agent", entries: [
      ["Core Stats", `Three Core Stats: <b>Body</b>, <b>Mind</b> and <b>Spirit</b>. Give one Specialty (4), one Good (3) and one Mundane (1). Each has five Aspects: you spread 4-3-2-1 points over the Specialty's Aspects, 3-2-1 over the Good, and 2-1 over the Mundane. The Aspect with 4 is your Special Aspect.`],
      ["Aspects", `<b>Body</b>: Strength (melee, lifting), Agility (Evasion), Speed (turn order, fleeing), Durability (Body Resistance), Humors (healing Health). <b>Mind</b>: Charisma (all social rolls), IQ (knowledge, locks, traps), Awareness (searching, hiding, guns), Willpower (Mind Resistance), Mindfulness (healing Sanity). <b>Spirit</b>: Occult, Faith, Ancient (magic and lore), Potency (how many magic words in a spell), Morality (Spirit Resistance).`],
      ["Healing Pools", `Three pools: <b>Health</b> (Body), <b>Sanity</b> (Mind), <b>Stability</b> (Spirit). Each starts at 5 + 5 × its Core Stat. When one reaches 0, you choose an Injury or the Death Die (see Injuries and death).`],
      ["Defence", `<b>Evasion Rating (ER)</b> = 7 + Agility + armour: attacks must reach it to hit. <b>Body Resistance (BR)</b> = armour + Durability, subtracted from Health damage. <b>Mind Resistance (MR)</b> = Willpower, against Sanity damage. <b>Spirit Resistance (SR)</b> = Morality, against Stability damage.`],
      ["Size, vision, languages", `Agents are Medium, or one step to Small (+1 ER, −5 Health) or Large (+1 BR, +5 Health, −1 ER, +1 Attack). Everyone starts with Normal Vision. You speak English and your home language; with IQ above 3 you may take another. <i>House rule: languages beyond that cost a Focus each.</i>`],
      ["Background", `Every agent has a background: a bonus to a Core Stat and an ability. See <b>Backgrounds</b> below for every one, and what the game does with it.`],
      ["Gear", `One weapon (a type, 2 Modifiers, 1 Specialty) and one armour (a type, Modifiers, a Specialty). You start with 7 Spending Power (SP) and 3 Bonds at 10.`],
      ["Bonds", `Three people you love. Visiting them in downtime restores Sanity and keeps the bond strong. A bond that falls to 0 is broken; you can rebuild it once, with the GM's say.`]] },
    { id: "checks", title: "Checks and difficulty", entries: [
      ["Making a check", `Roll 2d6, add the Aspect and any bonuses. Meet or beat the Challenge Rating (CR) to succeed. A tie succeeds (the book's own example counts it).`],
      ["Challenge Ratings", `Easy ${cr("easy")} · Medium ${cr("medium")} · Challenging ${cr("challenging")} · Dangerous ${cr("dangerous")} · Hopeless ${cr("hopeless")}. "CR +1" means one step harder.`],
      ["Situational bonus", `+2 when circumstances help: the right clothes, a clue, a clever plan. Items you carry can add their bonus too (the roll window lets you use them).`],
      ["Group checks", `Sometimes everyone rolls (sneaking past, holding a door). Usually everyone has to succeed.`],
      ["Investigating", `Searching uses Awareness; knowledge and locks use IQ; lore uses Occult, Faith or Ancient. Social rolls (persuading, lying, reading someone) use Charisma. A Detective lowers investigation CRs by 1.`],
      ["Fate Points", `Each agent gets 1 Fate Point per mission. Spend one to turn any roll into the result you want (a success, or a Critical). Unused points are kept for later missions. Using more than one in a single mission raises your <b>Noticed</b> by 1 each time.`],
      ["Noticed", `The Beyond is watching you. Each point of Noticed lowers your maximum Sanity (points 1–5) or Stability (6–10). Past 10, the Beyond starts to act on its own.`],
      ["Criticals and fumbles", `A natural 12 is a Critical (weapon Specialties trigger, extra effects). A natural 2 fails, and in a fight the enemy gets a counter-attack.`]] },
    { id: "combat", title: "Fights", entries: [
      ["Turns and actions", `Higher Speed acts first; ties go to the agents. Each agent has <b>2 actions</b> a turn: move, attack, hide, search, cast, use an item, and so on. You can repeat an action.`],
      ["Interruptions", `If your Speed is higher than the number of fighters, you get one Interruption a round: a single action during someone else's turn.`],
      ["Attacking", `Roll 2d6 + the weapon's Aspect (Strength for melee, Awareness for ranged) + the weapon type's bonus. Reach the target's ER to hit. <b>Damage = your attack total − their Resistance</b> (BR for Health, MR for Sanity, SR for Stability).`],
      ["Damage types", `Health (physical, Ancient magic), Sanity (psychological, Occult magic), Stability (paranormal, Faith magic). <b>Elemental</b> (fire, poison, ice) hits Health and ignores BR and ER. <b>Corrupted</b> hits all three pools and ignores everything. Spells ignore ER.`],
      ["Zones", `Fights happen in rooms (zones). Moving one zone costs an action. Melee needs the same zone; ranged weapons reach further. A zone where one side outnumbers the other two to one is <b>controlled</b>: the other side can only leave by fleeing or charging, and the controller gets +1 Speed.`],
      ["Hiding, fleeing, grappling", `<b>Hide</b>: Awareness vs the toughest foe's CR. <b>Flee</b>: Speed vs the toughest foe's CR, to leave the fight. <b>Grapple</b> or <b>Shove</b>: Strength vs its CR.`],
      ["Light", `Shadow gives −2 to rolls (a lantern's Glow cancels it). Bright or Dark makes you Blind (−4) without the right vision. Blinding or Pitch also costs an action.`]] },
    { id: "hurt", title: "Injuries and death", entries: [
      ["When a pool hits 0", `Choose: <b>Take an Injury</b> (regain 10 in that pool, take an injury of that kind, lose a Core Stat point, and flee for free), or <b>roll the Death Die</b>.`],
      ["The Death Die", `2d6. On 7 or more you regain half of every pool. Below 7 you are marked for death, and the GM secretly rolls: 1–3 you die now, 4–5 you have 2 to 5 days, 6 you recover with an injury. Gifted agents get one extra attempt each mission.`],
      ["Death", `If a Core Stat reaches 0, the agent dies, no roll. (A Survivor must reach −1.) When an agent dies, something of theirs may become a Beyond Artifact.`],
      ["Retiring", `After three level-ups an agent can retire: they become a person in the world, safe, and you make a new agent.`]] },
    { id: "rest", title: "Downtime and healing", entries: [
      ["Healing happens overnight", `Healing is tallied at the end of each day and needs at least 6 hours' sleep. Magic healing is instant.`],
      ["Rest options (choose one a night)", `<b>Natural Recovery</b>: 2 + Humors Health. <b>Therapy</b>: 1 + Mindfulness Sanity. <b>Meditation</b>: 1 + Potency Stability. A favourite pastime adds +1 to Therapy or Meditation.`],
      ["Other healing", `<b>Food</b>: 1 Health a day, +2 per Wealth Class above Mundane. <b>Medicine</b>: heals a pool, more with better Wealth Class. A <b>Healer</b> in the roster adds 3 Health a day. <b>Visiting a bond</b> restores Sanity. Services (doctors, therapists) can be hired.`],
      ["Spending Power and Wealth Class", `Gear, housing and vehicles cost SP to <b>commit</b> to a mission, by Wealth Class: Mundane, Quality, Advanced and up. Better classes give bigger bonuses and uses. <b>Favors</b> waive one commit cost.`],
      ["Levelling up", `Every 2 missions an agent gains a level: +1 to a Core Stat, 2 Aspect points, and one benefit: Answers From The Beyond, a Beyond Artifact, a Gift From a Patron, Miraculous Recovery (remove an injury) or Promotion (+1 SP). Aspects cap at level + 2 (your Special Aspect at level + 3).`],
      ["Patrons and artifacts", `A <b>patron</b> is a god of the Beyond who grants gifts, and asks for things in return. <b>Beyond Artifacts</b> are cursed objects with powers and memories; every one belonged to someone.`]] },
    { id: "magic", title: "Magic", entries: [
      ["Who can cast", `An agent with Occult, Faith or Ancient picks one as their Magic Source. It sets the damage type: Occult hits Sanity, Faith hits Stability, Ancient hits Health.`],
      ["Words and strings", `Spells are strings of magic words. Your <b>Word Pool</b> (5 per point of Occult + Faith + Ancient) is how many words you prepare each day. <b>Potency</b> is how many words fit in one spell, and how many Duration spells can run at once.`],
      ["Placement matters", `A word's strength is its place in the string. "Enemy, Damage, Move" hits 1 enemy for 6 (Damage ×3 in second place) and moves it 3 zones. "Damage, Move, Enemy" does 3 damage, moves 2 zones, but hits 3 enemies. Every spell needs a target word, or it targets you.`]] },
    { id: "monsters", title: "Monsters", entries: [
      ["How monsters are built", `Each monster has a type (Beyond, Construct, Divine, Feral, Folklore, Golem, Human, Spirit, Swarm, Undead), a difficulty (Easy to Hopeless, which sets its CR and raises its numbers), and Modifiers. Monsters roll Aspects using a Core value: a Body-2 monster rolls Strength at +2.`],
      ["Not everything is a monster", `Some threats are places, cursed objects or events. Many can be ended with a rite (a group roll) instead of a fight.`]] },
    { id: "house", title: "House rules", entries: [
      ["What's added", `These aren't in the rulebook and are marked where they appear: extra languages cost Focus; the corkboard theory in the case file; working contacts for Favors in downtime; Construct monsters get Attack +3 so they can fight. Settings also offers the older draft's CR table (5/8/12/16/18).`]] }
  ];

  /* ------------------------------------------------------------ lists from the game's data */
  const lists = () => {
    const L = [];
    L.push({ id: "bg", title: "Backgrounds", entries: C.BACKGROUNDS.map((b) => [b.id, `<i>${b.group}</i>. ${b.text}`]) });
    const ST = (window.GEAR && GEAR.STATUS) || {};
    const book = { bleeding: "3 Health a round for 3 rounds.", burning: "4 Elemental damage a round until you spend a whole turn putting it out.", fear: "1 Sanity a round for 3 rounds.", terrified: "3 Sanity a round for 3 rounds.", soulsevered: "3 Stability a round for 3 rounds.", frozen: "Can't move for 2 turns.", poisoned: "One fewer action for the rest of the scene.", crippled: "Body Aspects −2 until rest.", befuddled: "Mind Aspects −2 until rest.", blind: "All rolls −4.", exhausted: "All Aspects −2 for each day without sleep.", disease: "Each day: Humors vs the source CR, or all Core Stats −1.", suffocation: "All Healing Pools −1 every round.", forgetfulness: "Each day: Mindfulness vs the source CR, or lose something important.", possessed: "Controlled by an entity for 3 rounds unless Morality beats its CR each round.", beyondTouched: "No healing of any kind until the source is gone." };
    L.push({ id: "status", title: "Statuses", entries: Object.entries({ ...Object.fromEntries(Object.entries(ST).map(([k, v]) => [k, v.text])), ...book }).map(([k, t]) => [((ST[k] && ST[k].label) || k.replace(/([A-Z])/g, " $1")).replace(/^\w/, (c) => c.toUpperCase()), t]) });
    L.push({ id: "inj", title: "Injuries", entries: Object.entries(R.INJURIES).flatMap(([pool, list]) => list.map((i) => [`${i.name} (${R.POOL_LABEL[pool]})`, i.text])) });
    L.push({ id: "dis", title: "Mental disorders", entries: R.DISORDERS.map((d) => [d.name, d.text]) });
    L.push({ id: "mut", title: "Mutation traits", entries: [["How mutations work", "Roll 3d6 twice on the Mutation table: the two Aspects named swap values. An 18 gives a Mutation Trait instead."], ...R.MUTATIONS.map((m) => [m.name, m.text])] });
    if (R.WORDS) L.push({ id: "words", title: "Magic words", entries: Object.entries(R.WORDS).map(([k, w]) => [k, w.help || (typeof w.text === "function" ? strip(w.text(1, "occult")) : "")]) });
    if (GD) {
      L.push({ id: "wtype", title: "Weapon and armour types", entries: [...GD.weaponTypes.map((w) => [w.name, strip(w.text)]), ...GD.armorTypes.map((a) => [a.name + " armour", strip(a.text || `BR ${a.br}, ER ${a.er}`)])] });
      L.push({ id: "wmod", title: "Weapon Modifiers and Specialties", entries: [...GD.weaponMods.map((m) => [m.name, strip(m.text)]), ...GD.weaponSpecialties.map((m) => [m.name + " (Specialty)", strip(m.text)])] });
      L.push({ id: "amod", title: "Armour Modifiers and Specialties", entries: [...GD.armorMods.map((m) => [m.name, strip(m.text)]), ...GD.armorSpecialties.map((m) => [m.name + " (Specialty)", strip(m.text)])] });
      L.push({ id: "svc", title: "Services and wealth", entries: [...GD.wealth.map((w) => [`${w.name} (Wealth Class)`, strip(w.text)]), ...GD.services.map((s) => [s.name, strip(s.text)])] });
    }
    L.push({ id: "zones", title: "Zone effects and weather", entries: [...R.ZONE_MODS.map((z) => [z.name, z.text]), ["Weather", "Severity 1: no effect. 2: −1 to rolls. 3: −2 and you see only one zone. 4: −4 and you see only one zone."]] });
    return L;
  };

  /* ------------------------------------------------------------ the screen */
  const all = () => [...CH, ...lists()];
  ui.rulesGuide = (opts = {}) => {
    const chapters = all();
    let cur = opts.chapter || "start", q = opts.q || "";
    const body = el("div", { class: "rguide" });
    const list = el("nav", { class: "rg-nav" }), main = el("div", { class: "rg-main" });
    const search = el("input", { type: "search", class: "rg-search", placeholder: "Search the rules: bleed, fate, flee, Healer…", value: q, "aria-label": "Search the rules",
      oninput: (e) => { q = e.target.value; draw(); } });
    const entry = (ch, [t, html]) => el("details", { class: "fold rg-entry", open: q || ch.id === "start" ? "open" : null }, el("summary", {}, t), el("div", { class: "small", html }));
    const draw = () => {
      list.replaceChildren(...chapters.map((ch) => el("button", { class: "segbtn" + (!q && ch.id === cur ? " on" : ""), onclick: () => { cur = ch.id; q = ""; search.value = ""; draw(); main.scrollTop = 0; } }, ch.title)));
      if (q.trim().length >= 2) {
        const words = q.toLowerCase().split(/\s+/).filter(Boolean);
        const hits = [];
        for (const ch of chapters) for (const e of ch.entries) { const hay = (e[0] + " " + strip(e[1])).toLowerCase(); if (words.every((w) => hay.includes(w))) hits.push([ch, e]); }
        main.replaceChildren(el("h3", {}, `${hits.length} result${hits.length === 1 ? "" : "s"} for “${q}”`), ...hits.slice(0, 80).map(([ch, e]) => el("div", {}, el("p", { class: "eyebrow" }, ch.title), entry(ch, e))));
        if (!hits.length) main.append(el("p", { class: "small muted" }, "Nothing matches. Try a shorter word."));
      } else {
        const ch = chapters.find((c) => c.id === cur) || chapters[0];
        main.replaceChildren(...[el("h3", {}, ch.title), ...ch.entries.map((e) => entry(ch, e)),
          ch.id === "monsters" && ui.libraryBody0 ? ui.libraryBody0() : null,
          ch.id === "start" && window.TUTORIAL && !(window.GAME && GAME.state) ? el("button", { class: "btn primary", onclick: () => { U.closeModal && U.closeModal(); window.TUTORIAL.start(); } }, "Play the tutorial case") : null].filter(Boolean));
      }
    };
    body.append(search, el("div", { class: "rg-cols" }, list, main));
    draw();
    return body;
  };
  /* the old library (example monsters, monster calculator, deities) becomes part of the Monsters chapter */
  ui.libraryBody0 = ui.libraryBody;
  ui.libraryBody = () => ui.rulesGuide();
  ui.library = (back) => ui.mount(el("div", { class: "cwrap" }, el("h2", {}, "How to play"), ui.rulesGuide(), el("div", { class: "row" }, ui.btn("Back", back || (() => (CAMP.camp ? ui.hub() : ui.title())), "ghost"))));
  ui.rulesModal = (q) => U.modal({ title: "How to play", cls: "wide rgmodal", body: ui.rulesGuide({ q: q || "" }) });

  /* title: rename the button; hub: add one; in a case: a ? button */
  const title0 = ui.title;
  ui.title = (...a) => { const r = title0(...a); document.querySelectorAll(".title-actions button").forEach((b) => { if (b.textContent === "Rules library") b.textContent = "How to play"; }); return r; };
  const hub0 = ui.hub;
  ui.hub = (...a) => { const r = hub0(...a); const row = document.querySelector(".hubtitle") && document.querySelector(".hubtitle").parentElement.querySelector(".row"); if (row && !row.querySelector(".rgbtn")) row.insertBefore(ui.btn("How to play", () => ui.rulesModal(), "ghost small rgbtn"), row.lastElementChild); return r; };
  document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
      const caseBtn = document.querySelector("#btn-case"), bar = caseBtn && caseBtn.parentNode;
      if (bar && !document.querySelector("#rgbtn")) bar.append(el("button", { id: "rgbtn", class: "icon-btn labeled", "aria-label": "How to play", title: "Rules: look anything up", onclick: () => ui.rulesModal() }, el("span", { class: "ico", "aria-hidden": "true" }, "?"), el("span", { class: "txt" }, "Rules")));
    }, 1000);
  });
})();
