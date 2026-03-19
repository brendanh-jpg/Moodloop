import * as Tone from 'tone'

// Helper: wrap an FMSynth to match NoiseSynth's triggerAttackRelease(duration, time) API
function wrapNoteSnare(synth, note = 'C4') {
  return {
    triggerAttackRelease: (dur, time) => synth.triggerAttackRelease(note, dur, time),
    dispose: () => synth.dispose(),
    disconnect: () => synth.disconnect(),
    chain: (...args) => synth.chain(...args),
    connect: (...args) => synth.connect(...args),
  }
}

const INSTRUMENTS = {
  chords: {
    'Warm Pad': () =>
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.3, decay: 0.4, sustain: 0.6, release: 0.8 },
        volume: -8,
      }).toDestination(),
    'Bright Keys': () =>
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
        volume: -8,
      }).toDestination(),
    'Soft Organ': () =>
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.1, decay: 0.5, sustain: 0.7, release: 1.0 },
        volume: -12,
      }).toDestination(),
    'Crystal Pad': () =>
      new Tone.PolySynth(Tone.AMSynth, {
        harmonicity: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.4, decay: 0.6, sustain: 0.5, release: 1.2 },
        modulation: { type: 'triangle' },
        modulationEnvelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 1.0 },
        volume: -10,
      }).toDestination(),
    'Dreamy Strings': () =>
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fatsawtooth', spread: 20, count: 3 },
        envelope: { attack: 0.5, decay: 0.4, sustain: 0.6, release: 1.5 },
        volume: -14,
      }).toDestination(),
    'Music Box': () =>
      new Tone.PolySynth(Tone.FMSynth, {
        modulationIndex: 4,
        harmonicity: 6,
        envelope: { attack: 0.001, decay: 0.5, sustain: 0.0, release: 0.8 },
        volume: -8,
      }).toDestination(),
    'Kalimba': () =>
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.6, sustain: 0.0, release: 1.0 },
        volume: -6,
      }).toDestination(),
  },
  melody: {
    'Bell Pluck': () =>
      new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 0.4 },
        volume: -6,
      }).toDestination(),
    'Soft Lead': () =>
      new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.3 },
        volume: -6,
      }).toDestination(),
    'Square Wave': () =>
      new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.2 },
        volume: -10,
      }).toDestination(),
    'FM Chime': () =>
      new Tone.FMSynth({
        modulationIndex: 3,
        envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 0.5 },
        volume: -8,
      }).toDestination(),
    'Marimba': () =>
      new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.0, release: 0.3 },
        volume: -4,
      }).toDestination(),
    'Flute': () =>
      new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.4 },
        volume: -8,
      }).toDestination(),
    'Whistle': () =>
      new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.08, decay: 0.05, sustain: 0.8, release: 0.3 },
        volume: -10,
      }).toDestination(),
    'Cat Meow': () =>
      new Tone.FMSynth({
        modulationIndex: 2,
        harmonicity: 1.5,
        envelope: { attack: 0.05, decay: 0.3, sustain: 0.1, release: 0.2 },
        modulation: { type: 'sine' },
        modulationEnvelope: { attack: 0.1, decay: 0.2, sustain: 0, release: 0.1 },
        volume: -6,
      }).toDestination(),
    'Bird Song': () =>
      new Tone.FMSynth({
        modulationIndex: 12,
        harmonicity: 3,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
        volume: -8,
      }).toDestination(),
  },
  bass: {
    'Sub Bass': () =>
      new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.8, release: 0.3 },
        volume: -6,
      }).toDestination(),
    'Round Bass': () =>
      new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.2 },
        volume: -6,
      }).toDestination(),
    'Growl Bass': () =>
      new Tone.FMSynth({
        modulationIndex: 5,
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.2 },
        volume: -8,
      }).toDestination(),
    'Upright Bass': () =>
      new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.04, decay: 0.4, sustain: 0.3, release: 0.5 },
        volume: -6,
      }).toDestination(),
    'Punchy Synth': () =>
      new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.005, decay: 0.15, sustain: 0.4, release: 0.15 },
        volume: -10,
      }).toDestination(),
    'Elephant Stomp': () =>
      new Tone.MembraneSynth({
        pitchDecay: 0.15,
        octaves: 8,
        envelope: { attack: 0.01, decay: 0.6, sustain: 0, release: 0.3 },
        volume: -2,
      }).toDestination(),
    'Bear Growl': () =>
      new Tone.FMSynth({
        modulationIndex: 10,
        harmonicity: 0.5,
        envelope: { attack: 0.05, decay: 0.4, sustain: 0.2, release: 0.3 },
        volume: -4,
      }).toDestination(),
  },
  percussion: {
    'Classic Kit': () => ({
      type: 'kit',
      kick: new Tone.MembraneSynth({ volume: -4 }).toDestination(),
      snare: new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
        volume: -8,
      }).toDestination(),
      hihat: new Tone.MetalSynth({
        frequency: 400,
        envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
        volume: -12,
      }).toDestination(),
    }),
    'Electronic': () => ({
      type: 'kit',
      kick: new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
        volume: -4,
      }).toDestination(),
      snare: new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
        volume: -8,
      }).toDestination(),
      hihat: new Tone.MetalSynth({
        frequency: 800,
        envelope: { attack: 0.001, decay: 0.03, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 40,
        resonance: 5000,
        octaves: 1,
        volume: -14,
      }).toDestination(),
    }),
    'Lo-Fi': () => ({
      type: 'kit',
      kick: new Tone.MembraneSynth({
        pitchDecay: 0.08,
        octaves: 4,
        envelope: { attack: 0.01, decay: 0.3, sustain: 0 },
        volume: -4,
      }).toDestination(),
      snare: new Tone.NoiseSynth({
        noise: { type: 'brown' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0 },
        volume: -8,
      }).toDestination(),
      hihat: new Tone.MetalSynth({
        frequency: 300,
        envelope: { attack: 0.001, decay: 0.08, release: 0.01 },
        harmonicity: 3,
        modulationIndex: 20,
        resonance: 3000,
        octaves: 1,
        volume: -14,
      }).toDestination(),
    }),
    'Toy Kit': () => ({
      type: 'kit',
      kick: new Tone.MembraneSynth({
        pitchDecay: 0.02,
        octaves: 3,
        envelope: { attack: 0.005, decay: 0.2, sustain: 0 },
        volume: -6,
      }).toDestination(),
      snare: new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.002, decay: 0.08, sustain: 0 },
        volume: -10,
      }).toDestination(),
      hihat: new Tone.MetalSynth({
        frequency: 600,
        envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
        harmonicity: 4,
        modulationIndex: 16,
        resonance: 6000,
        octaves: 1,
        volume: -16,
      }).toDestination(),
    }),
    'Jungle Kit': () => ({
      type: 'kit',
      kick: new Tone.MembraneSynth({
        pitchDecay: 0.06,
        octaves: 5,
        envelope: { attack: 0.005, decay: 0.25, sustain: 0 },
        volume: -3,
      }).toDestination(),
      snare: new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.12, sustain: 0 },
        volume: -7,
      }).toDestination(),
      hihat: new Tone.MetalSynth({
        frequency: 500,
        envelope: { attack: 0.001, decay: 0.03, release: 0.005 },
        harmonicity: 6,
        modulationIndex: 28,
        resonance: 4500,
        octaves: 1.2,
        volume: -13,
      }).toDestination(),
    }),
    'Animal Farm': () => {
      // Cowbell-like kick
      const kick = new Tone.MembraneSynth({
        pitchDecay: 0.03,
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
        volume: -4,
      }).toDestination()
      // Duck quack snare (FMSynth wrapped to match NoiseSynth API)
      const quackSynth = new Tone.FMSynth({
        modulationIndex: 8,
        harmonicity: 1.5,
        envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.05 },
        volume: -6,
      }).toDestination()
      const snare = wrapNoteSnare(quackSynth, 'G4')
      // Bird chirp hihat
      const hihat = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
        volume: -8,
      }).toDestination()
      // Wrap hihat to match MetalSynth API (triggerAttackRelease(duration, time))
      const hihatWrapped = {
        triggerAttackRelease: (dur, time) => hihat.triggerAttackRelease('C7', dur, time),
        dispose: () => hihat.dispose(),
        disconnect: () => hihat.disconnect(),
        chain: (...args) => hihat.chain(...args),
        connect: (...args) => hihat.connect(...args),
      }
      return { type: 'kit', kick, snare, hihat: hihatWrapped }
    },
  },
}

// Default note sets (no mood)
const CHORD_NOTES = [
  ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'],
  ['F4', 'A4', 'C5'], ['F4', 'A4', 'C5'], ['F4', 'A4', 'C5'], ['F4', 'A4', 'C5'],
  ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5'],
  ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'],
]

const MELODY_NOTES = [
  'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6',
  'B5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4',
]

const BASS_NOTES = [
  'C2', 'C2', 'E2', 'E2', 'F2', 'F2', 'A2', 'A2',
  'G2', 'G2', 'B2', 'B2', 'A2', 'A2', 'E2', 'E2',
]

const PENTA_CHORD_NOTES = [
  ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'],
  ['C4', 'E4', 'A4'], ['C4', 'E4', 'A4'], ['C4', 'E4', 'A4'], ['C4', 'E4', 'A4'],
  ['D4', 'G4', 'A4'], ['D4', 'G4', 'A4'], ['D4', 'G4', 'A4'], ['D4', 'G4', 'A4'],
  ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'],
]

const PENTA_MELODY_NOTES = [
  'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'A5', 'G5',
  'E5', 'D5', 'C5', 'A4', 'G4', 'A4', 'C5', 'D5',
]

const PENTA_BASS_NOTES = [
  'C2', 'C2', 'G2', 'G2', 'A2', 'A2', 'E2', 'E2',
  'D2', 'D2', 'G2', 'G2', 'C2', 'C2', 'E2', 'E2',
]

// Mood-specific note sets (8-step, doubled to 16 for normal mode)
const MOOD_NOTES = {
  calm: {
    chords: [
      ['C4','E4','G4','B4'], ['C4','E4','G4','B4'],
      ['F4','A4','C5','E5'], ['F4','A4','C5','E5'],
      ['G4','B4','D5','F#5'], ['G4','B4','D5','F#5'],
      ['A4','C#5','E5','G#5'], ['A4','C#5','E5','G#5'],
    ],
    melody: ['C5','D5','E5','F#5','G5','A5','B5','C6'],
    bass: ['C2','C2','F2','F2','G2','G2','A2','A2'],
  },
  hopeful: {
    chords: [
      ['C4','E4','G4'], ['C4','E4','G4'],
      ['F4','A4','C5'], ['F4','A4','C5'],
      ['G4','B4','D5'], ['G4','B4','D5'],
      ['C4','E4','G4'], ['C4','E4','G4'],
    ],
    melody: ['C5','D5','E5','G5','A5','C6','D6','E6'],
    bass: ['C2','C2','F2','F2','G2','G2','C2','C2'],
  },
  sad: {
    chords: [
      ['A3','C4','E4'], ['A3','C4','E4'],
      ['D4','F4','A4'], ['D4','F4','A4'],
      ['E4','G#4','B4'], ['E4','G#4','B4'],
      ['A3','C4','E4'], ['A3','C4','E4'],
    ],
    melody: ['A4','B4','C5','D5','E5','F5','G5','A5'],
    bass: ['A1','A1','D2','D2','E2','E2','A1','A1'],
  },
  anxious: {
    chords: [
      ['C4','Eb4','Gb4'], ['C4','Eb4','Gb4'],
      ['D4','F4','Ab4'], ['D4','F4','Ab4'],
      ['Eb4','Gb4','A4'], ['Eb4','Gb4','A4'],
      ['F4','Ab4','B4'], ['F4','Ab4','B4'],
    ],
    melody: ['C5','D5','E5','F#5','G#5','A#5','C6','D6'],
    bass: ['C2','Eb2','F#2','A2','C2','Eb2','F#2','A2'],
  },
  energized: {
    chords: [
      ['E4','B4','E5'], ['E4','B4','E5'],
      ['A3','E4','A4'], ['A3','E4','A4'],
      ['D4','A4','D5'], ['D4','A4','D5'],
      ['G4','D5','G5'], ['G4','D5','G5'],
    ],
    melody: ['E5','F#5','G#5','A5','B5','D6','E6','F#6'],
    bass: ['E2','E2','A2','A2','D2','D2','G2','G2'],
  },
}

// Mood-specific audio effects
const MOOD_EFFECTS = {
  calm: () => [
    new Tone.Reverb({ decay: 3, wet: 0.4 }),
    new Tone.Chorus({ frequency: 0.5, depth: 0.6, wet: 0.3 }).start(),
  ],
  hopeful: () => [
    new Tone.PingPongDelay({ delayTime: '16n', feedback: 0.3, wet: 0.25 }),
    new Tone.Filter({ frequency: 4000, type: 'lowpass' }),
  ],
  sad: () => [
    new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.4, wet: 0.3 }),
    new Tone.Filter({ frequency: 800, type: 'lowpass' }),
  ],
  anxious: () => [
    new Tone.Distortion({ distortion: 0.3, wet: 0.2 }),
    new Tone.Tremolo({ frequency: 6, depth: 0.6 }).start(),
  ],
  energized: () => [
    new Tone.Distortion({ distortion: 0.15, wet: 0.15 }),
    new Tone.Filter({ frequency: 2000, type: 'highpass' }),
  ],
}

function triggerPerc(kit, step) {
  const beat = step % 4
  if (beat === 0) kit.kick.triggerAttackRelease('C1', '8n')
  else if (beat === 2) kit.snare.triggerAttackRelease('8n')
  else kit.hihat.triggerAttackRelease('32n')
}

export const JAM_INSTRUMENTS = {
  chords: ['Warm Pad', 'Crystal Pad', 'Music Box', 'Kalimba'],
  melody: ['Bell Pluck', 'Marimba', 'Cat Meow', 'Bird Song'],
  bass: ['Sub Bass', 'Round Bass', 'Elephant Stomp', 'Bear Growl'],
  percussion: ['Classic Kit', 'Toy Kit', 'Animal Farm'],
}

export function getInstrumentOptions(trackType) {
  return Object.keys(INSTRUMENTS[trackType] || {})
}

export function getJamInstrumentOptions(trackType) {
  return JAM_INSTRUMENTS[trackType] || []
}

export function getDefaultInstrument(trackType) {
  const opts = getInstrumentOptions(trackType)
  return opts[0] || ''
}

export function getJamDefaultInstrument(trackType) {
  const opts = getJamInstrumentOptions(trackType)
  return opts[0] || ''
}

export function isJamInstrument(trackType, instrument) {
  return (JAM_INSTRUMENTS[trackType] || []).includes(instrument)
}

export function createDefaultTracks() {
  return [
    { type: 'chords', instrument: getDefaultInstrument('chords'), pattern: Array(16).fill(false) },
    { type: 'melody', instrument: getDefaultInstrument('melody'), pattern: Array(16).fill(false) },
    { type: 'bass', instrument: getDefaultInstrument('bass'), pattern: Array(16).fill(false) },
    { type: 'percussion', instrument: getDefaultInstrument('percussion'), pattern: Array(16).fill(false) },
  ]
}

export class LoopEngine {
  constructor() {
    this.synths = {}
    this.effects = []
    this.sequence = null
    this.isPlaying = false
    this.currentStep = -1
    this.onStepChange = null
  }

  async init() {
    await Tone.start()
  }

  async buildSynths(tracks, mood = null) {
    this.disposeSynths()
    this.disposeEffects()

    // Build mood effects chain
    if (mood && MOOD_EFFECTS[mood]) {
      this.effects = MOOD_EFFECTS[mood]()
      // Wait for any effects that need async init (e.g. Reverb)
      for (const fx of this.effects) {
        if (fx.ready) await fx.ready
      }
    }

    for (const track of tracks) {
      const factory = INSTRUMENTS[track.type]?.[track.instrument]
      if (factory) {
        const synth = factory()
        // Reconnect synth through mood effects chain
        if (this.effects.length > 0) {
          if (synth?.type === 'kit') {
            for (const part of [synth.kick, synth.snare, synth.hihat]) {
              if (part) {
                if (typeof part.disconnect === 'function') part.disconnect()
                part.chain(...this.effects, Tone.getDestination())
              }
            }
          } else {
            synth.disconnect()
            synth.chain(...this.effects, Tone.getDestination())
          }
        }
        this.synths[track.type] = synth
      }
    }
  }

  disposeEffects() {
    for (const fx of this.effects) {
      try { fx.dispose() } catch {}
    }
    this.effects = []
  }

  disposeSynths() {
    for (const [key, synth] of Object.entries(this.synths)) {
      if (synth?.type === 'kit') {
        synth.kick?.dispose()
        synth.snare?.dispose()
        synth.hihat?.dispose()
      } else {
        synth?.dispose()
      }
    }
    this.synths = {}
  }

  async start(tracks, bpm, freePlay = false, mood = null) {
    this.stop()
    Tone.getTransport().bpm.value = bpm
    await this.buildSynths(tracks, mood)

    // Select note sets based on mood, then freePlay
    const moodData = mood ? MOOD_NOTES[mood] : null
    let chordNotes, melodyNotes, bassNotes

    if (moodData) {
      if (freePlay) {
        chordNotes = moodData.chords
        melodyNotes = moodData.melody
        bassNotes = moodData.bass
      } else {
        chordNotes = [...moodData.chords, ...moodData.chords]
        melodyNotes = [...moodData.melody, ...moodData.melody]
        bassNotes = [...moodData.bass, ...moodData.bass]
      }
    } else {
      chordNotes = freePlay ? PENTA_CHORD_NOTES : CHORD_NOTES
      melodyNotes = freePlay ? PENTA_MELODY_NOTES : MELODY_NOTES
      bassNotes = freePlay ? PENTA_BASS_NOTES : BASS_NOTES
    }

    const stepCount = freePlay ? 8 : 16
    let step = 0
    this.sequence = new Tone.Sequence(
      (time, _) => {
        this.currentStep = step % stepCount

        for (const track of tracks) {
          if (!track.pattern[this.currentStep]) continue
          const synth = this.synths[track.type]
          if (!synth) continue

          if (track.type === 'chords') {
            synth.triggerAttackRelease(chordNotes[this.currentStep], '8n', time)
          } else if (track.type === 'melody') {
            synth.triggerAttackRelease(melodyNotes[this.currentStep], '16n', time)
          } else if (track.type === 'bass') {
            synth.triggerAttackRelease(bassNotes[this.currentStep], '8n', time)
          } else if (track.type === 'percussion' && synth.type === 'kit') {
            triggerPerc(synth, this.currentStep)
          }
        }

        if (this.onStepChange) {
          Tone.getDraw().schedule(() => {
            this.onStepChange(this.currentStep)
          }, time)
        }

        step++
      },
      [...Array(stepCount).keys()],
      '16n'
    )

    this.sequence.start(0)
    Tone.getTransport().start()
    this.isPlaying = true
  }

  stop() {
    if (this.sequence) {
      this.sequence.stop()
      this.sequence.dispose()
      this.sequence = null
    }
    Tone.getTransport().stop()
    Tone.getTransport().position = 0
    this.disposeSynths()
    this.disposeEffects()
    this.isPlaying = false
    this.currentStep = -1
    if (this.onStepChange) this.onStepChange(-1)
  }

  pause() {
    Tone.getTransport().pause()
    this.isPlaying = false
  }

  resume() {
    Tone.getTransport().start()
    this.isPlaying = true
  }

  updateBpm(bpm) {
    Tone.getTransport().bpm.value = bpm
  }

  dispose() {
    this.stop()
  }
}

// --- Music Maker helpers ---

export function createSynth(trackType, instrumentName) {
  return INSTRUMENTS[trackType]?.[instrumentName]?.()
}

export const MAKER_INSTRUMENTS = Object.keys(INSTRUMENTS.melody)

export const SOUND_PADS = {
  kick: {
    label: 'Kick', emoji: '\u{1F941}',
    create: () => new Tone.MembraneSynth({ volume: -4 }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('C1', '8n'),
  },
  snare: {
    label: 'Snare', emoji: '\u{1FA98}',
    create: () => new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
      volume: -8,
    }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('8n'),
  },
  hihat: {
    label: 'HiHat', emoji: '\u{1F514}',
    create: () => new Tone.MetalSynth({
      frequency: 400, envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5, volume: -12,
    }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('32n'),
  },
  meow: {
    label: 'Meow', emoji: '\u{1F431}',
    create: () => new Tone.FMSynth({
      modulationIndex: 2, harmonicity: 1.5,
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.1, release: 0.2 },
      volume: -6,
    }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('A4', '8n'),
  },
  bird: {
    label: 'Bird', emoji: '\u{1F426}',
    create: () => new Tone.FMSynth({
      modulationIndex: 12, harmonicity: 3,
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
      volume: -8,
    }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('C7', '16n'),
  },
  growl: {
    label: 'Growl', emoji: '\u{1F43B}',
    create: () => new Tone.FMSynth({
      modulationIndex: 10, harmonicity: 0.5,
      envelope: { attack: 0.05, decay: 0.4, sustain: 0.2, release: 0.3 },
      volume: -4,
    }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('E2', '4n'),
  },
  clap: {
    label: 'Clap', emoji: '\u{1F44F}',
    create: () => new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.005, decay: 0.12, sustain: 0 },
      volume: -6,
    }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('16n'),
  },
  cowbell: {
    label: 'Cowbell', emoji: '\u{1F42E}',
    create: () => new Tone.MetalSynth({
      frequency: 560, envelope: { attack: 0.001, decay: 0.12, release: 0.01 },
      harmonicity: 5, modulationIndex: 20, resonance: 800, octaves: 0.5, volume: -8,
    }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('8n'),
  },
  chime: {
    label: 'Chime', emoji: '\u2728',
    create: () => new Tone.FMSynth({
      modulationIndex: 4, harmonicity: 6,
      envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.8 },
      volume: -8,
    }).toDestination(),
    trigger: (s) => s.triggerAttackRelease('E6', '8n'),
  },
}
