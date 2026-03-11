import * as Tone from 'tone'

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
  },
}

// Note mappings per track type per step (16 steps)
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

// Percussion: step % 4 determines which drum plays
// 0 = kick, 2 = snare, 1,3 = hihat
function triggerPerc(kit, step) {
  const beat = step % 4
  if (beat === 0) kit.kick.triggerAttackRelease('C1', '8n')
  else if (beat === 2) kit.snare.triggerAttackRelease('8n')
  else kit.hihat.triggerAttackRelease('32n')
}

export function getInstrumentOptions(trackType) {
  return Object.keys(INSTRUMENTS[trackType] || {})
}

export function getDefaultInstrument(trackType) {
  const opts = getInstrumentOptions(trackType)
  return opts[0] || ''
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
    this.sequence = null
    this.isPlaying = false
    this.currentStep = -1
    this.onStepChange = null
  }

  async init() {
    await Tone.start()
  }

  buildSynths(tracks) {
    this.disposeSynths()
    for (const track of tracks) {
      const factory = INSTRUMENTS[track.type]?.[track.instrument]
      if (factory) {
        this.synths[track.type] = factory()
      }
    }
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

  start(tracks, bpm) {
    this.stop()
    Tone.getTransport().bpm.value = bpm
    this.buildSynths(tracks)

    let step = 0
    this.sequence = new Tone.Sequence(
      (time, _) => {
        this.currentStep = step % 16

        for (const track of tracks) {
          if (!track.pattern[this.currentStep]) continue
          const synth = this.synths[track.type]
          if (!synth) continue

          if (track.type === 'chords') {
            synth.triggerAttackRelease(CHORD_NOTES[this.currentStep], '8n', time)
          } else if (track.type === 'melody') {
            synth.triggerAttackRelease(MELODY_NOTES[this.currentStep], '16n', time)
          } else if (track.type === 'bass') {
            synth.triggerAttackRelease(BASS_NOTES[this.currentStep], '8n', time)
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
      [...Array(16).keys()],
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
