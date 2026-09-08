/* Icons are drawn here rather than pulled from a library.
 *
 * The set is tiny — eight marks — and §3's line weight is part of the look, so a
 * package whose stroke weights and corner radii were chosen for a different
 * design system would fight it. These share one stroke width and square caps,
 * matching the hairline rules used everywhere else.
 *
 * All are aria-hidden: every one sits inside a link or button that already
 * carries its own accessible name.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
} as const;

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 20.5l1.2-4.1a8 8 0 1 1 3 2.9z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-1.4-.8-1 .8a5 5 0 0 1-2.1-2.1l.8-1L11 9.5c-.5 0-1 .4-1 1" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/* The two map apps in the directions chooser.
 *
 * Drawn in the same hairline as the rest rather than reproduced as brand
 * marks. Both companies' logos are full-colour and trademarked, and dropping
 * two saturated glyphs into a two-row sheet on the espresso panel would be the
 * loudest thing on the page — for a choice the visitor makes once. These say
 * which app without borrowing anyone's identity: a folded paper map for Apple,
 * a dropped pin over a route for Google. The row's text is what actually
 * names them.
 */
export function AppleMapsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </svg>
  );
}

export function GoogleMapsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 9.5a4 4 0 1 0-8 0c0 3 4 7.5 4 7.5s4-4.5 4-7.5z" />
      <circle cx="10" cy="9.5" r="1.4" />
      <path d="M13.5 14.5 21 21" />
    </svg>
  );
}
