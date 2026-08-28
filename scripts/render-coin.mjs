/* Renders the Ata Lirası hero loop offline (design.md D2/D3).
 *
 *   node scripts/render-coin.mjs probe            8 spaced frames + scene report
 *   node scripts/render-coin.mjs render           480 transparent PNGs at 1600px
 *   node scripts/render-coin.mjs encode           frames → public/hero/ via ffmpeg
 *
 * The GLB is served only to a local Playwright-driven Chrome; it never enters
 * public/. Rotation is stepped deterministically per frame, so the loop's
 * seam cannot exist: frame N *is* frame 0 one revolution later.
 *
 * Flags (key=value): workdir=…  size=…  frames=…  crf800=…  crf420=…
 *                    ease=…  fill=…  exposure=…  spinOffset=…  headed=1
 */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync } from "node:fs";
import { join, resolve, normalize, extname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { chromium } from "@playwright/test";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const ffmpegPath = ffmpegInstaller.path;

const root = resolve(import.meta.dirname, "..");
const args = Object.fromEntries(
  process.argv.slice(3).map((a) => {
    const [k, ...v] = a.split("=");
    return [k.replace(/^--/, ""), v.join("=") || "1"];
  }),
);
const mode = process.argv[2] ?? "probe";
const WORKDIR = resolve(args.workdir ?? join(tmpdir(), "kk-coin-render"));
const FRAMES = parseInt(args.frames ?? "480", 10);   // 480 @ 30 fps = 16.000 s
const SUPER = parseInt(args.size ?? "1600", 10);      // rendered; encodes downscale
const ESPRESSO = "0x17120E";                          // D6 — must match the page ground
const OUT = join(root, "public", "hero");

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".glb": "model/gltf-binary",
  ".bin": "application/octet-stream",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

function serve() {
  const roots = {
    "/vendor/three/": join(root, "node_modules", "three"),
    "/asset/": join(root, "ata_animation"),
  };
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let file = null;
    if (url.pathname === "/") file = join(root, "scripts", "render-coin.html");
    for (const [prefix, base] of Object.entries(roots)) {
      if (url.pathname.startsWith(prefix)) {
        const candidate = normalize(join(base, url.pathname.slice(prefix.length)));
        if (candidate.startsWith(base)) file = candidate;
      }
    }
    try {
      const body = readFileSync(file);
      res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

function queryString() {
  const q = new URLSearchParams({ size: String(SUPER) });
  for (const k of ["ease", "fill", "exposure", "spinOffset", "debug"]) if (args[k]) q.set(k, args[k]);
  return q.toString();
}

async function withPage(fn) {
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch({
    channel: "chrome",
    headless: !args.headed,
    args: ["--force-color-profile=srgb"],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
    page.on("pageerror", (e) => console.error("pageerror:", e.message));
    page.on("console", (m) => ["error", "warning"].includes(m.type()) && console.error("console:", m.text()));
    await page.goto(`http://127.0.0.1:${port}/?${queryString()}`);
    const info = await page.evaluate(() => window.coinReady);
    await fn(page, info);
  } finally {
    await browser.close();
    server.close();
  }
}

function savePng(dataUrl, path) {
  writeFileSync(path, Buffer.from(dataUrl.split(",")[1], "base64"));
}

async function probe() {
  const dir = join(WORKDIR, "probe");
  mkdirSync(dir, { recursive: true });
  await withPage(async (page, info) => {
    console.log("scene:", JSON.stringify(info, null, 2));
    const n = parseInt(args.probeFrames ?? "8", 10);
    const t0 = Date.now();
    for (let k = 0; k < n; k++) {
      const i = Math.round((k * FRAMES) / n);
      const dataUrl = await page.evaluate(([i, N]) => window.renderFrame(i, N), [i, FRAMES]);
      savePng(dataUrl, join(dir, `probe-${String(i).padStart(4, "0")}.png`));
    }
    console.log(`probe: ${n} frames at ${SUPER}px in ${Date.now() - t0} ms → ${dir}`);
  });
}

async function render() {
  const dir = join(WORKDIR, "frames");
  mkdirSync(dir, { recursive: true });
  await withPage(async (page) => {
    const t0 = Date.now();
    for (let i = 0; i < FRAMES; i++) {
      const dataUrl = await page.evaluate(([i, N]) => window.renderFrame(i, N), [i, FRAMES]);
      savePng(dataUrl, join(dir, `frame-${String(i).padStart(4, "0")}.png`));
      if (i % 60 === 0) console.log(`frame ${i}/${FRAMES}, ${Date.now() - t0} ms elapsed`);
    }
    console.log(`render: ${FRAMES} frames at ${SUPER}px in ${Date.now() - t0} ms → ${dir}`);
  });
}

function ffmpeg(argv) {
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-y", ...argv], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) {
    console.error(r.error ?? r.stderr);
    throw new Error(`ffmpeg exited ${r.status}`);
  }
  return r.stderr; // ffmpeg reports to stderr
}

function encodeOne(width, crf) {
  const frames = join(WORKDIR, "frames", "frame-%04d.png");
  const compose = [
    "-f", "lavfi", "-i", `color=c=${ESPRESSO}:size=${SUPER}x${SUPER}:rate=30`,
    "-framerate", "30", "-i", frames,
    "-filter_complex",
    `[0:v][1:v]overlay=shortest=1:format=auto,scale=${width}:${width}:flags=lanczos,format=yuv420p`,
    "-an",
  ];
  const mp4 = join(OUT, `coin-${width}.mp4`);
  ffmpeg([...compose, "-c:v", "libx264", "-preset", "veryslow", "-crf", String(crf),
    "-movflags", "+faststart", mp4]);

  const still = join(OUT, `coin-still-${width}.webp`);
  ffmpeg([
    "-f", "lavfi", "-i", `color=c=${ESPRESSO}:size=${SUPER}x${SUPER}:d=1`,
    "-i", join(WORKDIR, "frames", "frame-0000.png"),
    "-filter_complex", `[0:v][1:v]overlay=format=auto,scale=${width}:${width}:flags=lanczos`,
    "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", still,
  ]);
  return [mp4, still];
}

function report(files) {
  for (const f of files) {
    const kb = statSync(f).size / 1024;
    console.log(`${f.replace(root, "").replaceAll("\\", "/")}  ${kb.toFixed(1)} KB`);
  }
}

function countFrames(file) {
  const err = ffmpeg(["-i", file, "-map", "0:v", "-c", "copy", "-f", "null", "-"]);
  const m = [...err.matchAll(/frame=\s*(\d+)/g)].at(-1);
  return m ? parseInt(m[1], 10) : NaN;
}

function encode() {
  const n = readdirSync(join(WORKDIR, "frames")).filter((f) => f.endsWith(".png")).length;
  if (n < FRAMES) throw new Error(`expected ${FRAMES} frames, found ${n} — run render first`);
  mkdirSync(OUT, { recursive: true });
  const files = [
    ...encodeOne(800, parseInt(args.crf800 ?? "21", 10)),
    ...encodeOne(420, parseInt(args.crf420 ?? "23", 10)),
  ];
  report(files);
  for (const f of files.filter((f) => f.endsWith(".mp4"))) {
    console.log(`${f.replace(root, "")}  frames=${countFrames(f)} (expected ${FRAMES})`);
  }
}

const modes = { probe, render, encode };
if (!modes[mode]) {
  console.error(`unknown mode "${mode}" — use: ${Object.keys(modes).join(" | ")}`);
  process.exit(1);
}
await modes[mode]();
