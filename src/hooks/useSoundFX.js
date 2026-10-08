import { useEffect } from "react";
import { soundFX } from "../utils/soundFX";

/**
 * Attaches delegated click sounds and transition-timed swooshes for the app.
 * @param {"closing" | "opening" | "loading" | "idle"} transitionPhase Current app transition phase.
 * @returns {void}
 */
export function useSoundFX(transitionPhase) {
  /** Register one capture-phase listener for interactive controls. */
  useEffect(() => {
    /** @param {MouseEvent} event Browser click event. @returns {void} */
    const handleGlobalClick = (e) => {
      const clickable = e.target.closest(
        "button, a, [role='button'], input[type='button'], input[type='submit']",
      );

      if (clickable) {
        soundFX.playClick();
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });
    return () =>
      window.removeEventListener("click", handleGlobalClick, { capture: true });
  }, []);

  /** Schedule transition audio against animation frames and cancel on change. */
  useEffect(() => {
    if (transitionPhase === "idle" || transitionPhase === "loading") return;

    let rafId;
    let startTime = null;
    /** Offset playback to align with the visual transition's fastest motion. */
    const delay = transitionPhase === "closing" ? 110 : 130;

    /** @param {number} timestamp Animation-frame timestamp. @returns {void} */
    const checkFrame = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed >= delay) {
        soundFX.playSwoosh();
      } else {
        rafId = requestAnimationFrame(checkFrame);
      }
    };

    rafId = requestAnimationFrame(checkFrame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [transitionPhase]);
}
