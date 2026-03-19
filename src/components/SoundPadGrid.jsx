import { useState, useCallback } from 'react'
import { SOUND_PADS } from '../utils/audio'

const PAD_KEYS = Object.keys(SOUND_PADS)

export default function SoundPadGrid({ onPadPlay, accentColor = '#3b82f6' }) {
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
            className="flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-75 cursor-pointer select-none"
            style={{
              borderColor: isActive ? accentColor : '#334155',
              background: isActive ? `${accentColor}25` : '#0f172a',
              transform: isActive ? 'scale(0.95)' : 'scale(1)',
              boxShadow: isActive ? `0 0 16px ${accentColor}40` : 'none',
            }}
          >
            <span className="text-2xl mb-1">{pad.emoji}</span>
            <span className="text-xs font-medium text-slate-300">{pad.label}</span>
          </button>
        )
      })}
    </div>
  )
}
