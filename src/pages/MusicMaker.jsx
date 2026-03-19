import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as Tone from 'tone'
import PianoKeyboard from '../components/PianoKeyboard'
import SoundPadGrid from '../components/SoundPadGrid'
import { createSynth, MAKER_INSTRUMENTS, SOUND_PADS } from '../utils/audio'

export default function MusicMaker() {
  const [instrument, setInstrument] = useState(MAKER_INSTRUMENTS[0])
  const [isRecording, setIsRecording] = useState(false)
  const [events, setEvents] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackPos, setPlaybackPos] = useState(-1)

  const synthRef = useRef(null)
  const padSynthsRef = useRef({})
  const startTimeRef = useRef(0)
  const playbackTimersRef = useRef([])
  const toneStartedRef = useRef(false)

  // Create keyboard synth
  useEffect(() => {
    synthRef.current?.dispose()
    synthRef.current = createSynth('melody', instrument)
    return () => synthRef.current?.dispose()
  }, [instrument])

  // Create pad synths once
  useEffect(() => {
    const pads = {}
    for (const [key, pad] of Object.entries(SOUND_PADS)) {
      pads[key] = pad.create()
    }
    padSynthsRef.current = pads
    return () => {
      for (const s of Object.values(pads)) {
        try { s.dispose() } catch {}
      }
    }
  }, [])

  const ensureTone = useCallback(async () => {
    if (!toneStartedRef.current) {
      await Tone.start()
      toneStartedRef.current = true
    }
  }, [])

  const handleNotePlay = useCallback(
    async (note) => {
      await ensureTone()
      synthRef.current?.triggerAttackRelease(note, '8n')
      if (isRecording) {
        const time = Date.now() - startTimeRef.current
        setEvents((prev) => [...prev, { time, type: 'key', note }])
      }
    },
    [isRecording, ensureTone]
  )

  const handlePadPlay = useCallback(
    async (padKey) => {
      await ensureTone()
      const pad = SOUND_PADS[padKey]
      const synth = padSynthsRef.current[padKey]
      if (pad && synth) {
        pad.trigger(synth)
      }
      if (isRecording) {
        const time = Date.now() - startTimeRef.current
        setEvents((prev) => [...prev, { time, type: 'pad', pad: padKey }])
      }
    },
    [isRecording, ensureTone]
  )

  const handleRecord = useCallback(async () => {
    await ensureTone()
    setEvents([])
    startTimeRef.current = Date.now()
    setIsRecording(true)
  }, [ensureTone])

  const handleStopRecord = useCallback(() => {
    setIsRecording(false)
  }, [])

  const handlePlayback = useCallback(async () => {
    if (events.length === 0) return
    await ensureTone()
    setIsPlaying(true)
    setPlaybackPos(0)

    // Clear any existing timers
    playbackTimersRef.current.forEach(clearTimeout)
    playbackTimersRef.current = []

    events.forEach((evt, idx) => {
      const timer = setTimeout(() => {
        setPlaybackPos(idx)
        if (evt.type === 'key') {
          synthRef.current?.triggerAttackRelease(evt.note, '8n')
        } else if (evt.type === 'pad') {
          const pad = SOUND_PADS[evt.pad]
          const synth = padSynthsRef.current[evt.pad]
          if (pad && synth) pad.trigger(synth)
        }
      }, evt.time)
      playbackTimersRef.current.push(timer)
    })

    // End playback after last event + buffer
    const lastTime = events[events.length - 1].time
    const endTimer = setTimeout(() => {
      setIsPlaying(false)
      setPlaybackPos(-1)
    }, lastTime + 500)
    playbackTimersRef.current.push(endTimer)
  }, [events, ensureTone])

  const handleStopPlayback = useCallback(() => {
    playbackTimersRef.current.forEach(clearTimeout)
    playbackTimersRef.current = []
    setIsPlaying(false)
    setPlaybackPos(-1)
  }, [])

  const handleClear = useCallback(() => {
    handleStopPlayback()
    setEvents([])
  }, [handleStopPlayback])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      playbackTimersRef.current.forEach(clearTimeout)
    }
  }, [])

  const duration = events.length > 0 ? events[events.length - 1].time : 0
  const accentColor = '#8b5cf6'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-white">Music Maker</h1>
        </div>
      </div>

      {/* Instrument selector */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Keyboard Sound</span>
        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className="bg-navy-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 border border-navy-600 outline-none focus:border-slate-400"
        >
          {MAKER_INSTRUMENTS.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* Piano Keyboard */}
      <div className="mb-6">
        <p className="text-xs text-slate-500 mb-2">Click keys or use keyboard: A-J = C4-B4, K-; = C5-E5</p>
        <PianoKeyboard onNotePlay={handleNotePlay} accentColor={accentColor} />
      </div>

      {/* Sound Pads */}
      <div className="mb-6">
        <p className="text-xs text-slate-500 mb-2">Sound Pads</p>
        <SoundPadGrid onPadPlay={handlePadPlay} accentColor={accentColor} />
      </div>

      {/* Recording controls */}
      <div className="flex items-center gap-3 mb-4">
        {!isRecording ? (
          <button
            onClick={handleRecord}
            disabled={isPlaying}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 bg-white rounded-full" /> Record
          </button>
        ) : (
          <button
            onClick={handleStopRecord}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium cursor-pointer flex items-center gap-2 animate-pulse"
          >
            <span className="w-2.5 h-2.5 bg-white rounded-sm" /> Stop
          </button>
        )}

        {!isPlaying ? (
          <button
            onClick={handlePlayback}
            disabled={events.length === 0 || isRecording}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ▶ Play
          </button>
        ) : (
          <button
            onClick={handleStopPlayback}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            ⏹ Stop
          </button>
        )}

        <button
          onClick={handleClear}
          disabled={events.length === 0 || isRecording}
          className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-slate-300 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear
        </button>

        {events.length > 0 && (
          <span className="text-xs text-slate-500 ml-auto">
            {events.length} events · {(duration / 1000).toFixed(1)}s
          </span>
        )}
      </div>

      {/* Timeline */}
      {events.length > 0 && (
        <div className="relative h-10 bg-navy-800 rounded-lg border border-navy-700 overflow-hidden">
          {events.map((evt, idx) => {
            const x = duration > 0 ? (evt.time / duration) * 100 : 0
            const isKeyEvt = evt.type === 'key'
            const isCurrent = idx === playbackPos
            return (
              <div
                key={idx}
                className="absolute top-1/2 -translate-y-1/2 rounded-full transition-transform"
                style={{
                  left: `${x}%`,
                  width: isCurrent ? 8 : 5,
                  height: isCurrent ? 8 : 5,
                  background: isKeyEvt ? accentColor : '#ef4444',
                  opacity: isCurrent ? 1 : 0.6,
                  transform: `translateY(-50%) ${isCurrent ? 'scale(1.5)' : 'scale(1)'}`,
                }}
              />
            )
          })}
          {isPlaying && playbackPos >= 0 && duration > 0 && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/50"
              style={{ left: `${(events[playbackPos]?.time / duration) * 100}%` }}
            />
          )}
        </div>
      )}
    </div>
  )
}
