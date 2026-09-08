"use client";

import { useRef, useSyncExternalStore } from "react";

import { directions, directionsHref } from "@/lib/config";
import { AppleMapsIcon, GoogleMapsIcon, PinIcon } from "./icons";

/* "Yol Tarifi Al" — the second most-pressed thing on the site after the phone.
 *
 * THE PROBLEM. On an iPhone, a Google Maps directions link opens Safari, then
 * either bounces to the Google Maps app or — far more often, because most
 * people have not installed it — leaves the visitor in a mobile web map asking
 * them to sign in. The visitor wanted the blue arrow they already use. Sending
 * every Apple device to Apple Maps instead has the mirror problem, because
 * plenty of iPhone owners do use Google Maps.
 *
 * So Apple platforms get asked, once, and everyone else goes straight to
 * Google. Two rows is not a menu; it is the one question that cannot be
 * answered from the user agent.
 *
 * `Macintosh` is in the test deliberately: iPadOS reports a Macintosh user
 * agent, and a desktop Mac is a device that plausibly has Apple Maps too. Both
 * should be offered the choice.
 *
 * WITHOUT JAVASCRIPT the anchor is an ordinary link to Google's directions URL
 * and works exactly as it reads. Hydration swaps the href to the internal
 * `/yol-tarifi?app=…` hop so the click registers as a page view (TECHNICAL.md
 * §9 — custom events are Pro-only, page views are free), and attaches the
 * chooser on Apple platforms. Nothing degrades to a dead button.
 */

/* Three states, not two: the server cannot know the platform, and "not yet
 * known" has to be distinguishable from "known, and not Apple" — they render
 * different hrefs. `useSyncExternalStore` is the hook for a value the server
 * and client disagree about; the store never changes, so subscribe is a no-op
 * and only the read half is used. Strings, so the snapshot is stable. */
type Platform = "ssr" | "apple" | "other";

const subscribe = () => () => {};
const serverPlatform = (): Platform => "ssr";
const clientPlatform = (): Platform =>
  /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? "apple" : "other";

export function DirectionsButton({
  variant = "onDark",
  label = "Yol Tarifi Al",
  className = "",
}: {
  /** `onDark` in the espresso room, `onCream` in the footer's frame band. */
  variant?: "onDark" | "onCream" | "quiet";
  label?: string;
  className?: string;
}) {
  const platform = useSyncExternalStore(
    subscribe,
    clientPlatform,
    serverPlatform,
  );
  const offersChoice = platform === "apple";
  const dialogRef = useRef<HTMLDialogElement>(null);

  /* Google's own URL before hydration and on Apple platforms — on Apple
   * because a middle-click or "open in new tab" bypasses the chooser and
   * should still land somewhere real. Everyone else gets the counted internal
   * hop, so an ordinary click registers as a page view. */
  const href =
    platform === "other" ? directionsHref("google") : directions.google;

  const styles = {
    onDark:
      "border border-gold-soft/50 text-gold-soft hover:bg-gold/15",
    onCream:
      "border border-gold-deep/60 text-gold-deep hover:bg-gold/15",
    quiet: "text-gold-soft hover:text-cream-text",
  }[variant];

  return (
    <>
      <a
        href={href}
        /* What the button decided, in one attribute. The href alone cannot say
           it: Google's URL is what both "not hydrated yet" and "Apple, so ask"
           render, and those two behave completely differently on click. */
        data-maps={platform === "apple" ? "ask" : platform === "other" ? "google" : "ssr"}
        onClick={(event) => {
          if (!offersChoice) return;
          /* Only a plain left click opens the sheet. Cmd-click, middle-click
           * and the rest are the visitor asking for a new tab, and the href
           * above is a real URL for exactly that reason. */
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          ) {
            return;
          }
          event.preventDefault();
          dialogRef.current?.showModal();
        }}
        className={`inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-sm transition-colors ${styles} ${className}`}
      >
        <PinIcon className="h-4 w-4 flex-none" />
        {label}
      </a>

      {/* Built on the native <dialog>, like the product lightbox: Escape,
          focus trapping and focus restoration are the platform's, and a
          hand-rolled version would be more code and worse. Bottom sheet below
          sm, centred panel above it — `m-auto` is overridden by the mt-auto
          on narrow screens. */}
      <dialog
        ref={dialogRef}
        aria-label="Harita uygulamasını seçin"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="mx-auto mb-0 mt-auto w-full max-w-sm bg-panel p-0 text-cream-text backdrop:bg-ground/80 sm:my-auto"
      >
        <p className="border-b border-line-dark px-5 py-4 text-label uppercase text-muted">
          Hangi haritada açılsın?
        </p>

        {/* Hairline-separated rows, the site's grid idiom. Real links, so the
            OS can hand off to the installed app — and same tab, because a
            new tab that immediately hands off leaves an empty one behind. */}
        <ul>
          {(
            [
              { app: "apple", name: "Apple Haritalar", Icon: AppleMapsIcon },
              { app: "google", name: "Google Haritalar", Icon: GoogleMapsIcon },
            ] as const
          ).map(({ app, name, Icon }) => (
            <li key={app} className="border-b border-line-dark last:border-b-0">
              <a
                href={directionsHref(app)}
                className="flex min-h-14 items-center gap-3 px-5 py-3 transition-colors hover:bg-gold/15 hover:text-gold-soft"
              >
                <Icon className="h-5 w-5 flex-none text-gold-soft" />
                {name}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="min-h-11 w-full border-t border-line-dark px-5 py-3 text-sm text-muted transition-colors hover:text-cream-text"
        >
          Vazgeç
        </button>
      </dialog>
    </>
  );
}
