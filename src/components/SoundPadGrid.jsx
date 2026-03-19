import { useState, useCallback } from 'react'
import { SOUND_PADS } from '../utils/audio'

const PAD_KEYS = Object.keys(SOUND_PADS)

export default function SoundPadGrid({ onPadPlay, accentColor = '#926b7f' }) {
  const [activePads, setActivePads] = useState(new Set())

  const handlePad = useCallback(
    (padKey) => {
      onPadPlay(padKey)
      setActivePads((prev) => new Set(prev).add(padKey))
      setTimeout(() => {
        setActivePads((prev) => {
          const next = new Set(prev)
          next.delete(padKey)
          return next
        })
      }, 150)
    },
    [onPadPlay]
  )

  return (
    <div className="grid grid-cols-3 gap-2">
      {PAD_KEYS.map((key) => {
        const pad = SOUND_PADS[key]
        const isActive = activePads.has(key)
        return (
          <button
            key={key}
            onMouseDown={() => handlePad(key)}
            className="flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-75 cursor-pointer select-none"
            style={{
              borderColor: isActive ? accentColor : '#e5e5e5',
              background: isActive ? `${accentColor}15` : '#f7f8f8',
              transform: isActive ? 'scale(0.95)' : 'scale(1)',
              boxShadow: isActive ? `0 0 16px ${accentColor}30` : '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span className="text-2xl mb-1">{pad.emoji}</span>
            <span className="text-xs font-medium text-ps-gray-600">{pad.label}</span>
          </button>
        )
      })}
    </div>
  )
}
