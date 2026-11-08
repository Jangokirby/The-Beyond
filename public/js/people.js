/* ============================================================================
   PEOPLE — where a character is from.

   An agent (and anyone the game invents: bonds, side-job witnesses) has an
   origin and a gender. The origin gives
     names     first names by gender and family names, so a rolled name fits
     langs     the language they grew up speaking (they speak English too)
     heritage  which painted / photo portraits suit them, and skin tones for
               the drawn portraits
   draft.origin / draft.sex ("f", "m", "x" for neither or unsaid) are kept on
   the agent. PEOPLE.speaks(agent, language) and PEOPLE.caseLang(case) feed the
   optional "Local tongue" house rule in js/focus.js.
   ========================================================================== */
(function () {
  const O = [
    { id: "england", name: "England", langs: ["English"], heritage: ["european"], skin: [0, 1, 2],
      f: ["Alice", "Edith", "Mary", "Florence", "Margaret", "Eleanor", "Clara", "Harriet", "Ivy", "Rose", "Agnes", "Beatrice"],
      m: ["Arthur", "William", "George", "Thomas", "Henry", "Edward", "Albert", "Walter", "Frederick", "John", "Samuel", "Charles"],
      last: ["Blackwell", "Hale", "Whitlock", "Ward", "Ashby", "Pike", "Thorne", "Fletcher", "Cole", "Harding", "Mercer", "Lowell", "Barrow", "Crane"] },
    { id: "scot-irish", name: "Scotland and Ireland", langs: ["English", "Gaelic"], heritage: ["european"], skin: [0, 1],
      f: ["Maeve", "Morag", "Siobhan", "Fiona", "Kirsty", "Aoife", "Bridget", "Isla", "Niamh", "Catriona"],
      m: ["Declan", "Iain", "Seamus", "Callum", "Angus", "Padraig", "Lachlan", "Fergus", "Ruairi", "Malcolm"],
      last: ["Lindsay", "Quinn", "MacLeod", "Sinclair", "O'Neill", "Gallagher", "Fraser", "Murray", "Byrne", "Campbell", "Doyle", "Kerr"] },
    { id: "usa", name: "United States", langs: ["English"], heritage: ["european", "african", "latin-american"], skin: [0, 1, 2, 3, 5, 6],
      f: ["Ruth", "Dolores", "Betty", "Hazel", "Loretta", "Mae", "Jean", "Shirley", "Lillian", "Opal", "Dorothy", "Pearl"],
      m: ["Hollis", "Earl", "Clyde", "Walt", "Jesse", "Calvin", "Roy", "Floyd", "Virgil", "Marcus", "Otis", "Wendell"],
      last: ["Pruitt", "Bray", "Jessup", "Dunn", "Carver", "Holloway", "Tate", "Booker", "Garrett", "Hayes", "Reed", "Coleman", "Pryor", "McCall"] },
    { id: "france", name: "France", langs: ["French"], heritage: ["european", "mediterranean"], skin: [0, 1, 2, 3],
      f: ["Camille", "Mathilde", "Élise", "Margot", "Sylvie", "Odette", "Hélène", "Colette", "Agathe", "Simone", "Inès", "Louise"],
      m: ["Étienne", "Lucien", "Marcel", "Henri", "Julien", "Gaston", "Rémy", "Théo", "Armand", "Benoît", "Olivier", "Gérard"],
      last: ["Moreau", "Fontaine", "Girard", "Lefèvre", "Dubois", "Marchand", "Rousseau", "Chevalier", "Bonnet", "Lambert", "Faure", "Garnier"] },
    { id: "germany", name: "Germany and Austria", langs: ["German"], heritage: ["european"], skin: [0, 1, 2],
      f: ["Ingrid", "Greta", "Liesel", "Hanna", "Klara", "Annelie", "Ursula", "Frieda", "Marlene", "Sophie"],
      m: ["Dieter", "Konrad", "Friedrich", "Klaus", "Ernst", "Matthias", "Lukas", "Otto", "Wilhelm", "Jonas"],
      last: ["Brandt", "Vogel", "Hoffmann", "Krüger", "Schäfer", "Lang", "Richter", "Becker", "Weiss", "Hartmann", "Keller", "Wolf"] },
    { id: "low-countries", name: "Netherlands and Flanders", langs: ["Dutch"], heritage: ["european"], skin: [0, 1, 2],
      f: ["Aleidis", "Grietje", "Femke", "Anouk", "Saskia", "Lieke", "Marieke", "Joke", "Elke", "Wilhelmina"],
      m: ["Wouter", "Joost", "Pieter", "Maarten", "Bram", "Sander", "Jeroen", "Floris", "Hendrik", "Koen"],
      last: ["de Vries", "Janssens", "Van Dijk", "Peeters", "Bakker", "Visser", "Maes", "de Graaf", "Claes", "Mulder", "Smits", "Hendriks"] },
    { id: "nordic", name: "Scandinavia", langs: ["Swedish"], heritage: ["european"], skin: [0, 1],
      f: ["Freya", "Astrid", "Sigrid", "Linnea", "Maja", "Elin", "Solveig", "Karin", "Ingeborg", "Liv"],
      m: ["Nils", "Erik", "Lars", "Anders", "Gunnar", "Henrik", "Torsten", "Bjørn", "Olav", "Magnus"],
      last: ["Lindqvist", "Berg", "Halvorsen", "Nyström", "Dahl", "Sandberg", "Holm", "Ek", "Strand", "Lund", "Eriksen", "Sjöberg"] },
    { id: "italy", name: "Italy", langs: ["Italian"], heritage: ["mediterranean", "european"], skin: [1, 2, 3],
      f: ["Giulia", "Chiara", "Rosa", "Francesca", "Lucia", "Teresa", "Bianca", "Serena", "Vittoria", "Paola"],
      m: ["Marco", "Lorenzo", "Salvatore", "Matteo", "Enzo", "Dario", "Vittorio", "Giorgio", "Luca", "Aldo"],
      last: ["Costa", "Ricci", "Moretti", "Esposito", "Ferraro", "Romano", "Bruno", "Greco", "Conti", "Marino", "Gallo", "Rinaldi"] },
    { id: "iberia", name: "Spain and Portugal", langs: ["Spanish"], heritage: ["mediterranean"], skin: [1, 2, 3],
      f: ["Isabel", "Ana", "Carmen", "Inês", "Lucía", "Pilar", "Mercedes", "Beatriz", "Teresa", "Rocío"],
      m: ["Tomás", "Rafael", "Joaquim", "Diego", "Álvaro", "Mateus", "Ignacio", "Rodrigo", "Pedro", "Fernando"],
      last: ["Duarte", "Reyes", "Salazar", "Ferreira", "Navarro", "Pereira", "Ortega", "Moreno", "Santos", "Vidal", "Cabral", "Iglesias"] },
    { id: "east-europe", name: "Eastern Europe and Russia", langs: ["Russian"], heritage: ["european"], skin: [0, 1, 2],
      f: ["Nadia", "Irina", "Zofia", "Katya", "Milena", "Agnieszka", "Vera", "Oksana", "Darya", "Halina"],
      m: ["Dmitri", "Viktor", "Pavel", "Tadeusz", "Mikhail", "Jakub", "Alexei", "Bogdan", "Andrei", "Stanisław"],
      last: ["Ivanov", "Kowalski", "Petrov", "Varga", "Novak", "Sokolov", "Horvath", "Wiśniewski", "Volkov", "Dvořák", "Lebedev", "Kral"] },
    { id: "mexico", name: "Mexico and Central America", langs: ["Spanish"], heritage: ["latin-american"], skin: [2, 3, 4, 5],
      f: ["Dolores", "Guadalupe", "Xóchitl", "Rosario", "Marisol", "Esperanza", "Itzel", "Consuelo", "Paloma", "Yolanda"],
      m: ["Rafael", "Joaquín", "Emiliano", "Santiago", "Arturo", "Mateo", "Ignacio", "Rubén", "Cuauhtémoc", "Héctor"],
      last: ["Salazar", "Hernández", "Ortiz", "Castillo", "Mendoza", "Vargas", "Cruz", "Ramírez", "Aguilar", "Flores", "Morales", "Juárez"] },
    { id: "south-america", name: "South America", langs: ["Spanish", "Portuguese"], heritage: ["latin-american"], skin: [1, 2, 3, 4, 5],
      f: ["Valentina", "Camila", "Luana", "Florencia", "Antônia", "Catalina", "Renata", "Josefina", "Thaís", "Mariana"],
      m: ["Gabriel", "Joaquín", "Thiago", "Matías", "Caio", "Sebastián", "Benício", "Facundo", "Rodrigo", "Andrés"],
      last: ["Oliveira", "González", "Silva", "Rojas", "Souza", "Fernández", "Carvalho", "Muñoz", "Almeida", "Pacheco", "Castro", "Lima"] },
    { id: "caribbean", name: "The Caribbean", langs: ["English", "Creole"], heritage: ["afro-caribbean"], skin: [4, 5, 6, 7],
      f: ["Clementine", "Delphine", "Marcia", "Yvonne", "Esme", "Hyacinth", "Claudette", "Beulah", "Odile", "Pearline"],
      m: ["Josiah", "Winston", "Desmond", "Lionel", "Errol", "Augustin", "Cedric", "Linton", "Moïse", "Tobias"],
      last: ["Price", "Knowles", "Ferguson", "Toussaint", "Rolle", "Clarke", "Baptiste", "Bethel", "Campbell", "Augustin", "Pinder", "Johnson"] },
    { id: "west-africa", name: "West Africa", langs: ["Yoruba", "French"], heritage: ["african"], skin: [5, 6, 7],
      f: ["Amara", "Adaeze", "Folake", "Abena", "Ngozi", "Aminata", "Efua", "Yetunde", "Fatou", "Chiamaka"],
      m: ["Kofi", "Chidi", "Babatunde", "Kwame", "Oumar", "Emeka", "Yaw", "Seydou", "Olumide", "Kojo"],
      last: ["Okafor", "Achebe", "Oyelaran", "Mensah", "Diallo", "Adeyemi", "Boateng", "Traoré", "Eze", "Asante", "Ndiaye", "Balogun"] },
    { id: "east-africa", name: "East Africa", langs: ["Swahili", "Amharic"], heritage: ["african"], skin: [5, 6, 7],
      f: ["Zawadi", "Makeda", "Wanjiru", "Amani", "Tigist", "Nia", "Saba", "Achieng", "Selam", "Imani"],
      m: ["Jabari", "Tesfaye", "Kamau", "Juma", "Dawit", "Baraka", "Otieno", "Haile", "Mosi", "Abebe"],
      last: ["Mbeki", "Abara", "Mwangi", "Bekele", "Odhiambo", "Haile", "Kariuki", "Tadesse", "Njoroge", "Wolde", "Omondi", "Girma"] },
    { id: "north-africa", name: "North Africa", langs: ["Arabic", "French"], heritage: ["north-african"], skin: [2, 3, 4, 5],
      f: ["Leila", "Yasmina", "Nour", "Samira", "Amel", "Fatima", "Zineb", "Houda", "Rania", "Malika"],
      m: ["Omar", "Karim", "Youssef", "Mehdi", "Rachid", "Tarik", "Hamza", "Nabil", "Idris", "Samir"],
      last: ["Haddad", "Benali", "El Amrani", "Bouzid", "Mansour", "Cherif", "Benyamina", "Saadi", "Belkacem", "Toumi", "Zerrouki", "Hamdi"] },
    { id: "middle-east", name: "The Middle East", langs: ["Arabic", "Persian"], heritage: ["middle-eastern"], skin: [2, 3, 4],
      f: ["Layla", "Shirin", "Rania", "Dalia", "Mina", "Soraya", "Hala", "Parisa", "Noor", "Yara"],
      m: ["Tariq", "Dariush", "Sami", "Khalil", "Reza", "Faris", "Bashir", "Kaveh", "Ziad", "Nadim"],
      last: ["Haddad", "Karimi", "Nasser", "Rahimi", "Khoury", "Tehrani", "Saleh", "Farahani", "Aziz", "Mansouri", "Najjar", "Abboud"] },
    { id: "south-asia", name: "India and South Asia", langs: ["Hindi", "Bengali"], heritage: ["south-asian"], skin: [3, 4, 5, 6],
      f: ["Priya", "Anjali", "Meera", "Sunita", "Kavya", "Lakshmi", "Nandini", "Farah", "Divya", "Ishani"],
      m: ["Arjun", "Rohan", "Vikram", "Sanjay", "Imran", "Rahul", "Dev", "Anil", "Kabir", "Suresh"],
      last: ["Das", "Sharma", "Iyer", "Chatterjee", "Khan", "Patel", "Nair", "Mehta", "Bose", "Reddy", "Qureshi", "Rao"] },
    { id: "china", name: "China", langs: ["Mandarin", "Cantonese"], heritage: ["east-asian"], skin: [1, 2, 3],
      f: ["Mei", "Lin", "Xiu", "Hua", "Ying", "Jing", "Fang", "Lan", "Yan", "Qing"],
      m: ["Wei", "Jun", "Hao", "Bo", "Tao", "Lei", "Ming", "Feng", "Zhen", "Kai"],
      last: ["Chen", "Zhou", "Wang", "Liu", "Deng", "Zhang", "Huang", "Lin", "Wu", "Xu", "Guo", "Ma"] },
    { id: "japan", name: "Japan", langs: ["Japanese"], heritage: ["east-asian"], skin: [1, 2, 3],
      f: ["Yuki", "Haruka", "Ayaka", "Kaede", "Naoko", "Chihiro", "Emi", "Sachiko", "Hana", "Michiko"],
      m: ["Hiroshi", "Takeshi", "Kenji", "Daichi", "Hideki", "Daigo", "Shinji", "Ryo", "Masato", "Isamu"],
      last: ["Tanaka", "Nakamura", "Yamada", "Satō", "Nomura", "Kobayashi", "Watanabe", "Mori", "Ishikawa", "Fujita", "Hase", "Kimura"] },
    { id: "korea", name: "Korea", langs: ["Korean"], heritage: ["east-asian"], skin: [1, 2, 3],
      f: ["Soo-jin", "Min-ji", "Ji-woo", "Hye-jin", "Eun-ji", "Seo-yeon", "Yuna", "Da-eun", "Mi-rae", "Hana"],
      m: ["Min-ho", "Jae-won", "Sung-min", "Dong-hyun", "Ji-hoon", "Tae-yang", "Hyun-woo", "Seung-ho", "Joon", "Young-soo"],
      last: ["Park", "Kim", "Lee", "Choi", "Jung", "Kang", "Cho", "Yoon", "Han", "Shin", "Lim", "Seo"] },
    { id: "southeast-asia", name: "Southeast Asia", langs: ["Vietnamese", "Tagalog"], heritage: ["southeast-asian"], skin: [2, 3, 4, 5],
      f: ["Linh", "Mai", "Maricel", "Siti", "Thao", "Ligaya", "Dewi", "Hoa", "Rosalind", "Kanya"],
      m: ["Minh", "Bayani", "Arif", "Duc", "Rizal", "Somchai", "Tuan", "Joaquin", "Budi", "Anh"],
      last: ["Nguyen", "Santos", "Reyes", "Tran", "Wijaya", "Pham", "Dela Cruz", "Rahman", "Le", "Bautista", "Saetang", "Hoang"] }
  ];
  const byId = Object.fromEntries(O.map((o) => [o.id, o]));
  const R = () => (window.R && window.R.rand ? window.R.rand() : Math.random());
  const pick = (a) => a[Math.floor(R() * a.length)];
  const P = (window.PEOPLE = { ORIGINS: O, get: (id) => byId[id] || null });
  P.randomOrigin = () => pick(O).id;
  P.SEXES = [["f", "Woman"], ["m", "Man"], ["x", "Neither, or rather not say"]];
  /* rnd: an optional seeded random function, so a side job rebuilt from its seed keeps its names */
  const pk = (a, rnd) => a[Math.floor((rnd || R)() * a.length)];
  P.first = (origin, sex, rnd) => { const o = byId[origin] || pk(O, rnd); const s = sex === "f" || sex === "m" ? sex : (rnd || R)() < 0.5 ? "f" : "m"; return pk(o[s], rnd); };
  P.last = (origin, rnd) => pk((byId[origin] || pk(O, rnd)).last, rnd);
  P.name = (origin, sex, rnd) => { const o = byId[origin] ? origin : pk(O, rnd).id; return `${P.first(o, sex, rnd)} ${P.last(o, rnd)}`; };

  /* ---- languages. Everyone speaks English; an origin adds its own; the free-text field adds the rest */
  const LANGS = ["French", "German", "Dutch", "Flemish", "Swedish", "Norwegian", "Danish", "Italian", "Spanish", "Portuguese", "Russian", "Polish", "Gaelic", "Creole", "Yoruba", "Swahili", "Amharic", "Arabic", "Persian", "Hindi", "Bengali", "Urdu", "Mandarin", "Cantonese", "Japanese", "Korean", "Vietnamese", "Tagalog", "Latin"];
  P.LANGS = LANGS;
  const SAME = { Flemish: "Dutch", Chinese: "Mandarin" };
  const norm = (l) => SAME[l] || l;
  P.langsOf = (a) => {
    const out = new Set(["English"]);
    const o = byId[a.origin]; if (o) for (const l of o.langs) out.add(norm(l));
    const t = String(a.languages || "").toLowerCase();
    for (const l of [...LANGS, "Chinese"]) if (t.includes(l.toLowerCase())) out.add(norm(l));
    return [...out];
  };
  P.speaks = (a, lang) => !lang || P.langsOf(a).includes(norm(lang));
  /* the language people speak where a case happens (a case can say { lang: "French" } itself) */
  const PLACE = [[/france|burgundy|paris|saint-|normandy|provence/i, "French"], [/flanders|netherlands|holland|rotterdam|amsterdam|belgi|hollebeke/i, "Dutch"],
    [/japan|tokyo|aomori|kyoto|osaka|tōhoku|tohoku/i, "Japanese"], [/china|yunnan|chengdu|beijing|shanghai|canton/i, "Mandarin"], [/korea|seoul/i, "Korean"],
    [/germany|berlin|bavaria|austria|vienna/i, "German"], [/italy|rome|venice|naples/i, "Italian"], [/spain|madrid|mexico|argentin|peru|chile/i, "Spanish"], [/brazil|portugal|lisbon/i, "Portuguese"],
    [/russia|moscow|siberia/i, "Russian"], [/egypt|cairo|morocco|algeri|tunis|arabia|baghdad|damascus/i, "Arabic"], [/persia|iran|tehran/i, "Persian"], [/india|bombay|calcutta|delhi/i, "Hindi"]];
  P.caseLang = (a) => { if (!a) return null; if (a.lang) return a.lang === "English" ? null : a.lang; const s = `${a.setting || ""}`; for (const [re, l] of PLACE) if (re.test(s)) return l; return null; };
  /* invented people for a place: "the Liverpool docks" -> england */
  const TOWN = [[/saint-aubin|france|paris|behind the lines/i, "france"], [/edinburgh|glasgow|scot/i, "scot-irish"], [/boston|kansas|route 66|desert test|suburb|new york|chicago|texas/i, "usa"],
    [/tokyo|osaka|japan/i, "japan"], [/haverleigh|wendmere|kirkby|whitechapel|lancashire|liverpool|london|council estate|retail park|ferry port/i, "england"]];
  P.originForPlace = (text) => { for (const [re, o] of TOWN) if (re.test(String(text || ""))) return o; return null; };

  /* ---- looks. Heritage words match the painted portraits' tags (assets/painted) */
  P.heritageOf = (origin) => (byId[origin] ? byId[origin].heritage : []);
  P.skinFor = (origin) => { const o = byId[origin]; const S = (window.ART && window.ART.SKIN) || []; return o && S.length ? S[pick(o.skin)] : pick(S); };
})();
