import * as THREE from "three";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Converts a PDF ArrayBuffer or URL into Three.js CanvasTextures
 * with automatic scale scaling to keep memory usage safe on larger zines.
 */
export async function renderPdfPagesToTextures(source, onProgress) {
  const loadingTask =
    source instanceof ArrayBuffer
      ? pdfjsLib.getDocument({ data: source })
      : pdfjsLib.getDocument(source);

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  // Keep crispness high while preventing RAM spikes on long PDFs
  const renderScale = numPages > 30 ? 1.15 : numPages > 16 ? 1.4 : 1.75;

  const pages = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    // Crisp dark/paper base before rendering PDF vector/raster content
    ctx.fillStyle = "#14151a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;

    pages.push({
      pageNumber: pageNum,
      aspectRatio: viewport.width / viewport.height || 1 / 1.414,
      texture,
      canvas,
    });

    if (onProgress) {
      onProgress(Math.round((pageNum / numPages) * 100));
    }

    // Release PDF.js page resources promptly
    page.cleanup();
  }

  return pages;
}

export function disposeZinePages(pages = []) {
  pages.forEach((p) => {
    if (p?.texture) p.texture.dispose();
    if (p?.canvas) {
      p.canvas.width = 0;
      p.canvas.height = 0;
    }
  });
}
