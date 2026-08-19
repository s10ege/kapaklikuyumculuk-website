import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* §12 — next/image is in place from day one, while every image is still an
     * SVG placeholder. Swapping a placeholder for a real JPEG is then a change
     * to one path string in lib/content.ts, with no component edit.
     *
     * Next does not optimise SVG by default because SVG can carry script. The
     * two settings below are what the docs require alongside it: the sandbox
     * CSP stops any embedded script executing, and `attachment` means a direct
     * visit to the file downloads rather than renders it. */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    /* Product photography will be amateur phone shots (§11). AVIF first cuts
     * those down hard; WebP covers anything that cannot take AVIF. */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
