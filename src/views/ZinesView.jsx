import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import ZineBook3D, {
  getStepView,
  getMaxStep,
} from "../components/three/ZineBook3D";
import {
  renderPdfPagesToTextures,
  disposeZinePages,
} from "../utils/pdfToTextures";

import { INITIAL_ZINES } from "../data/zines";

export default function ZinesView({ mouse }) {
  const [zines, setZines] = useState(INITIAL_ZINES);
  const [activeMeta, setActiveMeta] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [isSuperTall, setIsSuperTall] = useState(false);
  const [manualSinglePage, setManualSinglePage] = useState(null);

  const fileInputRef = useRef(null);
  const pagesRef = useRef([]);
  pagesRef.current = pages;

  useEffect(() => {
    const updateViewportMode = () => {
      const ratio = window.innerHeight / Math.max(1, window.innerWidth);
      setIsSuperTall(ratio > 1.25);
    };
    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);
    window.addEventListener("orientationchange", updateViewportMode);
    return () => {
      window.removeEventListener("resize", updateViewportMode);
      window.removeEventListener("orientationchange", updateViewportMode);
    };
  }, []);

  useEffect(() => {
    return () => {
      disposeZinePages(pagesRef.current);
    };
  }, []);

  const singlePageMode =
    manualSinglePage !== null ? manualSinglePage : isSuperTall;

  const maxStep = getMaxStep(pages.length, singlePageMode);
  const stepView = getStepView(currentStep, pages.length, singlePageMode);

  useEffect(() => {
    if (currentStep > maxStep) {
      setCurrentStep(Math.max(0, maxStep));
    }
  }, [maxStep, currentStep]);

  const handleOpenZine = async (zineSource, meta) => {
    setIsLoadingPdf(true);
    setLoadProgress(0);

    try {
      disposeZinePages(pagesRef.current);
      setPages([]);

      const renderedPages = await renderPdfPagesToTextures(zineSource, (pct) =>
        setLoadProgress(pct),
      );

      setPages(renderedPages);
      setCurrentStep(0);
      setActiveMeta({
        title: meta?.title || "UNTITLED ZINE",
        year: meta?.year || "2026",
        notes: meta?.notes || "Interactive 3D proof & publication preview.",
        specs: meta?.specs || `A5 EDITION // ${renderedPages.length} PAGES`,
        totalPages: renderedPages.length,
      });
    } catch (err) {
      console.error("PDF render error:", err);
      alert("Unable to load PDF. Check the file and try again.");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || file.type !== "application/pdf") return;
    const buffer = await file.arrayBuffer();
    const cleanTitle = file.name.replace(/\.pdf$/i, "").toUpperCase();

    const entry = {
      id: `upload-${Date.now()}`,
      title: cleanTitle,
      year: "LOCAL",
      pages: "PDF",
      buffer,
      specs: "LOCAL PDF PROOF // 3D VIEWER",
      notes:
        "Uploaded directly in session for layout, cover, and turn inspection.",
    };

    setZines((prev) => [entry, ...prev]);
    await handleOpenZine(buffer, entry);
  };

  const handleBackToArchive = () => {
    disposeZinePages(pagesRef.current);
    setPages([]);
    setActiveMeta(null);
    setCurrentStep(0);
    setManualSinglePage(null);
  };

  useEffect(() => {
    if (!activeMeta) return;
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setCurrentStep((s) => Math.min(s + 1, maxStep));
      } else if (e.key === "ArrowLeft") {
        setCurrentStep((s) => Math.max(s - 1, 0));
      } else if (e.key === "Escape") {
        handleBackToArchive();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeMeta, maxStep]);

  if (activeMeta) {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-2 shrink-0 pb-1">
          <button
            onClick={handleBackToArchive}
            className="text-[10px] md:text-xs tracking-[0.2em] text-yellow-400 uppercase cursor-pointer hover:underline"
          >
            ← BACK TO ZINES
          </button>

          <button
            onClick={() =>
              setManualSinglePage((prev) =>
                prev === null ? !isSuperTall : !prev,
              )
            }
            className="px-2.5 py-1 bg-[#14151a] border border-white/15 hover:border-yellow-400/60 text-[9px] md:text-[10px] tracking-[0.18em] text-white/70 hover:text-yellow-400 uppercase cursor-pointer transition-colors"
          >
            {singlePageMode ? "MODE: SINGLE PAGE" : "MODE: SPREAD"}
          </button>
        </div>

        {/* Wide Split: Far-Left Info Column + 3D Zine Slightly Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5 flex-1 min-h-0 my-1 items-stretch">
          {/* Far-Left Info & Controls Column */}
          <aside className="order-2 md:order-1 md:col-span-4 bg-[#14151a]/90 border border-white/10 p-3.5 md:p-5 flex flex-col justify-between min-h-0 overflow-y-auto yellow-dot-scrollbar">
            <div className="space-y-3">
              <div>
                <p className="text-[9px] md:text-[10px] tracking-[0.25em] text-yellow-400 uppercase mb-1">
                  {activeMeta.year} · {activeMeta.totalPages} PP
                </p>
                <h3 className="text-base md:text-xl font-bold tracking-tight text-white">
                  {activeMeta.title}
                </h3>
              </div>

              <p className="text-[11px] md:text-xs text-white/70 leading-relaxed font-mono">
                {activeMeta.notes}
              </p>

              <div className="pt-2.5 border-t border-white/10 space-y-1 text-[10px] font-mono text-white/50">
                <p>SPEC // {activeMeta.specs}</p>
                <p>VIEW // {stepView.label}</p>
                <p className="text-white/35">
                  DRAG TO ORBIT · SCROLL ZOOM · ← / → FLIP
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
                disabled={currentStep <= 0}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-25 border border-white/20 text-[10px] tracking-[0.2em] uppercase text-white cursor-pointer transition-colors"
              >
                ← PREV
              </button>
              <button
                onClick={() => setCurrentStep((s) => Math.min(s + 1, maxStep))}
                disabled={currentStep >= maxStep}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-25 border border-white/20 text-[10px] tracking-[0.2em] uppercase text-white cursor-pointer transition-colors"
              >
                NEXT →
              </button>
            </div>
          </aside>

          {/* Right 3D Stage with Floating Left/Right Arrows */}
          <div className="order-1 md:order-2 md:col-span-8 relative min-h-[220px] h-full border border-white/10 bg-[#0a0a0c]/70 overflow-hidden">
            <Canvas
              camera={{ position: [0, 0, singlePageMode ? 4.8 : 5.4], fov: 40 }}
              dpr={[1, 2]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <Environment
                files="/monochrome_studio_02_1k.hdr"
                background={false}
              />
              <ambientLight intensity={0.85} />
              <directionalLight position={[3, 5, 6]} intensity={1.5} />
              <directionalLight position={[-4, -2, 4]} intensity={0.5} />

              <ZineBook3D
                pages={pages}
                currentStep={currentStep}
                singlePageMode={singlePageMode}
                mouse={mouse}
                shiftRightOnWide={!singlePageMode}
              />

              <OrbitControls
                enablePan={false}
                minDistance={2.6}
                maxDistance={8.5}
              />
            </Canvas>

            {/* Left Arrow */}
            <button
              onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
              disabled={currentStep <= 0}
              className="w-8 h-8 md:w-9 md:h-9 border border-white/20 bg-[#14151a]/90 hover:border-yellow-400 disabled:opacity-25 flex items-center justify-center cursor-pointer transition-colors text-xs md:text-sm absolute left-3 top-1/2 -translate-y-1/2 z-10"
              aria-label="Previous Page or Spread"
            >
              ←
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => setCurrentStep((s) => Math.min(s + 1, maxStep))}
              disabled={currentStep >= maxStep}
              className="w-8 h-8 md:w-9 md:h-9 border border-white/20 bg-[#14151a]/90 hover:border-yellow-400 disabled:opacity-25 flex items-center justify-center cursor-pointer transition-colors text-xs md:text-sm absolute right-3 top-1/2 -translate-y-1/2 z-10"
              aria-label="Next Page or Spread"
            >
              →
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full h-10 md:h-11 bg-[#14151a] border border-yellow-400/20 px-4 md:px-6 flex items-center justify-between text-[10px] md:text-xs shrink-0">
          <span className="text-yellow-400 tracking-widest uppercase truncate">
            {stepView.label}
          </span>
          <span className="text-white/60 font-mono shrink-0">
            {currentStep + 1} / {maxStep + 1}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full justify-between py-1 md:py-0 overflow-hidden relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
      }}
    >
      {isLoadingPdf && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="w-64 border border-white/20 bg-[#14151a] p-5 text-center space-y-3">
            <p className="text-[10px] tracking-[0.25em] text-yellow-400 uppercase animate-pulse">
              PREPARING 3D ZINE SHEETS
            </p>
            <div className="w-full h-1.5 bg-white/10 overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-150"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-xs font-mono text-white/60">{loadProgress}%</p>
          </div>
        </div>
      )}

      <div className="flex items-end justify-between gap-4 shrink-0 mb-2">
        <div>
          <p className="text-[9px] md:text-xs tracking-[0.25em] text-white/50 uppercase mb-0.5">
            CATALOGUE NO. 05 — ZINES & PRINT EDITIONS
          </p>
          <h2 className="text-base md:text-4xl font-bold tracking-tight">
            ZINE ARCHIVE
          </h2>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 md:px-4 md:py-2.5 bg-white text-black hover:bg-yellow-400 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer shrink-0"
        >
          + UPLOAD PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) handleFileUpload(file);
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-6 overflow-y-auto md:overflow-x-auto md:overflow-y-hidden py-2 my-auto items-center min-h-0 flex-1 yellow-dot-scrollbar">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-[320px] md:max-w-none md:w-[260px] aspect-[4/3] md:aspect-[14/19] border border-dashed transition-all p-5 flex flex-col items-center justify-center text-center cursor-pointer shrink-0 ${
            isDragging
              ? "border-yellow-400 bg-yellow-400/10"
              : "border-white/25 bg-[#14151a]/50 hover:border-white/60"
          }`}
        >
          <span className="text-2xl mb-2 text-white/70">↑</span>
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1">
            DROP ZINE PDF
          </p>
          <p className="text-[10px] font-mono text-white/40 leading-relaxed">
            Preview spreads, cover, and page turns in 3D
          </p>
        </div>

        {zines.map((zine) => (
          <div
            key={zine.id}
            onClick={() => handleOpenZine(zine.buffer || zine.pdfUrl, zine)}
            className="w-full max-w-[320px] md:max-w-none md:w-[260px] aspect-[4/3] md:aspect-[14/19] bg-[#14151a]/80 border border-white/10 p-4 md:p-6 flex flex-col justify-between cursor-pointer hover:border-white/40 transition-all group shrink-0 relative"
          >
            <div className="w-full flex-1 bg-[#0a0a0c] border border-white/5 flex flex-col items-center justify-center p-4 text-center group-hover:border-white/20 transition-colors mb-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-yellow-400/80 mb-2">
                [ 3D EDITION ]
              </span>
              <p className="text-xs font-mono text-white/50">{zine.specs}</p>
            </div>

            <div>
              <span className="text-[9px] md:text-xs tracking-[0.2em] text-white/50 block">
                {zine.year} · {zine.pages} PP
              </span>
              <h3 className="text-sm md:text-lg font-bold tracking-wide mt-0.5 truncate group-hover:text-yellow-400 transition-colors">
                {zine.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-10 md:h-12 bg-[#14151a] border border-white/10 px-4 md:px-6 flex items-center justify-between text-[10px] md:text-xs shrink-0">
        <span className="tracking-widest text-white/60 uppercase">
          SELECT AN ISSUE OR DROP A PDF TO OPEN 3D VIEWER
        </span>
        <span className="tracking-widest text-white/40 hidden sm:inline font-mono">
          {isSuperTall ? "[ SINGLE-PAGE AUTO ]" : "[ SPREAD MODE READY ]"}
        </span>
      </div>
    </div>
  );
}
