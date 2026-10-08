import React, { useState } from "react";
import { NAV_ITEMS } from "../../data/nav.js";

/**
 * Renders section navigation, including the expandable mobile menu.
 * @param {Object} props Current navigation state and selection callback.
 * @param {string} props.activeTab Active section key.
 * @param {function(string): void} props.onSelectTab Selects a section.
 * @param {boolean} props.isTransitioning Whether navigation is temporarily locked.
 * @param {boolean} props.hasEntered Whether the welcome sequence completed.
 * @returns {React.ReactElement}
 */
export default function Navbar({
  activeTab,
  onSelectTab,
  isTransitioning,
  hasEntered,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /** Closes the mobile menu before asking the app to navigate. @param {string} key Destination section key. @returns {void} */
  const handleItemClick = (key) => {
    setIsMobileOpen(false);
    onSelectTab(key);
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR (Unchanged) --- */}
      <nav className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 items-center">
        <div
          className={`flex items-center gap-10 [@media(min-width:768px)_and_(max-width:1366px)_and_(orientation:landscape)_and_(pointer:coarse)]:gap-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hasEntered
              ? "translate-x-0 opacity-100 scale-100"
              : "translate-x-0 opacity-0 scale-50 pointer-events-none"
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                disabled={isTransitioning}
                onClick={() => onSelectTab(item.key)}
                className={`group flex items-center gap-2 [@media(min-width:768px)_and_(max-width:1366px)_and_(orientation:landscape)_and_(pointer:coarse)]:gap-1 text-xs [@media(min-width:768px)_and_(max-width:1366px)_and_(orientation:landscape)_and_(pointer:coarse)]:text-[clamp(11px,0.88vw,12px)] tracking-[0.2em] transition-all duration-300 uppercase cursor-pointer disabled:cursor-not-allowed ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-white"
                      : "text-white/40 group-hover:text-white/80"
                  }
                >
                  {item.id}
                </span>
                <span>—</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* --- MOBILE NAVBAR TRIGGER: Bottom Left Icon --- */}
      <div className="lg:hidden absolute bottom-6 left-6 z-30">
        <div
          className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hasEntered
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-50 pointer-events-none"
          }`}
        >
          <button
            onClick={() => setIsMobileOpen(true)}
            disabled={isTransitioning}
            className="w-12 h-12 rounded-full border border-white/15 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:border-white/40 transition-all cursor-pointer shadow-lg"
            aria-label="Open Navigation Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* --- MOBILE FULL-SCREEN EXPANDED OVERLAY --- */}
      {/* --- MOBILE FULL-SCREEN EXPANDED OVERLAY --- */}
      {/* --- MOBILE FULL-SCREEN EXPANDED OVERLAY (TWO-COLUMN LANDSCAPE, NO SCROLL) --- */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-2xl flex flex-col justify-between px-6 py-4 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center shrink-0">
            <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase">
              Navigation
            </span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
              aria-label="Close Navigation Menu"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Links Grid: 1 column on portrait, 2 columns on landscape */}
          <div className="grid grid-cols-1 landscape:grid-cols-2 gap-x-6 gap-y-2 w-full max-w-2xl mx-auto my-auto items-center">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  disabled={isTransitioning}
                  onClick={() => handleItemClick(item.key)}
                  className={`group flex items-center justify-between py-2 sm:py-3 border-b border-white/10 text-left transition-all cursor-pointer ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] tracking-widest text-white/30">
                      {item.id}
                    </span>
                    <span className="text-sm sm:text-base tracking-wider uppercase">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-white/30 group-hover:translate-x-1 transition-transform text-sm">
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer branding */}
          <div className="text-center shrink-0">
            <p className="text-[9px] tracking-[0.3em] text-white/30 uppercase">
              AREMU // 2026
            </p>
          </div>
        </div>
      )}
    </>
  );
}
