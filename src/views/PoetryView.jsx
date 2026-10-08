import React, { useState, useEffect, useRef } from "react";

/**
 * @deprecated Replaced in App by the separate PoetryCatalogView and PoetryDetailView.
 */
export default function PoetryView({
  POEMS_DATA,
  currentPoemIndex,
  onPrevPoem,
  onNextPoem,
  onStopMusic,
}) {
  const activePoem = POEMS_DATA[currentPoemIndex];

  // Interactive state
  const [lines, setLines] = useState(activePoem?.lines || []);
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [noAnimationMode, setNoAnimationMode] = useState(false);
  const [isSpokenAudioPlaying, setIsSpokenAudioPlaying] = useState(false);

  const spokenAudioRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Load external text file, reset states, and cleanup when poem changes
  useEffect(() => {
    setRevealedIndex(0);
    setTypedText("");
    setIsTyping(false);
    setIsSpokenAudioPlaying(false);

    // Cleanup active intervals
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    // Cleanup active audio
    if (spokenAudioRef.current) {
      spokenAudioRef.current.pause();
      spokenAudioRef.current.currentTime = 0;
      spokenAudioRef.current = null; // Force new instance for new poem
    }

    // Fetch dynamic .txt or .md file if textUrl is provided
    if (activePoem?.textUrl) {
      fetch(activePoem.textUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load poem text file");
          return res.text();
        })
        .then((rawText) => {
          const parsedLines = rawText
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
          setLines(parsedLines);
        })
        .catch((err) => {
          console.error("Error loading external poem file:", err);
          setLines(activePoem.lines || []);
        });
    } else {
      setLines(activePoem?.lines || []);
    }

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (spokenAudioRef.current) {
        spokenAudioRef.current.pause();
      }
    };
  }, [activePoem]);

  // Handle line-by-line typewriter effect
  const handleTypeLine = (lineText, lineIdx) => {
    if (isTyping) return;
    onStopMusic(); // Stop background audio if reading poetry
    setIsTyping(true);
    setTypedText("");

    let charIdx = 0;
    setTypedText(lineText.charAt(0));
    charIdx = 1;

    typingIntervalRef.current = setInterval(() => {
      if (charIdx < lineText.length) {
        setTypedText(lineText.substring(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        setRevealedIndex(lineIdx + 1); // Reveal play button for next line
      }
    }, 35); // Typing speed per character (ms)
  };

  // Handle Text-to-Speech / Spoken Cadence audio
  const toggleSpokenAudio = () => {
    if (!spokenAudioRef.current && activePoem.audioUrl) {
      spokenAudioRef.current = new Audio(activePoem.audioUrl);
    }

    if (spokenAudioRef.current) {
      if (isSpokenAudioPlaying) {
        spokenAudioRef.current.pause();
        setIsSpokenAudioPlaying(false);
      } else {
        onStopMusic(); // Stop background audio

        const playPromise = spokenAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsSpokenAudioPlaying(true);
              spokenAudioRef.current.onended = () =>
                setIsSpokenAudioPlaying(false);
            })
            .catch((err) => {
              console.error("Audio playback was blocked by the browser:", err);
              setIsSpokenAudioPlaying(false);
            });
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between yellow-dot-scrollbar overflow-y-auto overflow-x-hidden min-h-0 pb-24 lg:pb-6 max-lg:landscape:pb-4 pr-1 sm:pr-2">
      {/* Inline Keyframe Styles for Fade-In & Slide-Up Motion */}
      <style>{`
        @keyframes poetryFadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-poetry-fade {
          animation: poetryFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Top Bar: Navigation & Voice Selector */}
      <div className="flex flex-col gap-3 max-lg:landscape:gap-1 pb-4 max-lg:landscape:pb-2 border-b border-white/10 shrink-0">
        {/* Publication Links Row */}
        <div className="flex flex-wrap items-center justify-between text-xs gap-2 max-lg:landscape:hidden">
          <div className="flex items-center gap-2 text-white/50 shrink-0">
            <span className="text-[10px] tracking-[0.2em] uppercase text-yellow-400">
              PUBLISHED WORKS:
            </span>
          </div>
          <a
            href="https://kreatifzine.com/writers/writers-winter-2026/mobolaji-adewale-england/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-yellow-400 transition-colors tracking-wide flex items-center gap-1.5 group break-words text-right"
          >
            <span className="line-clamp-1 sm:line-clamp-none">
              Kreatif Zine // Winter 2026 Feature
            </span>
            <span className="text-[10px] text-white/40 group-hover:text-yellow-400 shrink-0">
              ↗
            </span>
          </a>
        </div>

        {/* Main Status & Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pt-1 gap-4 md:gap-2 max-lg:landscape:flex-row max-lg:landscape:pt-0 max-lg:landscape:gap-2">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-white/80 uppercase line-clamp-1 sm:line-clamp-none">
              ACTIVE PIECE // {activePoem.subtitle}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 self-start md:self-auto flex-wrap max-lg:landscape:self-auto max-lg:landscape:flex-nowrap">
            <button
              onClick={() => setNoAnimationMode(!noAnimationMode)}
              className={`px-3 py-1.5 sm:py-1 border text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                noAnimationMode
                  ? "bg-yellow-400 text-black border-yellow-400 font-bold"
                  : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
              }`}
            >
              {noAnimationMode ? "MODE: INSTANT" : "MODE: STEP-BY-STEP"}
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onPrevPoem}
                className="w-8 h-8 sm:w-8 sm:h-8 border border-white/20 bg-[#14151a] hover:border-white/60 flex items-center justify-center cursor-pointer text-xs"
              >
                ←
              </button>
              <button
                onClick={onNextPoem}
                className="w-8 h-8 sm:w-8 sm:h-8 border border-white/20 bg-[#14151a] hover:border-white/60 flex items-center justify-center cursor-pointer text-xs"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center Content: Poem Lines & Spoken Cadence Bar */}
      <div className="grid grid-cols-1 max-lg:landscape:grid-cols-12 lg:grid-cols-12 gap-6 lg:gap-8 max-lg:landscape:gap-4 my-4 lg:my-auto max-lg:landscape:my-2 items-start md:items-center flex-1">
        <div className="max-lg:landscape:col-span-7 lg:col-span-8 space-y-4 sm:space-y-6 max-lg:landscape:space-y-2">
          <div>
            <p className="text-[10px] tracking-[0.25em] text-yellow-400 uppercase mb-1">
              {activePoem.opus}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6 max-lg:landscape:mb-2 break-words">
              {activePoem.title}
            </h2>
          </div>

          {/* Poem Lines Container */}
          <div className="space-y-4 max-lg:landscape:space-y-2 min-h-[120px] sm:min-h-[180px] max-lg:landscape:min-h-[80px] font-mono text-xs sm:text-sm md:text-base break-words whitespace-pre-wrap">
            {noAnimationMode ? (
              <div className="space-y-3 max-lg:landscape:space-y-1.5 text-white/90 animate-poetry-fade">
                {lines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            ) : (
              lines.map((line, idx) => {
                const isRevealed = idx <= revealedIndex;
                const isCurrentActive = idx === revealedIndex;

                if (!isRevealed) return null;

                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 max-lg:landscape:flex-row max-lg:landscape:gap-3 group animate-poetry-fade"
                  >
                    {isCurrentActive &&
                    idx > revealedIndex - (isTyping ? 0 : 1) ? (
                      // Show play button for the next unplayed line
                      <button
                        onClick={() => handleTypeLine(line, idx)}
                        disabled={isTyping}
                        className="px-3 py-1.5 sm:py-1 bg-yellow-400 text-black text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-2 max-w-[140px]"
                      >
                        <span>▶</span>
                        <span>LINE {idx + 1}</span>
                      </button>
                    ) : (
                      <span className="text-white/95 leading-relaxed">
                        {isCurrentActive && isTyping ? typedText : line}
                        {isCurrentActive && isTyping && (
                          <span className="inline-block w-2 h-3.5 sm:h-4 bg-yellow-400 ml-1 animate-pulse align-middle" />
                        )}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Side Panel / Read Aloud Widget */}
        <div className="max-lg:landscape:col-span-5 lg:col-span-4 bg-[#14151a] border border-white/10 p-5 sm:p-6 max-lg:landscape:p-3 flex flex-col justify-between space-y-4 sm:space-y-6 max-lg:landscape:space-y-2 shrink-0">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-yellow-400 uppercase block mb-1.5 sm:mb-2 max-lg:landscape:mb-1">
              AUDITORY COMPONENT
            </span>
            <h4 className="text-base sm:text-lg font-bold tracking-tight mb-1.5 sm:mb-2 max-lg:landscape:mb-1">
              SPOKEN CADENCE
            </h4>
            <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed max-lg:landscape:text-[10px]">
              Listen to the original vocal recitation captured via binaural
              recording.
            </p>
          </div>
          <button
            onClick={toggleSpokenAudio}
            className="w-full py-3 sm:py-3 max-lg:landscape:py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-colors"
          >
            <span>
              {isSpokenAudioPlaying
                ? "❚❚ PAUSE VOICE"
                : "▶ PLAY SPOKEN CADENCE"}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-3 sm:pt-4 max-lg:landscape:pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-white/50 gap-2 shrink-0">
        <span>PUBLISHED: {activePoem.date}</span>
        <span>{lines.length} LINES TOTAL</span>
      </div>
    </div>
  );
}
