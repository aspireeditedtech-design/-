# Md Irfan Raza · TechBurne — Video Editing Portfolio

A static, GitHub Pages-ready video editor portfolio using the **premium retro-game** art direction supplied in `Pasted text.txt`: dark navy/black, subtle pixel motifs, cobalt buttons, warm gold accents, cinematic film frames and clean editorial typography. No backend, npm install or React build required.

## What's inside

- `index.html` — homepage with 5 selected best short videos, on-ground documentary, local 16:9 showreel, About, Services, Workflow, software/tool ratings, 3 client collaborations, Dettol AI ad film, and contact.
- `gallery.html` — separate project archive with **11 short-format** and **22 long-format** YouTube videos; thumbnails load lazily and each video opens in an on-site dialog.
- `content.js` — all supplied project and social links in one place, with no API keys.
- `app.js`, `gallery.js` — mobile menu, native dialogs, embedded playback, reduced-motion-aware local video previews.
- `styles.css`, `gallery.css` — self-contained responsive design.
- `assets/images/editor.webp` — the real previously supplied editor photo. No AI-generated replacement or yellow cap has been fabricated.
- `assets/videos/showreel.mp4` — compressed, locally hosted version of previously supplied original showreel; `assets/videos/dettol-ai-ad.mp4` — previously supplied AI ad.
- `.nojekyll` — for GitHub Pages static hosting.

## Deploy in GitHub Pages

1. Extract the ZIP locally. **Upload its contents**, not the ZIP itself, into the repository root. `index.html` must sit at the root, alongside `gallery.html`.
2. On GitHub, open **Settings → Pages → Build and deployment** and choose **Deploy from a branch → main → /(root) → Save**.
3. Wait for the deploy to complete. For a repository called `video-editor-portfolio`, the URL will look like `https://USERNAME.github.io/video-editor-portfolio/`.
4. Verify both `/` and `/gallery.html` work. Press Ctrl+Shift+R if the browser shows stale files.

## About playback and external hosts

- YouTube cards play using `youtube-nocookie.com/embed/VIDEO_ID`. The original YouTube links are provided for fallback if the publisher disables embedding.
- Instagram cards attempt the official `instagram.com/p/POST_ID/embed/` route. Instagram controls whether a post permits embedding. If blocked, choose **Open on Instagram** in the player.
- Video thumbnails come from YouTube's public thumbnail host. No fabricated video imagery or titles are used (generic numbered project titles are intentional because exact titles were not supplied for most videos).
- Local showreel and AI ad have silent hover previews where the device supports hover and motion. Full videos play with controls and audio on click.
- The **1.1M project views** label is from the supplied portfolio master brief, not a live analytics feed. It is annotated on the page.

## Content provenance and items to confirm

All named work specialties, tools, software star ratings and links come from the user's supplied master info, or previously uploaded original portfolio media. `TechBurne` appears as the personal brand. `Techvana` is **not** listed as a client because the master document notes uncertainty about the relationship between these names. No unverifiable client statistics or dates were invented. The master document also described a **yellow-cap photo**, but the only supplied identifiable editor photo shows glasses and a teal top at a workstation; the site uses that exact photo without changing identity.

## Customize

- Edit `content.js` to change any YouTube / Instagram / client link.
- Change the intro copy, ratings or client labels in `index.html`.
- Change colors in `styles.css` under `:root`.
- Replace photos and media in `assets/` only when you have appropriate replacement files. Keep the existing filenames or change all references.

## Local preview

In the project folder, run `python -m http.server 8000` and open `http://localhost:8000` in your browser. You can also double-click `index.html` to preview most visual features, but use a local server for the closest GitHub Pages behavior.
