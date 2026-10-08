import React, { useState } from "react";

/**
 * Shows the medium entry screen, photo grid, and image lightbox.
 * @param {Object} props Collection metadata and navigation callbacks.
 * @param {string} [props.mediumTitle=""] Display name for the selected medium.
 * @param {Array<Object>} [props.photos=[]] Images and capture metadata to display.
 * @param {Function} props.onBackToCatalog Returns to the medium selector.
 * @param {function(function(): void): void} [props.onTriggerGlobalWipe] Optional transition wrapper.
 * @returns {React.ReactElement}
 */
export default function PhotographyDetailView({
  mediumTitle = "",
  photos = [],
  onBackToCatalog,
  onTriggerGlobalWipe,
}) {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const formattedTitle = mediumTitle.toUpperCase();
  const enterButtonText = `ENTER ${formattedTitle} ${formattedTitle === "FILM" ? "ARCHIVE" : "STUDIO"}`;

  /** Enters the photo grid, optionally after the shared transition callback. @returns {void} */
  const handleEnterWorkspace = () => {
    if (onTriggerGlobalWipe) {
      onTriggerGlobalWipe(() => {
        setHasEntered(true);
      });
    } else {
      setHasEntered(true);
    }
  };

  if (hasEntered) {
    return (
      <div className="flex flex-col h-full justify-between relative overflow-hidden animate-fade-in pb-24 lg:pb-6 max-lg:landscape:pb-4 pr-1 sm:pr-2">
        {/* Top Bar: Sub-Page Header with Back Button */}
        <div className="flex flex-wrap items-center justify-between pb-3 sm:pb-4 max-lg:landscape:pb-2 border-b border-white/10 z-20 shrink-0 gap-3">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] text-white/80 uppercase">
              ARCHIVE // {formattedTitle} SECTOR
            </span>
          </div>

          <button
            onClick={onBackToCatalog}
            className="px-2.5 sm:px-3 py-1 bg-white/5 border border-white/20 hover:bg-white/10 text-[9px] sm:text-[10px] tracking-widest text-white uppercase transition-colors cursor-pointer whitespace-nowrap"
          >
            ← [BACK TO SECTORS]
          </button>
        </div>

        {/* Main Content Grid Area */}
        <div className="flex-1 overflow-y-auto py-4 max-lg:landscape:py-2 pr-1 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 max-lg:landscape:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 max-lg:landscape:gap-3 animate-fade-in">
            {photos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => setSelectedImage(photo)}
                className="group relative bg-[#14151a] border border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-white/40 cursor-pointer shadow-lg"
              >
                <div className="aspect-[4/3] bg-white/5 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="text-[10px] tracking-widest text-yellow-400 font-mono uppercase bg-black/60 px-2 py-1 border border-white/20">
                      CLICK TO EXPAND
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 max-lg:landscape:p-2 flex items-center justify-between border-t border-white/5 bg-[#0e0f13]">
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-bold text-white/90 line-clamp-1">
                      {photo.title}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-white/50 font-mono mt-0.5 line-clamp-1">
                      {photo.camera}{" "}
                      {photo.stock && photo.stock !== "N/A"
                        ? `// ${photo.stock}`
                        : ""}
                    </p>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-yellow-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                    EXPAND ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in overflow-hidden"
            onClick={() => setSelectedImage(null)}
          >
            {/* Modal Container: w-fit dynamically wraps the image size */}
            <div
              className="relative w-fit max-w-[85vw] bg-[#14151a] border border-white/25 flex flex-col overflow-hidden shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-2 border-b border-white/10 bg-[#0e0f13] shrink-0 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-white/80 uppercase truncate">
                    {selectedImage.title}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-[9px] sm:text-[10px] font-mono text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  [ESC / CLOSE]
                </button>
              </div>

              {/* Image Container */}
              <div className="p-1 bg-black flex items-center justify-center overflow-hidden shrink min-h-0">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-h-[calc(55vh-60px)] max-lg:landscape:max-h-[calc(60vh-50px)] max-w-[75vw] sm:max-w-[550px] w-auto h-auto object-contain block min-h-0"
                />
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-white/10 bg-[#0e0f13] flex items-center justify-between gap-2 text-[9px] sm:text-[10px] font-mono text-white/60 shrink-0">
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 min-w-0 text-[9px]">
                  <span className="truncate">
                    <span className="text-yellow-400 uppercase">Camera:</span>{" "}
                    {selectedImage.camera}
                  </span>
                  {selectedImage.stock && selectedImage.stock !== "N/A" && (
                    <span className="truncate">
                      <span className="text-yellow-400 uppercase">Stock:</span>{" "}
                      {selectedImage.stock}
                    </span>
                  )}
                </div>
                <span className="text-[8px] sm:text-[9px] text-white/40 shrink-0 hidden sm:inline max-lg:landscape:hidden">
                  HIGH-RES PREVIEW
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-2 sm:pt-3 max-lg:landscape:pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-white/50 z-20 gap-2 shrink-0">
          <span>STATUS: {formattedTitle} SECTOR ACTIVE</span>
          <span>{photos.length} FRAMES LOADED</span>
        </div>
      </div>
    );
  }

  /** Show the medium-specific entry screen until the workspace is opened. */
  return (
    <div className="relative flex flex-col h-full justify-between overflow-hidden pb-24 lg:pb-6 max-lg:landscape:pb-4 pr-1 sm:pr-2">
      <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-6 max-lg:landscape:pb-3 border-b border-white/10 z-20 shrink-0 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] text-white/80 uppercase">
            ARCHIVE // {formattedTitle} SECTOR
          </span>
        </div>
        <button
          onClick={onBackToCatalog}
          className="px-2.5 sm:px-3 py-1 bg-white/5 border border-white/20 hover:bg-white/10 text-[9px] sm:text-[10px] tracking-widest text-white uppercase transition-colors cursor-pointer whitespace-nowrap"
        >
          ← [BACK TO SECTORS]
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-20 my-auto py-4 sm:py-6 max-lg:landscape:py-1">
        <div className="bg-[#14151a]/95 backdrop-blur-md border border-white/20 p-6 sm:p-12 max-lg:landscape:p-3 max-lg:landscape:py-4 max-w-lg w-full mx-4 rounded-sm shadow-2xl flex flex-col items-center text-center space-y-4 sm:space-y-6 max-lg:landscape:space-y-2">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-yellow-400 uppercase font-mono">
            WALL GRID INITIALIZED
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white uppercase">
            {formattedTitle} {formattedTitle === "FILM" ? "ARCHIVE" : "STUDIO"}
          </h2>
          <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed max-lg:landscape:text-[10px] max-lg:landscape:leading-snug">
            All frames loaded into memory. Click below to initialize full
            interactive workspace.
          </p>
          <button
            onClick={handleEnterWorkspace}
            className="w-full py-3 sm:py-3.5 max-lg:landscape:py-2 bg-white text-black hover:bg-yellow-400 text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <span>{enterButtonText}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="pt-3 sm:pt-4 max-lg:landscape:pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-white/50 z-20 gap-2 shrink-0">
        <span>
          STATUS: {formattedTitle} WALL LOADED ({photos.length} FRAMES)
        </span>
        <span>AWAITING EXECUTION</span>
      </div>
    </div>
  );
}
