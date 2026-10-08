import React, { useState } from "react";

/**
 * Renders the album catalog and its optional passcode prompt.
 * @param {Object} props Catalog data and playback/navigation callbacks.
 * @param {Array<Object>} props.albumsData Albums and their track metadata.
 * @param {Object|null} props.currentTrack Currently active track, if any.
 * @param {boolean} props.isPlaying Whether the shared player is playing.
 * @param {function(Object, Object): void} props.onPlayTrack Starts or toggles a track.
 * @param {Function} props.onStopMusic Stops the shared music player.
 * @param {function(Object): void} props.onSelectAlbum Opens album details.
 * @returns {React.ReactElement}
 */
export default function MusicCatalogView({
  albumsData,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onStopMusic,
  onSelectAlbum,
  unlockedAlbums = [],
}) {
  const [passwordModalAlbum, setPasswordModalAlbum] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  /**
   * Requests a passcode for a locked album or opens an available album.
   * @param {Object} album Album selected from the catalog.
   * @returns {void}
   */
  const handleAlbumClick = (album) => {
    if (album.isLocked && !unlockedAlbums.includes(album.id)) {
      setPasswordModalAlbum(album);
      setEnteredPassword("");
      setPasswordError(false);
      return;
    }
    onSelectAlbum(album);
  };

  /**
   * Validates the entered passcode and opens the album when it matches.
   * @param {React.FormEvent<HTMLFormElement>} event Form submission event.
   * @returns {void}
   */
  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const correctPassword = passwordModalAlbum?.password || "1234";
    if (enteredPassword === correctPassword) {
      setUnlockedAlbums((prev) => [...prev, passwordModalAlbum.id]);
      const albumToOpen = passwordModalAlbum;
      setPasswordModalAlbum(null);
      onSelectAlbum(albumToOpen);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between py-1 max-lg:landscape:py-0 md:py-0 overflow-hidden relative">
      {/* Header text */}
      <div className="shrink-0 mb-1 max-lg:landscape:mb-0.5 md:mb-2">
        <p className="text-[9px] max-lg:landscape:text-[7px] md:text-xs tracking-[0.25em] text-white/50 uppercase mb-0.5 max-lg:landscape:mb-0">
          CATALOGUE NO. 02 — DISCOGRAPHY & SONIC EXPERIMENTS
        </p>
        <h2 className="text-base max-lg:landscape:text-xs md:text-4xl font-bold tracking-tight">
          SOUNDS OF AREMU
        </h2>
      </div>

      {/* Catalog items container - fixed landscape padding & bottom cushion */}
      <div className="flex flex-col max-lg:landscape:flex-row md:flex-row gap-3 max-lg:landscape:gap-3 md:gap-6 overflow-y-auto max-lg:landscape:overflow-y-hidden max-lg:landscape:overflow-x-auto md:overflow-y-hidden md:overflow-x-auto p-2.5 max-lg:landscape:p-2.5 max-lg:landscape:pb-3 md:p-0 md:py-2 my-auto items-center min-h-0 flex-1 yellow-dot-scrollbar  [@media(min-width:1024px)_and_(max-height:680px)]:!flex-row [@media(min-width:1024px)_and_(max-height:680px)]:!overflow-x-auto [@media(min-width:1024px)_and_(max-height:680px)]:!overflow-y-hidden [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!grid [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!grid-cols-2 [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!grid-rows-2 [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!h-full [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!overflow-hidden [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!gap-3">
        {albumsData.map((album, index) => {
          const isUnreleased = album.isUnreleased || index === 2;
          const isLocked =
            (album.isLocked || index === 3) &&
            !unlockedAlbums.includes(album.id);

          return (
            <div
              key={album.id}
              onClick={() => handleAlbumClick({ ...album, isLocked })}
              className={`w-full max-w-[320px] md:max-w-none md:w-[280px] max-lg:landscape:h-full max-lg:landscape:w-auto aspect-[4/3] md:aspect-[14/19] bg-[#14151a]/80 border border-white/10 p-3 max-lg:landscape:p-2 md:p-6 flex flex-col max-lg:landscape:relative md:flex-col justify-between cursor-pointer hover:border-white/40 transition-all group shrink-0 overflow-hidden relative [@media(min-width:1024px)_and_(max-height:680px)]:!h-full [@media(min-width:1024px)_and_(max-height:680px)]:!w-[220px] [@media(min-width:1024px)_and_(max-height:680px)]:!aspect-[14/19] [@media(min-width:1024px)_and_(max-height:680px)]:!relative [@media(min-width:1024px)_and_(max-height:680px)]:!p-2 [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!w-full [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!h-full [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!aspect-auto [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!p-3 [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!min-h-0 ${
                isUnreleased ? "opacity-95" : ""
              }`}
            >
              {/* Badges Overlay */}
              <div className="absolute top-2 right-2 z-20 flex gap-1">
                {isUnreleased && (
                  <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[8px] md:text-[9px] font-mono tracking-widest px-2 py-0.5 uppercase">
                    UNRELEASED
                  </span>
                )}
                {unlockedAlbums.includes(album.id) ? (
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[8px] md:text-[9px] font-mono tracking-widest px-2 py-0.5 uppercase flex items-center gap-1">
                    <span>🔓</span> UNLOCKED VIA CELESTARIS
                  </span>
                ) : (
                  isLocked && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[8px] md:text-[9px] font-mono tracking-widest px-2 py-0.5 uppercase flex items-center gap-1">
                      <span>🔒</span> PROTECTED
                    </span>
                  )
                )}
              </div>

              {/* Album Artwork Container */}
              <div className="w-full h-full max-lg:landscape:absolute max-lg:landscape:inset-0 max-lg:landscape:h-full md:flex-1 min-h-0 bg-[#0a0a0c] border border-white/5 overflow-hidden flex items-center justify-center group-hover:border-white/20 transition-colors mb-2 max-lg:landscape:mb-0 md:mb-3 relative [@media(min-width:1024px)_and_(max-height:680px)]:!absolute [@media(min-width:1024px)_and_(max-height:680px)]:!inset-0 [@media(min-width:1024px)_and_(max-height:680px)]:!h-full [@media(min-width:1024px)_and_(max-height:680px)]:!mb-0 [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!static [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!flex-1 [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!min-h-0 [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!w-full [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!mb-2">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      isLocked ? "blur-sm opacity-40 grayscale" : ""
                    }`}
                  />
                ) : (
                  <span className="text-[10px] text-white/40 tracking-widest">
                    {isLocked ? "[ LOCKED ARCHIVE ]" : "[ LOADING ARTWORK ]"}
                  </span>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent hidden max-lg:landscape:block md:hidden pointer-events-none [@media(min-width:1024px)_and_(max-height:680px)]:!block [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!hidden" />
              </div>

              {/* Album Info Text */}
              <div className="shrink-0 z-10 max-lg:landscape:absolute max-lg:landscape:bottom-2 max-lg:landscape:left-2.5 max-lg:landscape:right-2.5 md:static [@media(min-width:1024px)_and_(max-height:680px)]:!absolute [@media(min-width:1024px)_and_(max-height:680px)]:!bottom-2 [@media(min-width:1024px)_and_(max-height:680px)]:!left-2.5 [@media(min-width:1024px)_and_(max-height:680px)]:!right-2.5 [@media(min-width:768px)_and_(max-width:1024px)_and_(orientation:portrait)]:!static">
                <span className="text-[9px] max-lg:landscape:text-[7px] md:text-xs tracking-[0.2em] text-white/60 max-lg:landscape:text-white/80 [@media(min-width:1024px)_and_(max-height:680px)]:!text-white/80 block">
                  {album.year} {isUnreleased ? "· DEMO / IN-PROGRESS" : ""}
                </span>
                <h3 className="text-sm max-lg:landscape:text-xs md:text-lg font-bold tracking-wide mt-0.5 group-hover:text-white transition-colors truncate">
                  {album.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Password Prompt Modal */}
      {passwordModalAlbum && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14151a] border border-white/20 p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setPasswordModalAlbum(null)}
              className="absolute top-3 right-3 text-white/40 hover:text-white text-xs font-mono"
            >
              ✕ CLOSE
            </button>
            <span className="text-red-400 text-xs font-mono tracking-widest uppercase block mb-1">
              🔒 RESTRICTED ACCESS
            </span>
            <h4 className="text-lg font-bold uppercase tracking-wider mb-2">
              {passwordModalAlbum.title}
            </h4>
            <p className="text-xs text-white/60 mb-4 font-mono">
              ENTER PASSCODE TO UNLOCK STREAM ARCHIVE
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Passcode..."
                autoFocus
                className="w-full bg-black/60 border border-white/20 px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-white/60"
              />
              {passwordError && (
                <p className="text-red-400 text-[10px] font-mono tracking-widest uppercase">
                  INVALID PASSCODE. ACCESS DENIED.
                </p>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-colors"
              >
                UNLOCK
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer Music Player */}
      <div className="w-full h-10 md:h-14 bg-[#14151a] border border-white/10 px-3 max-lg:landscape:px-2.5 md:px-6 flex items-center justify-between shrink-0 max-lg:landscape:hidden">
        <div className="flex items-center gap-3 md:gap-4 truncate">
          <button
            onClick={() => {
              if (!currentTrack && albumsData[0]?.tracks[0]) {
                onPlayTrack(albumsData[0].tracks[0], albumsData[0]);
              }
            }}
            className="w-5 h-5 max-lg:landscape:w-4.5 max-lg:landscape:h-4.5 md:w-7 md:h-7 bg-white/10 hover:bg-white/20 flex items-center justify-center text-[9px] md:text-xs cursor-pointer transition-colors shrink-0"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <div className="truncate">
            <p className="text-[10px] max-lg:landscape:text-[8.5px] md:text-[11px] font-bold tracking-wider truncate">
              {currentTrack ? currentTrack.title : "NOTHING IS PLAYING"}
            </p>
            <p className="text-[8px] max-lg:landscape:text-[7px] md:text-[9px] text-white/40 truncate">
              {currentTrack
                ? currentTrack.albumTitle
                : "Select an album or track to initialize stream"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <span className="text-[10px] md:text-[11px] tracking-widest text-white/40 hidden sm:inline">
            {currentTrack ? "[ ACTIVE STREAM ]" : "[ NO ACTIVE SIGNAL ]"}
          </span>
          {currentTrack && (
            <button
              onClick={onStopMusic}
              className="w-5 h-5 md:w-6 md:h-6 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 flex items-center justify-center text-[10px] md:text-xs cursor-pointer transition-colors"
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
