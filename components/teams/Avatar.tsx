/* Member avatar: the Clerk image when there is one, otherwise initials on a
 * hue derived from the name, so a roster never shows broken images. A plain
 * <img> because avatar hosts are not configured for next/image. */

const hueOf = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % 360;

export function Avatar({
  name,
  src,
  size = 40,
  className = "",
}: {
  name: string;
  src: string | null;
  size?: number;
  className?: string;
}) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => [...w][0]?.toUpperCase() ?? "")
      .join("") || "?";

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-steel-line bg-void font-display text-[0.65rem] font-bold text-bone ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: src ? undefined : `oklch(0.38 0.1 ${hueOf(name)})`,
      }}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" width={size} height={size} loading="lazy" className="size-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
