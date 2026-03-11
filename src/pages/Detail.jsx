import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEntry, deleteEntry } from '../utils/storage'
import { MOODS } from '../utils/moods'
import { LoopEngine } from '../utils/audio'
import StepGrid from '../components/StepGrid'
import Transport from '../components/Transport'

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const engineRef = useRef(null)

  const [entry, setEntry] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const data = getEntry(id)
    if (!data) {
      navigate('/')
      return
    }
    setEntry(data)
    engineRef.current = new LoopEngine()
    return () => engineRef.current?.dispose()
  }, [id, navigate])

  const handlePlay = useCallback(async () => {
    if (!entry || !engineRef.current) return
    await engineRef.current.init()
    engineRef.current.onStepChange = setCurrentStep
    engineRef.current.start(entry.tracks, entry.bpm)
    setIsPlaying(true)
  }, [entry])

  const handlePause = useCallback(() => {
    if (!engineRef.current) return
    if (engineRef.current.isPlaying) {
      engineRef.current.pause()
      setIsPlaying(false)
    } else {
      engineRef.current.resume()
      setIsPlaying(true)
    }
  }, [])

  const handleStop = useCallback(() => {
    engineRef.current?.stop()
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [])

  const handleDelete = () => {
    handleStop()
    deleteEntry(id)
    navigate('/')
  }

  if (!entry) return null

  const mood = MOODS[entry.mood]
  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const time = new Date(entry.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => {
            handleStop()
            navigate('/')
          }}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Entry metadata */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${mood.hex}20` }}
          >
            {mood.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{entry.title}</h1>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${mood.hex}25`, color: mood.hex }}
              >
                {mood.label}
              </span>
              <span className="text-xs text-slate-500">{date} at {time}</span>
            </div>
          </div>
        </div>

        {entry.note && (
          <p className="text-slate-300 text-sm bg-navy-800 rounded-xl p-3 border border-navy-700">
            {entry.note}
          </p>
        )}
      </div>

      {/* Playback */}
      <div className="space-y-6 mb-8">
        <Transport
          isPlaying={isPlaying}
          bpm={entry.bpm}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onBpmChange={() => {}}
        />

        <StepGrid
          tracks={entry.tracks}
          onToggleStep={() => {}}
          onInstrumentChange={() => {}}
          currentStep={currentStep}
          moodHex={mood.hex}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            handleStop()
            navigate(`/edit/${entry.id}`)
          }}
          className="flex-1 py-2.5 bg-navy-700 hover:bg-navy-600 text-slate-200 rounded-xl font-medium transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="px-4 py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-xl font-medium transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Delete this entry?</h3>
            <p className="text-slate-400 text-sm mb-6">
              "{entry.title}" will be permanently removed from your journal.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2 bg-navy-700 text-slate-300 rounded-xl font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
