import { MOODS, MOOD_KEYS } from '../utils/moods'

export default function MoodPicker({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {MOOD_KEYS.map((key) => {
        const mood = MOODS[key]
        const isActive = selected === key
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: isActive ? mood.hex : '#334155',
              background: isActive ? `${mood.hex}20` : 'transparent',
              boxShadow: isActive ? `0 0 20px ${mood.hex}30` : 'none',
            }}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-sm font-medium" style={{ color: isActive ? mood.hex : '#94a3b8' }}>
              {mood.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
