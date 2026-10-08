import React from "react";

const DOC_ITEMS = [
  {
    id: "architecture",
    type: "markdown",
    label: "Architecture",
    tag: "SYSTEM ARCHITECTURE",
    description:
      "System overview, state management flow, and component structure.",
  },
  {
    id: "user-flows",
    type: "markdown",
    label: "User Flows",
    tag: "STATE & TRANSITIONS",
    description:
      "User journey maps, view switching logic, and audio/video state rules.",
  },
  {
    id: "content-authoring",
    type: "markdown",
    label: "Authoring Guide",
    tag: "CONTENT GUIDE",
    description:
      "Guidelines and conventions for adding media, Markdown, and catalog records.",
  },
  {
    id: "jsdoc",
    type: "jsdoc",
    label: "JSDoc API Guide",
    tag: "API REFERENCE",
    description:
      "Interactive subframe viewer for generated JSDoc API documentation.",
  },
];

/**
 * Renders the main documentation hub catalog.
 * @param {Object} props Component inputs.
 * @param {function(Object): void} props.onSelectDoc Triggers selection transition for a document.
 */
export default function DocsCatalogView({ onSelectDoc }) {
  return (
    <div className="flex flex-col h-full justify-between overflow-y-auto overflow-x-hidden pb-20 lg:pb-6 pr-2 yellow-dot-scrollbar">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-white/10 shrink-0">
        <p className="text-[10px] tracking-[0.25em] text-yellow-400 uppercase">
          SYSTEM MANUALS & SPECIFICATIONS
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          DOCUMENTATION HUB
        </h2>
      </div>

      {/* Grid of Documentation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 flex-1 items-start">
        {DOC_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectDoc(item)}
            className="group relative bg-[#14151a]/80 hover:bg-[#1c1d24] border border-white/10 hover:border-yellow-400/60 p-5 transition-all cursor-pointer flex flex-col justify-between h-44"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest mb-2">
                <span>{item.tag}</span>
                <span className="text-yellow-400/80 font-mono">
                  [{item.type.toUpperCase()}]
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight group-hover:text-yellow-400 transition-colors">
                {item.label}
              </h3>
              <p className="text-xs text-white/50 mt-2 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 tracking-wider">
              <span>
                FORMAT: {item.type === "jsdoc" ? "HTML SUBFRAME" : "MARKDOWN"}
              </span>
              <span className="group-hover:translate-x-1 transition-transform text-yellow-400">
                OPEN DOC →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 tracking-widest shrink-0">
        <span>TOTAL GUIDES: {DOC_ITEMS.length}</span>
        <span>SELECT A MODULE TO READ</span>
      </div>
    </div>
  );
}
