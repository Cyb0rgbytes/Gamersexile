import { useId } from "react";
import type { ReactionKind } from "@/lib/clips/constants";

/* ═══════════════════════════════════════════════════════════════════════════
 *  REACTION ICONS — original 24×24 inline SVGs, all drawn in currentColor.
 *
 *  respect  A hanko seal pressed slightly off-square, with 礼 (rei — respect,
 *           the bow) knocked OUT of the stamp through a mask, so the kanji is
 *           whatever sits behind it. The site's seal motif, made a button.
 *  gg       "GG" monogram in a hex badge.
 *  hype     Flame with an inner tongue.
 *  clutch   Crosshair with a filled centre.
 *  lol      Laughing face: squeezed-shut eyes, wide-open mouth.
 *
 *  Decorative: aria-hidden. The button around the icon carries the label.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface ReactionIconProps {
  kind: ReactionKind;
  size?: number;
  className?: string;
}

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ReactionIcon({ kind, size = 24, className = "" }: ReactionIconProps) {
  const maskId = useId();
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
    className,
  } as const;

  switch (kind) {
    case "respect":
      return (
        <svg {...common}>
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="white" />
              {/* 礼: the 礻 radical, then 乚 */}
              <g fill="none" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.7 5.5 8.9 6.7" />
                <path d="M5.5 8.6h4.7L6 13.3" />
                <path d="M8.3 11v7.6" />
                <path d="M9.2 12.3l1.5 1.3" />
                <path d="M13.4 5.3v11c0 1.2.6 1.8 1.7 1.8h2c.9 0 1.4-.5 1.5-1.6l.1-1.4" />
              </g>
            </mask>
          </defs>
          <rect
            x="2.6"
            y="2.6"
            width="18.8"
            height="18.8"
            rx="4.2"
            fill="currentColor"
            mask={`url(#${maskId})`}
            transform="rotate(-4 12 12)"
          />
        </svg>
      );

    case "gg":
      return (
        <svg {...common}>
          <path {...STROKE} strokeWidth={1.6} d="M12 2.6l8.4 4.7v9.4L12 21.4l-8.4-4.7V7.3Z" />
          <path {...STROKE} strokeWidth={1.7} d="M10.4 10.1a2.6 2.6 0 1 0 .8 2.2H9.3" />
          <path {...STROKE} strokeWidth={1.7} d="M17.1 10.1a2.6 2.6 0 1 0 .8 2.2H16" />
        </svg>
      );

    case "hype":
      return (
        <svg {...common}>
          <path
            {...STROKE}
            d="M12.2 2.6c.7 3.1-1.5 4.8-3 6.8C7.7 11.3 7 12.7 7 14.5a5 5 0 0 0 10 0c0-2.2-1-3.9-2.3-5.1-.2 1.4-.9 2.4-2 2.8.6-3.4-.1-6.6-.5-9.6Z"
          />
          <path
            fill="currentColor"
            d="M12 20.2a2.3 2.3 0 0 1-2.3-2.3c0-1.5 1.1-2.4 1.9-3.6.4 1 1.3 1.6 1.9 2.5.5.8.8 1.3.8 1.7a2.3 2.3 0 0 1-2.3 1.7Z"
          />
        </svg>
      );

    case "clutch":
      return (
        <svg {...common}>
          <circle {...STROKE} cx="12" cy="12" r="6.8" />
          <path {...STROKE} d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );

    case "lol":
      return (
        <svg {...common}>
          <circle {...STROKE} cx="12" cy="12" r="9.2" />
          <path {...STROKE} d="M7.3 10.2 8.9 8.6l1.6 1.6M13.5 10.2l1.6-1.6 1.6 1.6" />
          <path fill="currentColor" d="M7.4 13.2h9.2a4.6 4.6 0 0 1-9.2 0Z" />
        </svg>
      );
  }
}
