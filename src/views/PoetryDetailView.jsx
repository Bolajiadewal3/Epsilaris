import React, { useState, useEffect, useRef } from "react";

/**
 * Renders one poem with stepped or instant reading and optional spoken audio.
 * @param {Object} props Selected poem and catalog/player callbacks.
 * @param {Object} props.activePoem Poem metadata, lines, and optional media URLs.
 * @param {Function} props.onBackToCatalog Returns to the poetry catalog.
 * @param {Function} props.onStopMusic Stops the shared music player.
 * @returns {React.ReactElement}
 */
export default function PoetryDetailView({
  activePoem,
  onBackToCatalog,
  onStopMusic,
}) {
  const [lines, setLines] = useState(activePoem?.lines || []);
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [noAnimationMode, setNoAnimationMode] = useState(false);
  const [isSpokenAudioPlaying, setIsSpokenAudioPlaying] = useState(false);

  const spokenAudioRef = useRef(null);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    setRevealedIndex(0);
    setTypedText("");
    setIsTyping(false);
    setIsSpokenAudioPlaying(false);

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (spokenAudioRef.current) {
      spokenAudioRef.current.pause();
      spokenAudioRef.current.currentTime = 0;
      spokenAudioRef.current = null;
    }

    if (activePoem?.textUrl) {
      fetch(activePoem.textUrl)
        .then((res) => res.text())
        .then((rawText) => {
          const rawLines = rawText.split("\n");
          const cleanedLines = [];
          let passedMetadata = false;

          for (let line of rawLines) {
            const trimmed = line.trim();
            /** Keep headings and metadata out of the rendered poem body. */
            if (
              trimmed.startsWith("#") ||
              trimmed.startsWith("Date:") ||
              trimmed.startsWith("Movement:") ||
              trimmed.startsWith("Sub-Theme") ||
              trimmed.startsWith("Theme:")
            ) {
              continue;
            }
            if (!passedMetadata && trimmed === "") {
              passedMetadata = true;
              continue;
            }
            if (passedMetadata || trimmed !== "") {
              passedMetadata = true;
              cleanedLines.push(trimmed);
            }
          }

          while (cleanedLines.length > 0 && cleanedLines[0] === "") {
            cleanedLines.shift();
          }

          setLines(
            cleanedLines.length > 0 ? cleanedLines : activePoem.lines || [],
          );
        })
        .catch(() => setLines(activePoem.lines || []));
    } else {
      setLines(activePoem?.lines || []);
    }

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (spokenAudioRef.current) spokenAudioRef.current.pause();
    };
  }, [activePoem]);

  /**
   * Types one line, stopping background music before the reading animation.
   * @param {string} lineText Text to reveal character by character.
   * @param {number} lineIdx Index of the line being revealed.
   * @returns {void}
   */
  const handleTypeLine = (lineText, lineIdx) => {
    if (isTyping) return;
    onStopMusic();
    setIsTyping(true);
    setTypedText(lineText.charAt(0));

    let charIdx = 1;
    typingIntervalRef.current = setInterval(() => {
      if (charIdx < lineText.length) {
        setTypedText(lineText.substring(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        setRevealedIndex(lineIdx + 1);
      }
    }, 35);
  };

  /** Toggles the poem's optional spoken recording. @returns {void} */
  const toggleSpokenAudio = () => {
    if (!spokenAudioRef.current && activePoem?.audioUrl) {
      spokenAudioRef.current = new Audio(activePoem.audioUrl);
    }

    if (spokenAudioRef.current) {
      if (isSpokenAudioPlaying) {
        spokenAudioRef.current.pause();
        setIsSpokenAudioPlaying(false);
      } else {
        onStopMusic();
        spokenAudioRef.current
          .play()
          .then(() => {
            setIsSpokenAudioPlaying(true);
            spokenAudioRef.current.onended = () =>
              setIsSpokenAudioPlaying(false);
          })
          .catch(() => setIsSpokenAudioPlaying(false));
      }
    }
  };

  const externalPublicationUrl =
    activePoem?.externalUrl ||
    "https://kreatifzine.com/writers/writers-winter-2026/mobolaji-adewale-england/";

  return (
    <div className="flex flex-col h-full justify-between yellow-dot-scrollbar overflow-y-auto overflow-x-hidden min-h-0 pb-24 lg:pb-6 pr-2">
      {/* Top Bar Navigation & Header */}
      <div className="flex flex-col gap-3 pb-4 border-b border-white/10 shrink-0">
        {/* Publication Row Link */}
        <div className="flex flex-wrap items-center justify-between text-xs gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-white/50 shrink-0">
            <span className="text-[10px] tracking-[0.2em] uppercase text-yellow-400">
              PUBLISHED WORKS:
            </span>
          </div>
          <a
            href={externalPublicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-yellow-400 transition-colors tracking-wide flex items-center gap-1.5 group break-words text-right"
          >
            <span className="line-clamp-1 sm:line-clamp-none">
              {activePoem?.publicationName ||
                "Kreatif Zine // Winter 2026 Feature"}
            </span>
            <span className="text-[10px] text-white/40 group-hover:text-yellow-400 shrink-0">
              ↗
            </span>
          </a>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onBackToCatalog}
            className="text-xs text-yellow-400 hover:underline tracking-widest uppercase flex items-center gap-1 cursor-pointer"
          >
            ← BACK TO POETRY CATALOG
          </button>

          {activePoem?.movement && (
            <span className="text-[10px] tracking-widest text-white/50 uppercase border border-white/15 px-2 py-0.5">
              {activePoem.movement}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between pt-1 gap-4 md:gap-2">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs tracking-[0.2em] text-white/80 uppercase">
              ACTIVE PIECE // {activePoem?.subtitle || activePoem?.title}
            </span>
          </div>

          <button
            onClick={() => setNoAnimationMode(!noAnimationMode)}
            className={`px-3 py-1 border text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
              noAnimationMode
                ? "bg-yellow-400 text-black border-yellow-400 font-bold"
                : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
            }`}
          >
            {noAnimationMode ? "MODE: INSTANT" : "MODE: STEP-BY-STEP"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-4 items-start flex-1">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <p className="text-[10px] tracking-[0.25em] text-yellow-400 uppercase mb-1">
              {activePoem?.opus}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              {activePoem?.title}
            </h2>
          </div>

          <div className="space-y-4 font-mono text-sm md:text-base break-words whitespace-pre-wrap">
            {noAnimationMode ? (
              <div className="space-y-3 text-white/90">
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
                    className="flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {isCurrentActive &&
                    idx > revealedIndex - (isTyping ? 0 : 1) ? (
                      <button
                        onClick={() => handleTypeLine(line, idx)}
                        disabled={isTyping}
                        className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold tracking-widest uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center gap-2 max-w-[140px]"
                      >
                        <span>▶</span>
                        <span>LINE {idx + 1}</span>
                      </button>
                    ) : (
                      <span className="text-white/95 leading-relaxed">
                        {isCurrentActive && isTyping ? typedText : line}
                        {isCurrentActive && isTyping && (
                          <span className="inline-block w-2 h-4 bg-yellow-400 ml-1 animate-pulse align-middle" />
                        )}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Auditory Component Side Panel */}
        <div className="lg:col-span-4 bg-[#14151a] border border-white/10 p-6 flex flex-col justify-between space-y-6 shrink-0">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-yellow-400 uppercase block mb-2">
              AUDITORY COMPONENT
            </span>
            <h4 className="text-lg font-bold tracking-tight mb-2">
              SPOKEN CADENCE
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              {activePoem?.audioUrl
                ? "Listen to the original vocal recitation captured via binaural recording."
                : "No vocal recording has been attached to this piece yet."}
            </p>
          </div>

          {activePoem?.audioUrl ? (
            <button
              onClick={toggleSpokenAudio}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-3 cursor-pointer transition-colors"
            >
              <span>
                {isSpokenAudioPlaying
                  ? "❚❚ PAUSE VOICE"
                  : "▶ PLAY SPOKEN CADENCE"}
              </span>
            </button>
          ) : (
            <div className="w-full py-3 bg-white/5 border border-white/10 text-xs tracking-[0.2em] uppercase text-white/40 text-center font-bold">
              AUDIO COMING SOON
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
        <span>PUBLISHED: {activePoem?.date}</span>
        <span>THEME: {activePoem?.theme}</span>
      </div>
    </div>
  );
}
