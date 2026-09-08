"use client";

import { useEffect, useState } from "react";

import { directions, type MapsApp } from "@/lib/config";

/* Reads ?app= and leaves.
 *
 * `window.location.search` rather than `useSearchParams()`. The hook opts the
 * page into dynamic rendering unless it is wrapped in Suspense, and this page
 * has to stay prerendered — hard rule 9, and the whole reason this is a page
 * rather than the route handler that would be the obvious implementation.
 * Reading the string in an effect keeps the route a plain ○ in the build.
 *
 * `replace`, not `assign`: this page is a hop, and Back should return to the
 * page the visitor pressed the button on, not bounce them forward again.
 *
 * An unknown or absent `app` falls through to Google, which is the same
 * default the button itself uses.
 */
export function DirectionsForward() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const app = new URLSearchParams(window.location.search).get("app");
    const target: MapsApp = app === "apple" ? "apple" : "google";

    /* If the navigation has not taken by now the visitor is stuck looking at
     * a page that says "yönlendiriliyorsunuz" and does nothing, so say so and
     * let the links below do the job. */
    const timer = window.setTimeout(() => setFailed(true), 2500);
    window.location.replace(directions[target]);

    return () => window.clearTimeout(timer);
  }, []);

  if (!failed) return null;

  return (
    <p className="mt-4 text-sm text-gold-soft">
      Otomatik yönlendirme çalışmadı. Aşağıdaki bağlantılardan birini kullanın.
    </p>
  );
}
