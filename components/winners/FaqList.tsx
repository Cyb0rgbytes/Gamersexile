import type { FaqItem } from "@/types";

/* FAQ as native <details>/<summary> disclosures. Chosen over the shared
 * Accordion for this page because (1) every answer stays in the server HTML
 * even while collapsed, matching the FAQPage JSON-LD exactly, and (2) it uses
 * logical alignment, so it reads correctly in RTL. Keyboard and screen-reader
 * behaviour is the browser's own. */

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-steel-line border-y border-steel-line">
      {items.map((item, i) => (
        <details key={item.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-start [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-base font-semibold tracking-wide text-bone transition-colors group-open:text-crimson-hot">
              {item.q}
            </h3>
            {/* Plus that turns into a minus. */}
            <span aria-hidden="true" className="relative grid size-6 shrink-0 place-items-center">
              <span className="absolute h-px w-3.5 bg-bone-faint group-open:bg-crimson" />
              <span className="absolute h-px w-3.5 rotate-90 bg-bone-faint transition-transform duration-300 group-open:rotate-0 group-open:opacity-0" />
            </span>
          </summary>
          <p className="pe-10 pb-6 text-bone-dim">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
