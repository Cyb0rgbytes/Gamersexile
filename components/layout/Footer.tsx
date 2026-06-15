import Link from "next/link";
import {
  Twitch,
  Youtube,
  Instagram,
  MessageCircle,
  Music2,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/games" },
  { label: "Streamers", href: "/streamers" },
  { label: "Community", href: "/community" },
];

const socialLinks = [
  { icon: <Twitch size={18} />, href: "#", label: "Twitch" },
  { icon: <Youtube size={18} />, href: "#", label: "YouTube" },
  { icon: <Music2 size={18} />, href: "#", label: "TikTok" },
  { icon: <MessageCircle size={18} />, href: "#", label: "Discord" },
  { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 bg-exile-surface">
      {/* Accent line at the very top */}
      <div className="accent-line" />

      <div className="px-4 sm:px-6 lg:px-12 xl:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Logo + Tagline */}
          <div>
            <Link href="/" className="flex items-center gap-0.5">
              <span className="font-display font-bold text-xl uppercase tracking-wider text-white">
                GAMERS
              </span>
              <span className="font-display font-bold text-xl uppercase tracking-wider text-exile-accent">
                EXILE
              </span>
            </Link>
            <p className="text-exile-muted text-sm mt-3 max-w-xs">
              Where gamers become legends and streamers build their empire. A
              community-first platform for competitive gaming.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col items-start md:items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-exile-muted text-sm hover:text-exile-accent transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col items-start md:items-end">
            <p className="font-display font-semibold text-sm uppercase tracking-wider text-exile-text mb-4">
              Connect
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-sm bg-exile-surface-2 text-exile-muted hover:text-exile-accent hover:bg-exile-accent/10 transition-all duration-200 border border-exile-border hover:border-exile-accent/30"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-exile-border px-4 sm:px-6 lg:px-12 xl:px-24 py-4">
        <p className="text-exile-muted text-xs font-mono text-center">
          © {new Date().getFullYear()} Gamers Exile. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
