import React from "react";

/**
 * Sub-view for viewing JSDoc HTML API documentation iframe.
 * @param {Object} props
 * @param {Function} props.onBackToCatalog Returns to the docs catalog.
 */
export default function DocsJsDocView({ onBackToCatalog }) {
  return (
    <div className="flex flex-col h-full justify-between relative overflow-hidden pb-20 lg:pb-6 pr-1 sm:pr-2">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <button
          onClick={onBackToCatalog}
          className="text-xs text-yellow-400 hover:underline tracking-widest uppercase flex items-center gap-1 cursor-pointer"
        >
          ← BACK TO DOCS CATALOG
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] text-white/80 uppercase">
            DOCUMENTATION // JSDOC API REFERENCE
          </span>
        </div>
      </div>

      {/* Iframe View Area */}
      <div className="flex-1 my-4 min-h-0 relative">
        <div className="w-full h-full border border-white/10 bg-[#0a0a0c] rounded overflow-hidden grayscale opacity-40">
          <iframe
            src="/docs/jsdoc/index.html"
            title="JSDoc API Reference"
            className="w-full h-full border-none pointer-events-none"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <div className="absolute inset-0 z-10 bg-[#0d0e12]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4 border border-white/10 bg-[#14151a] p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse inline-block mx-auto" />
            <p className="text-[10px] tracking-[0.3em] text-yellow-400 uppercase font-bold">
              API REFERENCE // UNDER REFINEMENT
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
              JSDOC GUIDE IN PROGRESS
            </h2>
            <p className="text-xs text-white/60 font-mono leading-relaxed">
              The generated API reference is temporarily unavailable while its
              documentation is being refined.
            </p>
            <div className="pt-4 border-t border-white/10 text-[10px] tracking-[0.2em] text-white/40 uppercase">
              STATUS // REFINEMENT
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50 shrink-0">
        <span>STATUS: UNDER REFINEMENT</span>
        <span>RENDER MODE: SUBFRAME IFRAME</span>
      </div>
    </div>
  );
}
