import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MoodPicker from '../components/MoodPicker'
import StepGrid from '../components/StepGrid'
import Transport from '../components/Transport'
import { MOODS } from '../utils/moods'
import { createDefaultTracks, LoopEngine, isJamInstrument, getJamDefaultInstrument } from '../utils/audio'
import { addEntry, getEntry, updateEntry } from '../utils/storage'

export default function Composer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const engineRef = useRef(null)

  const [step, setStep] = useState('mood') // 'mood' | 'compose' | 'save'
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')
  const [tracks, setTracks] = useState(createDefaultTracks)
  const [bpm, setBpm] = useState(90)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [title, setTitle] = useState('')
  const [freePlay, setFreePlay] = useState(false)
  const [bpmAutoSet, setBpmAutoSet] = useState(false)

  // Load existing entry for editing
  useEffect(() => {
    if (id) {
      const entry = getEntry(id)
      if (entry) {
        setMood(entry.mood)
        setNote(entry.note || '')
        setTracks(entry.tracks)
        setBpm(entry.bpm)
        setTitle(entry.title)
        setStep('compose')
      }
    }
  }, [id])

  useEffect(() => {
    engineRef.current = new LoopEngine()
    return () => engineRef.current?.dispose()
  }, [])

  const handlePlay = useCallback(async () => {
    const engine = engineRef.current
    if (!engine) return
    await engine.init()
    engine.onStepChange = setCurrentStep
    await engine.start(tracks, bpm, freePlay, mood)
    setIsPlaying(true)
  }, [tracks, bpm, freePlay, mood])

  const handlePause = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    if (engine.isPlaying) {
      engine.pause()
      setIsPlaying(false)
    } else {
      engine.resume()
      setIsPlaying(true)
    }
  }, [])

  const handleStop = useCallback(() => {
    engineRef.current?.stop()
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [])

  const handleBpmChange = useCallback(
    (newBpm) => {
      setBpm(newBpm)
      if (engineRef.current?.isPlaying) {
        engineRef.current.updateBpm(newBpm)
      }
    },
    []
  )

  const handleManualBpmChange = useCallback(
    (newBpm) => {
      setBpmAutoSet(false)
      handleBpmChange(newBpm)
    },
    [handleBpmChange]
  )

  const handleToggleStep = useCallback((trackIdx, stepIdx) => {
    setTracks((prev) => {
      const next = prev.map((t, i) =>
        i === trackIdx ? { ...t, pattern: t.pattern.map((v, j) => (j === stepIdx ? !v : v)) } : t
      )
      return next
    })
    if (engineRef.current?.isPlaying) {
      setTimeout(() => {}, 0)
    }
  }, [])

  // Restart playback when tracks change during play
  useEffect(() => {
    if (isPlaying && engineRef.current) {
      engineRef.current.onStepChange = setCurrentStep
      engineRef.current.stop()
      engineRef.current.start(tracks, bpm, freePlay, mood)
    }
  }, [tracks, freePlay, mood])

  const handleInstrumentChange = useCallback((trackIdx, instrument) => {
    setTracks((prev) =>
      prev.map((t, i) => (i === trackIdx ? { ...t, instrument } : t))
    )
  }, [])

  const handleSave = () => {
    if (!title.trim()) return

    const entryData = {
      title: title.trim(),
      mood,
      note: note.trim(),
      bpm,
      tracks,
    }

    if (id) {
      updateEntry(id, entryData)
    } else {
      addEntry({
        ...entryData,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        createdAt: new Date().toISOString(),
      })
    }

    handleStop()
    navigate('/')
  }

  const moodHex = mood ? MOODS[mood].hex : '#926b7f'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => {
            handleStop()
            navigate('/')
          }}
          className="text-ps-gray-500 hover:text-ps-dark transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-ps-dark">
          {id ? 'Edit Entry' : 'New Entry'}
        </h1>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {['mood', 'compose', 'save'].map((s, i) => (
          <div
            key={s}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              background: ['mood', 'compose', 'save'].indexOf(step) >= i ? moodHex : '#e5e5e5',
            }}
          />
        ))}
      </div>

      {/* Mood step */}
      {step === 'mood' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-ps-dark mb-1">How are you feeling?</h2>
            <p className="text-ps-gray-500 text-sm">Pick a mood to color your loop</p>
          </div>

          <MoodPicker selected={mood} onSelect={setMood} />

          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              placeholder="Add a note (optional)..."
              className="w-full bg-white border border-ps-gray-200 rounded-2xl p-3 text-ps-dark text-sm placeholder-ps-gray-500 resize-none outline-none focus:border-ps-mauve h-20"
            />
            <p className="text-xs text-ps-gray-500 text-right">{note.length}/200</p>
          </div>

          <button
            onClick={() => mood && setStep('compose')}
            disabled={!mood}
            className="w-full py-3 rounded-full font-medium transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-white"
            style={{
              background: mood ? moodHex : '#ddd',
            }}
          >
            Continue to Composer
          </button>
        </div>
      )}

      {/* Compose step */}
      {step === 'compose' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{MOODS[mood]?.emoji}</span>
            <span className="text-sm font-medium" style={{ color: moodHex }}>
              {MOODS[mood]?.label}
            </span>
            {note && <span className="text-xs text-ps-gray-500 truncate ml-2">— {note}</span>}
          </div>

          <Transport
            isPlaying={isPlaying}
            bpm={bpm}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onBpmChange={handleManualBpmChange}
            freePlay={freePlay}
            onFreePlayToggle={() => {
              setFreePlay((prev) => {
                const next = !prev
                if (next) {
                  handleBpmChange(75)
                  setBpmAutoSet(true)
                  setTracks((prevTracks) =>
                    prevTracks.map((t) =>
                      isJamInstrument(t.type, t.instrument)
                        ? t
                        : { ...t, instrument: getJamDefaultInstrument(t.type) }
                    )
                  )
                } else if (bpmAutoSet) {
                  handleBpmChange(90)
                  setBpmAutoSet(false)
                }
                return next
              })
            }}
          />

          <StepGrid
            tracks={tracks}
            onToggleStep={handleToggleStep}
            onInstrumentChange={handleInstrumentChange}
            currentStep={currentStep}
            moodHex={moodHex}
            freePlay={freePlay}
          />

          <div className="flex gap-3">
            <button
              onClick={() => setStep('mood')}
              className="px-4 py-2.5 bg-ps-gray-100 hover:bg-ps-gray-200 text-ps-gray-600 rounded-full transition-colors cursor-pointer"
            >
              ← Mood
            </button>
            <button
              onClick={() => setStep('save')}
              className="flex-1 py-2.5 rounded-full font-medium text-white transition-all cursor-pointer"
              style={{ background: moodHex }}
            >
              Save Entry →
            </button>
          </div>
        </div>
      )}

      {/* Save step */}
      {step === 'save' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-ps-dark mb-1">Name your loop</h2>
            <p className="text-ps-gray-500 text-sm">Give this moment a title</p>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Late Night Thoughts..."
            className="w-full bg-white border border-ps-gray-200 rounded-2xl p-3 text-ps-dark text-lg placeholder-ps-gray-500 outline-none focus:border-ps-mauve"
            autoFocus
          />

          <div
            className="p-4 rounded-2xl border bg-white"
            style={{ borderColor: `${moodHex}30` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{MOODS[mood]?.emoji}</span>
              <span className="text-sm font-medium" style={{ color: moodHex }}>
                {MOODS[mood]?.label}
              </span>
            </div>
            {note && <p className="text-sm text-ps-gray-500">{note}</p>}
            <p className="text-xs text-ps-gray-500 mt-2">
              {bpm} BPM · {tracks.filter((t) => t.pattern.some(Boolean)).length} active tracks
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('compose')}
              className="px-4 py-2.5 bg-ps-gray-100 hover:bg-ps-gray-200 text-ps-gray-600 rounded-full transition-colors cursor-pointer"
            >
              ← Edit Loop
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-full font-medium text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: moodHex }}
            >
              {id ? 'Update Entry' : 'Save to Journal'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
