import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { loadEntries } from '../utils/storage'
import { MOODS, MOOD_KEYS } from '../utils/moods'
import EntryCard from '../components/EntryCard'

export default function Home() {
  const [entries, setEntries] = useState([])
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    setEntries(loadEntries())
  }, [])

  const filtered = filter ? entries.filter((e) => e.mood === filter) : entries

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Moodloop</h1>
          <p className="text-slate-400 text-sm">Your mood music journal</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/maker"
            className="px-4 py-2.5 bg-navy-700 hover:bg-navy-600 text-slate-200 rounded-xl font-medium transition-all border border-navy-600"
          >
            Music Maker
          </Link>
          <Link
            to="/new"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/30"
          >
            + New Entry
          </Link>
        </div>
      </div>

      {/* Mood filter pills */}
      {entries.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              filter === null ? 'bg-slate-600 text-white' : 'bg-navy-700 text-slate-400 hover:bg-navy-600'
            }`}
          >
            All
          </button>
          {MOOD_KEYS.map((key) => {
            const mood = MOODS[key]
            const isActive = filter === key
            return (
              <button
                key={key}
                onClick={() => setFilter(isActive ? null : key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
                style={{
                  background: isActive ? `${mood.hex}30` : '#1e293b',
                  color: isActive ? mood.hex : '#94a3b8',
                  borderColor: isActive ? mood.hex : 'transparent',
                }}
              >
                {mood.emoji} {mood.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Entry list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎵</div>
          <p className="text-slate-400 mb-2">
            {entries.length === 0 ? 'No entries yet' : 'No entries match this filter'}
          </p>
          {entries.length === 0 && (
            <p className="text-slate-500 text-sm">Create your first mood loop to get started</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
