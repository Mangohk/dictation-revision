# dictation-revision

English Revision Studio — P5 dictation revision hub and read-aloud pages.

## Routes

| Path | Page |
|------|------|
| `/` | Dictation hub (lists linked revision pages) |
| `/dictations/1/` | Dictation 1 — Broadcast Read-Aloud |

## Develop

```bash
npm install
npm run dev
```

## Add another dictation

1. Add content under `src/content/`.
2. Add a page at `dictations/<id>/index.html` (+ entry in `vite.config.js`).
3. Register it in `src/dictations.js` so the hub links to it.
