/**
 * Registry of dictation revision pages.
 * Add a new entry here and a matching route under /dictations/<id>/ to ship another page.
 */
export const DICTATIONS = [
  {
    id: '1',
    title: 'Dictation 1',
    dateLabel: '16-10-2026 Friday',
    description: 'Broadcast Read-Aloud · Vocabulary & paragraphs',
    term: 'P5 Term 1',
    status: 'ready',
    href: '/dictations/1/',
    parts: ['Part A · Vocabulary', 'Part B · Paragraphs'],
  },
]

export function getDictation(id) {
  return DICTATIONS.find((d) => d.id === String(id)) ?? null
}
