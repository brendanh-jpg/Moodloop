import { Link } from 'react-router-dom'
import { MOODS } from '../utils/moods'

export default function EntryCard({ entry }) {
  const mood = MOODS[entry.mood]
  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      to={`/entry/${entry.id}`}
      className="block p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01]"
      style={{
        borderColor: `${mood.hex}40`,
        background: `linear-gradient(135deg, ${mood.hex}08, transparent)`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{ background: `${mood.hex}20` }}
        >
          {mood.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold truncate">{entry.title}</h3>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{ background: `${mood.hex}25`, color: mood.hex }}
            >
              {mood.label}
            </span>
          </div>
          <p className="text-slate-400 text-sm truncate">{entry.note || 'No note'}</p>
          <p className="text-slate-500 text-xs mt-1">{date}</p>
        </div>
      </div>
    </Link>
  )
}
