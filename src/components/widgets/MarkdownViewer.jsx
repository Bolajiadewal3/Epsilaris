import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MermaidDiagram from "./MermaidDiagram.jsx";

/**
 * Renders Markdown with GFM tables and Mermaid code blocks as diagrams.
 * @param {Object} props Viewer inputs.
 * @param {string} props.content Markdown source text.
 * @returns {React.ReactElement}
 */
export default function MarkdownViewer({ content }) {
  return (
    <div className="prose prose-invert max-w-none text-xs sm:text-sm font-mono text-white/80 space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const value = String(children).replace(/\n$/, "");

            if (!inline && language === "mermaid") {
              return <MermaidDiagram chart={value} />;
            }

            return inline ? (
              <code
                className="bg-white/10 text-yellow-400 px-1 py-0.5 rounded text-[11px]"
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-[#14151a] border border-white/10 p-3 rounded overflow-x-auto text-yellow-300 text-xs">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4 uppercase tracking-wider">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-yellow-400 mt-6 mb-2 uppercase tracking-wide">
              {children}
            </h2>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-white/10 rounded">
              <table className="w-full text-left border-collapse bg-[#14151a]">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-white/10 p-2 bg-white/5 text-yellow-400 text-xs font-bold uppercase">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-white/5 p-2 text-white/70 text-xs">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
