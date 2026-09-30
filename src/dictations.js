/**
 * Registry of dictation revision pages.
 * Year category → child exercise folder (same routing idea as teaching-games,
 * but hub visuals are Quiet Practice Desk — not the games portal look).
 * Paths are relative to the hub page so GitHub Pages project sites work
 * (https://<user>.github.io/<repo>/) without a Vite-only absolute root.
 * Add a new entry here and a matching route under /dictations/<id>/ to ship another page.
 */
export const DICTATIONS = [
  {
    id: '1',
    title: 'Dictation 1',
    year: 'p5',
    yearLabel: 'Primary 5',
    dateLabel: '16-10-2026 Friday',
    description: 'Self-study read-aloud — practise vocabulary & the passage before Term 1 Dictation 1.',
    term: 'P5 Term 1',
    status: 'ready',
    href: './dictations/1/',
    thumb: './dictations/1/thumb.svg',
    skill: 'dictation',
    skillLabel: 'dictation',
    parts: ['Part A · Vocabulary', 'Part B · Paragraphs'],
  },
]

export const YEAR_CATEGORIES = [
  { id: 'p5', label: 'Primary 5' },
]

export function getDictation(id) {
  return DICTATIONS.find((d) => d.id === String(id)) ?? null
}
