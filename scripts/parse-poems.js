import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POEMS_DIR = path.join(__dirname, "../public/poetry/poems");
const AUDIO_DIR = path.join(__dirname, "../public/poetry/audio");
const OUTPUT_FILE = path.join(__dirname, "../src/data/poemsData.json");

/**
 * Generates the poem catalog JSON from Markdown sources and matching audio.
 * @returns {void} Exits with an error if the poem source directory is missing.
 */
function parsePoems() {
  if (!fs.existsSync(POEMS_DIR)) {
    console.error(`Directory not found: ${POEMS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(POEMS_DIR).filter((f) => f.endsWith(".md"));
  const poems = [];

  files.forEach((filename, index) => {
    const filePath = path.join(POEMS_DIR, filename);
    const rawContent = fs.readFileSync(filePath, "utf-8");

    const rawLines = rawContent.split(/\r?\n/);

    let title = "";
    let date = "UNDATED";
    let movement = "Contemporary";
    let subTheme = "";
    let theme = "General Anthology";

    const bodyLines = [];
    let parsingBody = false;

    for (let line of rawLines) {
      const trimmed = line.trim();

      /** Extract a title from a Markdown heading. */
      if (trimmed.startsWith("#")) {
        title = trimmed
          .replace(/^#+\s*/, "")
          .replace(/["']/g, "")
          .trim();
        continue;
      }

      /** Parse metadata only until the poem body begins. */
      if (!parsingBody) {
        if (trimmed.startsWith("Date:")) {
          date = trimmed.replace("Date:", "").trim();
          continue;
        }
        if (trimmed.startsWith("Movement:")) {
          movement = trimmed.replace("Movement:", "").trim();
          continue;
        }
        if (trimmed.startsWith("Sub-Theme One:")) {
          subTheme = trimmed.replace("Sub-Theme One:", "").trim();
          continue;
        }
        if (trimmed.startsWith("Theme:")) {
          theme = trimmed.replace("Theme:", "").trim();
          continue;
        }

        /** A blank line after explicit metadata marks the start of the body. */
        if (trimmed === "") {
          if (date !== "UNDATED" || movement !== "Contemporary") {
            parsingBody = true;
          }
          continue;
        }
      }

      /** Keep body lines, including interior blank lines, for stanza spacing. */
      if (parsingBody) {
        bodyLines.push(line);
      } else if (trimmed !== "") {
        parsingBody = true;
        bodyLines.push(line);
      }
    }

    /** Fall back to a readable filename when no heading is present. */
    if (!title) {
      const cleanName = filename
        .replace(".md", "")
        .replace(/[a-f0-9]{24,}/gi, "")
        .trim();
      title = cleanName.replace(/[-_]/g, " ");
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    /** Derive a stable URL-friendly ID from the source filename. */
    const baseIdName = filename
      .replace(".md", "")
      .replace(/[a-f0-9]{24,}/gi, "")
      .trim();
    const id =
      baseIdName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || `poem-${index + 1}`;

    /** Remove only outer blank lines; retain blank lines between stanzas. */
    while (bodyLines.length > 0 && bodyLines[0].trim() === "") {
      bodyLines.shift();
    }
    while (
      bodyLines.length > 0 &&
      bodyLines[bodyLines.length - 1].trim() === ""
    ) {
      bodyLines.pop();
    }

    const finalLines = bodyLines.map((l) => l.trim());
    const firstLine = finalLines.find((l) => l.length > 0) || "";

    /** Match optional audio by slug, exact title, then lowercase title. */
    const possibleAudioNames = [
      `${id}.wav`,
      `${title}.wav`,
      `${title.toLowerCase()}.wav`,
    ];
    let matchingAudioFile = null;

    if (fs.existsSync(AUDIO_DIR)) {
      const audioFiles = fs.readdirSync(AUDIO_DIR);
      for (const audioName of possibleAudioNames) {
        if (audioFiles.includes(audioName)) {
          matchingAudioFile = audioName;
          break;
        }
      }
    }

    const audioUrl = matchingAudioFile
      ? `/poetry/audio/${matchingAudioFile}`
      : null;

    const poemObj = {
      id,
      title,
      subtitle: title.toUpperCase(),
      opus: `OPUS ${String(index + 1).padStart(2, "0")}`,
      date: date || "UNDATED",
      theme: theme || "General Anthology",
      subTheme: subTheme || firstLine,
      movement: movement || "Contemporary",
      audioUrl,
      textUrl: `/poetry/poems/${filename}`,
      lines: finalLines,
    };

    poems.push(poemObj);
  });

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(poems, null, 2), "utf-8");
  console.log(`Successfully parsed ${poems.length} poems to ${OUTPUT_FILE}`);
}

parsePoems();
