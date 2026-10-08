import React from "react";

/**
 * Renders the floating controls for the shared audio player.
 * @param {Object} props Visibility, playback state, and player callbacks.
 * @param {boolean} props.showFloatingPlayer Whether the player is visible.
 * @param {Object|null} props.currentTrack Active track metadata, if any.
 * @param {boolean} props.isPlaying Whether audio is currently playing.
 * @param {Function} props.onTogglePlay Toggles playback.
 * @param {Function} props.onStopMusic Stops and resets playback.
 * @returns {React.ReactElement}
 */
export default function MiniPlayer({
  showFloatingPlayer,
  currentTrack,
  isPlaying,
  onTogglePlay,
  onStopMusic,
}) {
  return (
    <div
      className={`absolute bottom-6 z-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2 sm:gap-3 bg-[#14151a]/95 backdrop-blur-md border border-white/20 p-2 [@media(min-height:721px)]:p-3 shadow-2xl ${
        showFloatingPlayer
          ? "right-[2%] md:right-[2%] translate-x-0 opacity-100 scale-100 pointer-events-auto"
          : "right-[-300px] translate-x-10 opacity-0 scale-75 pointer-events-none"
      }`}
    >
      <button
        onClick={onTogglePlay}
        className="w-8 h-8 bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs cursor-pointer transition-colors shrink-0"
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>

      {/* Hide track info text on short-height screens (<720px) and mobile landscape */}
      <div className="overflow-hidden max-w-[140px] md:max-w-[180px] hidden [@media(min-height:721px)]:block max-xl:landscape:!hidden">
        <p className="text-[11px] font-bold tracking-wider truncate">
          {currentTrack?.title}
        </p>
        <p className="text-[9px] text-white/40 truncate">
          {currentTrack?.albumTitle}
        </p>
      </div>

      <button
        onClick={onStopMusic}
        className="w-6 h-6 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 flex items-center justify-center text-xs cursor-pointer transition-colors shrink-0 ml-0.5 [@media(min-height:721px)]:ml-1"
        title="Cut music"
      >
        ✕
      </button>
    </div>
  );
}
