import React, { useState, useEffect } from "react";

/**
 * Shows the entry control and its timed transition into the portfolio.
 * @param {Object} props Entry callback and optional deep-link auto-start flag.
 * @param {function(): void} props.onEnter Called when the entry animation completes.
 * @param {boolean} [props.autoStart=false] Starts the entry sequence automatically.
 * @returns {React.ReactElement}
 */
export default function WelcomeScreen({ onEnter, autoStart = false }) {
  const [stage, setStage] = useState("idle");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  /**
   * Runs the staged entry animation and calls onEnter after its final delay.
   * @returns {void}
   */
  const startSequence = () => {
    setStage("fading-button");

    /** Advance after the button fade completes. */
    setTimeout(() => {
      setStage("arrow-circle");
    }, 500);

    /** Hold the rotating arrow stage for two seconds. */
    setTimeout(() => {
      setStage("plain-circle");
    }, 2500);

    /** Replace the arrow with the final square frame. */
    setTimeout(() => {
      setStage("square");
    }, 3100);

    /** Hand control back to the app once the entrance sequence completes. */
    setTimeout(() => {
      onEnter();
    }, 4200);
  };

  /** Start once on mount when a valid deep link requests automatic entry. */
  useEffect(() => {
    if (autoStart && stage === "idle") {
      startSequence();
    }
  }, [autoStart]);

  /**
   * Tilts the entry control relative to the pointer while it is idle.
   * @param {React.MouseEvent<HTMLDivElement>} event Pointer event.
   * @returns {void}
   */
  const handleMouseMove = (event) => {
    if (stage !== "idle") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -24, y: x * 24 });
  };

  /** Resets the entry control tilt after the pointer leaves. @returns {void} */
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  /** Begins entry when the control is idle. @returns {void} */
  const handleClick = () => {
    if (stage !== "idle") return;
    startSequence();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0a0a0c] flex flex-col items-center justify-center overflow-hidden [perspective:1000px]">
      {/* 3D Button Layer */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        className={`group relative cursor-pointer select-none [transform-style:preserve-3d] transform-gpu will-change-transform transition-all duration-500 ease-in-out ${
          stage !== "idle"
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100 transition-transform duration-150 ease-out hover:scale-105"
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-orange-500/25 blur-xl [transform:translateZ(-30px)] transition-all duration-300 group-hover:bg-orange-500/50 group-hover:blur-2xl" />
        <div className="absolute inset-0 rounded-full bg-black/80 [transform:translateZ(-12px)] shadow-2xl" />
        <div className="relative px-12 py-6 rounded-full bg-gradient-to-b from-[#2a2b34] via-[#16171f] to-[#0a0b0e] border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-6px_12px_rgba(0,0,0,0.9)] active:translate-y-1 transition-all">
          <div className="absolute inset-[2px] rounded-full border border-white/10 pointer-events-none" />
          <span className="relative z-10 flex items-center justify-center text-sm font-extrabold tracking-[0.3em] uppercase text-white group-hover:text-orange-400 transition-colors">
            ENTER
          </span>
        </div>
      </div>

      {/* Central Morphing Box Layer */}
      {stage !== "idle" && stage !== "fading-button" && (
        <div className="absolute top-[3%] left-[3%] right-[3%] bottom-[12%] flex items-center justify-center pointer-events-none z-10">
          <div
            className={`w-8 h-8 flex items-center justify-center border border-white/85 transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              stage === "arrow-circle" || stage === "plain-circle"
                ? "rounded-full"
                : "rounded-none"
            }`}
          >
            <div
              className={`flex items-center justify-center transition-all duration-500 ease-in-out ${
                stage === "arrow-circle"
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-50"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white stroke-current fill-none animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
