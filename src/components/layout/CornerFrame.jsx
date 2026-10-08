import React from "react";
import HomeScene3D from "../three/HomeScene3D";
import PlaceholderScene3D from "../three/Placeholder";

/**
 * Frames a catalog/home view and coordinates its background scene and transition.
 * @param {Object} props Frame state, background configuration, and child content.
 * @param {string} props.transitionPhase Current shared transition phase.
 * @param {React.ReactNode} props.children Active section content.
 * @param {{current: {x: number, y: number}}} props.mouse Normalized pointer position ref.
 * @param {string} props.activeTab Active section key.
 * @param {string} props.shape Placeholder geometry for non-home sections.
 * @param {boolean} props.hasEntered Whether the welcome sequence completed.
 * @returns {React.ReactElement}
 */
export default function CornerFrame({
  transitionPhase,
  children,
  mouse,
  activeTab,
  shape,
  hasEntered,
}) {
  const isClosedOrClosing = transitionPhase !== "idle";

  return (
    <div className="absolute top-[3%] left-[3%] right-[3%] bottom-[12%] z-10 pointer-events-none">
      {/* Top-Left Corner Bracket */}
      <div
        className={`absolute w-8 h-8 border-t border-l border-white/80 z-30 pointer-events-none transform-gpu will-change-[top,left,opacity] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          hasEntered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          top: isClosedOrClosing ? "calc(50% - 16px)" : "0px",
          left: isClosedOrClosing ? "calc(50% - 16px)" : "0px",
        }}
      />

      {/* Bottom-Right Corner Bracket */}
      <div
        className={`absolute w-8 h-8 border-b border-r border-white/80 z-30 pointer-events-none transform-gpu will-change-[bottom,right,opacity] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          hasEntered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          bottom: isClosedOrClosing ? "calc(50% - 16px)" : "0px",
          right: isClosedOrClosing ? "calc(50% - 16px)" : "0px",
        }}
      />

      {/* Main Clip-Path Container */}
      <div
        className="relative w-full h-full lg:p-6 md:px-10 sm:p-4 pointer-events-auto transform-gpu will-change-[clip-path] transition-[clip-path] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-hidden"
        style={{
          clipPath: isClosedOrClosing
            ? "inset(calc(50% - 16px) calc(50% - 16px) calc(50% - 16px) calc(50% - 16px))"
            : "inset(0px 0px 0px 0px)",
        }}
      >
        {activeTab === "home" ? (
          <HomeScene3D mouse={mouse} hasEntered={hasEntered} />
        ) : (
          <PlaceholderScene3D
            shape={shape}
            mouse={mouse}
            hasEntered={hasEntered}
          />
        )}
        <div
          className="relative z-20 h-full flex flex-col justify-center transition-opacity duration-300 transform-gpu will-change-opacity"
          style={{ opacity: transitionPhase === "idle" ? 1 : 0 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
