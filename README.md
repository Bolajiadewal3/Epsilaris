# Epsilaris

Epsilaris is a personal creative portfolio bringing music, poetry, photography, and moving-image work together in one interactive site. It is a client-side React application with locally managed content and static media; there is no application server or API.

## Explore the project

- **Home and navigation** — a motion-led entry experience linking the portfolio sections.
- **Music** — album and track catalogs with in-page audio playback.
- **Poetry** — a searchable, filterable collection with poem details and optional audio.
- **Photography** — film and digital collections with individual image details.
- **Videography and links** — dedicated portfolio sections for video work and external profiles.
- **Interactive presentation** — animated transitions, sound effects, and Three.js-powered visuals.

## Run locally

Install the project dependencies, then start Vite's development server:

```sh
npm install
npm run dev
```

Vite prints the local URL in the terminal. Use `Ctrl+C` to stop the server.

## Project commands

| Command               | Purpose                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`         | Start the local development server.                                               |
| `npm run build`       | Create the production site in `dist/`.                                            |
| `npm run preview`     | Serve the production build locally. Run the build first.                          |
| `npm run lint`        | Run Oxlint over the project.                                                      |
| `npm run parse-poems` | Regenerate `src/data/poemsData.json` from poem Markdown and matching audio files. |

## Project map

- `src/App.jsx` coordinates section navigation, view selection, transitions, and media state.
- `src/views/` contains the section and detail experiences.
- `src/data/` contains navigation, copy, and media manifests. `src/data/poemsData.json` is generated from source content.
- `public/` contains the site's images, audio, video, and Markdown content.
- `scripts/parse-poems.js` converts poem Markdown into the JSON consumed by the app.

For diagrams and implementation detail, see [Architecture and data flow](docs/architecture.md). Content editing and poem formatting will be covered in [Content authoring](docs/content-authoring.md); user journeys are mapped in [User flows](docs/user-flows.md).

## Deployment

The production site is published through Vercel from the Vite build output in `dist/`, and the site's domain is registered with IONOS and directed to that Vercel deployment. The checked-in `vercel.json` specifies `dist` as the output directory. The repository does not record whether deployment is triggered by a connected Git build or a manual/prebuilt upload, nor does it include the domain's DNS record details; use the Vercel project and IONOS domain settings for those operational specifics.
