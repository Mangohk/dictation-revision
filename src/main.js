import { DICTATIONS, YEAR_CATEGORIES } from './dictations.js'

const nav = document.getElementById('dictationNav')
const STORAGE_KEY = 'dictation-tools-filter'

function renderCard(dictation) {
  const isReady = dictation.status === 'ready'
  const tag = document.createElement(isReady ? 'a' : 'article')
  tag.className = `practice-card ${isReady ? 'is-ready' : 'is-placeholder'}`
  if (isReady) {
    tag.href = dictation.href
  }
  tag.setAttribute('data-skill', dictation.skill || 'dictation')

  tag.innerHTML = `
    <span class="thumb-wrap">
      <img
        class="practice-thumb"
        src="${dictation.thumb}"
        alt=""
        width="640"
        height="360"
        decoding="async"
        loading="lazy"
      />
    </span>
    <h3>${dictation.yearLabel} · ${dictation.title}</h3>
    <p>${dictation.description}</p>
    <span class="skill-tag" data-skill="${dictation.skill || 'dictation'}">${
      dictation.skillLabel || 'dictation'
    }</span>
  `

  return tag
}

function renderHub() {
  nav.innerHTML = ''

  YEAR_CATEGORIES.forEach((category) => {
    const items = DICTATIONS.filter((d) => d.year === category.id)
    if (!items.length) return

    const section = document.createElement('section')
    section.className = 'category'
    section.dataset.category = category.id
    section.setAttribute('aria-labelledby', `cat-${category.id}`)

    const title = document.createElement('h2')
    title.className = 'category-title'
    title.id = `cat-${category.id}`
    title.textContent = category.label

    const grid = document.createElement('div')
    grid.className = 'grid'
    items.forEach((item) => grid.appendChild(renderCard(item)))

    section.appendChild(title)
    section.appendChild(grid)
    nav.appendChild(section)
  })
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filter-btn')
  const sections = () => document.querySelectorAll('.category')
  const valid = { all: true }
  YEAR_CATEGORIES.forEach((c) => {
    valid[c.id] = true
  })

  function showFilter(id) {
    if (!valid[id]) id = 'all'
    sections().forEach((section) => {
      section.hidden = id !== 'all' && section.getAttribute('data-category') !== id
    })
    buttons.forEach((btn) => {
      const active = btn.getAttribute('data-filter') === id
      btn.classList.toggle('active', active)
      btn.setAttribute('aria-pressed', active ? 'true' : 'false')
    })
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* ignore quota / private mode */
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => showFilter(btn.getAttribute('data-filter')))
  })

  let saved = 'all'
  try {
    saved = localStorage.getItem(STORAGE_KEY) || 'all'
  } catch {
    saved = 'all'
  }
  showFilter(saved)
}

renderHub()
setupFilters()
