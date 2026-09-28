/**
 * Shared Web Speech helpers for read-aloud revision pages.
 */
export function createSpeechController({
  voiceSelect,
  statusBadge,
  statusDot,
  statusText,
  soundWave,
  rateButtons,
}) {
  const synth = window.speechSynthesis
  let availableVoices = []
  let selectedVoice = null
  let speechRate = 0.85
  let vocabLoopTimeout = null
  let isSpeakingVocabLoop = false

  function setBroadcastingStatus(active, message = 'Broadcasting...') {
    if (!statusBadge) return
    statusBadge.classList.toggle('is-live', active)
    if (statusText) statusText.textContent = active ? message : 'Ready to read'
    if (statusDot) statusDot.className = 'status-dot'
  }

  function clearHighlights() {
    document.querySelectorAll('.speaking-now').forEach((el) => el.classList.remove('speaking-now'))
    document.querySelectorAll('.active-vocab').forEach((el) => el.classList.remove('active-vocab'))
  }

  function stopSpeech() {
    if (vocabLoopTimeout) clearTimeout(vocabLoopTimeout)
    isSpeakingVocabLoop = false
    if (synth) synth.cancel()
    clearHighlights()
    setBroadcastingStatus(false)
  }

  function populateVoiceList() {
    if (!synth || !voiceSelect) return
    availableVoices = synth.getVoices()
    const englishVoices = availableVoices.filter((v) => v.lang.startsWith('en'))

    voiceSelect.innerHTML = ''
    if (englishVoices.length === 0) {
      const opt = document.createElement('option')
      opt.textContent = 'Default System Voice'
      opt.value = ''
      voiceSelect.appendChild(opt)
      return
    }

    const reporterVoiceKeywords = [
      'Google UK English Female',
      'Google UK English Male',
      'Google US English',
      'Daniel',
      'Samantha',
      'Oliver',
      'Serena',
      'Arthur',
      'Natural',
      'Neural',
    ]

    englishVoices.sort((a, b) => {
      const aScore = reporterVoiceKeywords.some((kw) => a.name.includes(kw)) ? 1 : 0
      const bScore = reporterVoiceKeywords.some((kw) => b.name.includes(kw)) ? 1 : 0
      return bScore - aScore
    })

    englishVoices.forEach((voice) => {
      const option = document.createElement('option')
      option.value = voice.name
      const isUK = voice.lang.includes('GB')
      const flag = isUK ? 'UK' : 'US'
      option.textContent = `${flag} · ${voice.name} (${voice.lang})`
      voiceSelect.appendChild(option)
    })

    const preferred =
      englishVoices.find(
        (v) =>
          v.name.includes('Google UK English Female') ||
          v.name.includes('Daniel') ||
          v.name.includes('Natural') ||
          v.lang === 'en-GB',
      ) || englishVoices[0]

    if (preferred) {
      voiceSelect.value = preferred.name
      selectedVoice = preferred
    }
  }

  if (synth) {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoiceList
    }
    populateVoiceList()
  }

  voiceSelect?.addEventListener('change', () => {
    selectedVoice = availableVoices.find((v) => v.name === voiceSelect.value) || null
  })

  rateButtons?.forEach((btn) => {
    btn.addEventListener('click', () => {
      rateButtons.forEach((b) => b.classList.remove('active-rate'))
      btn.classList.add('active-rate')
      speechRate = parseFloat(btn.dataset.rate)
    })
  })

  function speakSingleWordOrPhrase(text, targetElement) {
    stopSpeech()
    clearHighlights()

    if (targetElement) {
      if (targetElement.classList.contains('vocab-item')) {
        targetElement.classList.add('active-vocab')
      } else {
        targetElement.classList.add('speaking-now')
      }
    }

    setBroadcastingStatus(true, `Reading "${text}"`)

    const utter = new SpeechSynthesisUtterance(text)
    if (selectedVoice) utter.voice = selectedVoice
    utter.rate = speechRate * 0.95
    utter.pitch = 1.0

    utter.onend = () => {
      clearHighlights()
      setBroadcastingStatus(false)
    }
    utter.onerror = () => {
      clearHighlights()
      setBroadcastingStatus(false)
    }

    synth?.speak(utter)
  }

  function readSentenceIsolated(sentenceText) {
    stopSpeech()
    clearHighlights()
    setBroadcastingStatus(true, 'Reading sentence...')

    const utter = new SpeechSynthesisUtterance(sentenceText)
    if (selectedVoice) utter.voice = selectedVoice
    utter.rate = speechRate
    utter.pitch = 1.0

    utter.onend = () => {
      clearHighlights()
      setBroadcastingStatus(false)
    }
    utter.onerror = () => {
      clearHighlights()
      setBroadcastingStatus(false)
    }

    synth?.speak(utter)
  }

  function playVocabularyList(vocabularyData) {
    stopSpeech()
    isSpeakingVocabLoop = true
    let currentIndex = 0

    function speakItem() {
      if (!isSpeakingVocabLoop || currentIndex >= vocabularyData.length) {
        stopSpeech()
        return
      }

      clearHighlights()
      const currentItem = vocabularyData[currentIndex]
      const card = document.getElementById(`vocab-card-${currentItem.id}`)
      if (card) {
        card.classList.add('active-vocab')
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }

      setBroadcastingStatus(
        true,
        `Vocabulary ${currentIndex + 1} of ${vocabularyData.length}: "${currentItem.text}"`,
      )

      const speakText = `${currentIndex + 1}. ${currentItem.text}`
      const utter = new SpeechSynthesisUtterance(speakText)
      if (selectedVoice) utter.voice = selectedVoice
      utter.rate = speechRate
      utter.pitch = 1.0

      utter.onend = () => {
        if (!isSpeakingVocabLoop) return
        currentIndex += 1
        vocabLoopTimeout = setTimeout(speakItem, 800)
      }
      utter.onerror = () => stopSpeech()

      synth?.speak(utter)
    }

    speakItem()
  }

  function playFullParagraph(paragraphText, wordSpanElements) {
    stopSpeech()
    clearHighlights()
    setBroadcastingStatus(true, 'Broadcasting passage...')

    const utterance = new SpeechSynthesisUtterance(paragraphText)
    if (selectedVoice) utterance.voice = selectedVoice
    utterance.rate = speechRate
    utterance.pitch = 1.0

    let wordPointer = 0

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        clearHighlights()
        if (wordPointer < wordSpanElements.length) {
          const currentSpan = wordSpanElements[wordPointer]
          currentSpan.classList.add('speaking-now')
          currentSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
          wordPointer += 1
        }
      }
    }

    utterance.onend = () => {
      clearHighlights()
      setBroadcastingStatus(false)
    }
    utterance.onerror = () => {
      clearHighlights()
      setBroadcastingStatus(false)
    }

    synth?.speak(utterance)
  }

  return {
    stopSpeech,
    speakSingleWordOrPhrase,
    readSentenceIsolated,
    playVocabularyList,
    playFullParagraph,
    setBroadcastingStatus,
  }
}
