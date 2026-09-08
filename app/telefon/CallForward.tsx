"use client";

import { useEffect, useState } from "react";

import { phoneHref } from "@/lib/config";

/* Fires the `tel:` link on load.
 *
 * Same shape as yol-tarifi/DirectionsForward, and same reasoning: this is a
 * page rather than a redirect so that it renders, because Vercel Web Analytics
 * counts page views from a script on a rendered page and a redirect renders
 * nothing. Browsers also disagree about redirecting to a `tel:` URL, which is
 * the reason specific to this route.
 *
 * `assign`, not `replace`. `/yol-tarifi` uses `replace` because it navigates to
 * a real web page and Back should skip the hop. A `tel:` handoff does not
 * navigate at all — the page stays where it is while the dialer opens over it —
 * so there is no forward history entry to worry about, and `replace` would
 * throw away the entry the visitor needs in order to get back to the product
 * they were looking at.
 */
export function CallForward() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    /* Nothing paints before this on a fast connection, which is the intent:
     * the visitor pressed a call button and should get a dialer, not a page.
     * On desktop nothing happens at all — `tel:` has no handler — so the
     * message below and the number itself are the whole experience there. */
    const timer = window.setTimeout(() => setFailed(true), 2500);
    window.location.assign(phoneHref);

    return () => window.clearTimeout(timer);
  }, []);

  if (!failed) return null;

  return (
    <p className="mt-4 text-sm text-gold-soft">
      Telefon uygulaması açılmadı. Numarayı aşağıdan arayabilir veya
      kopyalayabilirsiniz.
    </p>
  );
}
