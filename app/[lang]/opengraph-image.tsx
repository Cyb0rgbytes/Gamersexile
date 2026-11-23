import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Social card.
 *
 * Satori (the renderer behind ImageResponse) supports only a subset of CSS —
 * no clip-path, no CSS custom properties, no external stylesheets — so the
 * design tokens are inlined as literals here and the notched geometry is
 * approximated with borders. The emblem is drawn as inline SVG rather than
 * imported from LogoMark, whose filters and gradients Satori would drop.
 *
 * No Japanese glyphs on this card: Satori needs the font binary embedded to
 * render them, and fetching a JP font at build time for two characters is not
 * worth the weight.
 *
 * Language: the only font is the one bundled with next/og (Geist), which
 * covers Latin and Cyrillic but not Arabic or CJK. Those locales would render
 * as empty boxes, so they get the English card. */

/** Locales whose script the bundled OG font can draw. */
const OG_SCRIPT_OK: readonly Locale[] = ["en", "de", "ru", "es", "fr"];

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) && OG_SCRIPT_OK.includes(lang) ? lang : DEFAULT_LOCALE;
  const t = await getDictionaryFor(locale);
  const { headline, highlightIndex } = t.home.hero;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#07060B",
          backgroundImage:
            "radial-gradient(circle at 78% 32%, rgba(255,106,31,0.30), transparent 55%), radial-gradient(circle at 12% 88%, rgba(59,76,122,0.28), transparent 55%)",
        }}
      >
        {/* Emblem */}
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <svg width="76" height="76" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#342E44"
              strokeWidth="8"
            />
            <path
              d="M170 62 A78 78 0 0 1 178 108"
              fill="none"
              stroke="#E11D48"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M30 138 A78 78 0 0 1 22 92"
              fill="none"
              stroke="#E11D48"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="66" fill="#13111B" />
            <g
              fill="none"
              stroke="#F4F2F7"
              strokeWidth="9"
              strokeLinecap="round"
            >
              <path d="M118 82 A24 24 0 1 0 118 118" />
              <path d="M118 118 L118 102 L104 102" />
              <path d="M140 78 L140 122" />
              <path d="M140 78 L160 78" />
              <path d="M140 100 L154 100" />
              <path d="M140 122 L160 122" />
            </g>
          </svg>

          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#F4F2F7",
              letterSpacing: "0.16em",
            }}
          >
            GAMER&apos;S EXILE
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: "56px",
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "#F4F2F7",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {headline.map((word, i) => (
            <span
              key={i}
              style={{
                color: i === highlightIndex ? "#E11D48" : "#F4F2F7",
                marginRight: i < headline.length - 1 ? "0.26em" : 0,
              }}
            >
              {word.toUpperCase()}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: "36px",
            fontSize: 27,
            color: "#B0ABBD",
            maxWidth: "860px",
          }}
        >
          {t.home.og.lead}
        </div>

        {/* Footer rule */}
        <div
          style={{
            marginTop: "52px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 21,
            letterSpacing: "0.2em",
            color: "#8A849A",
          }}
        >
          <div style={{ width: "64px", height: "2px", background: "#E11D48" }} />
          {t.home.og.footer.toUpperCase()}
        </div>
      </div>
    ),
    size,
  );
}
