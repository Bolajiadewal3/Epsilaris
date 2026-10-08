import React, { useState, useMemo } from "react";

/**
 * @typedef {Object} PoemRecord
 * @property {string} id Stable poem identifier.
 * @property {string} title Display title.
 * @property {string} [theme] Theme used by the catalog filter.
 * @property {string} [movement] Movement searchable from the catalog.
 * @property {string} [subTheme] Sub-theme searchable from the catalog.
 * @property {string} [opus] Catalog label.
 * @property {string[]} [lines] Parsed poem lines.
 */

/**
 * Displays poems with catalog-local search and theme filtering.
 * @param {Object} props Component inputs.
 * @param {PoemRecord[]} props.POEMS_DATA Catalog records to display.
 * @param {function(PoemRecord): void} props.onSelectPoem Opens a selected record.
 * @returns {React.ReactElement}
 */
export default function PoetryCatalogView({ POEMS_DATA, onSelectPoem }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("ALL");

  const themes = useMemo(
    /**
     * Derives the available theme filters from the current catalog.
     * @returns {string[]} Unique themes preceded by the all-items option.
     */
    () => {
      const list = POEMS_DATA.map((poem) => poem.theme).filter(Boolean);
      return ["ALL", ...Array.from(new Set(list))];
    },
    [POEMS_DATA],
  );

  const filteredPoems = useMemo(
    /**
     * Applies the catalog search and selected-theme constraints together.
     * @returns {PoemRecord[]} Records matching both active filters.
     */
    () =>
      POEMS_DATA.filter((poem) => {
        const normalizedSearch = searchTerm.toLowerCase();
        const matchesSearch =
          poem.title.toLowerCase().includes(normalizedSearch) ||
          poem.movement?.toLowerCase().includes(normalizedSearch) ||
          poem.subTheme?.toLowerCase().includes(normalizedSearch);

        const matchesTheme =
          selectedTheme === "ALL" || poem.theme === selectedTheme;

        return matchesSearch && matchesTheme;
      }),
    [POEMS_DATA, searchTerm, selectedTheme],
  );

  return (
    <div className="flex flex-col h-full justify-between overflow-y-auto overflow-x-hidden pb-20 lg:pb-6 pr-2 yellow-dot-scrollbar">
      {/* Header & Filters Bar */}
      <div className="flex flex-col gap-4 pb-4 border-b border-white/10 shrink-0">
        {/* Publication External Link Banner */}
        <div className="flex flex-wrap items-center justify-between text-xs gap-2 border-b border-white/5 pb-2">
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.25em] text-yellow-400 uppercase">
              ARCHIVE CATALOG
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              POETRY & ANTHOLOGY
            </h2>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="SEARCH TITLE, MOVEMENT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 bg-[#14151a] border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400 w-full sm:w-64 transition-colors"
          />
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-3 py-1 border text-[10px] tracking-[0.15em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                selectedTheme === theme
                  ? "bg-yellow-400 text-black border-yellow-400 font-bold"
                  : "bg-white/5 border-white/15 text-white/60 hover:border-white/40"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Poem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6 flex-1 items-start">
        {filteredPoems.map((poem) => (
          <div
            key={poem.id}
            onClick={() => onSelectPoem(poem)}
            className="group relative bg-[#14151a]/80 hover:bg-[#1c1d24] border border-white/10 hover:border-yellow-400/60 p-5 transition-all cursor-pointer flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest mb-2">
                <span>{poem.opus}</span>
                <span className="text-yellow-400/80">{poem.movement}</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight group-hover:text-yellow-400 transition-colors">
                {poem.title}
              </h3>
              <p className="text-xs text-white/50 mt-1 line-clamp-2">
                {poem.lines?.[0] || poem.subTheme}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 tracking-wider">
              <span>{poem.theme}</span>
              <span className="group-hover:translate-x-1 transition-transform text-yellow-400">
                READ →
              </span>
            </div>
          </div>
        ))}

        {filteredPoems.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-white/40 tracking-widest uppercase">
            NO POEMS MATCHING YOUR CRITERIA
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 tracking-widest shrink-0">
        <span>TOTAL PIECES: {POEMS_DATA.length}</span>
        <span>SELECT A PIECE TO ENTER READER</span>
      </div>
    </div>
  );
}
