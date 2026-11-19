# Afterglow

A pretend dating app for adults (18+). Every woman in it is generated from scratch with a full, locked character sheet
(based on *AI Texting Simulation Framework v9* and the *Chat Roulette Generation System*). They swipe on you, match or don't,
text you first, follow up when you go quiet, send selfies that keep the same face, refuse when they're not comfortable,
get attached over time, and sometimes unmatch you.

Everything runs on your own devices. Texting goes through a local AI server (AI Box on the phone), and photos come from a
local Stable Diffusion server. Nothing is sent anywhere else.

## What's in it
- **Discover**: swipe cards (drag or buttons; drag up = super like). Tap a card for her full profile.
- **The algorithm**: each woman has her own taste (built from her interests and personality), how picky she is, and what she's on the app for.
  Your profile is scored against that. Some already liked you (they're in **Likes**), some match later and you get a
  "It's a match!" notification hours afterwards, and some never do. Your swipes also teach it your type (background, body type, hair,
  age, what she's looking for), and the deck leans that way with a quarter of it left random so you keep seeing new kinds of people.
- **Chats**: real texting rhythm. On *Realistic* speed she reads, types, gets busy at work, sleeps, and leaves you on read.
  She texts first on her own schedule: good mornings, bored at work, can't sleep, a little tipsy, flirty late-night texts with a pic,
  "hellooo?" when you ignore her, and she gives up eventually.
- **Building something**: every chat has hidden Willingness, Patience and Affection (framework v9 rules). Asking about her, hitting her
  interests, making her laugh and respecting a "no" build it; pushing, rudeness and boring one-word texts burn it. Affection moves her
  through stages (New match → Getting to know you → Vibing → Flirting → Into you → Hooked). She remembers things about you.
- **Photos**: she decides whether to send, what, and how (silently, captioned, or teasing first). Each photo uses the full v9 template:
  locked face landmarks, body, current outfit, location, "same face as the anchor photo", and the same seed every time.
  What she's wearing changes only when she changes it.
- **Roulette**: random text chat. New woman every spin, she opens with her photo, either of you can skip. Tap her name to save her to your chats.
- **Me**: your profile (they all know it and never ask you to describe yourself), AI and image settings, behaviour (reply speed,
  how often they text first, spice level, quiet hours), who you see, backup and restore.

Turn on *Show character sheets & scores* in Me if you want to see behind the curtain.

## 1. Texting brain: AI Box (on the phone)
1. Install AI Box (the `app-arm64-v8a-release.apk` you have), download a model. Gemma 2 2B Abliterated is fast; Gemma 4 E4B Heretic
   or Dolphin Llama 3 8B write better texts if your phone has 8 GB+ RAM.
2. Load the model, open **Local API Server**, turn it on (note the port it shows; 8080 is the usual one) and keep AI Box running in the background.
3. In Afterglow → Me → AI texting, press **Find on this phone** (or type the address it shows, e.g. `http://127.0.0.1:8080/v1`),
   then **Test connection**. API key `local`.

Any other OpenAI-style server works too: KoboldCpp, LM Studio, llama.cpp server, Ollama (`http://127.0.0.1:11434/v1`), or one on
your PC (`http://192.168.x.x:PORT/v1`).

## 2. Photos: a local image generator
Pick the type in Me → Photos, put in its address, press **Test image**.
- **On a PC (fastest)**: Stable Diffusion WebUI Forge / AUTOMATIC1111 started with `--api --listen --cors-allow-origins=*`,
  address `http://YOUR-PC-IP:7860`. Use a realistic checkpoint you like. In the Android app, CORS doesn't matter.
- **ComfyUI**: start with `--listen --enable-cors-header`, address `http://YOUR-PC-IP:8188`, put your checkpoint's file name in
  "Checkpoint". You can paste your own API-format workflow with `%prompt%`, `%negative%`, `%seed%` etc.
- **On the phone itself**: KoboldCpp in Termux with an SD 1.5 model serves the same A1111 API (`http://127.0.0.1:5001`);
  slow but fully local. Any server with an OpenAI-style `/v1/images/generations` also works (LocalAI, stable-diffusion.cpp server).

Without a generator you get drawn portraits and written photo descriptions. A built-in negative prompt keeps everyone looking
like an adult.

## 3. Install it on the phone
**Android app (recommended: real notifications while closed).** On GitHub open **Actions → Build Afterglow APK**. It also runs
on every push that touches `afterglow/`. Download `afterglow-apk` from the finished run, unzip, install the `.apk`
(allow installs from unknown sources), allow notifications. Messages she writes ahead of time are scheduled as real Android
notifications, so she can text you at 9:14 tomorrow morning even if the app is closed. She writes her next text while the app
is open or in the background; it's only delivered when its time comes.

To build it yourself: `cd afterglow && npm install && npx cap add android && node tools/patch-android.js && npx cap sync android && npx cap open android`.

**Or as a web app.** Serve `afterglow/www` (`npm run serve`, or the folder on any web host), open it in Chrome on the phone,
⋮ → Add to Home screen. In browser mode notifications only appear while the page is alive. Anything that came due while it was
closed arrives when you open it.

## Files
- `www/js/gen.js`: generates a woman: looks, face landmarks, personality, texting style, goal, schedule, wardrobe, taste in men
- `www/js/match.js`: the algorithm (attraction, pickiness, learning your type, deck ranking)
- `www/js/chat.js`: decides what she does each turn (reply, go cold, leave, send/refuse photos, text first) and builds the prompts
- `www/js/planner.js`: when she texts first, follows up, gives up, or matches you later
- `www/js/img.js`: image backends and the v9 photo prompt; `www/js/llm.js`: the chat backend
- `www/js/notify.js`: Android local notifications / browser notifications
