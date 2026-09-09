import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate KrishiQ High-Resolution Official Avatar Logo (512x512)
const logoSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#075E54" />
      <stop offset="50%" stop-color="#128C7E" />
      <stop offset="100%" stop-color="#00A884" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3B0" />
      <stop offset="40%" stop-color="#FFD166" />
      <stop offset="100%" stop-color="#F4A261" />
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A7F3D0" />
      <stop offset="100%" stop-color="#34D399" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Circular Base -->
  <circle cx="256" cy="256" r="256" fill="url(#bgGrad)" />

  <!-- Subtle Inner Border -->
  <circle cx="256" cy="256" r="240" stroke="#ffffff" stroke-opacity="0.15" stroke-width="4" fill="none" />
  <circle cx="256" cy="256" r="226" stroke="#ffffff" stroke-opacity="0.08" stroke-dasharray="10 8" stroke-width="2" fill="none" />

  <!-- Central Shield / Agri Crest Container -->
  <g filter="url(#glow)">
    <!-- Golden Wheat Ears Left & Right -->
    <!-- Left Ear -->
    <path d="M190 280 C 180 230, 205 170, 256 120 C 240 160, 230 200, 236 260" fill="url(#goldGrad)" opacity="0.9" />
    <path d="M185 240 C 160 220, 165 190, 195 190 C 205 205, 200 225, 185 240 Z" fill="url(#goldGrad)" />
    <path d="M175 280 C 145 270, 145 240, 180 235 C 192 248, 188 268, 175 280 Z" fill="url(#goldGrad)" />
    <path d="M180 320 C 150 320, 140 290, 175 280 C 188 295, 190 310, 180 320 Z" fill="url(#goldGrad)" />

    <!-- Right Ear -->
    <path d="M322 280 C 332 230, 307 170, 256 120 C 272 160, 282 200, 276 260" fill="url(#goldGrad)" opacity="0.9" />
    <path d="M327 240 C 352 220, 347 190, 317 190 C 307 205, 312 225, 327 240 Z" fill="url(#goldGrad)" />
    <path d="M337 280 C 367 270, 367 240, 332 235 C 320 248, 324 268, 337 280 Z" fill="url(#goldGrad)" />
    <path d="M332 320 C 362 320, 372 290, 337 280 C 324 295, 322 310, 332 320 Z" fill="url(#goldGrad)" />

    <!-- Center Sprouting Leaves -->
    <path d="M256 340 C 256 250, 210 200, 175 185 C 190 230, 220 275, 256 340 Z" fill="url(#leafGrad)" />
    <path d="M256 340 C 256 240, 310 190, 345 175 C 330 220, 300 270, 256 340 Z" fill="#25D366" />
    <path d="M256 355 L 256 165 C 256 150, 260 140, 256 130 C 252 140, 256 150, 256 165 Z" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />

    <!-- Stylized "Q" Ring Base representing KrishiQ -->
    <circle cx="256" cy="270" r="105" stroke="#FFFFFF" stroke-width="18" fill="none" opacity="0.95" />
    <circle cx="256" cy="270" r="105" stroke="url(#goldGrad)" stroke-width="12" fill="none" />
    <!-- Q leg diagonal bar -->
    <path d="M320 330 L 375 385" stroke="#FFFFFF" stroke-width="22" stroke-linecap="round" />
    <path d="M320 330 L 375 385" stroke="url(#goldGrad)" stroke-width="14" stroke-linecap="round" />

    <!-- Verified Star / Seed symbol at center -->
    <circle cx="256" cy="270" r="24" fill="#FFFFFF" />
    <path d="M256 254 L 260 264 L 271 266 L 263 273 L 265 284 L 256 278 L 247 284 L 249 273 L 241 266 L 252 264 Z" fill="#075E54" />
  </g>

  <!-- Bottom Badge Banner "KRISHIQ" -->
  <g transform="translate(0, 395)">
    <rect x="136" y="0" width="240" height="42" rx="21" fill="#054c44" />
    <rect x="138" y="2" width="236" height="38" rx="19" fill="#06544b" stroke="url(#goldGrad)" stroke-width="1.5" />
    <text x="256" y="26" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" letter-spacing="4">KRISHIQ</text>
  </g>
</svg>
`;

// 2. Generate WhatsApp Authentic Doodle Pattern SVG
const doodleSvg = `
<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#000000" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0.08">
    <!-- Chat bubble -->
    <path d="M30 40 h 35 a 10 10 0 0 1 10 10 v 15 a 10 10 0 0 1 -10 10 h -20 l -10 8 v -8 h -5 a 10 10 0 0 1 -10 -10 v -15 a 10 10 0 0 1 10 -10 z" />
    <circle cx="45" cy="55" r="1.5" fill="#000" />
    <circle cx="55" cy="55" r="1.5" fill="#000" />
    <circle cx="65" cy="55" r="1.5" fill="#000" />

    <!-- Coffee cup -->
    <path d="M140 35 h 25 v 20 a 12 12 0 0 1 -24 0 v -20 z" />
    <path d="M165 42 h 6 a 5 5 0 0 1 0 10 h -6" />
    <path d="M135 62 h 35" />
    <path d="M148 27 q 3 -5 0 -9" />
    <path d="M156 27 q 3 -5 0 -9" />

    <!-- Clock -->
    <circle cx="260" cy="50" r="16" />
    <path d="M260 40 v 10 l 6 4" />

    <!-- Headphones -->
    <path d="M330 55 a 18 18 0 0 1 36 0 v 12 h -6 v -10 h 6" />
    <rect x="326" y="55" width="6" height="14" rx="3" />
    <rect x="364" y="55" width="6" height="14" rx="3" />

    <!-- Smartphone -->
    <rect x="40" y="140" width="22" height="38" rx="4" />
    <line x1="48" y1="144" x2="54" y2="144" />
    <circle cx="51" cy="172" r="2" />

    <!-- Star -->
    <path d="M150 145 l 3 7 h 7 l -5.5 4.5 2 7 -6.5 -4.5 -6.5 4.5 2 -7 -5.5 -4.5 h 7 z" />

    <!-- Heart -->
    <path d="M250 145 c -5 -10 -18 -2 -12 8 c 6 9 12 14 12 14 c 0 0 6 -5 12 -14 c 6 -10 -7 -18 -12 -8 z" />

    <!-- Paper airplane -->
    <path d="M330 140 l 40 15 -40 25 8 -22 z" />
    <path d="M338 158 l 32 -3" />

    <!-- Camera -->
    <rect x="30" y="240" width="36" height="26" rx="4" />
    <path d="M42 240 l 3 -5 h 12 l 3 5" />
    <circle cx="48" cy="253" r="7" />
    <circle cx="58" cy="245" r="1.5" fill="#000" />

    <!-- Speech bubble round -->
    <ellipse cx="150" cy="250" rx="18" ry="14" />
    <path d="M140 262 l -8 10 3 -8" />
    <line x1="140" y1="248" x2="160" y2="248" />
    <line x1="144" y1="253" x2="156" y2="253" />

    <!-- Musical note -->
    <circle cx="240" cy="260" r="5" fill="#000" />
    <circle cx="260" cy="254" r="5" fill="#000" />
    <path d="M245 260 v -25 l 20 -6 v 25" />
    <line x1="245" y1="240" x2="265" y2="234" stroke-width="2.5" />

    <!-- Sun / Flower -->
    <circle cx="350" cy="250" r="8" />
    <line x1="350" y1="236" x2="350" y2="239" />
    <line x1="350" y1="261" x2="350" y2="264" />
    <line x1="336" y1="250" x2="339" y2="250" />
    <line x1="361" y1="250" x2="364" y2="250" />
    <line x1="340" y1="240" x2="342" y2="242" />
    <line x1="358" y1="258" x2="360" y2="260" />
    <line x1="340" y1="260" x2="342" y2="258" />
    <line x1="358" y1="242" x2="360" y2="240" />

    <!-- Gift box -->
    <rect x="40" y="340" width="28" height="24" rx="2" />
    <path d="M37 340 h 34 v 6 h -34 z" />
    <line x1="54" y1="340" x2="54" y2="364" />
    <path d="M54 340 c -4 -8 -12 -4 -6 0 z" />
    <path d="M54 340 c 4 -8 12 -4 6 0 z" />

    <!-- Leaf / Plant -->
    <path d="M140 365 c 0 -20 20 -25 25 -25 c 0 20 -20 25 -25 25 z" />
    <path d="M140 365 q 15 -10 25 -25" />

    <!-- Location pin -->
    <path d="M250 335 c -8 0 -14 6 -14 14 c 0 10 14 22 14 22 c 0 0 14 -12 14 -22 c 0 -8 -6 -14 -14 -14 z" />
    <circle cx="250" cy="348" r="4" />

    <!-- Padlock / Security -->
    <rect x="340" y="348" width="22" height="18" rx="3" />
    <path d="M344 348 v -6 a 7 7 0 0 1 14 0 v 6" />
    <circle cx="351" cy="356" r="2" fill="#000" />
  </g>
</svg>
`;

async function main() {
  // Write WhatsApp doodle svg
  fs.writeFileSync(path.join(publicDir, 'whatsapp-doodle.svg'), doodleSvg.trim());
  console.log('Created public/whatsapp-doodle.svg');

  // Convert logo SVG to PNG using sharp
  await sharp(Buffer.from(logoSvg.trim()))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('Created public/logo.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
