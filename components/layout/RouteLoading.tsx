import { RedSun } from "@/components/art/RedSun";
import { getDictionary } from "@/lib/i18n/dictionaries";

/* Route loading state: one pulsing sun, not a spinner, announced for screen
 * readers. Not mounted at the [lang] root on purpose — a root loading.tsx
 * wraps every page in Suspense, so the response streams with a 200 before
 * notFound() can run and unknown URLs lose their 404 status. A segment that
 * really does load slowly opts in with a one-line loading.tsx:
 *
 *   export { RouteLoading as default } from "@/components/layout/RouteLoading";
 */

export async function RouteLoading() {
  const t = await getDictionary();

  return (
    <div role="status" className="flex min-h-[80svh] flex-col items-center justify-center gap-6">
      <div aria-hidden="true" className="size-24 animate-pulse">
        <RedSun glow />
      </div>
      <p className="font-display text-eyebrow tracking-eyebrow text-bone-faint uppercase">{t.errors.loading}</p>
    </div>
  );
}
