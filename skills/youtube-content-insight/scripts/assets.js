// Usage (from your work folder): node <skill>/scripts/assets.js content.js
// Run build.js --dry first so icons.json and avatars.json exist.
// Generates all PNG assets: icons, hero illustrations, avatars, banners, roadblock diagram
const fs = require('fs');
const path = require('path');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const pi = require('react-icons/pi');

const WORK = process.cwd();
const CONTENT = path.resolve(process.argv[2] || 'content.js');
const OUT = path.join(WORK, 'assets');
fs.mkdirSync(OUT, { recursive: true });

const RED = '#FF0033', INK = '#0F0F0F', PALE = '#FFE8EC';

// ---- icon helpers -------------------------------------------------------
function iconInner(name) {
  const Icon = pi[name];
  if (!Icon) throw new Error('icon missing ' + name);
  const svg = RDS.renderToStaticMarkup(React.createElement(Icon, { size: 256 }));
  const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const vb = (svg.match(/viewBox="([^"]+)"/) || [0, '0 0 256 256'])[1];
  return { inner, vb };
}
// nested svg icon at x,y size s with color
function ic(name, x, y, s, color) {
  const { inner, vb } = iconInner(name);
  return `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="${vb}" fill="${color}" color="${color}">${inner}</svg>`;
}
async function iconPng(name, color, file) {
  const { inner, vb } = iconInner(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="${vb}" fill="${color}" color="${color}">${inner}</svg>`;
  await sharp(Buffer.from(svg)).resize(256, 256).png().toFile(path.join(OUT, file));
}

// ---- hero illustration frame -------------------------------------------
function chip(x, y, label, iconName, dark) {
  const w = 34 + label.length * 13.5 + 40;
  const bg = dark ? INK : '#FFFFFF';
  const fg = dark ? '#FFFFFF' : INK;
  const iconC = RED;
  return `<g filter="url(#sh)"><rect x="${x}" y="${y}" rx="24" ry="24" width="${w}" height="48" fill="${bg}"/></g>
  ${ic(iconName, x + 16, y + 11, 26, iconC)}
  <text x="${x + 52}" y="${y + 32}" font-family="Plus Jakarta Sans, Google Sans, Arial" font-weight="700" font-size="22" fill="${fg}">${label}</text>`;
}

function frame(art, o) {
  // o: {topChip:[label,icon], botChip:[label,icon], dur, durRed, progress}
  const W = 1000, H = 800;
  const tx = 90, ty = 110, tw = 800, th = 450;
  const prog = o.progress || 0.62;
  const durW = 20 + o.dur.length * 15;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#FF0033" flood-opacity="0.16"/></filter>
    <filter id="shc" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#99001F" flood-opacity="0.18"/></filter>
    <clipPath id="thc"><rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="22"/></clipPath>
    ${o.defs || ''}
  </defs>
  <circle cx="930" cy="90" r="70" fill="${PALE}"/>
  <circle cx="70" cy="700" r="80" fill="${PALE}"/>
  <circle cx="955" cy="560" r="28" fill="none" stroke="${PALE}" stroke-width="10"/>
  <g filter="url(#shc)"><rect x="60" y="80" width="860" height="660" rx="34" fill="#FFFFFF"/></g>
  <g clip-path="url(#thc)"><g transform="translate(${tx},${ty})">${art}</g></g>
  <rect x="${tx}" y="${ty + th - 8}" width="${tw}" height="8" fill="#E8E8E8" opacity="0.9"/>
  <rect x="${tx}" y="${ty + th - 8}" width="${tw * prog}" height="8" fill="${RED}"/>
  <circle cx="${tx + tw * prog}" cy="${ty + th - 4}" r="12" fill="${RED}"/>
  <rect x="${tx + tw - durW - 18}" y="${ty + th - 58}" width="${durW}" height="36" rx="8" fill="${o.durRed ? RED : 'rgba(15,15,15,0.85)'}"/>
  <text x="${tx + tw - 18 - durW / 2}" y="${ty + th - 33}" text-anchor="middle" font-family="Google Sans, Arial" font-weight="700" font-size="20" fill="#FFFFFF">${o.dur}</text>
  <circle cx="140" cy="628" r="30" fill="#EDEDED"/>
  <rect x="192" y="604" width="420" height="20" rx="10" fill="#1F1F1F"/>
  <rect x="192" y="638" width="280" height="14" rx="7" fill="#CFCFCF"/>
  ${chip(30, 40, o.topChip[0], o.topChip[1], true)}
  ${chip(600, 690, o.botChip[0], o.botChip[1], false)}
</svg>`;
}

// ---- pillar arts (800 x 450) -------------------------------------------
const arts = {};

// 01 OPM: stage with spotlights, mic, equalizer
arts.opm = (() => {
  let bars = '';
  const hs = [80, 130, 60, 150, 100, 170, 90, 60, 40, 50, 45, 70, 140, 70, 160, 100, 150, 80, 110, 60];
  hs.forEach((h, i) => {
    const c = i % 3 === 0 ? '#FF8FA6' : (i % 3 === 1 ? RED : '#FFC2CF');
    bars += `<rect x="${40 + i * 37}" y="${440 - h}" width="24" height="${h}" rx="6" fill="${c}"/>`;
  });
  return `<defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A0010"/><stop offset="1" stop-color="#B8002A"/></linearGradient>
  <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#g1)"/>
  <polygon points="150,0 200,0 330,450 20,450" fill="url(#sp)"/>
  <polygon points="380,0 420,0 560,450 240,450" fill="url(#sp)"/>
  <polygon points="600,0 650,0 780,450 470,450" fill="url(#sp)"/>
  ${bars}
  <circle cx="400" cy="185" r="92" fill="#FFFFFF" opacity="0.12"/>
  ${ic('PiMicrophoneStageBold', 330, 115, 140, '#FFFFFF')}
  ${ic('PiMusicNotesBold', 110, 70, 64, '#FFFFFF')}
  ${ic('PiMusicNotesBold', 620, 90, 54, '#FFC2CF')}
  ${ic('PiSparkleBold', 560, 40, 40, '#FFFFFF')}`;
})();

// 02 Teleserye: TV in living room showing drama silhouettes + LIVE
arts.tele = `<defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF3358"/><stop offset="1" stop-color="#99001F"/></linearGradient></defs>
  <rect width="800" height="450" fill="#161616"/>
  <rect x="0" y="360" width="800" height="90" fill="#222222"/>
  <rect x="180" y="45" width="440" height="270" rx="18" fill="#2E2E2E"/>
  <rect x="198" y="62" width="404" height="236" rx="10" fill="url(#g2)"/>
  <circle cx="330" cy="150" r="34" fill="#1A0006" opacity="0.85"/>
  <path d="M270 300 Q270 205 330 205 Q390 205 390 300 Z" fill="#1A0006" opacity="0.85"/>
  <circle cx="470" cy="160" r="30" fill="#1A0006" opacity="0.85"/>
  <path d="M418 300 Q418 215 470 215 Q522 215 522 300 Z" fill="#1A0006" opacity="0.85"/>
  ${ic('PiHeartBold', 378, 110, 44, '#FFFFFF')}
  <rect x="215" y="78" width="78" height="30" rx="6" fill="${RED}"/><circle cx="231" cy="93" r="5" fill="#FFFFFF"/>
  <text x="243" y="100" font-family="Google Sans, Arial" font-weight="700" font-size="18" fill="#FFFFFF">LIVE</text>
  <rect x="385" y="315" width="30" height="30" fill="#2E2E2E"/><rect x="330" y="340" width="140" height="12" rx="6" fill="#2E2E2E"/>
  <path d="M40 450 L40 385 Q40 360 70 360 L230 360 Q260 360 260 385 L260 450 Z" fill="#3A3A3A"/>
  ${ic('PiPlantBold', 660, 250, 110, '#3F3F3F')}
  ${ic('PiPopcornBold', 560, 372, 56, '#FF8FA6')}`;

// 03 Kwentuhan: podcast mic, speech bubbles, moon
arts.kwento = `<defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A0A12"/><stop offset="1" stop-color="#5C0017"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#g3)"/>
  <circle cx="690" cy="80" r="44" fill="#FFE8EC"/><circle cx="672" cy="66" r="44" fill="#3A0C17"/>
  <circle cx="560" cy="60" r="4" fill="#FFFFFF"/><circle cx="600" cy="120" r="3" fill="#FFFFFF"/><circle cx="740" cy="160" r="3" fill="#FFFFFF"/><circle cx="480" cy="40" r="3" fill="#FFFFFF"/>
  <circle cx="250" cy="240" r="120" fill="${RED}" opacity="0.18"/>
  <circle cx="250" cy="240" r="170" fill="none" stroke="${RED}" stroke-opacity="0.25" stroke-width="6"/>
  <circle cx="250" cy="240" r="220" fill="none" stroke="${RED}" stroke-opacity="0.15" stroke-width="6"/>
  ${ic('PiMicrophoneBold', 160, 130, 180, '#FFFFFF')}
  <g><rect x="420" y="170" width="250" height="84" rx="26" fill="#FFFFFF"/><path d="M440 250 L430 285 L475 252 Z" fill="#FFFFFF"/>
  ${ic('PiHeartBold', 440, 190, 44, RED)}<rect x="500" y="196" width="140" height="14" rx="7" fill="#1F1F1F"/><rect x="500" y="222" width="96" height="12" rx="6" fill="#CFCFCF"/></g>
  <g><rect x="470" y="290" width="240" height="84" rx="26" fill="${RED}"/><path d="M690 370 L705 400 L660 372 Z" fill="${RED}"/>
  ${ic('PiGhostBold', 490, 310, 44, '#FFFFFF')}<rect x="550" y="316" width="130" height="14" rx="7" fill="#FFFFFF"/><rect x="550" y="342" width="90" height="12" rx="6" fill="#FFC2CF"/></g>`;

// 04 Kitchen: pot with steam, table, plate
arts.kitchen = `<defs><radialGradient id="g4" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#FF6B7F"/><stop offset="1" stop-color="#D1002A"/></radialGradient></defs>
  <rect width="800" height="450" fill="url(#g4)"/>
  <rect x="0" y="360" width="800" height="90" fill="#A30022"/>
  <circle cx="400" cy="230" r="150" fill="#FFFFFF" opacity="0.14"/>
  <path d="M340 70 q-22 30 0 60 q22 30 0 60" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
  <path d="M400 50 q-22 30 0 60 q22 30 0 60" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
  <path d="M460 70 q-22 30 0 60 q22 30 0 60" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
  ${ic('PiCookingPotBold', 290, 150, 220, '#FFFFFF')}
  <ellipse cx="150" cy="330" rx="95" ry="26" fill="#FFFFFF"/><ellipse cx="150" cy="324" rx="62" ry="15" fill="#FFE8EC"/>
  ${ic('PiForkKnifeBold', 620, 300, 90, '#FFFFFF')}
  <rect x="560" y="60" width="190" height="56" rx="14" fill="#FFFFFF"/>${ic('PiChefHatBold', 574, 70, 36, RED)}
  <rect x="620" y="78" width="110" height="12" rx="6" fill="#1F1F1F"/><rect x="620" y="96" width="70" height="10" rx="5" fill="#CFCFCF"/>`;

// 05 Game On: court + phone with controller + basketball + trophy
arts.game = `<rect width="800" height="450" fill="#121212"/>
  <rect x="30" y="30" width="740" height="390" rx="8" fill="none" stroke="#2C2C2C" stroke-width="6"/>
  <line x1="400" y1="30" x2="400" y2="420" stroke="#2C2C2C" stroke-width="6"/>
  <circle cx="400" cy="225" r="80" fill="none" stroke="#2C2C2C" stroke-width="6"/>
  <path d="M30 110 Q170 225 30 340" fill="none" stroke="#2C2C2C" stroke-width="6"/>
  <path d="M770 110 Q630 225 770 340" fill="none" stroke="#2C2C2C" stroke-width="6"/>
  <rect x="250" y="130" width="300" height="170" rx="26" fill="${RED}"/>
  <rect x="266" y="146" width="268" height="138" rx="16" fill="#FF3358"/>
  ${ic('PiGameControllerBold', 335, 150, 130, '#FFFFFF')}
  ${ic('PiSwordBold', 70, 150, 130, '#FFFFFF')}
  ${ic('PiTrophyBold', 610, 140, 130, '#FFC83D')}
  <rect x="300" y="330" width="200" height="40" rx="20" fill="#FFFFFF"/>
  <text x="400" y="357" text-anchor="middle" font-family="Plus Jakarta Sans, Arial" font-weight="800" font-size="22" fill="${INK}">VICTORY</text>`;

// 06 Shop: bag + product card + stars
arts.shop = `<rect width="800" height="450" fill="#FFE8EC"/>
  <circle cx="260" cy="225" r="150" fill="#FFC2CF"/>
  <rect x="165" y="140" width="190" height="175" rx="30" fill="${RED}"/>
  <path d="M215 140 q0 -60 45 -60 q45 0 45 60" fill="none" stroke="${RED}" stroke-width="16"/>
  <path d="M215 205 q45 50 90 0" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round"/>
  <g filter="url(#sh)"><rect x="470" y="95" width="270" height="230" rx="20" fill="#FFFFFF"/></g>
  <rect x="490" y="115" width="80" height="80" rx="14" fill="#FFE8EC"/>${ic('PiSparkleBold', 505, 130, 50, RED)}
  <rect x="585" y="125" width="130" height="14" rx="7" fill="#1F1F1F"/><rect x="585" y="150" width="90" height="12" rx="6" fill="${RED}"/>
  ${ic('PiStarFill', 585, 172, 22, RED)}${ic('PiStarFill', 610, 172, 22, RED)}${ic('PiStarFill', 635, 172, 22, RED)}${ic('PiStarFill', 660, 172, 22, RED)}${ic('PiStarFill', 685, 172, 22, RED)}
  <rect x="490" y="215" width="230" height="12" rx="6" fill="#E3E3E3"/><rect x="490" y="238" width="170" height="12" rx="6" fill="#E3E3E3"/>
  <rect x="490" y="268" width="200" height="40" rx="20" fill="${INK}"/>${ic('PiShoppingCartBold', 506, 277, 22, '#FFFFFF')}
  <text x="536" y="295" font-family="Google Sans, Arial" font-weight="700" font-size="18" fill="#FFFFFF">View products</text>`;


// TH 03 Ghost: haunted night, full moon, old house, radio mic, ghost
arts.ghost = `<defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12030A"/><stop offset="1" stop-color="#4A0016"/></linearGradient>
  <radialGradient id="gm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE8EC"/><stop offset="1" stop-color="#FFC2CF"/></radialGradient></defs>
  <rect width="800" height="450" fill="url(#gg)"/>
  <circle cx="620" cy="110" r="70" fill="url(#gm)"/>
  <circle cx="120" cy="60" r="3" fill="#FFFFFF"/><circle cx="260" cy="40" r="3" fill="#FFFFFF"/><circle cx="420" cy="80" r="3" fill="#FFFFFF"/><circle cx="730" cy="230" r="3" fill="#FFFFFF"/>
  <path d="M60 450 L60 300 L140 240 L220 300 L220 450 Z" fill="#1A0409"/>
  <rect x="95" y="330" width="40" height="45" fill="#FF0033" opacity="0.85"/><rect x="150" y="330" width="40" height="45" fill="#3A0A15"/>
  <path d="M0 450 L0 400 Q200 370 400 400 Q600 430 800 395 L800 450 Z" fill="#12030A"/>
  <circle cx="400" cy="230" r="118" fill="#FF0033" opacity="0.16"/>
  ${ic('PiGhostBold', 320, 140, 160, '#FFFFFF')}
  <rect x="560" y="250" width="170" height="110" rx="18" fill="#FFFFFF"/>
  ${ic('PiMicrophoneBold', 578, 268, 44, RED)}
  <rect x="632" y="276" width="80" height="12" rx="6" fill="#1F1F1F"/><rect x="632" y="298" width="56" height="10" rx="5" fill="#CFCFCF"/>
  <rect x="578" y="326" width="70" height="22" rx="6" fill="${RED}"/><text x="613" y="342" text-anchor="middle" font-family="Google Sans, Arial" font-weight="700" font-size="14" fill="#FFFFFF">ON AIR</text>`;

// TH 04 Talk: two mics facing, ON AIR light, speech bubbles
arts.talk = `<defs><linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A1A1A"/><stop offset="1" stop-color="#3A0A15"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#gt)"/>
  <rect x="330" y="36" width="140" height="44" rx="10" fill="${RED}"/><text x="400" y="66" text-anchor="middle" font-family="Plus Jakarta Sans, Arial" font-weight="800" font-size="22" fill="#FFFFFF">ON AIR</text>
  <rect x="0" y="360" width="800" height="90" fill="#2A2A2A"/>
  <ellipse cx="400" cy="372" rx="250" ry="26" fill="#3A3A3A"/>
  <circle cx="190" cy="250" r="95" fill="#FF0033" opacity="0.2"/><circle cx="610" cy="250" r="95" fill="#FFFFFF" opacity="0.08"/>
  ${ic('PiMicrophoneBold', 120, 170, 150, '#FFFFFF')}
  ${ic('PiMicrophoneBold', 540, 170, 150, '#FFC2CF')}
  <g><rect x="300" y="120" width="200" height="70" rx="22" fill="#FFFFFF"/>${ic('PiLightbulbBold', 316, 135, 40, RED)}<rect x="366" y="140" width="110" height="12" rx="6" fill="#1F1F1F"/><rect x="366" y="162" width="76" height="10" rx="5" fill="#CFCFCF"/></g>
  <g><rect x="320" y="215" width="170" height="64" rx="22" fill="${RED}"/>${ic('PiChatsCircleBold', 336, 227, 38, '#FFFFFF')}<rect x="384" y="236" width="90" height="12" rx="6" fill="#FFFFFF"/></g>`;

// TH 05 Eat & Travel: noodle bowl, chopsticks, map pin, mountains, road
arts.eat = `<defs><linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF4D6D"/><stop offset="1" stop-color="#C4002B"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#ge)"/>
  <path d="M0 330 L150 190 L260 290 L380 170 L520 320 L640 210 L800 340 L800 450 L0 450 Z" fill="#A30022"/>
  <path d="M470 450 Q560 360 700 330 Q760 318 800 322 L800 450 Z" fill="#8A001D"/>
  <circle cx="660" cy="90" r="46" fill="#FFE8EC" opacity="0.9"/>
  <ellipse cx="300" cy="300" rx="170" ry="34" fill="#FFFFFF"/>
  <path d="M130 300 Q140 420 300 420 Q460 420 470 300 Z" fill="#FFFFFF"/>
  <path d="M150 300 Q300 330 450 300" fill="none" stroke="#FFE8EC" stroke-width="10"/>
  <path d="M200 296 q20 -30 40 0 q20 -30 40 0 q20 -30 40 0 q20 -30 40 0" fill="none" stroke="#FFC83D" stroke-width="8" stroke-linecap="round"/>
  <line x1="360" y1="120" x2="300" y2="290" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
  <line x1="395" y1="130" x2="320" y2="292" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
  <path d="M220 200 q-14 -20 0 -40 q14 -20 0 -40" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
  <path d="M270 200 q-14 -20 0 -40 q14 -20 0 -40" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
  <circle cx="610" cy="220" r="62" fill="#FFFFFF"/>${ic('PiMapPinBold', 568, 176, 84, RED)}
  <rect x="540" y="300" width="190" height="52" rx="14" fill="#FFFFFF"/>${ic('PiStarFill', 556, 314, 24, RED)}${ic('PiStarFill', 584, 314, 24, RED)}${ic('PiStarFill', 612, 314, 24, RED)}${ic('PiStarFill', 640, 314, 24, RED)}${ic('PiStarFill', 668, 314, 24, RED)}`;

const heroCfg = {
  opm: { topChip: ['Sold out', 'PiTicketBold'], botChip: ['Trending', 'PiFireBold'], dur: '4:12' },
  tele: { topChip: ['Live now', 'PiBroadcastBold'], botChip: ['Next episode', 'PiPlayBold'], dur: '45:30' },
  kwento: { topChip: ['New episode', 'PiMicrophoneBold'], botChip: ['Listening', 'PiHeadphonesBold'], dur: '1:02:15' },
  kitchen: { topChip: ['Recipe', 'PiChefHatBold'], botChip: ['Saved', 'PiHeartBold'], dur: '12:48' },
  game: { topChip: ['Live', 'PiBroadcastBold'], botChip: ['Champions', 'PiTrophyBold'], dur: 'LIVE', durRed: true },
  shop: { topChip: ['Trusted review', 'PiThumbsUpBold'], botChip: ['Tagged', 'PiTagBold'], dur: '18:06' },
};

// ---- avatars ------------------------------------------------------------
async function avatar(initials, style, file) {
  const bg = style === 'red' ? RED : style === 'dark' ? INK : style === 'grey' ? '#3A3A3A' : '#FFC2CF';
  const fg = style === 'pink' ? '#C4002B' : '#FFFFFF';
  const ring = style === 'red' ? '#FF0033' : '#FFFFFF';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <circle cx="200" cy="200" r="200" fill="${bg}"/>
  <circle cx="200" cy="200" r="186" fill="none" stroke="${ring === '#FFFFFF' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.35)'}" stroke-width="6"/>
  <text x="200" y="${initials.length > 2 ? 238 : 245}" text-anchor="middle" font-family="Plus Jakarta Sans, Arial" font-weight="800" font-size="${initials.length > 2 ? 110 : 132}" fill="${fg}">${initials}</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, file));
}

// ---- banners (per pillar pattern) --------------------------------------
async function banner(icons, file) {
  const W = 1200, H = 150;
  let s = '';
  let k = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 18; col++) {
      const x = col * 70 + (row % 2 ? 35 : 0) - 10;
      const y = row * 52 + 6;
      s += ic(icons[k++ % icons.length], x, y, 34, 'rgba(255,255,255,0.28)');
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" rx="14" fill="${RED}"/>${s}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, file));
}

// ---- roadblock mini diagram --------------------------------------------
async function roadblock(file) {
  const card = (x, dark) => `
  <g filter="url(#sh)"><rect x="${x}" y="20" width="230" height="200" rx="16" fill="#FFFFFF"/></g>
  <rect x="${x}" y="20" width="230" height="128" rx="16" fill="${dark ? INK : '#FFC2CF'}"/>
  <rect x="${x}" y="132" width="230" height="16" fill="${dark ? INK : '#FFC2CF'}"/>
  <circle cx="${x + 115}" cy="84" r="30" fill="${RED}"/><path d="M${x + 106} 70 L${x + 130} 84 L${x + 106} 98 Z" fill="#FFFFFF"/>
  <rect x="${x + 12}" y="32" width="52" height="28" rx="6" fill="#FFCC00"/><text x="${x + 38}" y="53" text-anchor="middle" font-family="Google Sans, Arial" font-weight="700" font-size="18" fill="${INK}">Ad</text>
  <circle cx="${x + 30}" cy="178" r="14" fill="#E6E6E6"/><rect x="${x + 54}" y="166" width="150" height="12" rx="6" fill="#2A2A2A"/><rect x="${x + 54}" y="188" width="100" height="10" rx="5" fill="#CFCFCF"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="250" viewBox="0 0 780 250"><defs><filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#99001F" flood-opacity="0.16"/></filter></defs>
  ${card(20, false)}${card(275, true)}${card(530, false)}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, file));
}

module.exports = { OUT };

if (require.main === module) {
  (async () => {
    // hero illustrations, one per pillar from content.js
    const C = require(CONTENT);
    for (const p of C.pillars) {
      const svg = frame(arts[p.art], p.hero);
      fs.writeFileSync(path.join(OUT, `hero_${p.key}.svg`), svg);
      await sharp(Buffer.from(svg), { density: 144 }).resize(1500).png().toFile(path.join(OUT, `hero_${p.key}.png`));
    }
    // icons (red, white, ink)
    const iconNames = JSON.parse(fs.readFileSync(path.join(WORK, 'icons.json'), 'utf8'));
    for (const n of iconNames) {
      await iconPng(n, RED, `i_${n}_red.png`);
      await iconPng(n, '#FFFFFF', `i_${n}_white.png`);
    }
    // avatars
    const avs = JSON.parse(fs.readFileSync(path.join(WORK, 'avatars.json'), 'utf8'));
    for (const a of avs) await avatar(a.initials, a.style, a.file);
    // banners
    for (const p of C.pillars) await banner(p.banner, `banner_${p.key}.png`);
    await roadblock('roadblock.png');
    console.log('assets done');
  })().catch(e => { console.error(e); process.exit(1); });
}
