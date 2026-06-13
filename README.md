# Personal Website (runnable template)

This project is a polished, runnable personal portfolio with dynamic achievements, a contact zone, featured projects, timeline, and testimonial sections.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open http://localhost:3000 in your browser.

## Developer preview

For automatic refresh while editing:

- Install the VS Code extension **Live Server** and open `public/index.html`.
- Or run the server with watcher support:

```bash
npm run dev
```

That will restart the server when `server.js` or files under `public/` change. In VS Code, use the Preview or Browser preview tab and refresh to see updates after saving.

> If you want browser auto refresh, the Live Server extension is the easiest option.

## Customize content

Edit `server.js` inside the `/api/data` response to update:

- `profile` — name, title, bio, avatar image
- `stats` — experience cards
- `moments` — story cards
- `milestones` — career and high school timeline entries
- `medals` — badges and recognition
- `projects` — featured work with preview images and tags
- `skills` — progress bars and skill strengths
- `timeline` — segmented timeline by stage
- `testimonials` — endorsements
- `gallery` — image storytelling section
- `contact` — email, phone, socials
- `highlights` — hero marquee and highlights list

## New features included

- polished dark/light theme toggle
- animated stat cards and hover transitions
- hero marquee with highlight text
- image-backed featured projects
- project category filters
- segmented timeline with high school, college, and career chapters
- skill progress bars with animation
- image gallery section
- testimonial cards
- contact cards with socials
- search across projects, milestones, moments, and medals
- responsive layout and scroll-friendly sections
- local storage theme persistence

## Files of interest

- `public/index.html` — page structure and new sections
- `public/styles.css` — styling, dynamic theme, and transitions
- `public/app.js` — dynamic client-side rendering and search behavior
- `server.js` — Express server and `/api/data` JSON endpoint

Reload the page after editing `server.js` to see updates on the preview tab.

## Multi-page structure

New pages have been added to split content across routes:

- `public/work.html` — project carousel and projects
- `public/achievements.html` — segmented timeline and badges
- `public/contact.html` — contact form and multiple contact options

## Contact backend

- The contact form POSTs JSON to `/api/contact`.
- Messages are appended to `contacts.json` in the project root.

## Development

Run the dev server with auto-restart on edits:

```bash
npm run dev
```

Open the pages in your browser (e.g. `http://localhost:3000/work.html`).
# sid-v-website
Personal Website of Sidharth Vellanki detailing some of his best moments, milestones and medals
