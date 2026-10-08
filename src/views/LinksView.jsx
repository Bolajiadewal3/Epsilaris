import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaSpotify,
  FaSoundcloud,
  FaYoutube,
  FaTiktok,
  FaCube,
} from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";
import { TbBook } from "react-icons/tb";
import { FiMail, FiExternalLink } from "react-icons/fi";

const LINKS_DATA = [
  {
    category: "DEVELOPMENT & ENGINEERING",
    links: [
      {
        title: "Celestaris // 3D WebGL Portfolio",
        url: "https://bolajiadewal3.github.io/Celestaris/",
        description:
          "Interactive WebGL dioramas, 3D visualizers, and spatial web experiments.",
        icon: FaCube,
      },
      {
        title: "GitHub",
        url: "https://github.com/Bolajiadewal3",
        description:
          "Open-source repositories, full-stack applications, and interactive web projects.",
        icon: FaGithub,
      },
      {
        title: "LinkedIn",
        url: "https://www.linkedin.com/in/mobolaji-adewale/",
        description:
          "Professional background, software engineering, and industry experience.",
        icon: FaLinkedin,
      },
    ],
  },
  {
    category: "MUSIC & AUDIO",
    links: [
      {
        title: "Spotify",
        url: "https://open.spotify.com/artist/7uVl4cQoiYTdYJyyOPSQZR",
        description:
          "Official discography, single releases, and curated listening collections.",
        icon: FaSpotify,
      },
      {
        title: "SoundCloud",
        url: "https://soundcloud.com/mobolaji-adewale",
        description:
          "Demos, unreleased audio cuts, mixing experiments, and WIP tracks.",
        icon: FaSoundcloud,
      },
    ],
  },
  {
    category: "PUBLICATIONS & VISUAL MEDIA",
    links: [
      {
        title: "Substack",
        url: "https://substack.com/@mobolajiadewale",
        description:
          "Long-form essays, creative writing, dev notes, and newsletter releases.",
        icon: SiSubstack,
      },
      {
        title: "Kreatif Zine // Winter 2026 Feature",
        url: "https://kreatifzine.com/writers/writers-winter-2026/mobolaji-adewale-england/",
        description:
          "Featured literary poetry contribution and writer spotlight.",
        icon: TbBook,
      },
      {
        title: "TikTok",
        url: "http://tiktok.com/@mobolajiadewale",
        description:
          "Short-form visual snippets, audio previews, creative process clips, and reels.",
        icon: FaTiktok,
      },
      {
        title: "YouTube Channel",
        url: "https://www.youtube.com/@mobolajiadewale",
        description:
          "Short films, video essays (coming soon), creative process vlogs (also coming soon), and visual reels.",
        icon: FaYoutube,
      },
      {
        title: "Instagram",
        url: "https://www.instagram.com/bolaji.ad/",
        description:
          "Behind-the-scenes footage, visual aesthetics, photography, and daily updates.",
        icon: FaInstagram,
      },
    ],
  },
  {
    category: "DIRECT CONTACT & INQUIRIES",
    links: [
      {
        title: "Email & Collaborations",
        url: "mailto:bolajidgs@gmail.com",
        description:
          "Reach out directly for freelance web development, sound design, or creative projects.",
        icon: FiMail,
      },
    ],
  },
];

/**
 * Renders the external portfolio, publication, and contact destinations.
 * @returns {React.ReactElement}
 */
export default function LinksView() {
  return (
    <div className="flex flex-col h-full justify-between overflow-y-auto min-h-0 pb-20 lg:pb-6 pr-1 sm:pr-2 yellow-dot-scrollbar">
      <div className="space-y-6 my-auto">
        {LINKS_DATA.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] tracking-[0.25em] text-yellow-400 uppercase font-bold border-b border-white/10 pb-1">
              {group.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.links.map((item, linkIdx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={linkIdx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#14151a] border border-white/10 hover:border-yellow-400/60 p-4 transition-all duration-300 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-white/50 group-hover:text-yellow-400 transition-colors shrink-0" />
                        <h4 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <FiExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-yellow-400 transition-colors shrink-0" />
                    </div>
                    <p className="text-xs text-white/60 font-mono leading-relaxed pl-6">
                      {item.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
