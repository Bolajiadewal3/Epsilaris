import React, { useEffect, useState, useRef } from "react";

/**
 * Displays a pointer-following cursor on devices with a precise pointer.
 * @returns {React.ReactElement|null} Cursor markup, or null on touch devices.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    /** Skip cursor listeners when the primary pointer is coarse. */
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    /** @param {MouseEvent} event Pointer movement from the browser. @returns {void} */
    const handleMouseMove = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }

      const target = event.target;
      const isInteractive = Boolean(
        target.closest(
          "button, a, [role='button'], input, select, textarea, .cursor-pointer",
        ),
      );

      setIsHovered((prev) => (prev !== isInteractive ? isInteractive : prev));
    };

    /** @returns {void} Reflects the pressed-pointer visual state. */
    const handleMouseDown = () => setIsClicked(true);
    /** @returns {void} Clears the pressed-pointer visual state. */
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        className="transition-transform duration-150 ease-out"
      >
        {isHovered ? (
          <circle
            cx="12"
            cy="12"
            r="8"
            fill={isClicked ? "#ffffff" : "none"}
            stroke={isClicked ? "#ff6b00" : "#ffffff"}
            strokeWidth={isClicked ? "2.5" : "1.8"}
            className="transition-all duration-150"
          />
        ) : (
          <path
            d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
            fill={isClicked ? "#ffffff" : "none"}
            stroke={isClicked ? "#ff6b00" : "#ffffff"}
            strokeWidth={isClicked ? "2.5" : "1.5"}
            strokeLinejoin="round"
            className="transition-all duration-150"
          />
        )}
      </svg>
    </div>
  );
}
