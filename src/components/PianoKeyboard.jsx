import { useEffect, useCallback, useState } from 'react'

const OCTAVE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_NOTES = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]

// Computer keyboard → note mapping (2 octaves)
const KEY_MAP = {
  a: 'C4', w: 'C#4', s: 'D4', e: 'D#4', d: 'E4', f: 'F4', t: 'F#4',
  g: 'G4', y: 'G#4', h: 'A4', u: 'A#4', j: 'B4',
  k: 'C5', o: 'C#5', l: 'D5', p: 'D#5', ';': 'E5',
}

function buildKeys(startOctave, numOctaves) {
  const keys = []
  for (let oct = startOctave; oct < startOctave + numOctaves; oct++) {
    for (const note of OCTAVE_NOTES) {
      keys.push({ note: `${note}${oct}`, name: note, octave: oct, isBlack: note.includes('#') })
    }
  }
  return keys
}

export default function PianoKeyboard({ onNotePlay, accentColor = '#926b7f' }) {
  const [activeKeys, setActiveKeys] = useState(new Set())
  const keys = buildKeys(4, 2)
  const whiteKeys = keys.filter((k) => !k.isBlack)
  const allKeys = keys

  const playNote = useCallback(
    (note) => {
      onNotePlay(note)
      setActiveKeys((prev) => new Set(prev).add(note))
      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev)
          next.delete(note)
          return next
        })
      }, 150)
    },
    [onNotePlay]
  )

  useEffect(() => {
    const pressed = new Set()
    const handleDown = (e) => {
      const key = e.key.toLowerCase()
      if (pressed.has(key)) return
      const note = KEY_MAP[key]
      if (note) {
        pressed.add(key)
        playNote(note)
      }
    }
    const handleUp = (e) => {
      pressed.delete(e.key.toLowerCase())
    }
    window.addEventListener('keydown', handleDown)
    window.addEventListener('keyup', handleUp)
    return () => {
      window.removeEventListener('keydown', handleDown)
      window.removeEventListener('keyup', handleUp)
    }
  }, [playNote])

  const whiteKeyWidth = 100 / whiteKeys.length
  const totalWidth = whiteKeys.length

  return (
    <div className="relative select-none rounded-2xl overflow-hidden border border-ps-gray-200 shadow-sm" style={{ height: 140 }}>
      {/* White keys */}
      {whiteKeys.map((k, i) => {
        const isActive = activeKeys.has(k.note)
        return (
          <div
            key={k.note}
            onMouseDown={() => playNote(k.note)}
            className="absolute top-0 bottom-0 border-r border-ps-gray-200 cursor-pointer transition-colors duration-75"
            style={{
              left: `${(i / totalWidth) * 100}%`,
              width: `${whiteKeyWidth}%`,
              background: isActive ? accentColor : '#ffffff',
              zIndex: 1,
            }}
          >
            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] text-ps-gray-500 font-mono">
              {k.name}{k.octave}
            </span>
          </div>
        )
      })}
      {/* Black keys */}
      {whiteKeys.map((wk, i) => {
        const noteIdx = OCTAVE_NOTES.indexOf(wk.name)
        if (noteIdx === -1) return null
        const sharpName = wk.name + '#'
        if (!OCTAVE_NOTES.includes(sharpName)) return null
        const blackNote = `${sharpName}${wk.octave}`
        const blackKey = allKeys.find((k) => k.note === blackNote)
        if (!blackKey) return null

        const isActive = activeKeys.has(blackNote)
        const blackWidth = whiteKeyWidth * 0.6
        const offset = (i + 1) * whiteKeyWidth - blackWidth / 2

        return (
          <div
            key={blackNote}
            onMouseDown={(e) => {
              e.stopPropagation()
              playNote(blackNote)
            }}
            className="absolute top-0 rounded-b-lg cursor-pointer transition-colors duration-75"
            style={{
              left: `${(offset / whiteKeyWidth / totalWidth) * 100}%`,
              width: `${(blackWidth / whiteKeyWidth / totalWidth) * 100}%`,
              height: '60%',
              background: isActive ? accentColor : '#172337',
              zIndex: 2,
            }}
          />
        )
      })}
    </div>
  )
}
