/* Uploader avatar: the Clerk image when there is one, else a monogram tile
 * on a hue derived from the name (same idea as the creator cards). */

interface AvatarProps {
  name: string;
  url: string | null;
  size?: number;
  className?: string;
}

function hueOf(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) % 360;
  return h;
}

export function Avatar({ name, url, size = 28, className = "" }: AvatarProps) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote Clerk avatar, already sized by Clerk's CDN
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={`shrink-0 rounded-full border border-steel-line object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  const hue = hueOf(name);
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border border-bone/15 font-display font-bold text-bone ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(135deg, oklch(0.5 0.15 ${hue}), oklch(0.3 0.1 ${(hue + 40) % 360}))`,
      }}
    >
      {[...name][0]?.toUpperCase() ?? "?"}
    </span>
  );
}
