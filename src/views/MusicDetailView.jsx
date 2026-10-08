import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import RotatingCuboid from "../components/three/RotatingCuboid";

/**
 * Displays an album tracklist, shared playback state, and desktop 3D artwork.
 * @param {Object} props Selected album, playback state, and view callbacks.
 * @param {Object} props.selectedAlbum Album and track metadata to render.
 * @param {Object|null} props.currentTrack Currently active track, if any.
 * @param {boolean} props.isPlaying Whether the shared player is playing.
 * @param {{x: number, y: number}} props.mouse Normalized pointer position for the 3D artwork.
 * @param {Function} props.onBackToCatalog Returns to the album catalog.
 * @param {Function} props.onPlayTrack Starts or toggles a track.
 * @param {Function} props.onStopMusic Stops the shared music player.
 * @returns {React.ReactElement}
 */
export default function MusicDetailView({
  selectedAlbum,
  currentTrack,
  isPlaying,
  mouse,
  onBackToCatalog,
  onPlayTrack,
  onStopMusic,
}) {
  return (
    <div className="w-full flex flex-col h-full justify-between md:py-0 lg:py-0 overflow-hidden">
      {/* Top Bar: Clean stacking on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 mb-0 lg:mb-0">
        <button
          onClick={onBackToCatalog}
          className="text-[10px] md:text-xs tracking-[0.2em] text-yellow-400 uppercase cursor-pointer hover:underline text-left"
        >
          ← BACK TO CATALOGUE
        </button>
        <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4">
          {selectedAlbum.spotifyUrl && (
            <a
              href={selectedAlbum.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] md:text-[10px] tracking-[0.2em] text-white/60 hover:text-yellow-400 uppercase transition-colors"
            >
              [ SPOTIFY ]
            </a>
          )}
          <p className="text-[10px] md:text-xs tracking-[0.25em] text-yellow-400/80 uppercase truncate">
            {selectedAlbum.title}
          </p>
        </div>
      </div>

      {/* Main Content Grid: Tracklist + 3D Object only on large screens (lg:) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 my-auto items-center overflow-y-auto yellow-dot-scrollbar  py-2 min-h-0 flex-1">
        <div className="space-y-2 lg:space-y-4 w-full">
          <h3 className="text-lg lg:text-2xl font-bold tracking-tight">
            TRACKLIST
          </h3>
          {/* 1 column on mobile/desktop, explicitly 2 columns only in mobile landscape */}
          <div className="grid grid-cols-1 max-lg:landscape:grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-1 divide-y max-lg:landscape:divide-y-0 lg:divide-y divide-white/10 border-y border-white/10 py-1 max-h-[180px] landscape:max-h-none lg:max-h-none overflow-y-auto lg:overflow-visible">
            {selectedAlbum.tracks.map((track) => {
              const isThisTrackPlaying =
                currentTrack?.title === track.title && isPlaying;
              return (
                <div
                  key={track.num}
                  onClick={() => onPlayTrack(track, selectedAlbum)}
                  className={`py-1.5 lg:py-3 flex items-center justify-between text-xs lg:text-sm cursor-pointer transition-colors ${
                    isThisTrackPlaying
                      ? "text-yellow-400 font-semibold"
                      : "hover:text-yellow-400 text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 lg:gap-4 truncate pr-2">
                    <span className="text-white/40 text-[10px] lg:text-xs shrink-0">
                      {isThisTrackPlaying ? "▶" : track.num}
                    </span>
                    <span className="truncate">{track.title}</span>
                  </div>
                  <span className="text-white/40 text-[10px] lg:text-xs shrink-0">
                    {track.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D Object - Completely hidden on phones and tablets, shown only on desktop (lg+) */}
        <div className="hidden lg:block w-full h-[280px] relative">
          <Canvas camera={{ position: [0, 0, 6] }}>
            <Environment
              files="/monochrome_studio_02_1k.hdr"
              background={false}
            />
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2.5} />
            <RotatingCuboid mouse={mouse} selectedAlbum={selectedAlbum} />
          </Canvas>
        </div>
      </div>

      {/* Bottom Player Bar */}
      <div className="w-full h-11 lg:h-12 bg-[#14151a] border border-yellow-400/20 px-4 lg:px-6 flex items-center justify-between text-[11px] lg:text-xs shrink-0 mt-auto">
        <div className="flex items-center gap-3 lg:gap-4 truncate">
          <span className="text-yellow-400 tracking-widest truncate">
            {currentTrack
              ? `NOW PLAYING: ${currentTrack.title}`
              : "READY FOR PLAYBACK"}
          </span>
        </div>
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          <span className="text-white/40 hidden sm:inline">
            {isPlaying ? "STREAMING" : "STANDBY"}
          </span>
          {currentTrack && (
            <button
              onClick={onStopMusic}
              className="w-5 h-5 lg:w-6 lg:h-6 bg-white/5 hover:bg-yellow-400/20 hover:text-yellow-400 border border-yellow-400/20 flex items-center justify-center text-[10px] lg:text-xs cursor-pointer transition-colors"
              title="Cut music"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
