import React from "react";

/**
 * Presents the film and digital collection choices.
 * @param {Object} props View callbacks.
 * @param {function(string): void} props.onSelectMedium Opens a collection.
 * @returns {React.ReactElement}
 */
export default function PhotographyView({ onSelectMedium }) {
  return (
    <div className="flex flex-col h-full justify-between relative overflow-hidden pb-24 lg:pb-6 max-lg:landscape:pb-4 pr-1 sm:pr-2">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 sm:pb-6 max-lg:landscape:pb-3 border-b border-white/10 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] text-white/80 uppercase line-clamp-1 sm:line-clamp-none">
            ARCHIVE // SELECT MEDIUM
          </span>
        </div>
      </div>

      {/* Main Selection Area */}
      <div className="flex-1 overflow-y-auto py-4 sm:py-6 max-lg:landscape:py-3 flex items-center justify-center min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 max-lg:landscape:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
          {/* Film Selector Card */}
          <div
            onClick={() => onSelectMedium("film")}
            className="group relative bg-[#14151a] border border-white/10 hover:border-white/40 p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer aspect-auto min-h-[130px] sm:aspect-[4/3] [@media(max-height:600px)]:aspect-auto [@media(max-height:600px)]:min-h-[130px] rounded-sm"
          >
            <div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-yellow-400 uppercase">
                ANALOGUE SECTOR
              </span>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white mt-1 sm:mt-2">
                FILM
              </h2>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2 sm:pt-4 mt-3 sm:mt-0">
              <span className="text-[10px] sm:text-xs font-mono text-white/50">
                SCANS // GRADE 01
              </span>
              <span className="text-[10px] sm:text-xs text-yellow-400 font-mono group-hover:translate-x-1 transition-transform">
                ENTER ↗
              </span>
            </div>
          </div>

          {/* Digital Selector Card */}
          <div
            onClick={() => onSelectMedium("digital")}
            className="group relative bg-[#14151a] border border-white/10 hover:border-white/40 p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer aspect-auto min-h-[130px] sm:aspect-[4/3] [@media(max-height:600px)]:aspect-auto [@media(max-height:600px)]:min-h-[130px] rounded-sm"
          >
            <div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-yellow-400 uppercase">
                NATIVE SECTOR
              </span>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white mt-1 sm:mt-2">
                DIGITAL
              </h2>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2 sm:pt-4 mt-3 sm:mt-0">
              <span className="text-[10px] sm:text-xs font-mono text-white/50">
                FRAMES // RAW
              </span>
              <span className="text-[10px] sm:text-xs text-yellow-400 font-mono group-hover:translate-x-1 transition-transform">
                ENTER ↗
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-2 sm:pt-4 max-lg:landscape:pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-white/50 z-20 gap-2 shrink-0">
        <span>STATUS: IDLE</span>
        <span>CHOOSE A CAPTURE MEDIUM TO INITIALIZE SUB-PAGE</span>
      </div>
    </div>
  );
}
