import './styles/studio.css'
import './styles/hub.css'
import { DICTATIONS } from './dictations.js'

const grid = document.getElementById('dictationGrid')

function renderCard(dictation) {
  const isReady = dictation.status === 'ready'
  const article = document.createElement(isReady ? 'a' : 'article')
  article.className = `card dictation-card ${isReady ? 'is-ready' : 'is-placeholder'}`
  if (isReady) {
    article.href = dictation.href
  }

  article.innerHTML = `
    <div class="dictation-card__top">
      <div>
        <h2>${dictation.title}</h2>
        <p class="dictation-card__date">${dictation.dateLabel}</p>
        <div class="dictation-card__meta">
          <span class="meta-chip">${dictation.term}</span>
          ${(dictation.parts || [])
            .map((part) => `<span class="meta-chip">${part}</span>`)
            .join('')}
        </div>
      </div>
      <span class="status-label ${isReady ? 'ready' : 'soon'}">
        ${isReady ? 'Ready' : 'Soon'}
      </span>
    </div>
    <p class="dictation-card__desc">${dictation.description}</p>
    <div class="dictation-card__actions">
      ${
        isReady
          ? `<span class="btn btn-primary">Open read-aloud
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>`
          : `<span class="btn btn-subtle" aria-disabled="true">Coming soon</span>`
      }
    </div>
  `

  return article
}

function renderPlaceholder() {
  const article = document.createElement('article')
  article.className = 'card dictation-card is-placeholder'
  article.innerHTML = `
    <div class="dictation-card__top">
      <div>
        <h2>Next dictation</h2>
        <p class="dictation-card__date">Link slot reserved</p>
        <div class="dictation-card__meta">
          <span class="meta-chip">P5 Term 1</span>
        </div>
      </div>
      <span class="status-label soon">Soon</span>
    </div>
    <p class="dictation-card__desc">
      More dictation read-aloud sessions will appear here as they are published for Term 1.
    </p>
    <div class="dictation-card__actions">
      <span class="btn btn-subtle" aria-disabled="true">Coming soon</span>
    </div>
  `
  return article
}

DICTATIONS.forEach((item) => grid.appendChild(renderCard(item)))
grid.appendChild(renderPlaceholder())
