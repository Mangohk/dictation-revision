# dictation-revision

**Dictation Tools** — self-study portal for P5 dictation revision (pattern matched to [teaching-games](https://mangohk.github.io/teaching-games/)). Students revise on their own before each dictation.

## Routes

| Path | Page |
|------|------|
| `/` | Dictation Tools hub (year filter → exercise cards) |
| `/dictations/1/` | Primary 5 · Dictation 1 — Self-study Read-Aloud |

Live (when Pages is enabled): https://mangohk.github.io/dictation-revision/

## Develop

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173/`). From the hub, click **Primary 5 · Dictation 1**.

GitHub Pages deploys the repo root on `main` (no build step). Hub/child pages use **relative** asset and navigation paths so the project site at `/dictation-revision/` works the same as local Vite. Prefer `npm run dev` while editing; `npm run build` / `npm run preview` remain available for a production bundle check.

## Add another dictation

1. Add content under `src/content/`.
2. Add a page at `dictations/<id>/index.html` (+ entry in `vite.config.js`).
3. Register it in `src/dictations.js` (set `year` / `yearLabel` so it appears under the right hub category).
