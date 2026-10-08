import React, { useEffect, useRef, useId } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "#14151a",
    primaryColor: "#1e2029",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#facc15",
    lineColor: "#facc15",
    fontFamily: "ui-monospace, monospace",
    fontSize: "12px",
  },
});

/**
 * Renders Mermaid source into an SVG diagram and guards updates after unmount.
 * @param {Object} props Diagram input.
 * @param {string} props.chart Mermaid diagram source.
 * @returns {React.ReactElement}
 */
export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);
  const uniqueId = `mermaid-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let isMounted = true;

    /**
     * Converts the current Mermaid source to SVG and installs it if still mounted.
     * @returns {Promise<void>}
     */
    const renderChart = async () => {
      if (!chart || !containerRef.current) return;
      try {
        const { svg } = await mermaid.render(uniqueId, chart);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid Render Error:", err);
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart, uniqueId]);

  return (
    <div
      ref={containerRef}
      className="my-4 p-4 bg-[#14151a] border border-white/10 rounded overflow-x-auto flex justify-center"
    />
  );
}
