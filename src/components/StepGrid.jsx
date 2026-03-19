import { getInstrumentOptions, getJamInstrumentOptions } from '../utils/audio'

const TRACK_LABELS = {
  chords: 'Chords',
  melody: 'Melody',
  bass: 'Bass',
  percussion: 'Drums',
}

export default function StepGrid({ tracks, onToggleStep, onInstrumentChange, currentStep, moodHex, freePlay }) {
  const stepCount = freePlay ? 8 : 16
  return (
    <div className="space-y-4">
      {tracks.map((track, trackIdx) => {
        const options = freePlay
          ? getJamInstrumentOptions(track.type)
          : getInstrumentOptions(track.type)
        return (
          <div key={track.type} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ps-gray-500 w-16">
                {TRACK_LABELS[track.type]}
              </span>
              <select
                value={track.instrument}
                onChange={(e) => onInstrumentChange(trackIdx, e.target.value)}
                className="bg-white text-ps-gray-600 text-xs rounded-full px-3 py-1 border border-ps-gray-200 outline-none focus:border-ps-mauve"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-1">
              {track.pattern.slice(0, stepCount).map((active, stepIdx) => {
                const isCurrent = stepIdx === currentStep
                const isBeatStart = stepIdx % 4 === 0
                return (
                  <button
                    key={stepIdx}
                    onClick={() => onToggleStep(trackIdx, stepIdx)}
                    className="w-full rounded-lg transition-all duration-100 cursor-pointer border"
                    style={{
                      aspectRatio: freePlay ? '1 / 1.15' : '1 / 1',
                      background: active
                        ? moodHex
                        : isCurrent ? '#f0f0f0' : freePlay ? '#fdf2f8' : '#f7f8f8',
                      borderColor: isCurrent ? `${moodHex}80` : isBeatStart ? '#ddd' : '#e5e5e5',
                      opacity: active ? 1 : 0.85,
                      boxShadow: active && isCurrent
                        ? `0 0 12px ${moodHex}40`
                        : active
                          ? `0 2px 4px ${moodHex}20`
                          : 'none',
                    }}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
