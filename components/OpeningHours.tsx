"use client";

import { useSyncExternalStore } from "react";

import { getCurrentSeason, hours, seasons, type Season } from "@/lib/config";

/* Opening hours, both seasons, on every surface that shows them.
 *
 * THE PROBLEM THIS SOLVES. The shop closes at 19:00 in summer and 18:00 in
 * winter, and the site is statically generated — so a page built in August
 * would still be telling a December visitor the shop is open until seven. The
 * usual fix is to compute the season at request time, which costs the static
 * build. The better fix is to stop hiding one of the two: publish both, all
 * year, and let today's date decide only which one is emphasised.
 *
 * WHAT RENDERS WITHOUT JAVASCRIPT. Both seasons, in calendar order, each with
 * its months spelled out in the label — "Yaz (Mayıs–Eylül)". That page is
 * complete and correct on its own; a visitor reads two lines instead of one
 * and knows which applies today, because they know what month it is. Nothing
 * below is load-bearing.
 *
 * WHAT HYDRATION ADDS. The current season moves to the top and takes the
 * emphasis, and a "Şu an geçerli" label appears beside it. The server cannot
 * know the visitor's date, so rendering anything date-dependent on the first
 * pass would be a hydration mismatch — `null` until hydrated is the honest
 * initial state.
 *
 * `useSyncExternalStore` rather than an effect writing state. It is the API
 * built for exactly this shape: a value the server and the client disagree
 * about, where the server's answer must render first and the client's must
 * replace it during hydration. The store never actually changes — `subscribe`
 * returns an unsubscribe that does nothing — so this is the read half of the
 * hook only, and the season is a string primitive, which is the stable
 * snapshot the hook requires.
 */

/* Never fires. The season changes twice a year, not while a page is open, and
 * a subscription that could deliver an update would be a lie about what this
 * store does. */
const subscribe = () => () => {};
const readSeason = () => getCurrentSeason();
const serverSnapshot = () => null;
export function OpeningHours({
  tone = "dark",
  className = "",
}: {
  /** `dark` for the espresso room, `cream` for the footer's frame band. */
  tone?: "dark" | "cream";
  className?: string;
}) {
  /* null on the server and through the first client render; today's season
   * from hydration onward. See the note above. */
  const current = useSyncExternalStore<Season | null>(
    subscribe,
    readSeason,
    serverSnapshot,
  );

  /* Summer first before hydration (the `seasons` order), current season first
   * after. Sorting rather than branching keeps one list and one render path. */
  const ordered =
    current === null
      ? seasons
      : [...seasons].sort((a) => (a === current ? -1 : 1));

  /* Both seasons keep the same six days today, so printing "Pazartesi–
   * Cumartesi" twice would be noise. Hoisted only while they agree — if
   * Saturday ever gets its own hours, each row prints its own days instead. */
  const sharedDays =
    hours.summer.days === hours.winter.days ? hours.summer.days : null;

  const strong = tone === "cream" ? "text-ink-text" : "text-cream-text";
  const quiet = tone === "cream" ? "text-ink-muted" : "text-muted";
  const accent = tone === "cream" ? "text-gold-deep" : "text-gold-soft";

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {sharedDays && <span className={strong}>{sharedDays}</span>}

      {ordered.map((season) => {
        const value = hours[season];
        const isCurrent = current === season;

        return (
          /* data-* rather than reading the label: the label is uppercased in
             CSS, and Turkish casing turns "Kış (Ekim–Nisan)" into
             "KIŞ (EKİM–NİSAN)" with a dotless I — so a test matching on the
             rendered text is really testing the locale's case rules. These two
             attributes say what the row is, in one form, whatever it reads. */
          <div
            key={season}
            data-season={season}
            data-current={isCurrent ? "true" : "false"}
            className="flex flex-col gap-0.5"
          >
            <span
              className={`flex flex-wrap items-baseline gap-x-2 text-label uppercase ${
                isCurrent ? accent : quiet
              }`}
            >
              {value.label}
              {isCurrent && (
                /* Not a badge — a badge would need a fill, and D12 rations
                   gold to one per section. The accent colour is the emphasis;
                   this just says why. */
                <span className={quiet}>· Şu an geçerli</span>
              )}
            </span>

            {!sharedDays && <span className={quiet}>{value.days}</span>}

            {/* tabular-nums so the two rows' colons line up under each other. */}
            <span className={`tabular-nums ${isCurrent ? strong : quiet}`}>
              {value.open} – {value.close}
            </span>
          </div>
        );
      })}

      <span className={`text-sm ${quiet}`}>{hours.closed}</span>
    </div>
  );
}
