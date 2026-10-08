import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

/**
 * Renders the videography player controls and Markdown dossier.
 * @param {Object} props Video records, current state, refs, and callbacks.
 * @param {Array<Object>} props.VIDEOS_DATA Video metadata records.
 * @param {number} props.currentVideoIndex Index of the selected video.
 * @param {boolean} props.isVideoPlaying Whether the video is playing.
 * @param {boolean} props.isDossierFlipped Whether the dossier side is shown.
 * @param {Object} props.videoPlayerRef Ref to the HTML video element.
 * @param {Function} props.onPrevVideo Selects the previous video.
 * @param {Function} props.onNextVideo Selects the next video.
 * @param {function(boolean): void} props.onToggleVideoPlay Updates playback state.
 * @param {Function} props.onToggleDossier Flips the player/dossier view.
 * @returns {React.ReactElement}
 */
export default function VideographyView({
  VIDEOS_DATA,
  currentVideoIndex,
  isVideoPlaying,
  isDossierFlipped,
  videoPlayerRef,
  onPrevVideo,
  onNextVideo,
  onToggleVideoPlay,
  onToggleDossier,
}) {
  const activeVideo = VIDEOS_DATA[currentVideoIndex];
  const prevVideoIndex =
    (currentVideoIndex - 1 + VIDEOS_DATA.length) % VIDEOS_DATA.length;
  const nextVideoIndex = (currentVideoIndex + 1) % VIDEOS_DATA.length;
  const [dossierContent, setDossierContent] = useState("");

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressTrackRef = useRef(null);

  useEffect(() => {
    if (activeVideo.dossierUrl) {
      fetch(activeVideo.dossierUrl)
        .then((res) => res.text())
        .then((text) => setDossierContent(text))
        .catch((err) => console.error("Failed to load dossier markdown:", err));
    } else {
      setDossierContent("# Pending");
    }
    setCurrentTime(0);
    setDuration(0);
  }, [activeVideo]);

  useEffect(() => {
    if (isDossierFlipped && isVideoPlaying) {
      onToggleVideoPlay(false);
    }
  }, [isDossierFlipped, isVideoPlaying, onToggleVideoPlay]);

  /** Formats a media timestamp as zero-padded minutes and seconds. @param {number} secs Duration in seconds. @returns {string} */
  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${String(mins).padStart(2, "0")}:${String(remainingSecs).padStart(2, "0")}`;
  };

  /**
   * Seeks the current video to the clicked position on its progress track.
   * @param {React.MouseEvent<HTMLElement>} event Click event on the progress track.
   * @returns {void}
   */
  const handleProgressBarClick = (event) => {
    if (!progressTrackRef.current || !videoPlayerRef.current) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    const newTime = clickPosition * (videoPlayerRef.current.duration || 0);

    videoPlayerRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  /**
   * Starts playback and requests landscape/fullscreen presentation when supported.
   * @returns {Promise<void>}
   */
  const handlePlayFilmReel = async () => {
    onToggleVideoPlay(true);

    if (window.screen?.orientation?.lock) {
      try {
        await window.screen.orientation.lock("landscape");
      } catch (e) {
        console.log("Orientation lock not supported:", e);
      }
    }

    setTimeout(() => {
      if (videoPlayerRef.current) {
        if (videoPlayerRef.current.webkitEnterFullscreen) {
          videoPlayerRef.current.webkitEnterFullscreen();
        } else if (videoPlayerRef.current.requestFullscreen) {
          videoPlayerRef.current.requestFullscreen();
        }
      }
    }, 100);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative flex flex-col h-full justify-between gap-2 md:gap-4 py-1 md:py-2 overflow-y-auto lg:overflow-hidden max-lg:landscape:p-0 max-lg:landscape:overflow-hidden">
      {/* COMING SOON OVERLAY */}
      <div className="absolute inset-0 z-50 bg-[#0d0e12]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4 border border-white/10 bg-[#14151a] p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse inline-block mx-auto" />
          <p className="text-[10px] tracking-[0.3em] text-yellow-400 uppercase font-bold">
            ARCHIVE STATUS // DEFERRED
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
            FILM REELS COMING SOON
          </h2>
          <p className="text-xs text-white/60 font-mono leading-relaxed">
            Visual portfolios and cinematic logs are currently in production.
            Check back shortly for active screenings.
          </p>
          <div className="pt-4 border-t border-white/10 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            EST. DISPATCH // 2026
          </div>
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="max-lg:landscape:hidden flex items-center justify-between gap-2 shrink-0 mb-2 md:mb-0 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-white/80 uppercase">
            ACTIVE REEL
          </span>
          <span className="text-white/30">—</span>
          <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] text-white/40 uppercase whitespace-nowrap">
            FRAME {String(currentVideoIndex + 1).padStart(2, "0")} OF{" "}
            {String(VIDEOS_DATA.length).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onPrevVideo}
            className="w-7 h-7 sm:w-9 sm:h-9 border border-white/20 bg-[#14151a] hover:border-white/60 flex items-center justify-center cursor-pointer transition-colors text-xs sm:text-sm"
          >
            ←
          </button>
          <button
            onClick={onNextVideo}
            className="w-7 h-7 sm:w-9 sm:h-9 border border-white/20 bg-[#14151a] hover:border-white/60 flex items-center justify-center cursor-pointer transition-colors text-xs sm:text-sm"
          >
            →
          </button>
        </div>
      </div>

      {/* --- MOBILE & IPAD PORTRAIT VIEW (Preserved untouched) --- */}
      <div className="lg:hidden max-lg:landscape:hidden flex flex-col gap-3 my-auto min-h-0 flex-1">
        <button
          onClick={handlePlayFilmReel}
          className="w-full py-3.5 bg-white hover:bg-white/90 text-black font-bold text-xs tracking-[0.25em] uppercase flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] cursor-pointer shrink-0 border border-white/40"
        >
          <span className="text-sm">▶</span>
          <span>PLAY FILM REEL</span>
        </button>

        <div className="flex-1 bg-[#14151a] border border-yellow-400/40 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto rounded-none shadow-xl min-h-[250px]">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="text-xs tracking-[0.25em] text-yellow-400 uppercase font-semibold">
                DOSSIER // DIRECTOR'S LOG
              </span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">
                {activeVideo.title}
              </span>
            </div>
            <div className="text-xs text-white/80 leading-relaxed font-mono prose prose-invert max-w-none">
              <ReactMarkdown>{dossierContent}</ReactMarkdown>
            </div>
          </div>
          <div className="pt-3 mt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40 shrink-0">
            <span>CONFIDENTIAL ARCHIVE RECORD</span>
            <span>ROTATE DEVICE TO SCREEN</span>
          </div>
        </div>
      </div>

      {/* --- DESKTOP AND MOBILE/TABLET LANDSCAPE DISPLAY AREA --- */}
      <div className="hidden lg:grid lg:grid-cols-12 max-lg:landscape:block gap-3 lg:gap-6 items-center my-auto min-h-0 flex-1 max-lg:landscape:h-full max-lg:landscape:w-full">
        {/* Desktop Left Preview (Hidden on short desktops) */}
        <div
          onClick={onPrevVideo}
          className="hidden lg:block lg:col-span-2 h-[280px] bg-[#14151a]/60 border border-white/10 p-3 filter grayscale-[100%] contrast-125 opacity-50 hover:opacity-90 transition-all cursor-pointer group [@media(min-width:1024px)_and_(max-height:680px)]:!hidden"
        >
          <div className="w-full h-full relative overflow-hidden">
            <img
              src={VIDEOS_DATA[prevVideoIndex].thumbnailUrl}
              alt="Previous Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-3">
              <span className="text-[10px] tracking-widest text-white/70">
                PREV // {VIDEOS_DATA[prevVideoIndex].title}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN PLAYER CONTAINER (Takes 8 cols on short desktop) */}
        <div className="lg:col-span-8 perspective-1000 w-full h-full flex items-center justify-center max-lg:landscape:block max-lg:landscape:h-full max-lg:landscape:w-full [@media(min-width:1024px)_and_(max-height:680px)]:!col-span-8">
          <div
            className={`relative w-full transition-all duration-700 transform-gpu max-lg:landscape:!h-full max-lg:landscape:!w-full max-lg:landscape:!aspect-auto max-lg:landscape:!transform-none ${
              isDossierFlipped
                ? "rotate-y-180 h-[55svh] min-h-[280px] max-h-[420px]"
                : "max-h-[53vh] max-lg:h-auto max-lg:max-h-none aspect-video "
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front Video Player Card */}
            <div
              className={`absolute inset-0 w-full h-full bg-[#14151a] border border-white/20 flex flex-col justify-between overflow-hidden shadow-2xl backface-hidden max-lg:landscape:border-none transition-opacity duration-300 ${
                isDossierFlipped
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              {/* Inner Specs Bar */}
              <div className="h-8 md:h-10 bg-[#0a0a0c]/80 border-b border-white/10 px-4 flex items-center justify-between text-[11px] text-white/65 shrink-0 max-lg:landscape:hidden">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="tracking-widest">
                    NOW SCREENING · 4K DCI
                  </span>
                </div>
                <span className="tracking-widest text-[10px]">
                  {activeVideo.specs}
                </span>
              </div>

              {/* Video Content Box */}
              <div className="relative flex-1 bg-black overflow-hidden group flex items-center justify-center min-h-0">
                {isVideoPlaying ? (
                  <video
                    ref={videoPlayerRef}
                    playsInline
                    src={activeVideo.videoUrl}
                    className="w-full h-full object-cover"
                    controls={false}
                    autoPlay
                    onTimeUpdate={() => {
                      if (videoPlayerRef.current) {
                        setCurrentTime(videoPlayerRef.current.currentTime);
                      }
                    }}
                    onLoadedMetadata={() => {
                      if (videoPlayerRef.current) {
                        setDuration(videoPlayerRef.current.duration);
                      }
                    }}
                    onEnded={() => onToggleVideoPlay(false)}
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <img
                      src={activeVideo.thumbnailUrl}
                      alt={activeVideo.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={handlePlayFilmReel}
                        className="px-5 py-2.5 md:px-6 md:py-3 bg-white/90 hover:bg-white text-black font-bold text-xs tracking-[0.25em] uppercase flex items-center gap-3 shadow-2xl transition-all cursor-pointer z-10"
                      >
                        <span>▶</span>
                        <span>PLAY FILM REEL</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Player Scrub Bar */}
              <div className="h-10 md:h-12 bg-[#14151a] border-t border-white/10 px-4 flex items-center justify-between text-xs shrink-0 max-lg:landscape:bg-black/80 max-lg:landscape:absolute max-lg:landscape:bottom-0 max-lg:landscape:left-0 max-lg:landscape:right-0 max-lg:landscape:z-20 max-lg:landscape:pr-32">
                <div className="flex items-center gap-3 w-full max-w-md">
                  <button
                    onClick={() => onToggleVideoPlay(!isVideoPlaying)}
                    className="w-6 h-6 bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] cursor-pointer"
                  >
                    {isVideoPlaying ? "❚❚" : "▶"}
                  </button>
                  <span className="text-[10px] tracking-widest text-white/50 shrink-0">
                    {formatTime(currentTime)} /{" "}
                    {duration > 0 ? formatTime(duration) : activeVideo.duration}
                  </span>

                  <div
                    ref={progressTrackRef}
                    onClick={handleProgressBarClick}
                    className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative cursor-pointer group/bar"
                  >
                    <div
                      className="absolute top-0 left-0 bottom-0 bg-white group-hover/bar:bg-yellow-400 transition-colors"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] tracking-widest text-white/40 hidden md:inline">
                  {activeVideo.specs}
                </span>
              </div>
            </div>

            {/* Back Dossier Card */}
            <div
              className={`absolute inset-0 w-full h-full bg-[#14151a] border border-yellow-400/40 p-5 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl rotate-y-180 backface-hidden max-lg:hidden transition-opacity duration-300 ${
                isDossierFlipped
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <span className="text-xs tracking-[0.25em] text-yellow-400 uppercase">
                    DOSSIER // DIRECTOR'S LOG
                  </span>
                  <span className="text-[10px] text-white/40">
                    {activeVideo.title}
                  </span>
                </div>
                <div className="text-xs md:text-sm text-white/80 leading-relaxed font-mono prose prose-invert max-w-none">
                  <ReactMarkdown>{dossierContent}</ReactMarkdown>
                </div>
              </div>
              <div className="pt-3 mt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40 shrink-0">
                <span>CONFIDENTIAL ARCHIVE RECORD</span>
                <span>CLICK DOSSIER TO RETURN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Short Desktop Side Info Panel */}
        <div className="hidden [@media(min-width:1024px)_and_(max-height:680px)]:!flex [@media(min-width:1024px)_and_(max-height:680px)]:!col-span-4 h-full flex-col justify-between bg-[#14151a] border border-white/10 p-4 overflow-y-auto min-h-0">
          <div>
            <span className="text-[10px] tracking-[0.2em] text-yellow-400 uppercase font-semibold block mb-1">
              {activeVideo.subtitle || "ACTIVE REEL"}
            </span>
            <h3 className="text-lg font-bold tracking-tight text-white mb-2">
              {activeVideo.title}
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-mono mb-3 line-clamp-4">
              {activeVideo.description}
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] text-white/40 font-mono space-y-1">
              <p>SPECS: {activeVideo.specs}</p>
              <p>STATUS: ARCHIVED RECORD</p>
            </div>
          </div>
          <button
            onClick={onToggleDossier}
            className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-xs tracking-[0.2em] uppercase text-white transition-colors flex items-center justify-center gap-2 mt-3 shrink-0 cursor-pointer"
          >
            <span>{isDossierFlipped ? "CLOSE DOSSIER" : "DOSSIER"}</span>
            <span>{isDossierFlipped ? "↑" : "↓"}</span>
          </button>
        </div>

        {/* Desktop Right Preview */}
        <div
          onClick={onNextVideo}
          className="hidden lg:block lg:col-span-2 h-[280px] bg-[#14151a]/60 border border-white/10 p-3 filter grayscale-[100%] contrast-125 opacity-50 hover:opacity-90 transition-all cursor-pointer group [@media(min-width:1024px)_and_(max-height:680px)]:!hidden"
        >
          <div className="w-full h-full relative overflow-hidden">
            <img
              src={VIDEOS_DATA[nextVideoIndex].thumbnailUrl}
              alt="Next Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-3">
              <span className="text-[10px] tracking-widest text-white/70">
                NEXT // {VIDEOS_DATA[nextVideoIndex].title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Title & Description Bar */}
      <div className="max-lg:landscape:hidden [@media(min-width:1024px)_and_(max-height:680px)]:!hidden flex items-center justify-between gap-2 pt-2 md:pt-3 border-t border-white/10 shrink-0">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-[10px] tracking-[0.25em] text-white/50 uppercase mb-0.5 truncate">
            {activeVideo.subtitle}
          </p>

          <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white leading-tight truncate">
            {activeVideo.title}
          </h3>

          <p className="text-xs tracking-wide text-white/60 mt-0.5 max-w-xl line-clamp-2">
            {activeVideo.description}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onToggleDossier}
            className="hidden lg:flex px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-xs tracking-[0.2em] uppercase cursor-pointer transition-colors items-center gap-2"
          >
            <span>{isDossierFlipped ? "CLOSE DOSSIER" : "DOSSIER"}</span>
            <span>{isDossierFlipped ? "↑" : "↓"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
