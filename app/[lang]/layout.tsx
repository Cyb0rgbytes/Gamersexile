import type { Metadata, Viewport } from "next";
import {
  Chakra_Petch,
  Inter,
  Zen_Kaku_Gothic_New,
  JetBrains_Mono,
  Yuji_Boku,
  IBM_Plex_Sans_Arabic,
  Noto_Sans_SC,
  Russo_One,
} from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { SITE } from "@/lib/site";
import { LOCALES, OG_LOCALE, dirOf, languageAlternates } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { AUTH_ENABLED } from "@/lib/auth/enabled";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NoiseDefs } from "@/components/ui/Texture";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { DiscordBeacon } from "@/components/ui/DiscordBeacon";

/* ── Fonts ─────────────────────────────────────────────────────────────────
 * Chakra Petch carries the display voice and Inter the body, but Chakra has
 * no Cyrillic, Arabic or CJK glyphs. Rather than switching families per
 * language, each script gets a fallback face later in the same font stack
 * (see --font-display / --font-sans in globals.css); the browser falls
 * through per glyph. Fallback faces use unicode-range files and are not
 * preloaded, so an English visitor downloads none of them. */

const chakra = Chakra_Petch({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-chakra",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const zen = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zen",
  weight: ["400", "500", "700"],
});

const yuji = Yuji_Boku({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-yuji",
  weight: "400",
  preload: false,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

/** Arabic: body and display (Plex Arabic pairs with Inter's proportions). */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

/** Simplified Chinese. */
const notoSc = Noto_Sans_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sc",
  weight: ["400", "500", "700"],
  preload: false,
});

/** Cyrillic display face: squared, technical, close to Chakra Petch. */
const russo = Russo_One({
  subsets: ["cyrillic"],
  display: "swap",
  variable: "--font-cyrillic-display",
  weight: "400",
  preload: false,
});

const fontVars = [chakra, inter, zen, yuji, jetbrains, plexArabic, notoSc, russo]
  .map((f) => f.variable)
  .join(" ");

/* Pre-render every language at build time. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  const title = `${SITE.name} — ${t.common.meta.tagline}`;

  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: `%s — ${SITE.name}` },
    description: t.common.meta.description,
    alternates: { canonical: `/${locale}`, languages: languageAlternates("/") },
    keywords: t.common.meta.keywords,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: `${SITE.url}/${locale}`,
      siteName: SITE.name,
      title,
      description: t.common.meta.description,
    },
    twitter: { card: "summary_large_image", title, description: t.common.meta.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#07060B",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const t = await getDictionary();

  /* Organization markup: ties name, logo and social profiles together. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    alternateName: SITE.nameJp,
    description: t.common.meta.description,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo.jpg`,
    email: SITE.email,
    sameAs: Object.values(SITE.social),
  };

  return (
    /* No scroll-behavior anywhere: Lenis owns scrolling. */
    <html lang={locale} dir={dirOf(locale)} className={fontVars}>
      <body className="bg-void text-bone-dim antialiased">
        <AuthProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* SVG filter and pattern definitions, instantiated once. */}
          <NoiseDefs />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-100 focus:bg-crimson focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            {t.common.skipToContent}
          </a>

          <SmoothScroll>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>

          <DiscordBeacon />

          <PlaceholderNotice />
        </AuthProvider>
      </body>
    </html>
  );
}

/** <ClerkProvider> only when Clerk keys are configured. */
function AuthProvider({ children }: { children: React.ReactNode }) {
  return AUTH_ENABLED ? <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider> : <>{children}</>;
}
