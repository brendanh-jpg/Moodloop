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
    await engineRef.current.start(entry.tracks, entry.bpm, false, entry.mood)
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
          className="text-ps-gray-500 hover:text-ps-dark transition-colors cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Entry metadata */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `${mood.hex}15` }}
          >
            {mood.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ps-dark">{entry.title}</h1>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${mood.hex}15`, color: mood.hex }}
              >
                {mood.label}
              </span>
              <span className="text-xs text-ps-gray-500">{date} at {time}</span>
            </div>
          </div>
        </div>

        {entry.note && (
          <p className="text-ps-body text-sm bg-ps-gray-50 rounded-2xl p-3 border border-ps-gray-200">
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
          className="flex-1 py-2.5 bg-ps-gray-100 hover:bg-ps-gray-200 text-ps-gray-600 rounded-full font-medium transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-full font-medium transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-ps-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-ps-dark font-semibold text-lg mb-2">Delete this entry?</h3>
            <p className="text-ps-gray-500 text-sm mb-6">
              "{entry.title}" will be permanently removed from your journal.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2 bg-ps-gray-100 text-ps-gray-600 rounded-full font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-500 hover:bg-red-400 text-white rounded-full font-medium cursor-pointer"
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
