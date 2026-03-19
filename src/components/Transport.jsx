export default function Transport({ isPlaying, bpm, onPlay, onPause, onStop, onBpmChange, freePlay, onFreePlayToggle }) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex gap-2">
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="px-4 py-2 bg-ps-mauve hover:bg-ps-mauve-light text-white rounded-full font-medium transition-colors cursor-pointer"
          >
            ▶ Play
          </button>
        ) : (
          <button
            onClick={onPause}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-full font-medium transition-colors cursor-pointer"
          >
            ⏸ Pause
          </button>
        )}
        <button
          onClick={onStop}
          className="px-4 py-2 bg-ps-gray-100 hover:bg-ps-gray-200 text-ps-gray-600 rounded-full font-medium transition-colors cursor-pointer"
        >
          ⏹ Stop
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-ps-gray-500 font-medium">BPM</span>
        <input
          type="range"
          min={60}
          max={140}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-28 accent-ps-mauve"
        />
        <span className="text-sm text-ps-dark font-mono w-8">{bpm}</span>
      </div>

      {onFreePlayToggle && (
        <button
          onClick={onFreePlayToggle}
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border"
          style={{
            background: freePlay ? '#926b7f' : '#fff',
            borderColor: freePlay ? '#926b7f' : '#e5e5e5',
            color: freePlay ? '#fff' : '#6b7280',
          }}
        >
          Jam Mode
        </button>
      )}
    </div>
  )
}
