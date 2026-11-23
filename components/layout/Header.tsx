import { getDictionary } from "@/lib/i18n/dictionaries";
import { AUTH_ENABLED } from "@/lib/auth/enabled";
import { HeaderBar } from "./HeaderBar";
import { HeaderAuth } from "./HeaderAuth";

/* Server half of the header: reads the dictionary and hands the strings to
 * the client bar (which owns the scroll state, the "More" dropdown and the
 * mobile menu). The auth area exists only when Clerk is configured. */

export async function Header() {
  const t = await getDictionary();

  const labels = {
    nav: t.common.nav,
    joinDiscord: t.common.cta.joinDiscord,
    joinTheDiscord: t.common.cta.joinTheDiscord,
    language: t.common.language,
    homeLabel: t.common.brand.homeLabel,
    emblemAlt: t.common.brand.emblemAlt,
  };

  return (
    <HeaderBar
      labels={labels}
      auth={AUTH_ENABLED ? <HeaderAuth signInLabel={t.common.auth.signIn} /> : null}
    />
  );
}
