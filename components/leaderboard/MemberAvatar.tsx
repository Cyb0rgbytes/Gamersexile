/* Discord avatar with a monogram fallback. Plain <img>: cdn.discordapp.com is
 * not in next.config `images.remotePatterns`, and Discord already serves the
 * requested size as webp, so the optimizer would add nothing but a hop.
 * Server- and client-safe (no hooks). */

const hueOf = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % 360;

interface MemberAvatarProps {
  name: string;
  src: string | null | undefined;
  /** Rendered size in px. */
  size?: number;
  /** Alt text. Empty when the name is printed right beside the avatar. */
  alt?: string;
  className?: string;
}

export function MemberAvatar({ name, src, size = 40, alt = "", className = "" }: MemberAvatarProps) {
  const base = `clip-notch-sm relative inline-grid shrink-0 place-items-center overflow-hidden bg-steel-hi ${className}`;

  if (src) {
    return (
      <span className={base} style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote Discord CDN, see note above */}
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      </span>
    );
  }

  const initial = ([...name.trim()][0] ?? "?").toUpperCase();
  return (
    <span
      className={base}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hueOf(name)} 45% 28%), hsl(${hueOf(name)} 35% 14%))`,
      }}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <span className="font-display font-bold text-bone" style={{ fontSize: size * 0.42 }}>
        {initial}
      </span>
    </span>
  );
}
