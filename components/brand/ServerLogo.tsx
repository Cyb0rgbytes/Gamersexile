import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════════════
 *  SERVER LOGO — the community's real emblem, animated.
 *
 *  Source: the server's animated GIF (246 frames, 4.8 MB, opaque grey
 *  background), re-encoded to animated WebP at two sizes (282 KB / 764 KB).
 *  The grey corners are cropped away by a circular mask with the image scaled
 *  so the emblem's dark disc fills the circle; an inset ring hides the last
 *  antialiased pixel of the edge.
 *
 *  `unoptimized`: the image optimizer would flatten the animation to a still
 *  frame, so the pre-sized WebP files are served as-is.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface ServerLogoProps {
  /** Rendered diameter in px. ≤ 48 uses the 96px file, larger the 192px. */
  size?: number;
  /** Ember glow around the disc (matches the logo's own orange arcs). */
  glow?: boolean;
  /** Above-the-fold instances (the header) should preload. */
  priority?: boolean;
  /** Pass the translated alt (common.brand.emblemAlt). The site name is a
   *  proper noun, so the English default reads acceptably everywhere. */
  alt?: string;
  className?: string;
}

export function ServerLogo({
  size = 40,
  glow = false,
  priority = false,
  alt = "Gamer's Exile emblem",
  className = "",
}: ServerLogoProps) {
  const src = size <= 48 ? "/brand/logo-anim-96.webp" : "/brand/logo-anim-192.webp";

  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-void ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: glow
          ? "0 0 18px rgb(255 122 40 / 0.45), 0 0 48px rgb(255 122 40 / 0.2)"
          : undefined,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        unoptimized
        priority={priority}
        className="size-full scale-[1.16] object-cover object-[50%_48%]"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_2px_#07060b]" />
    </span>
  );
}
