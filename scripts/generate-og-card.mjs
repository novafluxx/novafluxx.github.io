/**
 * Generates src/images/og-card.png (1200×630) for social/link previews.
 * Run: node scripts/generate-og-card.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "src", "images");
const outPng = path.join(outDir, "og-card.png");

const WIDTH = 1200;
const HEIGHT = 630;

// Match site dark palette: slate base, violet/blue accents, constellation feel
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1224"/>
      <stop offset="45%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <radialGradient id="orbA" cx="18%" cy="28%" r="42%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.45"/>
      <stop offset="55%" stop-color="#2563eb" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbB" cx="88%" cy="78%" r="38%">
      <stop offset="0%" stop-color="#0891b2" stop-opacity="0.38"/>
      <stop offset="60%" stop-color="#4f46e5" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbC" cx="72%" cy="18%" r="28%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="55%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
    <linearGradient id="nameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Base -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#orbA)"/>
  <rect width="100%" height="100%" fill="url(#orbB)"/>
  <rect width="100%" height="100%" fill="url(#orbC)"/>

  <!-- Subtle grid -->
  <g opacity="0.07" stroke="#94a3b8" stroke-width="1">
    ${Array.from({ length: 16 }, (_, i) => {
			const x = 40 + i * 72;
			return `<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}"/>`;
		}).join("")}
    ${Array.from({ length: 9 }, (_, i) => {
			const y = 30 + i * 72;
			return `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}"/>`;
		}).join("")}
  </g>

  <!-- Constellation dots + a few connecting lines -->
  <g opacity="0.55">
    ${[
			[140, 120, 2.2],
			[210, 180, 1.6],
			[280, 110, 1.8],
			[980, 140, 2],
			[1040, 220, 1.5],
			[920, 260, 1.4],
			[1080, 480, 1.8],
			[980, 520, 1.5],
			[160, 500, 1.6],
			[220, 560, 1.3],
			[760, 90, 1.4],
			[820, 150, 1.2],
		]
			.map(
				([x, y, r]) =>
					`<circle cx="${x}" cy="${y}" r="${r}" fill="#e2e8f0"/>`,
			)
			.join("")}
    <g stroke="#a78bfa" stroke-width="1" opacity="0.45" fill="none">
      <path d="M140 120 L210 180 L280 110"/>
      <path d="M980 140 L1040 220 L920 260"/>
      <path d="M160 500 L220 560"/>
      <path d="M760 90 L820 150"/>
    </g>
  </g>

  <!-- Soft frame -->
  <rect x="28" y="28" width="1144" height="574" rx="28" fill="none"
        stroke="rgba(148,163,184,0.18)" stroke-width="1.5"/>

  <!-- Accent bar -->
  <rect x="88" y="168" width="72" height="6" rx="3" fill="url(#bar)" filter="url(#softGlow)"/>

  <!-- Kicker -->
  <text x="88" y="218"
        font-family="Segoe UI, system-ui, -apple-system, sans-serif"
        font-size="22" font-weight="600" letter-spacing="4.5"
        fill="#a78bfa">QUALITY  ·  AUTOMATION  ·  AVIATION</text>

  <!-- Name -->
  <text x="88" y="338"
        font-family="Segoe UI, system-ui, -apple-system, sans-serif"
        font-size="92" font-weight="700" letter-spacing="-2.5"
        fill="url(#nameGrad)">Justin High</text>

  <!-- Role -->
  <text x="88" y="418"
        font-family="Segoe UI, system-ui, -apple-system, sans-serif"
        font-size="36" font-weight="600" letter-spacing="-0.6"
        fill="#cbd5e1">Quality Engineer &amp; Automation Builder</text>

  <!-- Decorative corner marks -->
  <g stroke="#64748b" stroke-width="1.5" fill="none" opacity="0.5">
    <path d="M52 72 L52 52 L72 52"/>
    <path d="M1148 72 L1148 52 L1128 52"/>
    <path d="M52 558 L52 578 L72 578"/>
    <path d="M1148 558 L1148 578 L1128 578"/>
  </g>
</svg>`;

await mkdir(outDir, { recursive: true });

const png = await sharp(Buffer.from(svg))
	.png({ compressionLevel: 9 })
	.toBuffer();

await writeFile(outPng, png);

// Also keep the SVG source next to the script for easy edits
await writeFile(path.join(__dirname, "og-card.svg"), svg);

console.log(`Wrote ${path.relative(root, outPng)} (${png.length} bytes)`);
console.log(`SVG source: scripts/og-card.svg`);
