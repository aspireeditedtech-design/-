# Irfan Raza — Video Editing Portfolio (V14)

This is a static GitHub Pages website. No npm, build system, or paid hosting is required.

## Historical changes in V5

- Fixed the hero headline positioning: it now aligns to the left of the same content grid as the rest of the page, instead of appearing centered over the background portrait.
- Restored compact hero layout; contact information appears in the Contact section, where visitors can easily find it.
- Retained five interactive 9:16 reel cards, silent hover preview, and fullscreen focused player.
- Retained the Work Payoff feature video and résumé-based experience section.
- Fixed mobile carousel starting position and heading wrapping.

## Contact details

Irfan Raza • Senior Video Editor / Motion Designer / Visual Storyteller

Call / WhatsApp: +91 7717777075
Email: irfanraza055@gmail.com
Instagram: https://instagram.com/edit_aspire
Bengaluru, India • Open to Remote / Relocation

## Deploy to GitHub Pages

1. Download this ZIP and **extract** it.
2. In your public GitHub repository, replace older website files with **all the contents inside this folder**, including `index.html`, `styles.css`, `script.js`, `site-config.js`, `.nojekyll` and the complete `assets` folder. Do not upload only the ZIP file, and do not put an extra parent folder around `index.html`.
3. In repository **Settings → Pages**, set **Deploy from a branch**, branch `main`, folder `/(root)` and save.
4. After GitHub finishes deploying, reload with Ctrl+Shift+R to avoid cached old CSS.

Edit `site-config.js` to update phone, email, Instagram and video paths. Keep the asset filenames and folders when uploading.

## V6 updates
- Software/toolkit skills strip placed immediately beneath the Work Payoff video: Premiere Pro, After Effects, Photoshop, Audition, DaVinci Resolve and Frame.io.
- About Me copy and portfolio view/project figures reproduced from the supplied screenshot.
- Added a cinematic AI Ads & Films feature with the supplied Dettol video, an optimized browser-friendly MP4, poster, silent hover preview and sound-on modal player.
- Five original 9:16 hero reels, contact information, experience section and background preserved.
- No external video hosts or npm install required: upload *all* extracted files, including `assets/`, to the repository root.

## V7 updates
- Added a **Long Format** section right after Work Payoff (and the toolkit strip), before AI Ads & Films, with the YouTube video `043qBi8qw-Q` embedded (privacy-friendly youtube-nocookie player, lazy loaded, 16:9, responsive).
- To swap the video later, change the ID in the iframe `src` inside the `#long-format` section of `index.html`.

## V8 updates
- Hero reels increased from 5 to 7: **Tech Experiment (smartwatch test)** added as the first reel and **Infinity Admission** added as the last reel. Both have a compressed full video, silent hover preview and poster, wired into `site-config.js` (entries 7 and 8).
- Desktop shows all 7 reels in one row; tablet and mobile use the swipe carousel.
- To rename a reel, edit its title/subtitle in `index.html` (hero card) and `site-config.js` (player title).

## V9 preservation update
- This version starts from the user's supplied complete V8 ZIP. No existing sections or video assets were removed.
- Kept the 7 vertical hero reels, Work Payoff, 6 software skills, Long Format YouTube embed `043qBi8qw-Q`, AI Ads & Films, About Me, Experience, Services, and Contact.
- Restored a separate **Irfan Raza Showreel** section after Work Payoff / toolkit and before Long Format, using the supplied original 16:9 master. Silent hover preview and the existing sound-on popup player are supported.
- YouTube Long Format remains an iframe streamed from YouTube, so no extra YouTube video file is required.


## V10 — Content Gallery (new separate page)
- Preserves the complete V9 homepage, existing video files and all earlier sections.
- Adds a new Content Gallery section to the homepage plus a Gallery link in the desktop and mobile menus.
- `gallery.html` is a separate page with three categories: **Short Form (15 YouTube links)**, **Long Format (22 YouTube links)**, **AI Films (the existing Dettol AI ad)**.
- Includes a link to the supplied Keerthika Govindhasamy YouTube channel.
- Cards show lazy-loaded YouTube thumbnails and open an in-page player. YouTube videos stream directly from YouTube, not from your GitHub repository.
- `gallery.css` and `gallery.js` are the new page's style and interaction files. Keep them at the repository root beside `gallery.html`.
- The user supplied no separate AI YouTube links, so the AI category showcases the Dettol AI film already in this portfolio.
- The video names in the gallery are intentionally neutral (Short Edit 01 / Long Edit 01), because no titles were supplied.
- If YouTube restricts embedding of an individual video, the player also includes a **Watch on YouTube** link.

**Deploy:** extract the ZIP and upload **all** its contents (not the ZIP itself) to your existing GitHub Pages repository root. Both `index.html` and `gallery.html` must be at the root.


## V11 update — four additional long-format videos
Four clickable YouTube video cards have been added directly below the featured Long Format video on the homepage. The cards link to the first four videos from the supplied long-format list. All existing pages, video assets, and gallery content are preserved.


## V12 — Client cards, on-site YouTube playback, video views

### Client cards
Seven client/work cards were added after Work Experience, based on the supplied résumé PDF: Keerthika Govindhasamy / Keerthi History, Tech Burner, Comptech Motocorp, Brightso, Layers, Infinity Admission and London International. The cards distinguish full-time roles from freelance projects. They do **not** invent channel subscriber or reach totals.

### On-site playback
- The 15 Short Form and 22 Long Format videos on `gallery.html` already play in an on-site YouTube iframe modal. That behaviour remains.
- The four additional Long Format homepage cards now also play in an on-site modal (instead of redirecting immediately).
- The original featured Long Format YouTube iframe stays on the homepage.
- Every YouTube card has an **Original YouTube link** underneath, in case the video owner disables embedding.

### Latest YouTube views — optional 6-hour automatic refresh
GitHub Pages is static. It cannot safely query private YouTube Data API credentials directly from the browser. To display real view numbers beneath the 37 gallery videos and five homepage YouTube videos, enable the included GitHub Actions workflow:

1. In Google Cloud Console, create/select a project, enable **YouTube Data API v3**, and create an API key.
2. In the GitHub repository, go to **Settings → Secrets and variables → Actions → New repository secret**. Name it exactly `YOUTUBE_API_KEY` and paste the key. **Never put the key into JavaScript or HTML.**
3. Open **Actions → Refresh YouTube view counts → Run workflow** once. Scheduled updates are configured for approximately every six hours.
4. The workflow writes public view counts and YouTube titles into `assets/data/youtube-views.json`. The site reads that JSON and shows the latest known count below each video. GitHub scheduled runs may be delayed; these are *periodically refreshed counts*, not per-second live counters.

Without the API key, the site correctly displays **VIEWS · Check on YouTube** and keeps the original YouTube link visible. It never displays made-up numbers. Videos with disabled embedding may require the original link.

**Important:** Upload all files including the hidden `.github/workflows/` folder, `.nojekyll`, `assets/data/`, `scripts/`, `youtube-views.js` and the full `assets/videos/` folder. Upload extracted contents to the repository root.


## V13 — Client channel/brand logos
The client cards now display official channel avatars (Keerthi History and Tech Burner) and sourced brand artwork for Comptech Motocorp, Brightso and Layers. Infinity Admission uses the original infinity icon cropped from the portfolio's own Infinity Admission promotional video (stored locally at `assets/logos/infinity-admission-from-video.webp`).

London International's exact brand/channel identity could not be verified from the résumé; initials are retained to avoid showing another company's logo. If you have the official logo, save it in `assets/logos/` and replace the placeholder in `index.html`.

Some logos load from the original public brand websites or from Unavatar (for channel avatars). The client cards automatically fall back to initials if a logo image is unavailable. The free Unavatar service requires a visible attribution link, which is included in the client section.

No other sections or video files have been modified.


## V14 — Social profile links and simpler homepage
- Removed the duplicate **Work Experience** card section (and its desktop/mobile navigation links). The résumé-based **Clients** section remains, so work history is still represented by the seven client cards. The About section's CTA now leads to Clients.
- Corrected **Brightso** from Freelance to **Full-time**, per the portfolio owner's update. Its employment dates were not provided, so no date is invented. Client summary: 3 full-time roles, 4 freelance clients.
- Added clear clickable **platform rows, profile logos and client names**, opening the supplied profiles in a new tab:
  - Keerthi History: YouTube `https://www.youtube.com/@KeerthikaGovindhasamy` and Instagram `https://www.instagram.com/keerthi/?hl=en`.
  - Tech Burner: Instagram **only** `https://www.instagram.com/techburner/?hl=en`.
  - Brightso: Instagram `https://www.instagram.com/brightso.now/?hl=en`.
  - Infinity Admission: YouTube `https://www.youtube.com/@InfinityAdmissions`.
- Kept the local edit-play button on Infinity Admission and the Long Format gallery CTA on Keerthi History.
- Comptech Motocorp, Layers and London International have no profile URLs supplied, so their existing internal portfolio links are unchanged. No external links were invented.
- All 7 hero reels, 4 Long Format cards, embedded feature video, showreel, AI Ads, 37-video gallery, assets and YouTube views integration remain intact.

## V15 updates
- Hero background photo removed. The hero now plays a transparent cut-out animation (192 frames in `assets/hero-frames/`, drawn on a canvas by `hero-stage.js`): standing pose → arms folded, about 6 seconds, replays when the hero comes back into view. Reduced-motion visitors see the final pose.
- Giant "100M+ views" figure behind the portrait, plus four point-out notes (4–5 years, 200+ projects, Keerthi, Tech Burner). Edit the text inside `.stage-note` in `index.html`; reveal timing is the `data-at` frame number.
- Upload `hero-stage.js` and the whole `assets/hero-frames/` folder along with the other files.

## V16 updates
- Hero intro: the portrait first appears as scattered particles that fly together into the photo, then hands over to the real image.
- The arm fold is now driven by scroll. On desktop the hero stays pinned while you scroll through the fold, and scrolling back up unfolds the arms. On phones the first ~360px of scroll drives it. A "Scroll to play" hint shows until the visitor starts scrolling.
- "4–5 years" changed to "5+ years" (hero note, hero paragraph, About). "Hire Me" buttons renamed to "Get in touch".
- The particle effect needs the site served over http(s), which GitHub Pages does. If you open index.html straight from your computer, it skips the particles and shows the photo directly.
