# Content Authoring

Most portfolio content is maintained in JavaScript manifests under `src/data/`; media and Markdown files live under `public/`. Edit source files, not generated output, then run the relevant validation/build command.

## Content map

| Content                      | Source                             | Rendered by                                               |
| ---------------------------- | ---------------------------------- | --------------------------------------------------------- |
| Section labels               | `src/data/nav.js`                  | `Navbar` and `App`                                        |
| Section copy                 | `src/data/siteContent.js`          | Home and section presentation                             |
| Albums and tracks            | `src/data/music.js`                | Music catalog and detail views                            |
| Video metadata               | `src/data/videos.js`               | Videography view (currently behind a coming-soon overlay) |
| Film and digital photography | `src/data/photography.js`          | Photography catalog and detail views                      |
| Poems                        | `public/poetry/poems/*.md`         | `scripts/parse-poems.js`, poetry catalog, and detail view |
| Poem audio                   | `public/poetry/audio/`             | Poem detail view when a matching file is found            |
| Video dossier Markdown       | URL stored in `src/data/videos.js` | Videography view                                          |
| External profile links       | `src/views/LinksView.jsx`          | Links view                                                |
| Documentation hub entries    | `src/views/DocsCatalogView.jsx`    | Documentation catalog                                     |
| Documentation guides         | `docs/*.md`                        | `DocsMarkdownView.jsx` via raw imports                    |
| JSDoc API reference          | JSDoc comments in `src/`           | `npm run build:jsdoc`, embedded by `DocsJsDocView.jsx`    |

`src/data/index.js` is the active aggregation point. It imports generated `poemsData.json` and exports the split navigation, copy, and media manifests. Confirm imports before editing similarly named older data files.

## Updating the in-app documentation

The Architecture, User Flows, and Authoring Guide entries are Markdown files in `docs/`. `src/views/DocsMarkdownView.jsx` imports those files with Vite's `?raw` suffix, and `src/components/widgets/MarkdownViewer.jsx` renders the selected document. Edit the Markdown source directly; update `src/views/DocsCatalogView.jsx` and `DocsMarkdownView.jsx` when adding or renaming a guide.

The API reference is generated from JSDoc comments in the source files. Run `npm run build:jsdoc` to regenerate `public/docs/jsdoc/`; `src/views/DocsJsDocView.jsx` embeds that output. The JSDoc panel is currently shown as under refinement while its content is being reviewed.

## Static asset paths

Files in `public/` are served from the site root. For example, `public/music/albums/example/track.mp3` is referenced in a manifest as `/music/albums/example/track.mp3`; do not include the `public` prefix in the URL. Use paths and filename capitalization that match the actual files.

The music manifest describes albums with an `id`, `title`, `year`, `coverUrl`, `spotifyUrl`, and `tracks` array. Each track has a track number, title, audio URL, and duration. `App` reads audio metadata in the browser and can populate durations and embedded cover art when available; it does not replace the source manifest.

The photography manifest groups arrays under `film` and `digital`. Each photo has an `id`, `title`, `src`, `camera`, and `stock`. The video manifest includes a title and descriptive metadata plus thumbnail/video URLs; `dossierUrl` is optional and points to Markdown fetched by the view.

## Adding or updating a poem

1. Add or edit a Markdown file in `public/poetry/poems/`.
2. Put the title in a Markdown heading. Optional metadata labels are `Date:`, `Movement:`, `Sub-Theme One:`, and `Theme:`; place metadata before the poem body and separate it from the body with a blank line.
3. Keep poem lines as separate source lines. The parser trims each line and removes blank lines at the beginning and end of the poem body; internal blank lines remain in the generated data.
4. Optionally add a `.wav` recording under `public/poetry/audio/`. The parser checks the poem ID, exact title, and lowercase title as candidate filenames. Match filename spelling and capitalization exactly.
5. Run `npm run parse-poems`. This rewrites `src/data/poemsData.json`, including derived IDs, fallback metadata, text/audio URLs, and line arrays.
6. Review the generated JSON diff, then run `npm run build` to check the site.

The poetry catalog uses the generated metadata for searching/filtering and the detail view fetches `textUrl` to display the original Markdown text. If that fetch fails, the detail view falls back to the generated `lines` array.

## Content maintenance checks

- Keep every asset URL aligned with the file under `public/` or the intended external source.
- Keep IDs stable and unique where other content refers to them.
- Treat `src/data/poemsData.json` as generated output; make content changes in the Markdown source.
- The music catalog currently derives unreleased/locked presentation partly from album list positions. Check `MusicCatalogView.jsx` before reordering albums so presentation does not change unexpectedly.
- Videography remains behind a blocking coming-soon overlay; updating its data alone does not make the section available.
