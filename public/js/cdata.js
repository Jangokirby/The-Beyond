/* ============================================================================
   CAMPAIGN DATA — agencies, time periods, backgrounds, level-up benefits.
   Everything here is plain data so a GM (or you) can add more:
     AGENCIES.push({ id, name, short, founded, ... })
   An agency is available in any year >= its founding year.
   ========================================================================== */
(function () {
  const C = (window.CDATA = {});

  C.AGENCIES = [
    { id: "OID", name: "Order of Infinite Dark", short: "OID", founded: 800, home: "France, wandering",
      blurb: "Knights, rites and ancient steel. The oldest order against the Beyond, still loyal to the old ways.",
      style: "Ceremonial armor, holy weapons, ancient rites.", crest: "OID" },
    { id: "WCA", name: "Wells and Constantine Association", short: "WCA", founded: 1853, home: "London",
      blurb: "Sharp suits, thorough investigation, secret government agreements. The origin of every modern agency.",
      style: "Professional, polished, prepared.", crest: "WCA" },
    { id: "NSBD", name: "North and South American Beyond Division", short: "NSBD", founded: 1910, home: "The Bahamas",
      blurb: "Stretched thin across two continents. Self-reliant agents who act on their own judgment, far from backup.",
      style: "Rugged, practical, built for survival.", crest: "NSBD" },
    { id: "EHG", name: "The Emperor's Heavenly Guard", short: "EHG", founded: 1949, home: "Japan",
      blurb: "Born from the ruptures after the bomb. Fast, casual, efficient, and sometimes brutal.",
      style: "Casual clothes, quick decisions.", crest: "EHG", emblem: "emblem" },
    { id: "BFV", name: "Black Fang Vanguard", short: "BFV", founded: 2022, home: "China",
      blurb: "Large, technological and publicly friendly: drones, AI and compassionate civilian care.",
      style: "State-of-the-art tech, public-relations polish.", crest: "BFV" }
  ];

  /* Time periods. Players pick a year inside one of these. Add more freely. */
  C.ERAS = [
    { id: "medieval", name: "The Old Order", from: 800, to: 1852, sample: 1200, blurb: "Knights, plague and witch trials. Only the OID stands against what the villagers call witchcraft." },
    { id: "victorian", name: "Gaslight", from: 1853, to: 1909, sample: 1888, blurb: "Fog, telegraphs and the first organized global front. The WCA is new and secret." },
    { id: "wars", name: "The World Wars", from: 1910, to: 1948, sample: 1918, blurb: "Trenches, bombs and Beyond artifacts weaponized by governments." },
    { id: "atomic", name: "Atomic Age", from: 1949, to: 1989, sample: 1976, blurb: "Cold War paranoia and ruptures from nuclear fire. Casual dress, long nights." },
    { id: "modern", name: "Late Century", from: 1990, to: 2021, sample: 2005, blurb: "Pagers, cell phones and the internet. Every rumor spreads faster." },
    { id: "now", name: "The Present", from: 2022, to: 2100, sample: 2024, blurb: "Drones, AI and augmented reality, and a new Chinese vanguard." }
  ];

  C.agenciesIn = (year) => C.AGENCIES.filter((a) => a.founded <= year);
  C.eraOf = (year) => C.ERAS.find((e) => year >= e.from && year <= e.to) || C.ERAS[C.ERAS.length - 1];

  /* ---------------------------------------------------------------- backgrounds
     effect keys the engine understands: core (+1 to a Core Stat; "choice" = player picks),
     spBonus, hp, brBonus, bonds15, words, extraFate, patron, trait, artifact, aspectPlus.
     Everything else is carried as text on the sheet for the table to honor. */
  C.BACKGROUNDS = [
    { id: "Adrenaline Junkie", group: "Body", core: "body", text: "+1 Body, +1 to all rolls for every 10 missing in any Healing Pool." },
    { id: "Brawler", group: "Body", core: "body", hp: 10, text: "+1 Body, +10 Health, and +1 Damage." },
    { id: "Chef", group: "Body", core: "body", text: "+1 Body, start with five food items, and food you prepare heals 3 (+1 per Wealth Class above Mundane)." },
    { id: "Guardian", group: "Body", core: "body", brBonus: 2, trait: "guardian", text: "+1 Body, +2 BR, and you may take a hit meant for an ally in the same Zone." },
    { id: "Mule", group: "Body", core: "body", text: "+1 Body, Storage +2, no Strength rolls to lift large objects." },
    { id: "Detective", group: "Mind", core: "mind", trait: "detective", text: "+1 Mind, and CR is 1 lower when investigating." },
    { id: "Entrepreneur", group: "Mind", core: "mind", spBonus: 2, text: "+1 Mind, and start with 9 Spending Power instead of 7." },
    { id: "Empath", group: "Mind", core: "mind", bonds15: true, text: "+1 Mind, and all Bonds start at 15 instead of 10." },
    { id: "Healer", group: "Mind", core: "mind", text: "+1 Mind, start with 3 Medicine, heal 3 Health per day when you treat someone." },
    { id: "Tactician", group: "Mind", core: "mind", text: "+1 Mind, and once per round give an ally 1 extra action." },
    { id: "Artisan", group: "Spirit", core: "spirit", text: "+1 Spirit, and create 1 Quality item each mission." },
    { id: "Anchor", group: "Spirit", core: "spirit", extraFate: 1, text: "+1 Spirit, and 1 extra Fate Point each mission." },
    { id: "Gifted", group: "Spirit", core: "spirit", text: "+1 Spirit, and 1 extra attempt on the Death Die per mission." },
    { id: "Magician", group: "Spirit", core: "spirit", words: 5, text: "+1 Spirit, and +5 Words." },
    { id: "Zealot", group: "Spirit", core: "spirit", patron: true, text: "+1 Spirit, start with a patron; patron gifts cost 1 less Stability or Sanity." },
    { id: "Engineer", group: "Spirit", core: "choice", text: "+1 Core Stat, and you can put any Modifier on any weapon." },
    { id: "Ex-Cultist", group: "Spirit", core: "choice", mrsr: 1, text: "+1 Core Stat, +1 MR and SR, and one free cult contact per mission." },
    { id: "Average", group: "Other", core: "choice", aspectPlus: 2, text: "+2 in any Aspect and +1 Core Stat." },
    { id: "Beast Tamer", group: "Other", core: null, text: "A Feral, Medium (CR 8) companion who gains Friendly Beast (+5 in each Healing Pool)." },
    { id: "Hero", group: "Other", core: "choice", text: "+1 in a Core Stat, and a free apprentice." },
    { id: "Local", group: "Other", core: "choice", text: "+1 Core Stat; start with 3 Quality Favors and a free Mundane service each mission." },
    { id: "Mutant", group: "Other", core: "choice", text: "+1 Core Stat and 1 Mutant Trait." },
    { id: "Beyond Artifact Hunter", group: "Other", core: "choice", artifact: true, text: "+1 Core Stat and start with a Beyond Artifact." },
    { id: "Burglar", group: "Other", core: "choice", text: "+1 Core Stat; bonus vs locks and traps; add BR and ER to Falling and Trap damage." },
    { id: "Spy", group: "Other", core: "choice", text: "+1 Core Stat; hiding CR −1; a free Spy service once per mission." },
    { id: "Survivor", group: "Other", core: "choice", text: "+1 Core Stat; a Core Stat must reach −1, not 0, to kill you." },
    { id: "Trapper", group: "Other", core: "choice", text: "+1 Core Stat; one free Medium CR trap per mission; grappling CR −1." },
    { id: "Vampire Traitor", group: "Other", core: null, text: "Gain Bloodthirsty and Undead; you cannot heal from any source other than Bloodthirsty." },
    { id: "Veteran Hunter", group: "Other", core: "choice2", text: "+1 Body or Mind, and one extra Modifier on your weapon." }
  ];

  C.CORE_VALUES = { specialty: 4, good: 3, mundane: 1 };
  C.ASPECTS = {
    body: ["strength", "agility", "speed", "durability", "humors"],
    mind: ["charisma", "iq", "awareness", "willpower", "mindfulness"],
    spirit: ["occult", "faith", "ancient", "potency", "morality"]
  };
  C.ASPECT_NAMES = {
    strength: "Strength", agility: "Agility", speed: "Speed", durability: "Durability", humors: "Humors",
    charisma: "Charisma", iq: "IQ", awareness: "Awareness", willpower: "Willpower", mindfulness: "Mindfulness",
    occult: "Occult", faith: "Faith", ancient: "Ancient", potency: "Potency", morality: "Morality"
  };
  C.ASPECT_HELP = {
    strength: "Melee Attack and Damage, lifting, charging.", agility: "Raises Evasion (ER).", speed: "Turn order, fleeing, repositioning.",
    durability: "Adds to Body Resistance (BR).", humors: "+1 Health healing per rest point.", charisma: "All social rolls.",
    iq: "Knowledge, traps, locks.", awareness: "Searching, hiding, ranged weapons.", willpower: "Mind Resistance (MR).",
    mindfulness: "+1 Sanity healing per rest point.", occult: "Beyond magic (hits Sanity).", faith: "Religious magic (hits Stability).",
    ancient: "Natural/folk magic (hits Health).", potency: "Words you can string together.", morality: "Stability Resistance (SR)."
  };

  C.BENEFITS = [
    { id: "answers", name: "Answers From The Beyond", text: "Ask your GM a question about anything. (Recorded in your case log as an unanswered question.)" },
    { id: "artifact", name: "Beyond Artifact", text: "Choose a Beyond Artifact." },
    { id: "patron", name: "Gift From a Patron", text: "Dedicate yourself to a patron and gain abilities. May be taken again for stronger powers." },
    { id: "recovery", name: "Miraculous Recovery", text: "Remove 1 injury." },
    { id: "promotion", name: "Promotion", text: "+1 Spending Power, permanently." }
  ];

  /* ---------------------------------------------------------------- size */
  C.SIZES = [
    /* Agents start Medium and may shift one category (rulebook p.19): Small or Large. The rest come from Mutations etc. */
    { id: "tiny", name: "Tiny", er: 2, health: -10, br: 0, start: false },
    { id: "small", name: "Small", er: 1, health: -5, br: 0 },
    { id: "medium", name: "Medium", er: 0, health: 0, br: 0 },
    { id: "large", name: "Large", er: -1, health: 5, br: 1, attack: 1 },
    { id: "huge", name: "Huge", er: -2, health: 10, br: 2, attack: 2, start: false },
    { id: "giant", name: "Giant", er: -4, health: 20, br: 4, attack: 4, start: false }
  ];

  /* ---------------------------------------------------------------- weapon types (rulebook example: Melee One-Handed +2) */
  C.WEAPON_TYPES = [
    { name: "Melee One-Handed", bonus: 2, range: 0, aspect: "strength" },
    { name: "Melee Two-Handed", bonus: 4, range: 0, aspect: "strength" },
    { name: "Ranged One-Handed", bonus: 1, range: 1, aspect: "awareness" },
    { name: "Ranged Two-Handed", bonus: 3, range: 2, aspect: "awareness" }
  ];
  C.ARMOR_TYPES = [
    { name: "Breezy", br: 0, er: 3 }, { name: "Light", br: 1, er: 2 },
    { name: "Medium", br: 2, er: 1 }, { name: "Heavy", br: 3, er: 0 }
  ];
})();
