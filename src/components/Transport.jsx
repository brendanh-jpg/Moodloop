export default function Transport({ isPlaying, bpm, onPlay, onPause, onStop, onBpmChange, freePlay, onFreePlayToggle }) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex gap-2">
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            ▶ Play
          </button>
        ) : (
          <button
            onClick={onPause}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            ⏸ Pause
          </button>
        )}
        <button
          onClick={onStop}
          className="px-4 py-2 bg-navy-600 hover:bg-navy-500 text-slate-300 rounded-lg font-medium transition-colors cursor-pointer"
        >
          ⏹ Stop
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">BPM</span>
        <input
          type="range"
          min={60}
          max={140}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-28 accent-slate-400"
        />
        <span className="text-sm text-slate-300 font-mono w-8">{bpm}</span>
      </div>

      <button
        onClick={onFreePlayToggle}
        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border"
        style={{
          background: freePlay ? '#8b5cf6' : 'transparent',
          borderColor: freePlay ? '#8b5cf6' : '#475569',
          color: freePlay ? '#fff' : '#94a3b8',
        }}
      >
        ✦ Free Play
      </button>
    </div>
  )
}
