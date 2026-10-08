import React, { useState, useEffect, useRef } from "react";
import jsmediatags from "jsmediatags";
import {
  INITIAL_ALBUMS_DATA,
  VIDEOS_DATA,
  CONTENT_DATA,
  POEMS_DATA,
  PHOTOGRAPHY_DATA,
} from "./data/index";

import Navbar from "./components/layout/Navbar.jsx";
import CornerFrame from "./components/layout/CornerFrame.jsx";
import SubPageCornerFrame from "./components/layout/SubPageCornerFrame.jsx";
import MiniPlayer from "./components/widgets/MiniPlayer.jsx";
import WelcomeScreen from "./components/widgets/WelcomeScreen.jsx";

import MusicCatalogView from "./views/MusicCatalogView.jsx";
import MusicDetailView from "./views/MusicDetailView.jsx";
import VideographyView from "./views/VideographyView.jsx";
import PoetryCatalogView from "./views/PoetryCatalogView.jsx";
import PoetryDetailView from "./views/PoetryDetailView.jsx";
import PhotographyView from "./views/PhotographyView.jsx";
import PhotographyDetailView from "./views/PhotographyDetailView.jsx";
import LinksView from "./views/LinksView.jsx";

import { useSoundFX } from "./hooks/useSoundFX";
import CustomCursor from "./components/widgets/CustomCursor.jsx";
import DocsMarkdownView from "./views/DocsMarkdownView.jsx";
import DocsJsDocView from "./views/DocsJsDocView.jsx";
import DocsCatalogView from "./views/DocsCatalogView.jsx";

/**
 * Coordinates section navigation, transitions, view selection, and media state.
 * @returns {React.ReactElement}
 */
export default function App() {
  const [appState, setAppState] = useState("welcome");
  const [activeTab, setActiveTab] = useState("home");
  const [musicView, setMusicView] = useState("catalog");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [transitionPhase, setTransitionPhase] = useState("closing");

  const [docsView, setDocsView] = useState("catalog"); // "catalog" | "markdown" | "jsdoc"
  const [selectedDoc, setSelectedDoc] = useState("architecture");

  const [poetryView, setPoetryView] = useState("catalog"); // "catalog" or "detail"
  const [selectedPoem, setSelectedPoem] = useState(null);

  useSoundFX(transitionPhase);
  const mouse = useRef({ x: 0, y: 0 });

  const [albumsData, setAlbumsData] = useState(INITIAL_ALBUMS_DATA);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isDossierFlipped, setIsDossierFlipped] = useState(false);
  const videoPlayerRef = useRef(null);

  const [photographyView, setPhotographyView] = useState("catalog");
  const [selectedMedium, setSelectedMedium] = useState(null);

  /** Tracks the responsive mode that determines where music controls are shown. */
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [isAutoStart, setIsAutoStart] = useState(false);
  useEffect(() => {
    /** @returns {void} Synchronizes responsive state with the current viewport. */
    const checkMobileLandscape = () => {
      setIsMobileLandscape(
        window.matchMedia("(max-width: 1023px) and (orientation: landscape)")
          .matches,
      );
    };

    checkMobileLandscape();
    window.addEventListener("resize", checkMobileLandscape);
    window.addEventListener("orientationchange", checkMobileLandscape);
    return () => {
      window.removeEventListener("resize", checkMobileLandscape);
      window.removeEventListener("orientationchange", checkMobileLandscape);
    };
  }, []);

  useEffect(() => {
    const updatedAlbums = JSON.parse(JSON.stringify(INITIAL_ALBUMS_DATA));

    updatedAlbums.forEach(async (album, albumIndex) => {
      if (album.tracks.length > 0) {
        try {
          const response = await fetch(album.tracks[0].audioUrl);
          const blob = await response.blob();

          jsmediatags.read(blob, {
            onSuccess: (tag) => {
              const picture = tag.tags.picture;
              if (picture) {
                let base64String = "";
                for (let i = 0; i < picture.data.length; i++) {
                  base64String += String.fromCharCode(picture.data[i]);
                }
                const base64Url = `data:${picture.format};base64,${btoa(base64String)}`;
                setAlbumsData((prev) => {
                  const next = [...prev];
                  next[albumIndex].coverUrl = base64Url;
                  return next;
                });
              }
            },
            onError: (err) => console.log("ID3 tag read error:", err),
          });
        } catch (e) {
          console.log("Could not fetch track for cover art:", e);
        }
      }

      album.tracks.forEach((track, trackIndex) => {
        const audio = new Audio(track.audioUrl);
        audio.onloadedmetadata = () => {
          const mins = Math.floor(audio.duration / 60);
          const secs = Math.floor(audio.duration % 60)
            .toString()
            .padStart(2, "0");
          const formattedDuration = `${mins}:${secs}`;

          setAlbumsData((prev) => {
            const next = [...prev];
            next[albumIndex].tracks[trackIndex].duration = formattedDuration;
            return next;
          });
        };
      });
    });
  }, []);

  /**
   * Opens a poem after the shared transition finishes its closing phase.
   * @param {Object} poem The selected poem record.
   * @returns {void}
   */
  const handleSelectPoem = (poem) => {
    if (transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setSelectedPoem(poem);
      setPoetryView("detail");
      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => setTransitionPhase("idle"), 500);
      }, 400);
    }, 500);
  };

  /**
   * Returns to the poetry catalog and clears the selected poem.
   * @returns {void}
   */
  const handleBackToPoetryCatalog = () => {
    if (transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setPoetryView("catalog");
      setSelectedPoem(null);
      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => setTransitionPhase("idle"), 500);
      }, 400);
    }, 500);
  };

  const handleSelectDoc = (doc) => {
    if (transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setSelectedDoc(doc.id);
      setDocsView(doc.type === "jsdoc" ? "jsdoc" : "markdown");
      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => setTransitionPhase("idle"), 500);
      }, 400);
    }, 500);
  };

  // Handler for returning to catalog
  const handleBackToDocsCatalog = () => {
    if (transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setDocsView("catalog");
      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => setTransitionPhase("idle"), 500);
      }, 400);
    }, 500);
  };

  /**
   * Toggles the active track or replaces it, keeping the shared player in sync.
   * @param {{ title: string, audioUrl: string }} track Track to play or pause.
   * @param {{ title: string }} album Album containing the track.
   * @returns {void}
   */
  const handlePlayTrack = (track, album) => {
    const audioPath = track.audioUrl;
    if (currentTrack?.title === track.title && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioPath;
        audioRef.current.play();
      } else {
        const audio = new Audio(audioPath);
        audioRef.current = audio;
        audio.play();
      }
      setCurrentTrack({ ...track, albumTitle: album.title });
      setIsPlaying(true);
    }
  };

  /**
   * Stops playback, resets the audio position, and clears the active track.
   * @param {React.SyntheticEvent} [event] Optional event to stop bubbling.
   * @returns {void}
   */
  const handleStopMusic = (event) => {
    event?.stopPropagation();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  useEffect(() => {
    /** @param {MouseEvent} event Pointer event used to normalize scene coordinates. @returns {void} */
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [unlockedAlbums, setUnlockedAlbums] = useState(() => {
    const saved = localStorage.getItem("unlocked_albums");
    return saved ? JSON.parse(saved) : [];
  });

  /** Completes the welcome transition and marks the site as entered. @returns {void} */
  const handleEnterSite = () => {
    if (appState !== "welcome") return;
    setAppState("opening");
    setTransitionPhase("opening");
    setTimeout(() => {
      setTransitionPhase("idle");
      setAppState("entered");
    }, 500);
  };

  /**
   * Switches sections while idle and resets catalog/detail selections.
   * @param {string} newKey Key of the destination section.
   * @returns {void}
   */
  const handleNavigation = (newKey) => {
    if (newKey === activeTab || transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setActiveTab(newKey);
      setMusicView("catalog");
      setSelectedAlbum(null);
      setPhotographyView("catalog");
      setSelectedMedium(null);
      setPoetryView("catalog");
      setSelectedPoem(null);
      setDocsView("catalog");
      setSelectedDoc("architecture");

      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => setTransitionPhase("idle"), 500);
      }, 400);
    }, 500);
  };

  /**
   * Opens an album detail view after the section transition closes.
   * @param {{ title: string, tracks: Array<Object> }} album Selected album.
   * @returns {void}
   */
  const handleSelectAlbum = (album) => {
    if (transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setSelectedAlbum(album);
      setMusicView("detail");
      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => {
          setTransitionPhase("idle");
        }, 500);
      }, 400);
    }, 500);
  };

  /** Returns from album details to the music catalog. @returns {void} */
  const handleBackToCatalog = () => {
    if (transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setMusicView("catalog");
      setSelectedAlbum(null);
      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => {
          setTransitionPhase("idle");
        }, 500);
      }, 400);
    }, 500);
  };

  /**
   * Opens a photography medium after the shared transition closes.
   * @param {string} medium Photography collection key.
   * @returns {void}
   */
  const handleSelectMedium = (medium) => {
    if (transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setSelectedMedium(medium);
      setPhotographyView("detail");
      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => {
          setTransitionPhase("idle");
        }, 500);
      }, 400);
    }, 500);
  };

  /** Returns from a photography medium to the selector. @returns {void} */
  const handleBackToPhotographyCatalog = () => {
    if (transitionPhase !== "idle") return;
    setTransitionPhase("closing");
    setTimeout(() => {
      setPhotographyView("catalog");
      setSelectedMedium(null);
      setTransitionPhase("loading");
      setTimeout(() => {
        setTransitionPhase("opening");
        setTimeout(() => {
          setTransitionPhase("idle");
        }, 500);
      }, 400);
    }, 500);
  };

  const activeContent = CONTENT_DATA[activeTab] || CONTENT_DATA.home;

  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);

  /** Selects the previous poem, wrapping from the first to the last. @returns {void} */
  const handlePrevPoem = () => {
    setCurrentPoemIndex((prev) =>
      prev === 0 ? POEMS_DATA.length - 1 : prev - 1,
    );
  };

  /** Selects the next poem, wrapping from the last to the first. @returns {void} */
  const handleNextPoem = () => {
    setCurrentPoemIndex((prev) =>
      prev === POEMS_DATA.length - 1 ? 0 : prev + 1,
    );
  };

  /** Keeps the shared controls available when the section player is hidden. */
  const showFloatingPlayer =
    Boolean(currentTrack) && (activeTab !== "music" || isMobileLandscape);

  /** Advances the video selection and resets playback and dossier state. @returns {void} */
  const handleNextVideo = () => {
    setIsVideoPlaying(false);
    setIsDossierFlipped(false);
    setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS_DATA.length);
  };

  /** Moves to the prior video and resets playback and dossier state. @returns {void} */
  const handlePrevVideo = () => {
    setIsVideoPlaying(false);
    setIsDossierFlipped(false);
    setCurrentVideoIndex(
      (prev) => (prev - 1 + VIDEOS_DATA.length) % VIDEOS_DATA.length,
    );
  };

  /**
   * Maps a section key to its decorative 3D shape.
   * @param {string} tab Active section key.
   * @returns {string} Shape name, defaulting to the home shape.
   */
  const getActiveShape = (tab) => {
    switch (tab) {
      case "home":
        return "torus";
      case "music":
        return "icosahedron";
      case "poetry":
        return "octahedron";
      case "photography":
      case "videography":
        return "dodecahedron";
      case "links":
        return "torus";
      default:
        return "torus";
    }
  };



  // Accept only known section keys from query strings or hashes.
  useEffect(() => {
    /** Reads one supported deep-link target and applies it before first render settles. @returns {void} */
    const handleDeepLink = () => {
      const params = new URLSearchParams(window.location.search);
      const queryTarget = params.get("page") || params.get("tab");
      const hashTarget = window.location.hash.replace("#", "");
      const target = (queryTarget || hashTarget)?.toLowerCase();

      const unlockTarget = params.get("unlock");
      if (unlockTarget) {
        setUnlockedAlbums((prev) => {
          const updated = prev.includes(unlockTarget) ? prev : [...prev, unlockTarget];
      
          localStorage.setItem("unlocked_albums", JSON.stringify(updated));
        return updated;
        }
      );
      }

      const validTabs = [
        "home",
        "music",
        "videography",
        "poetry",
        "photography",
        "links",
        "documentation",
      ];

      if (target && validTabs.includes(target)) {
        setActiveTab(target);
        setIsAutoStart(true);
      }
    };

    handleDeepLink();
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-[#0a0a0c] text-white select-none font-sans overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <CustomCursor />

      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTrack(null);
        }}
      />

      {activeTab === "home" ||
      (activeTab === "music" && musicView === "catalog") ||
      (activeTab === "poetry" && poetryView === "catalog") ||
      (activeTab === "photography" && photographyView === "catalog") ||
      (activeTab === "documentation" && docsView === "catalog") ||
      activeTab === "links" ? (
        <CornerFrame
          transitionPhase={transitionPhase}
          mouse={mouse}
          activeTab={activeTab}
          shape={getActiveShape(activeTab)}
          hasEntered={appState === "entered"}
        >
          {activeTab === "home" && (
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.25em] text-white/50 uppercase mb-4">
                {activeContent.subtitle}
              </p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
                {activeContent.title}
              </h1>
              <p className="text-sm tracking-wide text-white/60">
                {activeContent.description}
              </p>
            </div>
          )}

          {activeTab === "music" && musicView === "catalog" && (
            <MusicCatalogView
              albumsData={albumsData}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onStopMusic={handleStopMusic}
              onSelectAlbum={handleSelectAlbum}
              unlockedAlbums={unlockedAlbums}
            />
          )}

          {activeTab === "poetry" && poetryView === "catalog" && (
            <PoetryCatalogView
              POEMS_DATA={POEMS_DATA}
              onSelectPoem={handleSelectPoem}
            />
          )}

          {activeTab === "photography" && photographyView === "catalog" && (
            <PhotographyView
              onSelectMedium={handleSelectMedium}
              PHOTOGRAPHY_DATA={PHOTOGRAPHY_DATA}
            />
          )}

          {activeTab === "documentation" && docsView === "catalog" && (
            <DocsCatalogView onSelectDoc={handleSelectDoc} />
          )}

          {activeTab === "links" && <LinksView />}
        </CornerFrame>
      ) : (
        <SubPageCornerFrame transitionPhase={transitionPhase}>
          {activeTab === "videography" && (
            <VideographyView
              VIDEOS_DATA={VIDEOS_DATA}
              currentVideoIndex={currentVideoIndex}
              isVideoPlaying={isVideoPlaying}
              isDossierFlipped={isDossierFlipped}
              videoPlayerRef={videoPlayerRef}
              onPrevVideo={handlePrevVideo}
              onNextVideo={handleNextVideo}
              onToggleVideoPlay={(val) => {
                if (val) {
                  handleStopMusic();
                }
                setIsVideoPlaying(val);
              }}
              onToggleDossier={() => setIsDossierFlipped(!isDossierFlipped)}
            />
          )}

          {activeTab === "music" && musicView === "detail" && selectedAlbum && (
            <MusicDetailView
              selectedAlbum={selectedAlbum}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              mouse={mouse}
              onBackToCatalog={handleBackToCatalog}
              onPlayTrack={handlePlayTrack}
              onStopMusic={handleStopMusic}
            />
          )}

          {activeTab === "photography" && photographyView === "detail" && (
            <PhotographyDetailView
              mediumTitle={selectedMedium?.toUpperCase()}
              photos={PHOTOGRAPHY_DATA[selectedMedium] || []}
              onBackToCatalog={handleBackToPhotographyCatalog}
            />
          )}
          {activeTab === "poetry" &&
            poetryView === "detail" &&
            selectedPoem && (
              <PoetryDetailView
                activePoem={selectedPoem}
                onBackToCatalog={handleBackToPoetryCatalog}
                onStopMusic={handleStopMusic}
              />
            )}

          {activeTab === "documentation" && docsView === "markdown" && (
            <DocsMarkdownView
              activeDocId={selectedDoc}
              onSelectDocId={setSelectedDoc}
              onBackToCatalog={handleBackToDocsCatalog}
            />
          )}

          {activeTab === "documentation" && docsView === "jsdoc" && (
            <DocsJsDocView onBackToCatalog={handleBackToDocsCatalog} />
          )}
        </SubPageCornerFrame>
      )}

      <MiniPlayer
        showFloatingPlayer={showFloatingPlayer}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (audioRef.current) {
            if (isPlaying) {
              audioRef.current.pause();
              setIsPlaying(false);
            } else {
              audioRef.current.play();
              setIsPlaying(true);
            }
          }
        }}
        onStopMusic={handleStopMusic}
      />

      {appState === "welcome" && (
        <WelcomeScreen onEnter={handleEnterSite} autoStart={isAutoStart} />
      )}

      {activeTab === "videography" && (
        <div className="hidden max-lg:landscape:flex lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] items-center gap-2 bg-black/85 p-2 rounded-lg border border-white/30 backdrop-blur-md shadow-2xl pointer-events-auto">
          <button
            onClick={handlePrevVideo}
            className="w-10 h-10 border border-white/30 bg-[#14151a] hover:border-white/70 active:scale-95 flex items-center justify-center cursor-pointer text-white font-bold text-sm transition-all"
            aria-label="Previous Video"
          >
            ←
          </button>
          <button
            onClick={handleNextVideo}
            className="w-10 h-10 border border-white/30 bg-[#14151a] hover:border-white/70 active:scale-95 flex items-center justify-center cursor-pointer text-white font-bold text-sm transition-all"
            aria-label="Next Video"
          >
            →
          </button>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        onSelectTab={handleNavigation}
        isTransitioning={transitionPhase !== "idle"}
        hasEntered={appState === "entered"}
      />
    </div>
  );
}
