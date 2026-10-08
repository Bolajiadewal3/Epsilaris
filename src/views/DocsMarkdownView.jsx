import React from "react";
import MarkdownViewer from "../components/widgets/MarkdownViewer.jsx";

import architectureMd from "../../docs/architecture.md?raw";
import userFlowsMd from "../../docs/user-flows.md?raw";
import contentAuthoringMd from "../../docs/content-authoring.md?raw";

const MARKDOWN_FILES = [
  { id: "architecture", label: "Architecture", content: architectureMd },
  { id: "user-flows", label: "User Flows", content: userFlowsMd },
  {
    id: "content-authoring",
    label: "Authoring Guide",
    content: contentAuthoringMd,
  },
];

/**
 * Sub-view for viewing Markdown documentation.
 * @param {Object} props
 * @param {string} props.activeDocId Currently selected Markdown doc ID.
 * @param {function(string): void} props.onSelectDocId Changes active Markdown tab.
 * @param {Function} props.onBackToCatalog Returns to the docs catalog.
 */
export default function DocsMarkdownView({
  activeDocId,
  onSelectDocId,
  onBackToCatalog,
}) {
  const currentDoc =
    MARKDOWN_FILES.find((d) => d.id === activeDocId) || MARKDOWN_FILES[0];

  return (
    <div className="flex flex-col h-full justify-between relative overflow-hidden pb-20 lg:pb-6 pr-1 sm:pr-2">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-3 pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToCatalog}
            className="text-xs text-yellow-400 hover:underline tracking-widest uppercase flex items-center gap-1 cursor-pointer"
          >
            ← BACK TO DOCS CATALOG
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-white/80 uppercase">
              DOCS // {currentDoc.id.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Markdown Document Switcher Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {MARKDOWN_FILES.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelectDocId(doc.id)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                currentDoc.id === doc.id
                  ? "bg-yellow-400 text-black border-yellow-400 font-bold"
                  : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {doc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Markdown Content Area */}
      <div className="flex-1 overflow-y-auto my-4 min-h-0 yellow-dot-scrollbar">
        <div className="bg-[#14151a] border border-white/10 p-4 sm:p-6 rounded">
          <MarkdownViewer content={currentDoc.content || ""} />
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50 shrink-0">
        <span>STATUS: READY</span>
        <span>RENDER MODE: STATIC BUNDLED MARKDOWN</span>
      </div>
    </div>
  );
}
