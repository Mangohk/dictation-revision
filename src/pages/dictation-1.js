import '../styles/studio.css'
import '../styles/review.css'
import { DICTATION_1 } from '../content/dictation-1.js'
import { createSpeechController } from '../speech.js'

const subtitle = document.getElementById('headerSubtitle')
subtitle.textContent = `${DICTATION_1.title} (${DICTATION_1.dateLabel}) · ${DICTATION_1.mode}`

const speech = createSpeechController({
  voiceSelect: document.getElementById('voiceSelect'),
  statusBadge: document.getElementById('statusBadge'),
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  soundWave: document.getElementById('soundWave'),
  rateButtons: [...document.querySelectorAll('.rate-btn')],
})

document.getElementById('globalStopBtn').addEventListener('click', () => speech.stopSpeech())

const vocabContainer = document.getElementById('vocabContainer')
DICTATION_1.vocabulary.forEach((item) => {
  const card = document.createElement('div')
  card.id = `vocab-card-${item.id}`
  card.className = 'vocab-item'
  card.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;min-width:0">
      <span class="vocab-index">${item.id}</span>
      <div>
        <div class="vocab-text">${item.text}</div>
        <div class="vocab-note">${item.note}</div>
      </div>
    </div>
    <div class="vocab-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
    </div>
  `
  card.addEventListener('click', () => speech.speakSingleWordOrPhrase(item.text, card))
  vocabContainer.appendChild(card)
})

const paragraphDisplay = document.getElementById('paragraphDisplay')
const paragraphWords = DICTATION_1.paragraph.split(' ')
const wordSpanElements = []

paragraphDisplay.innerHTML = ''
paragraphWords.forEach((wordStr) => {
  const span = document.createElement('span')
  span.className = 'read-word'
  span.textContent = wordStr
  span.addEventListener('click', () => {
    const cleanWord = wordStr.replace(/^[^\w']+|[^\w']+$/g, '')
    speech.speakSingleWordOrPhrase(cleanWord, span)
  })
  paragraphDisplay.appendChild(span)
  paragraphDisplay.appendChild(document.createTextNode(' '))
  wordSpanElements.push(span)
})

const sentenceListContainer = document.getElementById('sentenceListContainer')
const sentences = DICTATION_1.paragraph.match(/[^.!?]+[.!?]+/g) || [DICTATION_1.paragraph]

sentences.forEach((sentence, idx) => {
  const row = document.createElement('div')
  row.className = 'sentence-row'
  row.innerHTML = `
    <span><strong class="s-index">S${idx + 1}</strong>${sentence.trim()}</span>
    <button type="button" class="btn btn-subtle">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      Read
    </button>
  `
  row.querySelector('button').addEventListener('click', (e) => {
    e.stopPropagation()
    speech.readSentenceIsolated(sentence.trim())
  })
  sentenceListContainer.appendChild(row)
})

document.getElementById('listenAllBtn').addEventListener('click', () => {
  speech.playVocabularyList(DICTATION_1.vocabulary)
})

document.getElementById('listenPassageBtn').addEventListener('click', () => {
  speech.playFullParagraph(DICTATION_1.paragraph, wordSpanElements)
})
