# User Flows

These diagrams describe the current implementation. Videography is shown as deferred because its view currently places a “coming soon” overlay over the player interface.

## Entry and section navigation

```mermaid
flowchart TD
    open[Open site] --> deepLink{Valid page, tab, or hash target?}
    deepLink -->|yes| selectTarget[Select target section and enable welcome auto-start]
    deepLink -->|no| welcome[Show welcome screen]
    selectTarget --> welcome
    welcome --> enter[Enter site]
    enter --> home[Show selected section]
    home --> nav[Choose another navigation item]
    nav --> wait[Closing transition]
    wait --> reset[Reset section detail selections]
    reset --> load[Load selected section]
    load --> openTransition[Opening transition]
    openTransition --> home
```

Deep links are read once on initial mount. The app accepts `?page=...`, `?tab=...`, or a hash such as `#poetry` for the known section keys: `home`, `music`, `videography`, `poetry`, `photography`, and `links`.

## Catalog and detail patterns

```mermaid
flowchart LR
    music[Music catalog] -->|select album| album[Album detail]
    album -->|back| music

    poetry[Poetry catalog] -->|search or filter| poetry
    poetry -->|select poem| poem[Poem reader]
    poem -->|back| poetry

    photography[Photography catalog] -->|select film or digital| medium[Medium entry screen]
    medium -->|enter workspace| grid[Photo grid]
    grid -->|select image| lightbox[Expanded image]
    lightbox -->|close| grid
    grid -->|back| photography
```

## Music playback

```mermaid
flowchart TD
    choose[Choose album] --> detail[Open album tracklist]
    detail --> track[Choose a track]
    track --> playing[Play audio and update current track]
    playing --> same{Choose currently playing track?}
    same -->|yes| pause[Pause playback]
    same -->|no| replace[Load and play selected track]
    pause --> player[Player controls reflect playback state]
    replace --> player
    player --> stop[Stop: pause, reset time, clear current track]
```

Playback is controlled by browser audio APIs. A floating player is shown outside the music section, and on the music section in mobile landscape. Selecting a poem or starting its spoken audio stops the music player first.

## Poetry reading

```mermaid
flowchart TD
    catalog[Poetry catalog] --> search[Search title, movement, or sub-theme]
    catalog --> theme[Filter by theme]
    search --> select[Select a poem]
    theme --> select
    select --> detail[Open poem detail]
    detail --> markdown{Original Markdown available?}
    markdown -->|yes| fetch[Fetch and parse text]
    markdown -->|no or fetch fails| fallback[Use generated JSON lines]
    fetch --> mode{Reading mode}
    fallback --> mode
    mode -->|step-by-step| type[Reveal lines with typing interaction]
    mode -->|instant| full[Show all lines]
    detail --> audio{Matching audio exists?}
    audio -->|yes| spoken[Play or pause spoken audio]
    audio -->|no| unavailable[Show no recording message]
    type --> back[Return to catalog]
    full --> back
    spoken --> back
    unavailable --> back
```

## Videography status

The videography data and player interactions exist in the code, but the current view renders a blocking “FILM REELS COMING SOON” overlay. Treat the section as deferred/unavailable to visitors until that overlay is intentionally changed. Once available, the underlying controls support previous/next video, playback, dossier content, and progress seeking.

## Documentation hub

```mermaid
flowchart TD
    catalog[Documentation catalog] -->|select a guide| markdown[Bundled Markdown guide]
    markdown -->|switch guide tab| markdown
    markdown -->|back| catalog
    catalog -->|select API reference| api[JSDoc iframe]
    api --> overlay[Under-refinement overlay]
    api -->|back| catalog
```

The three Markdown guides are bundled from `docs/` and shown in tabs by `DocsMarkdownView.jsx`. The JSDoc API reference is generated into `public/docs/jsdoc/` and embedded by `DocsJsDocView.jsx`; its iframe is intentionally dimmed and non-interactive while the guide is being refined. The guide header and back-to-catalog control remain available.
