"use client";

import { useEffect, useRef } from "react";

/* D1–D5, D7 — the Ata Lirası, wired into the homepage hero from the loop
 * rendered offline in iteration 1.1 (public/hero/*, scripts/render-coin.mjs).
 *
 * Every fallback path — no JS, `prefers-reduced-motion`, `prefers-reduced-data`
 * — resolves to the same mechanism: the <video> simply never plays and shows
 * its `poster` still. There is no separate <img> to keep in sync and no
 * layout difference between the turning and still states, which is what
 * design.md means by "layout unchanged, not motion off and the layout
 * broken". `poster` starts as the small mobile still so a no-JS visitor never
 * pays for the desktop one; a JS visitor on a wide viewport upgrades it below,
 * well before playback would start.
 *
 * Playback is opt-in from JS, once three things are true: no reduced-motion
 * or reduced-data preference, the coin is on screen (IntersectionObserver —
 * battery, per design.md), and 500ms have passed since it entered view (the
 * "still, then it turns" first impression, D3).
 */
export function HeroCoin({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(min-width: 768px)").matches) {
      video.poster = "/hero/coin-still-800.webp";
    }

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(prefers-reduced-data: reduce)").matches ||
      Boolean(nav.connection?.saveData);

    // Stays on its poster, forever — that is the correct fallback, not a
    // degraded one.
    if (reduced) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          timer = setTimeout(() => {
            video.muted = true;
            video.play().catch(() => {
              // Autoplay can still be refused in some embedded contexts; the
              // poster stays visible, which is the correct fallback here too.
            });
          }, 500);
        } else {
          clearTimeout(timer);
          video.pause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(video);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative aspect-square ${className}`}>
      {/* D7 — a warm radial glow, the one exception to the no-shadow rule.
          Sized larger than the coin and centred behind it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-20%] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(184,150,79,0.35), transparent 70%)",
        }}
      />
      {/* Decorative and not clickable (D5): no href, no handler, aria-hidden.
          The radial mask feathers the video's outer 10% to transparent: the
          baked background can only ever be within ±1/255 of the page ground
          (tv-range H.264 cannot represent the exact hex — measured in Chrome
          across 96 candidate encodes), and a soft fade makes even that unit
          physically invisible in every browser. The coin ends at ~88% of the
          radius, so the fade never touches it. */}
      <video
        ref={videoRef}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="none"
        poster="/hero/coin-still-420.webp"
        className="relative h-full w-full object-contain"
        style={{
          maskImage:
            "radial-gradient(closest-side, black 90%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, black 90%, transparent 100%)",
        }}
      >
        <source media="(min-width: 768px)" src="/hero/coin-800.mp4" type="video/mp4" />
        <source src="/hero/coin-420.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
