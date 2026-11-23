/* The "→" that trails link labels. Kept out of translated strings and
 * mirrored under dir="rtl", so it always points along the reading
 * direction. Decorative: the label beside it carries the meaning. */

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-block rtl:-scale-x-100 ${className}`}>
      →
    </span>
  );
}
