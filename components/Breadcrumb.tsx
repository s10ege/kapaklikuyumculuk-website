import Link from "next/link";

/* §6.2 — the charcoal breadcrumb strip that opens every category page.
 *
 * Also the visible half of the BreadcrumbList JSON-LD added in iteration 14:
 * the same trail a person reads is the one the crawler reads.
 */

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="bg-charcoal">
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-5 py-3 text-xs text-cream/60">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.label} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-gold-soft"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={last ? "text-cream/90" : undefined}
                  aria-current={last ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
