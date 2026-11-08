// Character generator: builds a full, locked character sheet for a new woman
// (framework v9 + chat roulette rules). Everything is seeded so a woman can be
// rebuilt from her seed, and biased by what the player tends to swipe right on.

export function rng(seed) {
  let a = seed >>> 0;
  const r = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  r.int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
  r.chance = (p) => r() < p;
  r.some = (arr, n) => {
    const c = arr.slice(), out = [];
    while (out.length < n && c.length) out.push(c.splice(Math.floor(r() * c.length), 1)[0]);
    return out;
  };
  // weighted pick: items [{v, w}] or object {value: weight}
  r.weighted = (obj) => {
    const entries = Object.entries(obj);
    const total = entries.reduce((s, [, w]) => s + Math.max(0, w), 0);
    let x = r() * total;
    for (const [k, w] of entries) { x -= Math.max(0, w); if (x <= 0) return k; }
    return entries[entries.length - 1][0];
  };
  return r;
}

// ---------- data ----------
export const ETHNICITIES = {
  "white-american": { label: "white American", names: ["Emma","Hannah","Madison","Kayla","Brooke","Lauren","Megan","Ashley","Taylor","Sydney","Paige","Morgan","Kelsey","Rachel","Jenna","Abby","Haley","Chloe","Riley","Avery","Claire","Natalie","Shelby","Mackenzie"], last: ["Miller","Carter","Hayes","Bennett","Collins","Reed","Parker","Brooks","Sullivan","Ward"], origin: ["Ohio","Texas","Oregon","Colorado","North Carolina","Michigan","Florida","Minnesota"], skin: ["fair with warm peachy undertones","light with neutral undertones and a faint summer tan","pale porcelain with cool pink undertones","light olive-beige with a sun-kissed glow"], hair: ["honey blonde","dirty blonde","ash blonde","light brown","chestnut brown","dark brown","strawberry blonde","copper red","platinum blonde"], eyes: ["blue","grey-blue","green","hazel","light brown"] },
  "eastern-european": { label: "Eastern European", names: ["Anya","Katya","Daria","Milena","Oksana","Polina","Alina","Veronika","Irina","Natalia","Kristina","Sofia","Zlata","Yana","Lena"], last: ["Volkova","Novak","Kowalska","Petrova","Horvat","Dvorak"], origin: ["Ukraine","Poland","Czechia","Russia","Serbia","Croatia","Belarus"], skin: ["fair with cool pink undertones","pale ivory with neutral undertones","light with a faint olive undertone"], hair: ["ash blonde","platinum blonde","dark blonde","light brown","dark brown","jet black","auburn"], eyes: ["ice blue","grey","green","blue-grey","hazel"] },
  "mediterranean": { label: "Mediterranean", names: ["Giulia","Chiara","Elena","Sofia","Marta","Lucia","Ines","Alessia","Bianca","Daphne","Eleni","Valentina","Carla"], last: ["Rossi","Esposito","Romano","Papadopoulos","Ferreira","Costa"], origin: ["Italy","Greece","Spain","Portugal","southern France"], skin: ["warm olive","light olive with golden undertones","sun-tanned olive","golden beige"], hair: ["dark brown","espresso brown","black","chestnut","caramel brown"], eyes: ["dark brown","hazel","amber","green","warm brown"] },
  "latina": { label: "Latina", names: ["Valeria","Camila","Isabella","Daniela","Lucia","Mariana","Gabriela","Sofia","Ximena","Paola","Andrea","Natalia","Renata","Alejandra","Yesenia","Bianca"], last: ["Garcia","Martinez","Lopez","Hernandez","Ramirez","Torres","Flores","Rivera","Morales","Vargas"], origin: ["Mexico","Colombia","Puerto Rico","Argentina","Venezuela","Peru","Dominican Republic","Cuba","Texas"], skin: ["warm caramel with golden undertones","light tan with olive undertones","medium brown with warm undertones","golden honey","light beige with a warm glow"], hair: ["dark brown","black","chocolate brown","dark brown with caramel balayage","auburn-brown"], eyes: ["dark brown","warm brown","hazel","amber","light brown"] },
  "black": { label: "Black American", names: ["Jasmine","Aaliyah","Imani","Brianna","Kiara","Destiny","Nia","Jada","Zoe","Maya","Tiana","Alexis","Simone","Kennedy","Amara","Jordan"], last: ["Johnson","Williams","Jackson","Brown","Davis","Harris","Robinson","Thomas"], origin: ["Atlanta","Chicago","Houston","Maryland","New York","Detroit","Charlotte"], skin: ["deep brown with warm red undertones","rich medium brown with golden undertones","dark ebony with cool undertones","light brown with warm honey undertones","caramel brown"], hair: ["black","dark brown","black with honey-blonde highlights","dark brown with copper tint"], eyes: ["dark brown","deep brown","warm brown","light hazel-brown"], textures: ["tight coily","curly","braided","sleek pressed straight","loose curly"] },
  "african": { label: "African", names: ["Amara","Zainab","Chiamaka","Adaeze","Nala","Wanjiru","Thandiwe","Ayana","Efua","Folake","Nadia","Ama"], last: ["Okafor","Mensah","Adeyemi","Mwangi","Diallo","Nkosi"], origin: ["Nigeria","Ghana","Kenya","South Africa","Senegal","Ethiopia"], skin: ["deep chocolate with warm undertones","dark brown with cool undertones","rich mahogany","medium brown with golden undertones"], hair: ["black","dark brown"], eyes: ["dark brown","deep brown"], textures: ["coily","braided","short natural","long braids"] },
  "east-asian": { label: "East Asian", names: ["Mei","Yuna","Hana","Jiwoo","Sakura","Lin","Xinyi","Minji","Aiko","Seoyeon","Rin","Yuki","Jia","Haruka","Soo-ah","Chloe"], last: ["Kim","Park","Lee","Chen","Wang","Tanaka","Sato","Nguyen","Lin","Choi"], origin: ["Korea","Japan","Taiwan","China","California","Vancouver"], skin: ["fair with neutral undertones","light ivory with warm undertones","porcelain with cool pink undertones","light beige with golden undertones"], hair: ["jet black","soft black","dark brown","ash brown","dyed honey brown","dyed rose pink"], eyes: ["dark brown","deep brown","light brown"], eyeShapes: ["monolid almond","soft hooded almond","round double-lidded","upturned almond"] },
  "south-asian": { label: "South Asian", names: ["Priya","Ananya","Isha","Riya","Kavya","Aisha","Sana","Neha","Diya","Meera","Zara","Tara","Anika","Pooja"], last: ["Patel","Sharma","Singh","Gupta","Khan","Reddy","Iyer","Malik"], origin: ["India","Pakistan","Bangladesh","Sri Lanka","New Jersey","London","Toronto"], skin: ["warm medium brown with golden undertones","light wheatish with warm undertones","deep brown with neutral undertones","caramel with olive undertones"], hair: ["black","dark brown","black with soft brown highlights"], eyes: ["dark brown","deep brown","light brown","hazel"] },
  "southeast-asian": { label: "Southeast Asian", names: ["Linh","Mai","Thao","Angel","Bea","Kim","Ploy","Mint","Nicole","Jasmine","Ayu","Dewi","Trinh","Joy"], last: ["Nguyen","Tran","Santos","Reyes","Cruz","Wong","Pham","Dela Cruz"], origin: ["Philippines","Vietnam","Thailand","Indonesia","Malaysia","California"], skin: ["golden tan with warm undertones","light morena with olive undertones","warm light brown","fair with golden undertones"], hair: ["black","dark brown","dyed caramel brown","black with ash highlights"], eyes: ["dark brown","deep brown","warm brown"], eyeShapes: ["almond","round","upturned almond","soft hooded"] },
  "middle-eastern": { label: "Middle Eastern", names: ["Leila","Yasmin","Noor","Dalia","Rania","Shirin","Mina","Lina","Sara","Nadia","Farah","Layla","Selin","Deniz"], last: ["Haddad","Khalil","Rahimi","Aziz","Nasser","Yilmaz","Karimi"], origin: ["Lebanon","Iran","Turkey","Jordan","Egypt","Morocco","Michigan"], skin: ["light olive with warm undertones","warm beige","golden olive","light tan with neutral undertones"], hair: ["black","dark brown","espresso brown","dark brown with caramel highlights"], eyes: ["dark brown","hazel","green","amber","deep brown"] },
  "mixed": { label: "mixed", names: ["Kaia","Leilani","Mila","Nova","Skye","Aria","Luna","Jade","Sienna","Talia","Zuri","Elise","Naomi"], last: ["Silva","Santos","Kealoha","Bishop","Monroe","Grant"], origin: ["Hawaii","Brazil","California","London","Toronto","New York"], mixes: ["Black and white","Korean and white","Filipina and white","Mexican and white","Japanese and Brazilian","Puerto Rican and Black","Indian and Irish","Lebanese and Brazilian","Vietnamese and French","Hawaiian and Japanese"], skin: ["light caramel with golden undertones","warm tan","honey beige","light brown with olive undertones","golden olive"], hair: ["dark brown","black","light brown with sun-lightened ends","curly dark brown","chestnut"], eyes: ["hazel","light brown","green","dark brown","amber"], textures: ["loose curly","wavy","straight","big curly"] },
};

const CITIES = ["Austin","Denver","Chicago","Seattle","Portland","San Diego","Brooklyn","Atlanta","Nashville","Phoenix","Minneapolis","Miami","Los Angeles","Boston","Philadelphia","Salt Lake City","Raleigh","Columbus","Tampa","Sacramento","a college town nearby","the suburbs nearby","downtown"];

const JOBS = {
  young: ["college student (psych major)","nursing student","barista","bartender","retail at a boutique","art student","waitress at a brunch spot","receptionist at a salon","gym front desk","dental assistant","dance student","grad student in biology","vet tech","daycare aide","part-time model and student"],
  adult: ["ER nurse","graphic designer","elementary school teacher","marketing coordinator","fitness instructor","real estate agent","hairstylist","software tester","paralegal","physical therapist","social media manager","flight attendant","yoga teacher","tattoo artist","freelance photographer","accountant","event planner","pharmacist","bartender","makeup artist","UX designer","lab tech","personal trainer","architect","HR manager","sous chef","nail tech who owns her own studio","veterinarian","bank teller","dental hygienist"],
};

export const GOALS = {
  casual: { label: "Something casual", desc: "You want a hookup. If you're attracted you're happy to escalate fast and get sexual. Boring or needy guys lose you quickly.", cap: 5, openness: 2.0 },
  fwb: { label: "Friends with benefits", desc: "You want something ongoing and casual, but you need to actually like hanging out with him too.", cap: 5, openness: 1.3 },
  dating: { label: "Long-term, open to short", desc: "You want real chemistry and a connection first. Pure sexual advances early on turn you off, but once you really like someone you open up a lot.", cap: 4, openness: 0.4 },
  attention: { label: "Here for fun", desc: "You're mostly bored and like attention, compliments and flirting. You may not go far, and you lose interest once you've had your fun.", cap: 3, openness: 0.9 },
  curious: { label: "Still figuring it out", desc: "You're curious and seeing where things go. Your mood decides a lot.", cap: 4, openness: 1.0 },
  friends: { label: "New friends", desc: "You honestly want friends and good conversation. Nothing sexual; if it turns that way you lose interest.", cap: 0, openness: -1.5 },
};

export const BODY_TYPES = {
  petite: "petite, delicate frame",
  slim: "slim and slender",
  athletic: "athletic and toned",
  hourglass: "soft hourglass, narrow waist with noticeable hips",
  fit: "fit and lean with gentle curves",
  leggy: "long and leggy",
  curvy: "curvy and full-figured",
};

const BREASTS = { petite: ["small and perky","small, natural teardrop shape","modest and perky"], slim: ["small and perky","modest, natural shape","modest and round"], athletic: ["modest and firm","small and perky","full and firm"], hourglass: ["full and round","full natural teardrop shape","large and soft"], fit: ["modest and perky","full and natural","modest teardrop shape"], leggy: ["small and perky","modest and natural"], curvy: ["large and soft","very full and natural","full and heavy"] };
const HIPS = { petite: ["slim hips and a small round butt","narrow hips, small perky butt"], slim: ["slim hips, small tight butt","gentle hips and a pert butt"], athletic: ["firm round glutes from training","toned hips and a lifted athletic butt"], hourglass: ["wide hips, round full butt","flared hips with a heart-shaped butt"], fit: ["gently flared hips and a round butt","toned hips and a perky round butt"], leggy: ["narrow hips and a small lifted butt","slim hips with a round high butt"], curvy: ["wide soft hips and a big round butt","thick hips and thighs"] };
const HEIGHTS = { petite: ["very short and tiny (about 4'11\")","petite (around 5'0\")","short (about 5'1\")"], slim: ["average height (5'4\")","a little tall (5'6\")","average (5'5\")"], athletic: ["average height (5'5\")","tallish (5'7\")","5'4\""], hourglass: ["5'3\"","average height (5'5\")","5'6\""], fit: ["5'4\"","5'6\"","5'7\""], leggy: ["tall (5'9\")","tall (5'10\")","tall (5'8\") with very long legs"], curvy: ["5'3\"","5'5\"","5'6\""] };

const FACE_SHAPES = ["oval","heart-shaped","soft round","soft square","diamond","long oval"];
const JAW = ["soft rounded jaw","delicate pointed chin","defined jawline","soft square jaw","small rounded chin"];
const CHEEKS = ["high cheekbones","full soft cheeks","prominent cheekbones","subtle cheekbones with dimples when she smiles","rounded apple cheeks"];
const NOSE = ["small button nose","slightly upturned nose","straight narrow nose","soft rounded nose tip","small nose with a gentle bump on the bridge","wide soft nose","delicate straight nose"];
const LIPS = ["full lower lip","full plump lips","thin lips with a defined cupid's bow","heart-shaped lips","wide smile with full lips","small rosebud lips"];
const EYE_SHAPES = ["almond-shaped","large round","hooded","upturned almond","doe-like","cat-like upturned"];
const BROWS = ["thick straight brows","soft arched brows","thin defined brows","full natural brows","bold arched brows"];
const FACE_EXTRAS = ["light freckles across the nose","a small beauty mark above her lip","a tiny mole under her left eye","faint freckles on her cheeks","a small scar through her right eyebrow","dimples","a beauty mark on her cheek","a gap between her front teeth","no marks, clear skin"];
const LENGTHS = ["pixie-short","chin-length bob","shoulder-length","collarbone-length","mid-back length","long, past her shoulders","very long, down to her waist"];
const TEXTURES = ["straight","silky straight","wavy","loose beach waves","curly","thick and wavy"];
const STYLES = ["usually down","often in a messy bun","usually in a high ponytail","with curtain bangs","often in a claw clip","in a sleek low bun for work","in loose braids"];
const MARKS = ["a small fine-line flower tattoo on her ribs","a tiny star tattoo behind her ear","a delicate script tattoo on her wrist","a snake tattoo on her thigh","a sleeve of floral tattoos on her left arm","a butterfly tattoo on her lower back","a nose stud","a septum ring","a belly button piercing","double ear piercings","a tiny heart tattoo on her hip","a moon tattoo on her ankle","a small scar on her knee"];
const PUBIC = ["shaved","shaved","trimmed","trimmed","neatly trimmed landing strip","natural"];

const TRAITS = ["sarcastic","sweet","teasing","shy at first","confident","bubbly","chill","nerdy","flirty","blunt","witty","romantic","chaotic","ambitious","caring","bratty","dry-humored","adventurous","clingy once she likes someone","jealous","goofy","mysterious","competitive","dramatic","laid-back","intense","playful","emotionally open","guarded","spontaneous","overthinker","loyal","impatient","curious"];

const INTERESTS = {
  gaming: { tag: "gamer", list: ["playing Valorant","cozy games like Stardew","Elden Ring","Zelda","Overwatch","Minecraft with friends","horror games","streaming on Twitch"] },
  fitness: { tag: "fit", list: ["lifting","pilates","running","boxing","hiking","CrossFit","yoga","rock climbing"] },
  books: { tag: "reader", list: ["fantasy novels","horror novels","romance books","poetry","true crime","manga","sci-fi","Lovecraft and weird fiction"] },
  art: { tag: "creative", list: ["painting","drawing","photography","making music","pottery","fashion design","writing short stories","DJing"] },
  outdoors: { tag: "outdoorsy", list: ["camping","the beach","surfing","snowboarding","gardening","road trips","horseback riding","fishing"] },
  nightlife: { tag: "party", list: ["going out dancing","concerts","festivals","cocktail bars","karaoke","clubbing"] },
  food: { tag: "foodie", list: ["cooking","baking","trying new restaurants","wine","coffee shops","sushi"] },
  screen: { tag: "homebody", list: ["anime","reality TV","horror movies","true crime podcasts","rom-coms","binge-watching shows"] },
  nerdy: { tag: "nerd", list: ["D&D","tabletop games","history","astronomy","learning languages","Renaissance fairs","medieval stuff and swords"] },
  animals: { tag: "animals", list: ["dogs","cats","horses","volunteering at a shelter","reptiles"] },
  spiritual: { tag: "spiritual", list: ["astrology","tarot","crystals","meditation"] },
};

const DISLIKES = ["sports talk","crypto","politics","cars","work talk","guys who only talk about themselves","one-word answers","being called 'baby girl' right away","gym-bro talk","video games","pushy guys","talking about exes","anime","astrology","dry texters","guys who ask for pics right away"];
const BOUNDARIES = ["no face in spicy pics","won't send anything spicy until she's comfortable","hates being pressured","no rude or degrading talk unless she starts it","won't meet up quickly","won't share her address","nothing about her family"];

const WARDROBE = {
  casual: [["oversized hoodie","black leggings"],["white crop top","high-waisted mom jeans"],["band tee","denim shorts"],["fitted ribbed tank top","grey sweatpants"],["cropped cardigan","pleated mini skirt"],["off-shoulder sweater","skinny jeans"],["sundress",""],["black bodysuit","cargo pants"]],
  work: [["scrubs top","scrub pants"],["silk blouse","black pencil skirt"],["fitted turtleneck","tailored trousers"],["work polo","black jeans"],["blazer over a camisole","slacks"]],
  gym: [["sports bra","matching gym leggings"],["cropped tank","bike shorts"]],
  night: [["tight black mini dress",""],["satin slip dress",""],["corset top","leather mini skirt"],["going-out top","flared jeans"]],
  home: [["oversized t-shirt","sleep shorts"],["cami top","pajama shorts"],["a big oversized hoodie","just panties"],["tank top","cotton shorts"],["silky pajama set",""]],
};
const BRAS = ["a black lace bra and matching panties","a white cotton bra and panties","a pink satin bra and thong","a red lace set","a sporty bralette and boyshorts","a sheer black lace set","a nude t-shirt bra and seamless panties","a purple lingerie set"];

export const TEXT_STYLES = [
  { id: "chaotic", desc: "lowercase, heavy slang (fr, ngl, lmaooo, istg, bestie), lots of emojis like 😭💀✨, keysmashes when excited, quick short messages", sample: "LMAOO no way 😭 ngl thats kinda hot tho" },
  { id: "sweet", desc: "warm and friendly, proper-ish spelling, cute emojis like 🥰😊💕, asks lots of questions", sample: "aww that's so cute 🥰 what made you get into that?" },
  { id: "dry", desc: "dry and minimal, lowercase, rarely uses emojis, deadpan jokes, short replies until she's into you", sample: "wow. a man with hobbies. rare" },
  { id: "flirty", desc: "flirty and teasing, uses 😏😉😘🙈, playful innuendo, likes to make him work for it", sample: "hmm and what would you do about it 😏" },
  { id: "proper", desc: "full sentences, correct punctuation, thoughtful and articulate, occasional single emoji", sample: "That's actually really interesting. I've always wanted to try something like that." },
  { id: "blunt", desc: "blunt and direct, says exactly what she wants, little patience for small talk, swears casually", sample: "ok you're cute. what are you actually looking for on here" },
  { id: "bubbly", desc: "excitable, lots of exclamation marks and 'omg', stretched words (sooo, hiii), emojis like 😂🙌💖", sample: "omg hiii!! sooo you're telling me you sword fight?? 😂" },
  { id: "shy", desc: "a bit shy and hesitant at first, uses 'haha' and '...' a lot, softens things, opens up as she gets comfortable", sample: "haha um hi... i don't really know what to say on here 🙈" },
];

const PHOTO_STYLES = ["sends it silently with no comment", "sends it with a short caption", "teases first and makes him wait before sending", "sends it then comments on it"];

const PROMPTS = [
  ["My most irrational fear", ["geese. they know what they did","the ocean at night","running out of phone battery somewhere new","mannequins","forgetting someone's name mid-convo"]],
  ["I'm weirdly attracted to", ["guys who can cook","forearms, sorry","a man who reads","someone who's good with their hands","confidence that isn't cocky","nerds who are a little dangerous"]],
  ["The way to win me over is", ["make me laugh till I snort","send me memes at 2am","remember the little things","take me somewhere I've never been","feed me","be a little mean (in a fun way)"]],
  ["Typical Sunday", ["brunch, nap, regret","gym then couch then takeout","farmers market and a long walk","hungover and watching horror movies","cleaning my whole apartment and feeling like a new woman"]],
  ["Green flags I look for", ["he texts back","he has a hobby he's obsessed with","he's nice to waiters","he asks questions back","he plans the date"]],
  ["I'll fall for you if", ["you can keep up with my banter","you send good morning texts","you're a little bit of a nerd","you're tall enough to reach my top shelf","you make the first move"]],
  ["Together we could", ["start a cult (a fun one)","get way too competitive at mini golf","binge a whole series in one weekend","road trip with no plan","cook something extremely ambitious"]],
  ["Don't hate me if I", ["steal your hoodie","reply with voice notes","take 40 photos of my food","fall asleep during the movie","get jealous easily"]],
];

// ---------- user tags (for matching) ----------
export function userTags(p) {
  const t = new Set();
  const s = [p.hobbies, p.jobs, p.bio].join(" ").toLowerCase();
  const map = [
    [/sword|fenc|hema|martial|box|mma|kendo/, ["fighter", "fit", "nerd"]],
    [/gam|video game|xbox|playstation|nintendo|pc/, ["gamer", "nerd"]],
    [/writ|author|novel|poet|rpg|role ?play|eldritch|lovecraft/, ["creative", "reader", "nerd"]],
    [/work(ing)? out|gym|lift|fitness|running|crossfit/, ["fit"]],
    [/farm|ranch|hik|camp|fish|hunt|outdoor/, ["outdoorsy", "handy"]],
    [/program|developer|engineer|software|coder|it /, ["tech", "smart"]],
    [/manager|business|owner|lead|director/, ["ambitious", "stable"]],
    [/music|guitar|drum|paint|draw|art|photo/, ["creative"]],
    [/cook|chef|bak/, ["foodie"]],
    [/dog|cat|pet/, ["animals"]],
    [/party|club|bar|dj/, ["party"]],
    [/anime|movie|film|show/, ["homebody"]],
  ];
  for (const [re, tags] of map) if (re.test(s)) tags.forEach((x) => t.add(x));
  const face = (p.face || "").toLowerCase();
  if (/handsome|attractive|good.?looking|cute/.test(face)) t.add("handsome");
  const build = (p.build || "").toLowerCase();
  if (/stocky|muscular|strong|big|broad/.test(build)) t.add("strong");
  if (/athletic|fit|lean|toned/.test(build)) t.add("fit");
  const h = /(\d)\s*'\s*(\d{1,2})?/.exec(p.height || "");
  if (h) { const inches = +h[1] * 12 + (+h[2] || 0); if (inches >= 72) t.add("tall"); if (inches <= 67) t.add("short"); }
  return [...t];
}

// What a woman finds attractive, derived from her interests and personality.
function buildLikes(r, interestGroups, traits, goal) {
  const likes = { handsome: 1.2, funny: 1, tall: r() * 1.2, strong: r() * 1.5 - 0.2, fit: 0.6, smart: 0.5, ambitious: 0.4, stable: goal === "dating" ? 1 : 0, creative: 0.3, tech: 0, short: -r() * 1.2, gamer: r() * 1.2 - 0.5 };
  for (const g of interestGroups) {
    const tag = INTERESTS[g].tag;
    likes[tag] = (likes[tag] || 0) + 1.8;
    if (g === "nerdy") { likes.nerd = 1.6; likes.fighter = 1.2; likes.gamer = (likes.gamer || 0) + 0.8; }
    if (g === "fitness") { likes.fighter = (likes.fighter || 0) + 0.8; likes.strong = (likes.strong || 0) + 0.8; }
    if (g === "books" || g === "art") { likes.creative = (likes.creative || 0) + 1.2; likes.reader = (likes.reader || 0) + 1; }
    if (g === "outdoors") likes.handy = 1;
  }
  if (traits.includes("nerdy")) { likes.nerd = (likes.nerd || 0) + 1; likes.gamer = (likes.gamer || 0) + 0.8; }
  if (traits.includes("ambitious")) likes.ambitious = (likes.ambitious || 0) + 1;
  return likes;
}

// ---------- the generator ----------
// opts: { seed, prefs (settings.prefs), bias (learned swipe bias), mode: 'dating'|'roulette', recentNames: [] }
export function generateWoman(opts = {}) {
  const seed = opts.seed ?? Math.floor(Math.random() * 2 ** 31);
  const r = rng(seed);
  const prefs = opts.prefs || {};
  const bias = opts.bias || {};
  const explore = r.chance(0.25); // a quarter of the deck ignores learned taste

  const b = (key, value) => (explore ? 1 : 1 + Math.max(-0.7, Math.min(2, bias[key + ":" + value] || 0)));

  // ethnicity
  const ethW = {};
  const allowedEth = prefs.ethnicities && prefs.ethnicities.length ? prefs.ethnicities : Object.keys(ETHNICITIES);
  for (const k of allowedEth) if (ETHNICITIES[k]) ethW[k] = b("eth", k);
  const ethKey = r.weighted(ethW);
  const E = ETHNICITIES[ethKey];

  // age (weighted toward 20–32)
  const minA = Math.max(18, prefs.ageMin || 18), maxA = Math.min(60, Math.max(minA, prefs.ageMax || 40));
  let age;
  for (let i = 0; i < 6; i++) {
    age = r.int(minA, maxA);
    const bucket = age < 23 ? "18-22" : age < 28 ? "23-27" : age < 33 ? "28-32" : "33+";
    const w = (age >= 20 && age <= 32 ? 1 : 0.55) * b("age", bucket);
    if (r() < w / 2.2) break;
  }
  const ageBucket = age < 23 ? "18-22" : age < 28 ? "23-27" : age < 33 ? "28-32" : "33+";

  // name
  const recent = new Set(opts.recentNames || []);
  let first = r.pick(E.names);
  for (let i = 0; i < 8 && recent.has(first); i++) first = r.pick(E.names);
  const lastInitial = r.pick(E.last)[0] + ".";

  // body
  const allowedBodies = prefs.bodyTypes && prefs.bodyTypes.length ? prefs.bodyTypes : ["petite", "slim", "athletic", "hourglass", "fit", "leggy"];
  const bw = {}; for (const k of allowedBodies) if (BODY_TYPES[k]) bw[k] = b("body", k);
  const body = r.weighted(bw);

  // hair
  const hairColorW = {}; for (const c of E.hair) hairColorW[c] = b("hair", hairTone(c));
  const hairColor = r.weighted(hairColorW);
  const texture = E.textures && r.chance(0.7) ? r.pick(E.textures) : r.pick(TEXTURES);
  const hair = { color: hairColor, length: r.pick(LENGTHS), texture, style: r.pick(STYLES) };

  const eyes = { color: r.pick(E.eyes), shape: E.eyeShapes ? r.pick(E.eyeShapes) : r.pick(EYE_SHAPES) };
  const faceShape = r.pick(FACE_SHAPES);
  const extra = r.pick(FACE_EXTRAS);
  const face = [`${faceShape} face`, r.pick(JAW), r.pick(CHEEKS), r.pick(NOSE), r.pick(LIPS), `${eyes.shape} ${eyes.color} eyes with ${r.pick(["long lashes","thick dark lashes","soft lashes","fluttery lashes"])}`, r.pick(BROWS)];
  if (!/no marks/.test(extra)) face.push(extra);
  const marks = r.chance(0.65) ? r.some(MARKS, r.int(1, 2)) : [];

  // goal (dating app vs roulette mix)
  const goalW = opts.mode === "roulette"
    ? { casual: 2, fwb: 1.2, dating: 1, attention: 2, curious: 1.5, friends: 0.6 }
    : { casual: 1.2, fwb: 1, dating: 2.2, attention: 1, curious: 1.3, friends: 0.35 };
  if (prefs.goals) for (const g of Object.keys(goalW)) goalW[g] *= prefs.goals[g] ?? 1;
  for (const g of Object.keys(goalW)) goalW[g] *= b("goal", g);
  const goal = r.weighted(goalW);

  // personality
  const traits = r.some(TRAITS, r.int(6, 8));
  const interestGroups = r.some(Object.keys(INTERESTS), r.int(2, 4));
  const interests = interestGroups.map((g) => r.pick(INTERESTS[g].list));
  if (r.chance(0.5)) interests.push(r.pick(INTERESTS[r.pick(Object.keys(INTERESTS))].list));
  const dislikes = r.some(DISLIKES.filter((d) => !interests.some((i) => i.includes(d.split(" ")[0]))), r.int(2, 3));
  const boundaries = r.some(BOUNDARIES, r.int(1, 2));
  const style = r.pick(TEXT_STYLES);
  const intelligence = Math.max(2, Math.min(10, Math.round(4 + (r() + r() + r() - 1.5) * 3.2)));

  const job = age < 23 ? r.pick(JOBS.young) : r.pick(r.chance(0.15) ? JOBS.young : JOBS.adult);
  const G = GOALS[goal];
  const flirtyTrait = traits.some((t) => /flirty|teasing|confident|bratty|adventurous|spontaneous/.test(t));
  const willingness = clamp(Math.round(2 + r() * 3 + G.openness + (flirtyTrait ? 1 : 0) + (style.id === "flirty" ? 1 : 0)), 1, 9);
  const patience = clamp(Math.round(3 + r() * 5 + (traits.includes("impatient") ? -2 : 0) + (traits.includes("caring") || traits.includes("sweet") ? 1 : 0)), 2, 10);
  const initiative = clamp(r() * 0.8 + (traits.some((t) => /clingy|bubbly|romantic|flirty|spontaneous|chaotic/.test(t)) ? 0.3 : 0) + (["chaotic", "bubbly", "flirty"].includes(style.id) ? 0.15 : 0) - (["dry", "proper"].includes(style.id) ? 0.1 : 0), 0.05, 1);
  const pickiness = clamp(0.35 + r() * 0.5 + (goal === "dating" ? 0.08 : 0) - (goal === "casual" ? 0.1 : 0), 0.1, 0.95);

  const nightOwl = r.chance(0.45);
  const schedule = { wake: nightOwl ? r.int(9, 11) : r.int(6, 8), sleep: nightOwl ? r.int(1, 3) + 24 : r.int(22, 24), workStart: r.int(7, 10), workEnd: r.int(15, 19), worksWeekends: /barista|bartender|retail|nurse|waitress|server|chef|stylist/.test(job) };

  const sheet = {
    id: "w" + seed.toString(36) + Date.now().toString(36).slice(-4),
    seed, createdAt: Date.now(), mode: opts.mode || "dating",
    name: first, lastInitial, age, ageBucket,
    ethnicity: ethKey === "mixed" ? r.pick(E.mixes) + " (mixed)" : E.label,
    ethKey,
    origin: r.pick(E.origin),
    city: r.pick(CITIES),
    distance: r.int(1, 38),
    job,
    goal,
    height: r.pick(HEIGHTS[body]),
    body, bodyDesc: BODY_TYPES[body],
    athletic: body === "athletic" ? r.pick(["visible abs and defined arms","toned stomach and strong legs","muscular thighs and a strong back"]) : r.pick(["soft natural tone","lightly toned from walking everywhere","toned legs from dance","naturally slim with little muscle","a flat soft stomach"]),
    breasts: r.pick(BREASTS[body]),
    hips: r.pick(HIPS[body]),
    pubic: r.pick(PUBIC),
    hair, eyes, face, skin: r.pick(E.skin), marks,
    intelligence, traits, interests, interestGroups, dislikes, boundaries,
    style: style.id, styleDesc: style.desc, styleSample: style.sample,
    photoStyle: r.pick(PHOTO_STYLES),
    talkative: r() * 0.7 + 0.3,
    initiative, willingness, patience, pickiness,
    likes: buildLikes(r, interestGroups, traits, goal),
    schedule,
    wardrobeSeed: r.int(1, 1e6),
    prompts: r.some(PROMPTS, 3).map(([q, as]) => ({ q, a: r.pick(as) })),
    attr: { eth: ethKey, body, hair: hairTone(hairColor), goal, age: ageBucket, style: style.id },
  };
  sheet.bio = makeBio(sheet, r);
  sheet.state = dailyState(sheet, new Date());
  sheet.state.lastPhoto = "none yet";
  return sheet;
}

function hairTone(c) {
  c = c.toLowerCase();
  if (/blonde|platinum/.test(c)) return "blonde";
  if (/red|copper|auburn|strawberry/.test(c)) return "red";
  if (/black/.test(c) && !/brown/.test(c)) return "black";
  if (/pink|dyed rose/.test(c)) return "dyed";
  return "brown";
}

function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

function makeBio(s, r) {
  const st = s.style;
  const i1 = s.interests[0], i2 = s.interests[1] || s.interests[0];
  const t = s.traits[0];
  const lines = {
    chaotic: [`${i1} girlie 🫶 ${i2} enjoyer. ${s.job.split(" (")[0]} by day, menace by night`, `just here to find someone to play ${i1.includes("playing") ? i1.replace("playing ", "") : "games"} with and maybe more 👀 lowkey ${t}`],
    sweet: [`${s.job.split(" (")[0]} who loves ${i1} and ${i2} 💕 looking for someone kind who makes me laugh`, `Happiest when it involves ${i1}. Tell me your favorite thing about yourself 😊`],
    dry: [`${s.job.split(" (")[0]}. ${i1}. ${i2}. if you use the word "vibe" unironically, swipe left`, `${t}, apparently. I like ${i1} and people who can hold a conversation`],
    flirty: [`I like ${i1}, ${i2}, and guys who know what they want 😏`, `bad influence, good taste. ${i1} > everything. convince me 😉`],
    proper: [`${s.job.split(" (")[0]} based in ${s.city}. I spend my free time on ${i1} and ${i2}. Looking for good conversation and real chemistry.`, `Originally from ${s.origin}. Into ${i1}, ${i2}, and long dinners that turn into long walks.`],
    blunt: [`${s.age}, ${s.job.split(" (")[0]}, not here to waste time. ${GOALS[s.goal].label.toLowerCase()}. ${i1} is my therapy`, `I'll tell you if I'm into you. I like ${i1} and men who aren't boring`],
    bubbly: [`omg hiii 💖 ${i1} obsessed, ${i2} addict, professional overthinker!!`, `looking for my partner in crime 🙌 must love ${i1} or at least pretend to lol`],
    shy: [`kinda shy at first but I promise I'm fun haha... ${i1}, ${i2}, cozy nights 🙈`, `${s.job.split(" (")[0]}. I like ${i1} and quiet coffee shops. say hi first? 🙈`],
  };
  return r.pick(lines[st] || lines.sweet);
}

// What she's doing / wearing right now, rolled per time block of the day.
export function timeBlock(s, d) {
  const h = d.getHours() + d.getMinutes() / 60;
  const hh = h < 5 ? h + 24 : h; // 0:00–5:00 counts as the end of the previous day
  const day = d.getDay();
  const weekend = day === 0 || day === 6;
  if (hh >= s.schedule.sleep || hh < s.schedule.wake) return "asleep";
  const working = (!weekend || s.schedule.worksWeekends) && hh >= s.schedule.workStart && hh < s.schedule.workEnd && !/student/.test(s.job) ? true : (/student/.test(s.job) && !weekend && hh >= 9 && hh < 15);
  if (working) return "work";
  if (hh < s.schedule.workStart) return "morning";
  if (hh >= s.schedule.workEnd && hh < s.schedule.workEnd + 1.5 && (s.interestGroups.includes("fitness") || s.body === "athletic")) return "gym";
  if (weekend && hh >= 21 && hh < 26 && s.interestGroups.includes("nightlife")) return "night";
  if (hh >= 21) return "late";
  return "evening";
}

const PLACES = {
  morning: ["in bed, just woke up", "in her kitchen making coffee", "getting ready in the bathroom"],
  work: [null],
  gym: ["at the gym", "in the gym locker room"],
  night: ["out at a bar with friends", "at a club bathroom with her friends", "in an Uber home from a night out"],
  late: ["in bed", "on her couch", "in bed scrolling her phone"],
  evening: ["on her couch at home", "in her bedroom", "at a coffee shop", "cooking dinner at home", "at a friend's place"],
  asleep: ["asleep in bed"],
};

export function dailyState(s, d) {
  const block = timeBlock(s, d);
  const dayKey = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
  const r = rng(s.wardrobeSeed + dayKey * 7 + block.length * 131);
  let top, bottom;
  const set = block === "work" ? (/student/.test(s.job) ? WARDROBE.casual : WARDROBE.work) : block === "gym" ? WARDROBE.gym : block === "night" ? WARDROBE.night : block === "late" || block === "asleep" || block === "morning" ? WARDROBE.home : WARDROBE.casual;
  [top, bottom] = r.pick(set);
  if (/scrubs/.test(top) && !/nurse|dental|vet|hygienist|pharm/.test(s.job)) [top, bottom] = r.pick(WARDROBE.casual);
  if (/nurse|dental|vet|hygienist/.test(s.job) && block === "work") [top, bottom] = WARDROBE.work[0];
  const workPlace = /student/.test(s.job) ? "on campus between classes" : `at work (${s.job.split(" (")[0]})`;
  const location = block === "work" ? workPlace : r.pick(PLACES[block]);
  const underwear = block === "gym" ? "sports bra and seamless underwear" : block === "late" || block === "asleep" ? (r.chance(0.5) ? "no bra, panties on" : "no bra, cotton panties") : r.pick(BRAS);
  return { block, top, bottom: bottom || "nothing (one-piece outfit)", underwear, location, rolledAt: d.getTime(), lastPhoto: s.state?.lastPhoto || "none yet" };
}

export function lingerieSet(s) { return rng(s.wardrobeSeed + 99).pick(BRAS); }
