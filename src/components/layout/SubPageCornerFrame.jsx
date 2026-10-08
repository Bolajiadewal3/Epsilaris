import React from "react";

/**
 * Applies the shared closing/opening frame animation to detail views.
 * @param {Object} props Transition phase and nested page content.
 * @param {string} props.transitionPhase Current shared transition phase.
 * @param {React.ReactNode} props.children Active detail view.
 * @returns {React.ReactElement}
 */
export default function SubPageCornerFrame({ transitionPhase, children }) {
  const isClosedOrClosing = transitionPhase !== "idle";

  return (
    <div className="absolute top-[3%] left-[3%] right-[3%] bottom-[12%] z-10 pointer-events-none">
      <div
        className="absolute w-8 h-8 border-t border-r border-yellow-400 z-30 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          top: isClosedOrClosing ? "calc(50% - 16px)" : "0px",
          right: isClosedOrClosing ? "calc(50% - 16px)" : "0px",
        }}
      />
      <div
        className="absolute w-8 h-8 border-b border-l border-yellow-400 z-30 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          bottom: isClosedOrClosing ? "calc(50% - 16px)" : "0px",
          left: isClosedOrClosing ? "calc(50% - 16px)" : "0px",
        }}
      />
      <div
        className="relative w-full h-full lg:p-6 md:px-10 sm:p-4 pointer-events-auto transition-[clip-path] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-hidden flex flex-col justify-between"
        style={{
          clipPath: isClosedOrClosing
            ? "inset(calc(50% - 16px) calc(50% - 16px) calc(50% - 16px) calc(50% - 16px))"
            : "inset(0px 0px 0px 0px)",
        }}
      >
        <div
          className="relative z-20 h-full flex flex-col transition-opacity duration-300"
          style={{ opacity: transitionPhase === "idle" ? 1 : 0 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
