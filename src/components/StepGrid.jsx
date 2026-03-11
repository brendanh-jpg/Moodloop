import { getInstrumentOptions } from '../utils/audio'

const TRACK_LABELS = {
  chords: 'Chords',
  melody: 'Melody',
  bass: 'Bass',
  percussion: 'Drums',
}

export default function StepGrid({ tracks, onToggleStep, onInstrumentChange, currentStep, moodHex, freePlay }) {
  return (
    <div className="space-y-4">
      {tracks.map((track, trackIdx) => (
        <div key={track.type} className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
              {TRACK_LABELS[track.type]}
            </span>
            <select
              value={track.instrument}
              onChange={(e) => onInstrumentChange(trackIdx, e.target.value)}
              className="bg-navy-700 text-slate-300 text-xs rounded-lg px-2 py-1 border border-navy-600 outline-none focus:border-slate-400"
            >
              {getInstrumentOptions(track.type).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            {track.pattern.map((active, stepIdx) => {
              const isCurrent = stepIdx === currentStep
              const isBeatStart = stepIdx % 4 === 0
              return (
                <button
                  key={stepIdx}
                  onClick={() => onToggleStep(trackIdx, stepIdx)}
                  className="w-full rounded-md transition-all duration-100 cursor-pointer border"
                  style={{
                    aspectRatio: freePlay ? '1 / 1.15' : '1 / 1',
                    background: active
                      ? freePlay ? `${moodHex}` : moodHex
                      : isCurrent ? '#1e293b' : freePlay ? '#1a1033' : '#0f172a',
                    borderColor: isCurrent ? `${moodHex}99` : isBeatStart ? '#334155' : freePlay ? '#2d2050' : '#1e293b',
                    opacity: active ? 1 : freePlay ? 0.8 : 0.7,
                    boxShadow: active && isCurrent
                      ? `0 0 12px ${moodHex}60`
                      : active && freePlay
                        ? `0 0 8px ${moodHex}40`
                        : 'none',
                    borderRadius: freePlay ? '0.5rem' : '0.375rem',
                  }}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
