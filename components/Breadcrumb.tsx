import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

/* §6.2 — the panel breadcrumb strip that opens every interior page, and the
 * BreadcrumbList JSON-LD that goes with it.
 *
 * Both come out of one `trail`, deliberately. They used to be declared
 * separately at each call site — the visible strip here, the schema through a
 * second `breadcrumbSchema()` call beside it — and the comment on this file
 * already claimed "the same trail a person reads is the one the crawler
 * reads". Nothing enforced that. Google treats a BreadcrumbList that does not
 * match the visible trail as a mismatch, and the failure is silent: the rich
 * result quietly stops appearing.
 *
 * So `href` is required on every crumb, including the last. The strip declines
 * to link the last one because it is the current page; the schema still needs
 * its URL, and asking for it once is what keeps the two halves the same shape.
 */

export type Crumb = { label: string; href: string };

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          trail.map((crumb) => ({ name: crumb.label, url: crumb.href })),
        )}
      />

      <nav aria-label="Sayfa yolu" className="bg-panel">
        <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-5 py-3 text-xs text-muted">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.label} className="flex items-center gap-2">
                {last ? (
                  <span className="text-cream-text" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-gold-soft"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
