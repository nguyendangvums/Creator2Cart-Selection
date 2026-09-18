// Thai YouTube gaming and creator landscape deck for VNG / VNGGames
// Sales-enablement deck. All figures sourced from the supplied research appendix.

const PptxGenJS = require("pptxgenjs");

// ---------------------------------------------------------------- design tokens
const C = {
  bg:       "0A0A0A",
  surface:  "161616",
  surface2: "1E1E1E",
  border:   "232323",
  white:    "FFFFFF",
  grey:     "9E9E9E",
  cite:     "6E6E6E",
  red:      "FF0033",
  r2:       "C40028",
  r3:       "8A001C",
  r4:       "5C0014",
  neutral:  "4A4A4A",
  neutral2: "3A3A3A",
  chip:     "202020",
  chipLine: "2E2E2E",
  neutText: "8A8A8A"
};

const F = "Google Sans";

const M   = 0.7;                // left / right margin
const W   = 13.333;
const CW  = W - M * 2;          // 11.933 content width
const Y_TITLE = 0.42;
const Y_SUB   = 1.34;
const Y_TOP   = 2.05;
const Y_CITE  = 6.74;

// ---------------------------------------------------------------- helpers
function card(slide, x, y, w, h, opts) {
  opts = opts || {};
  slide.addShape("roundRect", {
    x: x, y: y, w: w, h: h,
    rectRadius: 0.06,
    fill: { color: opts.fill || C.surface },
    line: { color: opts.line || C.border, width: 1 }
  });
}

function tick(slide, x, y, h, color) {
  slide.addShape("rect", {
    x: x, y: y, w: 0.09, h: h || 0.22,
    fill: { color: color || C.red },
    line: { color: color || C.red, width: 0 }
  });
}

function txt(slide, text, o) {
  const base = {
    isTextBox: true,
    margin: 0,
    fontFace: F,
    valign: o.valign || "top",
    color: o.color || C.white,
    fontSize: o.size || 10,
    bold: !!o.bold,
    align: o.align || "left",
    x: o.x, y: o.y, w: o.w, h: o.h
  };
  if (o.lineSpacingMultiple) base.lineSpacingMultiple = o.lineSpacingMultiple;
  slide.addText(text, base);
}

function chip(slide, x, y, w, h, label, fillColor, textColor, size) {
  slide.addShape("roundRect", {
    x: x, y: y, w: w, h: h,
    rectRadius: 0.06,
    fill: { color: fillColor },
    line: { color: fillColor === C.chip ? C.chipLine : fillColor, width: 1 }
  });
  slide.addText(label, {
    isTextBox: true, margin: 0, fontFace: F,
    x: x, y: y, w: w, h: h,
    align: "center", valign: "middle",
    fontSize: size || 9.5, bold: true,
    color: textColor
  });
}

// item = red tick + header + body, used inside cards
function item(slide, x, y, w, header, body, o) {
  o = o || {};
  const hSize = o.hSize || 13;
  tick(slide, x, y + 0.04, 0.21, o.tickColor || C.red);
  txt(slide, header, {
    x: x + 0.19, y: y - 0.02, w: w - 0.19, h: 0.26,
    size: hSize, bold: true, color: o.hColor || C.white
  });
  if (body) {
    txt(slide, body, {
      x: x, y: y + 0.28, w: w, h: o.bodyH || 0.6,
      size: o.bSize || 10, color: o.bColor || C.grey,
      lineSpacingMultiple: 1.12
    });
  }
}

function estimateLabel(slide, xRight, y) {
  chip(slide, xRight - 1.52, y, 1.52, 0.24, "third-party estimate", C.chip, C.neutText, 8);
}

function frame(slide, title, subline, citation) {
  slide.background = { color: C.bg };
  txt(slide, title, {
    x: M, y: Y_TITLE, w: CW, h: 0.62,
    size: 29, bold: true, color: C.white, valign: "middle"
  });
  txt(slide, subline, {
    x: M, y: Y_SUB, w: CW, h: 0.34,
    size: 14, color: C.grey, valign: "middle"
  });
  // citation strip, built as a credibility component
  card(slide, M, Y_CITE, CW, 0.44);
  tick(slide, M + 0.16, Y_CITE + 0.11, 0.22, C.red);
  txt(slide, citation, {
    x: M + 0.38, y: Y_CITE, w: CW - 0.54, h: 0.44,
    size: 9.5, color: C.cite, valign: "middle"
  });
}

// ---------------------------------------------------------------- deck
const pres = new PptxGenJS();
pres.layout = "LAYOUT_WIDE";
pres.author = "VNGGames Thailand 2027";
pres.title  = "Thai YouTube gaming and creator landscape";

// ================================================================ SLIDE 1
(function () {
  const s = pres.addSlide();
  frame(s,
    "Thailand pays more per player than any SEA market",
    "and 42% of that money is not mobile.",
    "Source: Sensor Tower and Kasikorn Research Center via Bangkok Post, compiled by Digital in Asia, July 2026. Antom, January 2026."
  );

  // left: 3 stat cards
  const lx = M, lw = 5.7, ch = 1.23;
  const stats = [
    ["162 million dollars", "in mobile in-app purchases in Q1 2025, the most of any country in Southeast Asia, despite Indonesia downloading 3 to 4 times as many games"],
    ["16%", "growth in Thai mobile spending in 2024, against a 4% global average"],
    ["49%", "of Thai players are paying users"]
  ];
  stats.forEach(function (st, i) {
    const y = Y_TOP + i * (ch + 0.3);
    card(s, lx, y, lw, ch);
    tick(s, lx + 0.28, y + 0.27, 0.24, C.red);
    txt(s, st[0], { x: lx + 0.47, y: y + 0.18, w: lw - 0.75, h: 0.42, size: 19, bold: true, color: C.red, valign: "middle" });
    txt(s, st[1], { x: lx + 0.28, y: y + 0.66, w: lw - 0.56, h: 0.48, size: 10, color: C.grey, lineSpacingMultiple: 1.1 });
  });

  // right: platform split
  const rx = 6.9, rw = 5.733;
  card(s, rx, Y_TOP, rw, 2.70);
  tick(s, rx + 0.28, Y_TOP + 0.21, 0.21, C.red);
  txt(s, "Thai games market value by platform", { x: rx + 0.47, y: Y_TOP + 0.15, w: rw - 0.75, h: 0.28, size: 13, bold: true, color: C.white });

  const barX = rx + 0.28, barW = rw - 0.56;
  const bars = [
    ["Mobile", 0.583, "58.3%", C.red, C.white],
    ["PC", 0.264, "26.4%", C.neutral, C.grey],
    ["Console and handheld", 0.153, "15.3%", C.neutral2, C.grey]
  ];
  bars.forEach(function (b, i) {
    const y = 2.58 + i * 0.64;
    txt(s, b[0], { x: barX, y: y, w: barW - 1.2, h: 0.22, size: 10.5, color: b[4] });
    txt(s, b[2], { x: barX, y: y, w: barW, h: 0.22, size: 11, bold: true, color: b[3] === C.red ? C.red : C.grey, align: "right" });
    s.addShape("roundRect", { x: barX, y: y + 0.25, w: barW, h: 0.22, rectRadius: 0.06, fill: { color: C.surface2 }, line: { color: C.surface2, width: 0 } });
    s.addShape("roundRect", { x: barX, y: y + 0.25, w: barW * b[1], h: 0.22, rectRadius: 0.06, fill: { color: b[3] }, line: { color: b[3], width: 0 } });
  });

  // 42% callout card
  const cy = 5.05;
  card(s, rx, cy, rw, 1.30);
  tick(s, rx + 0.28, cy + 0.16, 0.24, C.red);
  txt(s, "42%", { x: rx + 0.47, y: cy + 0.10, w: 0.95, h: 0.36, size: 18, bold: true, color: C.red, valign: "middle" });
  txt(s, "non-mobile, the highest of any major Southeast Asian market", { x: rx + 1.45, y: cy + 0.10, w: rw - 1.73, h: 0.36, size: 10.5, color: C.white, valign: "middle" });
  txt(s, "The PC and console habit traces to Thailand's internet cafe and LAN shop heritage, and those players carry higher purchasing power and lean more competitive.",
    { x: rx + 0.28, y: cy + 0.58, w: rw - 0.56, h: 0.60, size: 9.5, color: C.grey, lineSpacingMultiple: 1.1 });

  s.addNotes(
    "Start here, because this is the number they should plan around, not the one they already quote.\n\n" +
    "VNG knows Thailand is big. Thailand put 162 million dollars into mobile in-app purchases in Q1 2025, the most of any country in Southeast Asia, and it did that while Indonesia downloaded 3 to 4 times as many games. Thai mobile spending grew 16% in 2024 against a 4% global average, and 49% of Thai players are paying users. That is a market that pays.\n\n" +
    "The number they probably do not plan around is on the right. 42% of the value of this market is not mobile. PC is 26.4% and console and handheld is 15.3%. That is the highest non-mobile share of any major Southeast Asian market, and it traces back to the internet cafe and LAN shop culture Thailand has had for 20 plus years.\n\n" +
    "Why that matters commercially: a PC and console audience sits down. They watch long content. They research before they spend. That is exactly the audience VNG's MMORPG slate is built for, and it is the audience a short-form-only plan cannot reach properly.\n\n" +
    "So the question for 2027 is not whether Thailand is worth funding. It is which layer of Thailand you are funding."
  );
})();

// ================================================================ SLIDE 2
(function () {
  const s = pres.addSlide();
  frame(s,
    "Garena owns RoV, and the creator pipeline",
    "the competitive picture VNG is planning into.",
    "Source: Digital in Asia, July 2026. MG Crystal Trophy, April 2026. Garena RoV Thailand official Facebook, 2026."
  );

  // competitor profile card
  const lx = M, lw = 7.6, lh = 3.3;
  card(s, lx, Y_TOP, lw, lh);
  chip(s, lx + 0.28, Y_TOP + 0.20, 1.05, 0.28, "Competitor", C.chip, C.neutText, 9);

  const ix = lx + 0.28, iw = lw - 0.56;
  item(s, ix, 2.72, iw,
    "Arena of Valor, known locally as RoV",
    "Published by Garena and culturally embedded in Thailand in a way it is not anywhere else in the region, anchored by a national pro league running since 2018. Most of Southeast Asia crowns Mobile Legends. Thailand belongs to RoV.",
    { bodyH: 0.54, bSize: 10, tickColor: C.neutral });
  item(s, ix, 3.72, iw,
    "A 3-title publishing position",
    "Garena also publishes Free Fire and Call of Duty Mobile and runs the flagship league.",
    { bodyH: 0.24, bSize: 10, tickColor: C.neutral });
  item(s, ix, 4.42, iw,
    "An owned creator pipeline, not campaign bookings",
    "Garena runs its own RoV Creator Club and a Creator Next Gen recruitment programme, building an owned creator pipeline rather than booking campaign by campaign.",
    { bodyH: 0.40, bSize: 10, tickColor: C.neutral });

  // scale callouts
  const rx = 8.6, rw = 4.033;
  const callouts = [
    ["278,951", "peak concurrent viewers", "RoV Pro League 2025 Winter grand final, 26 October 2025, BITEC Bangna"],
    ["742,342", "peak concurrent viewers and over 21 million hours watched", "AIC 2025"]
  ];
  callouts.forEach(function (co, i) {
    const y = Y_TOP + i * 1.78;
    card(s, rx, y, rw, 1.52);
    tick(s, rx + 0.28, y + 0.27, 0.24, C.neutral);
    txt(s, co[0], { x: rx + 0.47, y: y + 0.18, w: rw - 0.75, h: 0.42, size: 20, bold: true, color: C.white, valign: "middle" });
    txt(s, co[1], { x: rx + 0.28, y: y + 0.66, w: rw - 0.56, h: 0.40, size: 10, color: C.grey, lineSpacingMultiple: 1.1 });
    txt(s, co[2], { x: rx + 0.28, y: y + 1.12, w: rw - 0.56, h: 0.34, size: 9.5, color: C.neutText, lineSpacingMultiple: 1.05 });
  });

  // conclusion band
  const by = 5.65;
  card(s, M, by, CW, 0.79);
  tick(s, M + 0.28, by + 0.28, 0.24, C.red);
  txt(s, "RoV culture cannot be rented. A Thai creator strategy for VNG has to be built on genres and creators Garena does not already own, and on relationships locked early enough that Garena's pipeline does not absorb them first.",
    { x: M + 0.47, y: by + 0.10, w: CW - 0.75, h: 0.59, size: 11.5, bold: true, color: C.red, valign: "middle", lineSpacingMultiple: 1.1 });

  s.addNotes(
    "This is the room's own market, so do not explain Garena to them. Explain the shape of the problem.\n\n" +
    "RoV is not just the biggest title in Thailand, it is the one embedded in the culture. Most of Southeast Asia crowns Mobile Legends. Thailand belongs to RoV, and it has had a national pro league since 2018.\n\n" +
    "The scale numbers on the right are there to show what that ownership actually looks like. The RoV Pro League Winter grand final in October 2025 at BITEC Bangna peaked at 278,951 concurrent viewers. AIC 2025 peaked at 742,342 concurrent and put away over 21 million hours watched. That is a live audience most publishers in this region cannot buy.\n\n" +
    "The part that matters for 2027 is the last item. Garena is not booking creators campaign by campaign. It runs a RoV Creator Club and a Creator Next Gen recruitment programme. That is an owned pipeline. It signs people before anyone else gets to the table.\n\n" +
    "So the conclusion is simple. You cannot rent RoV culture, and you should not try. The Thai creator strategy has to sit on genres Garena does not already own, and the relationships have to be locked early enough that Garena's pipeline does not absorb them first. Timing here is competitive, not administrative."
  );
})();

// ================================================================ SLIDE 3
(function () {
  const s = pres.addSlide();
  frame(s,
    "VNG's slate is aimed at the money, not the noise",
    "Thailand's download charts and its revenue charts are different charts.",
    "Source: Sensor Tower via Digital in Asia, July 2026. VNGGames via Online Station, 15 October 2025. NCSOFT newsroom, 2024 and 2025."
  );

  const colW = (CW - 0.3) / 2;
  const lx = M, rx = M + colW + 0.3;
  const topH = 1.65;

  // left column, downloads
  card(s, lx, Y_TOP, colW, topH);
  tick(s, lx + 0.28, Y_TOP + 0.21, 0.21, C.neutral);
  txt(s, "Culture and downloads", { x: lx + 0.47, y: Y_TOP + 0.15, w: colW - 0.75, h: 0.28, size: 13, bold: true, color: C.white });
  txt(s, "Garena territory. High download volume.", { x: lx + 0.28, y: Y_TOP + 0.45, w: colW - 0.56, h: 0.22, size: 9.5, color: C.neutText });

  const gw = (colW - 0.56 - 0.28) / 3;
  const leftChips = ["RoV", "Free Fire", "Mobile Legends", "PUBG Mobile", "Roblox"];
  leftChips.forEach(function (label, i) {
    const r = Math.floor(i / 3), c = i % 3;
    chip(s, lx + 0.28 + c * (gw + 0.14), 2.76 + r * 0.42, gw, 0.34, label, C.chip, C.neutText, 9.5);
  });

  // right column, revenue
  card(s, rx, Y_TOP, colW, topH);
  tick(s, rx + 0.28, Y_TOP + 0.21, 0.21, C.red);
  txt(s, "Revenue leaders", { x: rx + 0.47, y: Y_TOP + 0.15, w: colW - 0.75, h: 0.28, size: 13, bold: true, color: C.white });
  txt(s, "Where Thai spending concentrates.", { x: rx + 0.28, y: Y_TOP + 0.45, w: colW - 0.56, h: 0.22, size: 9.5, color: C.grey });

  const rightChips = [["Realistic sports games", C.red], ["MMORPGs", C.r2], ["4X strategy", C.r3]];
  rightChips.forEach(function (rc, i) {
    chip(s, rx + 0.28 + i * (gw + 0.14), 2.76, gw, 0.34, rc[0], rc[1], C.white, 9.5);
  });
  txt(s, "VNG's Thai roster already sits in this column.", { x: rx + 0.28, y: 3.24, w: colW - 0.56, h: 0.22, size: 9.5, color: C.grey });

  // roster label
  tick(s, M, 4.04, 0.21, C.red);
  txt(s, "VNG's current Thailand roster, mapped to the revenue side",
    { x: M + 0.19, y: 4.00, w: CW - 0.19, h: 0.26, size: 12.5, bold: true, color: C.white });

  // roster cards
  const rosW = (CW - 4 * 0.25) / 5;
  const roster = [
    ["Lineage2M", "MMORPG", "via NCV Games, the joint venture with NCSOFT"],
    ["Revelation M", "MMORPG", "live with local payment promotions"],
    ["Perfect World Mobile", "MMORPG", "long-running MMORPG IP"],
    ["Metal Slug: Awakening", "Arcade shooter", "launch funnel ran across 9 markets"],
    ["DDTank Origin", "Casual", "turn-based shooter"]
  ];
  roster.forEach(function (r, i) {
    const x = M + i * (rosW + 0.25);
    card(s, x, 4.34, rosW, 1.18);
    tick(s, x + 0.20, 4.48, 0.20, C.red);
    txt(s, r[0], { x: x + 0.20, y: 4.68, w: rosW - 0.4, h: 0.26, size: 11, bold: true, color: C.white });
    txt(s, r[1], { x: x + 0.20, y: 4.94, w: rosW - 0.4, h: 0.22, size: 9.5, color: C.red });
    txt(s, r[2], { x: x + 0.20, y: 5.14, w: rosW - 0.4, h: 0.32, size: 8.5, color: C.neutText, lineSpacingMultiple: 1.05 });
  });

  // land line
  const by = 5.82;
  card(s, M, by, CW, 0.62);
  tick(s, M + 0.28, by + 0.20, 0.22, C.red);
  txt(s, "VNG's slate sits on the revenue side of the Thai market, not the download side. That audience is older, higher-spending and more PC-native, and it is reached by depth of content, not volume of clips.",
    { x: M + 0.47, y: by + 0.09, w: CW - 0.75, h: 0.44, size: 11, bold: true, color: C.white, valign: "middle", lineSpacingMultiple: 1.1 });

  s.addNotes(
    "The point of this slide is that Thailand has 2 different charts, and VNG is already on the better one.\n\n" +
    "On the left is the culture and download chart. RoV, Free Fire, Mobile Legends, PUBG Mobile, Roblox. That is Garena territory and it is where the noise is.\n\n" +
    "On the right is the revenue chart. Realistic sports games, MMORPGs and 4X strategy lead on spending. Different games, different players.\n\n" +
    "Now look at the VNG roster along the bottom. Lineage2M through the NCV Games joint venture with NCSOFT, Revelation M, Perfect World Mobile, Metal Slug: Awakening, DDTank Origin. 3 of those are MMORPGs. The slate is already pointed at the revenue column.\n\n" +
    "That is a good position, and it has a consequence people skip. A revenue-side audience is older, spends more and is more PC-native. You reach that person with depth of content, not with volume of clips. Depth of content is a YouTube behaviour, and that is what the next slide is about."
  );
})();

// ================================================================ SLIDE 4
(function () {
  const s = pres.addSlide();
  frame(s,
    "The Thai creator map",
    "the top 100 Thai gaming channels hold roughly 323 million combined subscribers and 96 billion combined views.",
    "Source: Communitrics, July 2026. Favikon, 2026. Wikipedia, 2026. Subscriber counts are reliable. Lifetime view totals are third-party estimates."
  );

  const lx = M, lw = 7.6, topH = 3.15;
  card(s, lx, Y_TOP, lw, topH);
  tick(s, lx + 0.28, Y_TOP + 0.21, 0.21, C.red);
  txt(s, "Top channels by subscribers", { x: lx + 0.47, y: Y_TOP + 0.15, w: 4.2, h: 0.28, size: 13, bold: true, color: C.white });
  estimateLabel(s, lx + lw - 0.28, Y_TOP + 0.17);

  const ix = lx + 0.28, iw = lw - 0.56;

  // tier 1
  chip(s, ix, 2.60, 2.55, 0.42, "zbing z.   21.9M", C.red, C.white, 11.5);
  txt(s, "roughly 13 billion lifetime views. Variety and livestream, started on horror games and Ark.",
    { x: ix + 2.75, y: 2.60, w: iw - 2.75, h: 0.42, size: 9.5, color: C.grey, valign: "middle", lineSpacingMultiple: 1.05 });

  // tier 2
  const w3 = (iw - 0.28) / 3;
  [["RUOK   10.7M"], ["HEARTROCKER   9.6M"], ["PojzPlaza   9.6M"]].forEach(function (t, i) {
    chip(s, ix + i * (w3 + 0.14), 3.16, w3, 0.38, t[0], C.r2, C.white, 10);
  });
  txt(s, "RUOK about 730 million views, a Free Fire specialist. HEARTROCKER about 4.1 billion views. PojzPlaza about 2.6 billion.",
    { x: ix, y: 3.62, w: iw, h: 0.22, size: 9, color: C.neutText });

  // tier 3
  const w4 = (iw - 0.42) / 4;
  ["PRIMKUNG   8.7M", "Ananped   8.4M", "LowGrade   8.3M", "CGGG   8.0M"].forEach(function (t, i) {
    chip(s, ix + i * (w4 + 0.14), 3.90, w4, 0.38, t, C.r3, C.white, 9.5);
  });

  // tier 4
  ["KRK Channel   6.7M", "SkizzTV   6.4M"].forEach(function (t, i) {
    chip(s, ix + i * (w3 + 0.14), 4.38, w3, 0.38, t, C.r4, C.white, 10);
  });
  txt(s, "PRIMKUNG, Ananped, LowGrade, KRK Channel and SkizzTV each sit between 1.3 and 2.6 billion lifetime views. CGGG about 870 million.",
    { x: ix, y: 4.84, w: iw, h: 0.32, size: 9, color: C.neutText, lineSpacingMultiple: 1.05 });

  // conflict flags
  const rx = 8.6, rw = 4.033;
  card(s, rx, Y_TOP, rw, topH);
  tick(s, rx + 0.28, Y_TOP + 0.21, 0.21, C.neutral);
  txt(s, "Conflict flags", { x: rx + 0.47, y: Y_TOP + 0.15, w: rw - 0.75, h: 0.28, size: 13, bold: true, color: C.white });

  const flags = [
    ["RUOK", "Free Fire, a Garena title. Title conflict."],
    ["กายหงิด", "RoV, a Garena title, but already worked a VNG joint-venture launch. Manageable conflict."],
    ["zbing z.", "Variety, no single-title conflict. Sits with Online Station, under True Visions Group, so an MCN commercial layer applies."]
  ];
  const flagY = [2.62, 3.32, 4.20];
  flags.forEach(function (f, i) {
    item(s, rx + 0.28, flagY[i], rw - 0.56, f[0], f[1],
      { hSize: 11.5, bSize: 9.5, bodyH: 0.62, tickColor: C.neutral, bColor: C.neutText });
  });

  // callout band
  const by = 5.50;
  card(s, lx, by, lw, 0.94);
  tick(s, lx + 0.28, by + 0.14, 0.22, C.red);
  txt(s, "zbing z. started livestreaming in April 2014, reached 1 million subscribers in 2 years and passed 10 million in 2019, the first Thai gaming livestream channel to do it. A woman holds the top of the gaming category in this market.",
    { x: lx + 0.47, y: by + 0.12, w: lw - 0.75, h: 0.70, size: 10.5, color: C.white, lineSpacingMultiple: 1.12 });

  card(s, rx, by, rw, 0.94);
  tick(s, rx + 0.28, by + 0.14, 0.22, C.red);
  txt(s, "Publicly verified genre data exists for only part of this list. Genre and brand-safety verification is step 1 of the 2027 workflow, not an assumption.",
    { x: rx + 0.47, y: by + 0.12, w: rw - 0.75, h: 0.70, size: 9.5, color: C.grey, lineSpacingMultiple: 1.12 });

  s.addNotes(
    "This is the part VNG does not already have, so slow down here.\n\n" +
    "The top 100 Thai gaming channels hold roughly 323 million combined subscribers and 96 billion combined views. That is the addressable creator layer in this market, and it is concentrated.\n\n" +
    "At the top, zbing z. with 21.9 million subscribers and roughly 13 billion lifetime views. She is not an RoV channel, she is variety and livestream, and she started on horror games and Ark. Then RUOK at 10.7 million, HEARTROCKER at 9.6 million, PojzPlaza at 9.6 million, and the band from 8.7 down to 6.4 million after that.\n\n" +
    "The column on the right is the part that changes a plan. RUOK is a Free Fire specialist, which is a Garena title, so that is a title conflict. กายหงิด plays RoV, also a Garena title, but he has already worked a VNG joint-venture launch, so that one is manageable. zbing z. has no single-title conflict, but she sits with Online Station under True Visions Group, so there is an MCN commercial layer to plan for.\n\n" +
    "The callout at the bottom is worth saying out loud. She started in April 2014, hit 1 million in 2 years and passed 10 million in 2019, the first Thai gaming livestream channel to do it. The top of the gaming category in this market is held by a woman. That is not the case in most markets in the region.\n\n" +
    "And be straight about the limit. Publicly verified genre data exists for only part of this list. Genre and brand-safety verification is step 1 of the 2027 workflow. We are not going to assume it."
  );
})();

// ================================================================ SLIDE 5
(function () {
  const s = pres.addSlide();
  frame(s,
    "Thai gamers use 3 platforms for 3 different jobs",
    "discovery, spark and decision are not the same job, and they do not happen in the same place.",
    "Source: Antom, January 2026. Reuters Institute Digital News Report 2026. YouTube and Analytic Edge via Nation Thailand, September 2025. TikTok for Business case study, VNG Corporation, 2023."
  );

  const cw = (CW - 2 * 0.4) / 3;
  const cy = Y_TOP, ch = 3.24;
  const xs = [M, M + cw + 0.4, M + 2 * (cw + 0.4)];

  // arrows
  [xs[1] - 0.29, xs[2] - 0.29].forEach(function (ax) {
    s.addShape("triangle", {
      x: ax, y: 3.62, w: 0.19, h: 0.19,
      rotate: 90,
      fill: { color: C.red }, line: { color: C.red, width: 0 }
    });
  });

  // column 1
  card(s, xs[0], cy, cw, ch);
  chip(s, xs[0] + 0.28, cy + 0.20, 0.34, 0.28, "1", C.chip, C.neutText, 10);
  txt(s, "Discovery", { x: xs[0] + 0.70, y: cy + 0.18, w: cw - 1.0, h: 0.30, size: 15, bold: true, color: C.white, valign: "middle" });
  txt(s, "Facebook", { x: xs[0] + 0.28, y: cy + 0.56, w: cw - 0.56, h: 0.28, size: 13, bold: true, color: C.neutText });
  tick(s, xs[0] + 0.28, cy + 1.00, 0.21, C.neutral);
  txt(s, "over 70%", { x: xs[0] + 0.47, y: cy + 0.96, w: cw - 0.75, h: 0.26, size: 12.5, bold: true, color: C.grey });
  txt(s, "of Thai gamers discover new titles through Facebook via KOL livestreams and trusted recommendations.",
    { x: xs[0] + 0.28, y: cy + 1.30, w: cw - 0.56, h: 0.70, size: 10, color: C.grey, lineSpacingMultiple: 1.12 });
  txt(s, "Official fan pages and player-run groups carry post-launch retention.",
    { x: xs[0] + 0.28, y: cy + 2.10, w: cw - 0.56, h: 0.60, size: 10, color: C.neutText, lineSpacingMultiple: 1.12 });

  // column 2
  card(s, xs[1], cy, cw, ch);
  chip(s, xs[1] + 0.28, cy + 0.20, 0.34, 0.28, "2", C.chip, C.neutText, 10);
  txt(s, "The spark", { x: xs[1] + 0.70, y: cy + 0.18, w: cw - 1.0, h: 0.30, size: 15, bold: true, color: C.white, valign: "middle" });
  txt(s, "Short form", { x: xs[1] + 0.28, y: cy + 0.56, w: cw - 0.56, h: 0.28, size: 13, bold: true, color: C.neutText });
  tick(s, xs[1] + 0.28, cy + 1.00, 0.21, C.neutral);
  txt(s, "short form starts it", { x: xs[1] + 0.47, y: cy + 0.96, w: cw - 0.75, h: 0.26, size: 12.5, bold: true, color: C.grey });
  txt(s, "Thai viewers begin with short-form video, and if interest holds, longer YouTube content follows, with search adding context.",
    { x: xs[1] + 0.28, y: cy + 1.30, w: cw - 0.56, h: 0.90, size: 10, color: C.grey, lineSpacingMultiple: 1.12 });
  txt(s, "Short form opens the door. It is not where the spend decision gets made.",
    { x: xs[1] + 0.28, y: cy + 2.10, w: cw - 0.56, h: 0.60, size: 10, color: C.neutText, lineSpacingMultiple: 1.12 });

  // column 3
  card(s, xs[2], cy, cw, ch);
  chip(s, xs[2] + 0.28, cy + 0.20, 0.34, 0.28, "3", C.red, C.white, 10);
  txt(s, "The decision", { x: xs[2] + 0.70, y: cy + 0.18, w: cw - 1.0, h: 0.30, size: 15, bold: true, color: C.white, valign: "middle" });
  txt(s, "YouTube", { x: xs[2] + 0.28, y: cy + 0.56, w: cw - 0.56, h: 0.28, size: 13, bold: true, color: C.red });

  const ytStats = [
    ["92%", "go to YouTube to understand their interests more deeply", 0.38],
    ["88%", "trust YouTube creators' opinions on brands and products more than voices on any other platform", 0.52],
    ["88%", "of Thai shoppers said YouTube played a critical role in their most recent purchase decision", 0.52],
    ["2.9x", "ROI versus television, and 1.6 times other social platforms", 0.38]
  ];
  let sy = cy + 0.98;
  ytStats.forEach(function (st) {
    txt(s, st[0], { x: xs[2] + 0.28, y: sy, w: 0.62, h: 0.24, size: 12, bold: true, color: C.red });
    txt(s, st[1], { x: xs[2] + 0.94, y: sy - 0.02, w: cw - 1.22, h: st[2], size: 9.5, color: C.grey, lineSpacingMultiple: 1.1 });
    sy += st[2] + 0.10;
  });

  // proof band
  const by = 5.59;
  card(s, M, by, CW, 0.85);
  tick(s, M + 0.28, by + 0.14, 0.22, C.red);
  txt(s, "VNG already proved the spark works. The Metal Slug: Awakening launch ran a planned funnel across 9 markets, and in Thailand iOS installs beat target by 328% while CPI came in 53% below target.",
    { x: M + 0.47, y: by + 0.10, w: CW - 0.75, h: 0.34, size: 10.5, color: C.white });
  txt(s, "The spark is won. The decision layer is the one still open.",
    { x: M + 0.47, y: by + 0.48, w: CW - 0.75, h: 0.28, size: 12, bold: true, color: C.red });

  s.addNotes(
    "This is the most important slide in the deck. If they remember a single thing from this deck, make it this.\n\n" +
    "Thai gamers use 3 platforms, but for 3 different jobs, and the mistake is treating them as interchangeable reach.\n\n" +
    "Job 1 is discovery, and it happens on Facebook. Over 70% of Thai gamers find new titles there, through KOL livestreams and recommendations they trust. Fan pages and player-run groups carry retention after launch.\n\n" +
    "Job 2 is the spark, and that is short form. Thai viewers start with a short video, and if the interest holds, longer YouTube content follows, with search filling in the gaps.\n\n" +
    "Job 3 is the decision, and that is YouTube. 92% of Thai users go to YouTube to understand their interests more deeply. 88% trust YouTube creators' opinions on brands and products more than voices on any other platform. 88% of Thai shoppers say YouTube played a critical role in their most recent purchase decision. And YouTube ROI comes in at 2.9 times television and 1.6 times other social platforms.\n\n" +
    "Now the band at the bottom, and say this as their evidence, not ours. Metal Slug: Awakening ran a planned funnel across 9 markets. In Thailand, iOS installs beat target by 328% and CPI came in 53% below target. That is a team that knows how to win the spark.\n\n" +
    "So the spark is won. The decision layer is the one still open. Everything after this slide is about funding that layer."
  );
})();

// ================================================================ SLIDE 6
(function () {
  const s = pres.addSlide();
  frame(s,
    "Start where VNG already has proof",
    "the 2027 roster, tier 1 and tier 2, sorted by genre fit and conflict risk, not by subscriber count.",
    "Source: Compgamer, 1 April 2025. Communitrics, July 2026. NoxInfluencer, 2026. Favikon, 2026. Average views are third-party estimates."
  );

  const lx = M, lw = 7.35, h = 4.39;
  const rx = M + lw + 0.3, rw = CW - lw - 0.3;

  // ---- tier 1
  card(s, lx, Y_TOP, lw, h);
  chip(s, lx + 0.28, Y_TOP + 0.20, 0.85, 0.28, "Tier 1", C.red, C.white, 9.5);
  txt(s, "Creators who have already worked a VNG launch", { x: lx + 1.25, y: Y_TOP + 0.18, w: lw - 1.53, h: 0.30, size: 14, bold: true, color: C.white, valign: "middle" });

  txt(s, "On stage at the NCV Games Lineage2M launch showcase, Bangkok, March 2025",
    { x: lx + 0.28, y: Y_TOP + 0.62, w: lw - 0.56, h: 0.22, size: 9.5, color: C.neutText });

  const cw3 = (lw - 0.56 - 0.28) / 3;
  ["คัทโตะ", "กายหงิด", "แป้งสามป๋องซาว"].forEach(function (n, i) {
    chip(s, lx + 0.28 + i * (cw3 + 0.14), 2.93, cw3, 0.40, n, C.red, C.white, 11);
  });
  txt(s, "alongside Vietnamese creators", { x: lx + 0.28, y: 3.44, w: lw - 0.56, h: 0.22, size: 9, color: C.neutText });
  ["Cris Phan", "Duy Thẩm", "Hải Triều"].forEach(function (n, i) {
    chip(s, lx + 0.28 + i * (cw3 + 0.14), 3.70, cw3, 0.36, n, C.chip, C.neutText, 10);
  });

  tick(s, lx + 0.28, 4.26, 0.21, C.red);
  txt(s, "Why they are the lead recommendation", { x: lx + 0.47, y: 4.22, w: lw - 0.75, h: 0.26, size: 12.5, bold: true, color: C.white });
  txt(s, "These 3 creators have already worked a VNG joint-venture launch in Thailand. They are the fastest path from a single launch booking to a standing 2027 relationship, and the relationship cost of starting again from zero is already paid.",
    { x: lx + 0.28, y: 4.52, w: lw - 0.56, h: 0.58, size: 10, color: C.grey, lineSpacingMultiple: 1.12 });

  card(s, lx + 0.28, 5.24, lw - 0.56, 0.92, { fill: C.surface2, line: C.border });
  tick(s, lx + 0.48, 5.38, 0.21, C.red);
  txt(s, "กายหงิด, Viratsan Ariyapongpisal", { x: lx + 0.67, y: 5.34, w: 3.6, h: 0.26, size: 11.5, bold: true, color: C.white });
  estimateLabel(s, lx + lw - 0.48, 5.35);
  txt(s, "About 4.88 million subscribers and roughly 515,000 average views. RoV plus humour and challenge formats, with strong TikTok crossover.",
    { x: lx + 0.48, y: 5.64, w: lw - 0.96, h: 0.42, size: 9.5, color: C.grey, lineSpacingMultiple: 1.1 });

  // ---- tier 2
  card(s, rx, Y_TOP, rw, h);
  chip(s, rx + 0.28, Y_TOP + 0.20, 0.85, 0.28, "Tier 2", C.r2, C.white, 9.5);
  txt(s, "Reach anchor", { x: rx + 1.25, y: Y_TOP + 0.18, w: rw - 1.53, h: 0.30, size: 14, bold: true, color: C.white, valign: "middle" });

  chip(s, rx + 0.28, Y_TOP + 0.62, rw - 0.56, 0.52, "zbing z.   21.9M", C.red, C.white, 14);

  tick(s, rx + 0.28, 3.32, 0.21, C.red);
  txt(s, "What she buys", { x: rx + 0.47, y: 3.28, w: rw - 0.75, h: 0.26, size: 12.5, bold: true, color: C.white });
  txt(s, "Scale and brand safety for a launch moment. Family-safe, female-fronted, and no single-title conflict to negotiate around.",
    { x: rx + 0.28, y: 3.58, w: rw - 0.56, h: 0.72, size: 10, color: C.grey, lineSpacingMultiple: 1.12 });

  card(s, rx + 0.28, 4.44, rw - 0.56, 1.10, { fill: C.surface2, line: C.border });
  tick(s, rx + 0.48, 4.58, 0.21, C.neutral);
  txt(s, "The trade-off", { x: rx + 0.67, y: 4.54, w: rw - 1.15, h: 0.26, size: 11.5, bold: true, color: C.white });
  txt(s, "A broad audience skewing young and family, so she buys reach, not hardcore MMORPG credibility.",
    { x: rx + 0.48, y: 4.84, w: rw - 0.96, h: 0.60, size: 9.5, color: C.neutText, lineSpacingMultiple: 1.1 });

  txt(s, "An MCN commercial layer applies: she sits with Online Station, under True Visions Group.",
    { x: rx + 0.28, y: 5.66, w: rw - 0.56, h: 0.50, size: 9, color: C.neutText, lineSpacingMultiple: 1.1 });

  s.addNotes(
    "The roster is sorted by genre fit and conflict risk, not by subscriber count. That is the whole discipline of this slide.\n\n" +
    "Tier 1 is the lead recommendation, and it is the easy one, because VNG has already done it. คัทโตะ, กายหงิด and แป้งสามป๋องซาว were on stage at the NCV Games Lineage2M launch showcase in Bangkok in March 2025, alongside Cris Phan, Duy Thẩm and Hải Triều from Vietnam. These creators have already worked a VNG joint-venture launch in this market.\n\n" +
    "That matters because the expensive part of creator work is not the booking, it is the first relationship. That cost is already paid here. This is the fastest path from a single launch booking to a standing 2027 relationship.\n\n" +
    "On กายหงิด specifically: Viratsan Ariyapongpisal, about 4.88 million subscribers, roughly 515,000 average views, RoV plus humour and challenge formats, with strong TikTok crossover. He plays a Garena title, so flag it, but he has already worked with VNG, so it is manageable rather than blocking.\n\n" +
    "Tier 2 is zbing z., and she does 1 job: she buys scale and brand safety for a launch moment. 21.9 million subscribers, family-safe, female-fronted, no single-title conflict.\n\n" +
    "Say the trade-off out loud, because they will spot it anyway. Her audience skews young and family. She buys reach, not hardcore MMORPG credibility. And she sits with Online Station under True Visions Group, so there is an MCN commercial layer in the deal."
  );
})();

// ================================================================ SLIDE 7
(function () {
  const s = pres.addSlide();
  frame(s,
    "The efficiency tier is the real argument",
    "subscribers measure history. Views per subscriber measures current delivery.",
    "Source: Communitrics, July 2026. NoxInfluencer, 2026. SpeakRJ and Favikon, 2026. Third-party estimates. The ratio table uses NoxInfluencer subscriber and average-view figures so the ratio stays internally consistent, while slide 4 uses Communitrics subscriber counts."
  );

  const lx = M, lw = 8.5, h = 3.05;
  const rx = M + lw + 0.3, rw = CW - lw - 0.3;

  // ---- tier 3 table
  card(s, lx, Y_TOP, lw, h);
  chip(s, lx + 0.28, Y_TOP + 0.20, 0.85, 0.28, "Tier 3", C.r3, C.white, 9.5);
  txt(s, "The efficiency tier", { x: lx + 1.25, y: Y_TOP + 0.18, w: 4.0, h: 0.30, size: 14, bold: true, color: C.white, valign: "middle" });
  estimateLabel(s, lx + lw - 0.28, Y_TOP + 0.20);

  const tx = lx + 0.28, tw = lw - 0.56;
  const colX = [tx, tx + 2.35, tx + 3.85, tx + 5.35];
  const colW = [2.30, 1.40, 1.40, tw - 5.35];

  // header row
  const hy = 2.70;
  ["Creator", "Subscribers", "Avg views", "Views per subscriber"].forEach(function (label, i) {
    txt(s, label, {
      x: colX[i], y: hy, w: colW[i], h: 0.24, size: 9.5, bold: true,
      color: i === 3 ? C.red : C.neutText,
      align: i === 0 ? "left" : (i === 3 ? "left" : "right")
    });
  });
  s.addShape("rect", { x: tx, y: hy + 0.28, w: tw, h: 0.012, fill: { color: C.border }, line: { color: C.border, width: 0 } });

  const rows = [
    ["Tatchai I", "308K", "530K", "1.72x", 1.72, C.red],
    ["MrWattana", "240K", "360K", "1.50x", 1.50, C.red],
    ["GangBad TM", "525K", "400K", "0.76x", 0.76, C.r2],
    ["KarosPPM", "851K", "530K", "0.62x", 0.62, C.r2],
    ["HEARTROCKER", "8.17M", "490K", "0.06x", 0.06, C.r3]
  ];
  const barMax = colW[3] - 0.62;
  rows.forEach(function (r, i) {
    const y = 3.08 + i * 0.40;
    txt(s, r[0], { x: colX[0], y: y, w: colW[0], h: 0.24, size: 10.5, bold: true, color: C.white, valign: "middle" });
    txt(s, r[1], { x: colX[1], y: y, w: colW[1], h: 0.24, size: 10.5, color: C.grey, align: "right", valign: "middle" });
    txt(s, r[2], { x: colX[2], y: y, w: colW[2], h: 0.24, size: 10.5, color: C.grey, align: "right", valign: "middle" });
    txt(s, r[3], { x: colX[3], y: y, w: 0.56, h: 0.24, size: 11, bold: true, color: r[5], align: "left", valign: "middle" });
    s.addShape("rect", {
      x: colX[3] + 0.60, y: y + 0.08, w: Math.max(0.03, barMax * (r[4] / 1.72)), h: 0.10,
      fill: { color: r[5] }, line: { color: r[5], width: 0 }
    });
  });

  // ---- tier 4
  card(s, rx, Y_TOP, rw, h);
  chip(s, rx + 0.28, Y_TOP + 0.20, 0.85, 0.28, "Tier 4", C.r4, C.white, 9.5);
  txt(s, "Pipeline bet", { x: rx + 0.28, y: Y_TOP + 0.58, w: rw - 0.56, h: 0.30, size: 14, bold: true, color: C.white });

  ["NotAmberRoblox", "Dragon Gold"].forEach(function (n, i) {
    chip(s, rx + 0.28, 2.98 + i * 0.44, rw - 0.56, 0.38, n, C.r4, C.white, 10);
  });
  txt(s, "Roblox-native. Roblox sits on the Thai download charts alongside RoV, Free Fire, Mobile Legends and PUBG Mobile.",
    { x: rx + 0.28, y: 3.92, w: rw - 0.56, h: 0.62, size: 9.5, color: C.grey, lineSpacingMultiple: 1.12 });
  txt(s, "Small line item. Next cohort, not this one.",
    { x: rx + 0.28, y: 4.62, w: rw - 0.56, h: 0.40, size: 9.5, color: C.neutText, lineSpacingMultiple: 1.1 });

  // ---- argument band
  const by = 5.40;
  card(s, M, by, CW, 1.04);
  tick(s, M + 0.28, by + 0.14, 0.22, C.red);
  txt(s, "MrWattana runs a 10.7% estimated engagement rate and GangBad TM 9.1%, against 6.4% for the macro tier. This is the tier VNG's own micro and UGC roster logic already points at, applied to Thailand.",
    { x: M + 0.47, y: by + 0.10, w: CW - 0.75, h: 0.40, size: 11, bold: true, color: C.white, lineSpacingMultiple: 1.1 });
  txt(s, "Average views and engagement rates are third-party estimates from monthly snapshots and require verification before commitment. Genre and brand-safety verification is required for every name.",
    { x: M + 0.47, y: by + 0.56, w: CW - 0.75, h: 0.34, size: 9, color: C.neutText, lineSpacingMultiple: 1.1 });

  s.addNotes(
    "This is the tier that carries the commercial argument, so give it the time.\n\n" +
    "Read the last column, not the second one. Subscribers measure history. Views per subscriber measures what a channel is delivering right now.\n\n" +
    "Tatchai I has 308,000 subscribers and pulls about 530,000 average views. That is 1.72 times its subscriber base on a typical video. MrWattana, 240,000 subscribers, about 360,000 average views, 1.50 times. Now compare that with HEARTROCKER: 8.17 million subscribers, about 490,000 average views, 0.06 times.\n\n" +
    "HEARTROCKER is a real channel with a real history. But if the job is delivered views per unit of effort, the small channels are outperforming the large one by more than 25 times on this ratio.\n\n" +
    "Engagement backs it up. MrWattana runs an estimated 10.7% engagement rate and GangBad TM 9.1%, against 6.4% for the macro tier.\n\n" +
    "And here is the part to land with this room: this is not a new idea we are importing. VNG already hires for a micro and UGC creator layer. This is that same logic, applied to Thailand.\n\n" +
    "Tier 4 is a small line item, not a 2027 commitment. NotAmberRoblox and Dragon Gold are Roblox-native, and Roblox is on the Thai download charts alongside RoV, Free Fire, Mobile Legends and PUBG Mobile. Worth a watching brief for the next cohort.\n\n" +
    "Be explicit about the data. Average views and engagement rates are third-party estimates from monthly snapshots. They need verification before anyone commits budget. Subscriber counts are reliable, the rest is directional."
  );
})();

// ================================================================ SLIDE 8
(function () {
  const s = pres.addSlide();
  frame(s,
    "Make the decision layer a 2027 line item",
    "3 moves that turn creator work from a launch cost into an always-on asset.",
    "Source: YouTube Blog, NewFronts, March 2026. Google Ads Help, 2026."
  );

  const cw = (CW - 2 * 0.3) / 3;
  const xs = [M, M + cw + 0.3, M + 2 * (cw + 0.3)];
  const cy = Y_TOP, ch = 3.05;

  const moves = [
    {
      n: "1", color: C.red,
      head: "Move from launch bookings to standing partnerships",
      body: "Creator content keeps working long after the launch window. For a live-ops business, that is the difference between a spike and a retention asset. Garena is already locking Thai creators through its own club programmes, so relationship timing is competitive, not administrative.",
      stat: "40%", statLabel: "of a video's views on YouTube happen more than a month after it goes live"
    },
    {
      n: "2", color: C.r2,
      head: "Put paid behind it with creator partnerships boost",
      body: "Creator partnerships boost lets an advertiser promote a creator's own video as an ad across the funnel, running from the creator's account with the brand attached, on Shorts and in-stream. The creator adds the brand partner in YouTube Studio and links the video to the Google Ads account. Minimum ad-spend thresholds that used to gate access have been removed.",
      stat: "86%", statLabel: "higher incremental long-term ROAS than paid social"
    },
    {
      n: "3", color: C.r3,
      head: "Measure it like media, not like influencer marketing",
      body: "YouTube Creator Partnerships, formerly BrandConnect, brings organic and paid metrics for linked creator videos together in a single view, with Brand Lift, Search Lift and Conversion Lift studies.",
      stat: "Brand, Search, Conversion", statLabel: "the reporting standard VNG already applies to user acquisition spend, extended to creator work"
    }
  ];

  moves.forEach(function (mv, i) {
    const x = xs[i];
    card(s, x, cy, cw, ch);
    chip(s, x + 0.28, cy + 0.20, 0.34, 0.28, mv.n, mv.color, C.white, 10);
    txt(s, mv.head, { x: x + 0.70, y: cy + 0.16, w: cw - 0.98, h: 0.52, size: 12.5, bold: true, color: C.white, lineSpacingMultiple: 1.05 });
    txt(s, mv.body, { x: x + 0.28, y: cy + 0.82, w: cw - 0.56, h: 1.44, size: 9.5, color: C.grey, lineSpacingMultiple: 1.12 });

    card(s, x + 0.28, cy + 2.32, cw - 0.56, 0.72, { fill: C.surface2, line: C.border });
    txt(s, mv.stat, { x: x + 0.46, y: cy + 2.40, w: cw - 0.92, h: 0.26, size: i === 2 ? 11 : 15, bold: true, color: C.red });
    txt(s, mv.statLabel, { x: x + 0.46, y: cy + 2.68, w: cw - 0.92, h: 0.32, size: 8.5, color: C.neutText, lineSpacingMultiple: 1.05 });
  });

  // closing band
  const by = 5.40, bw = 7.35;
  card(s, M, by, bw, 1.04);
  tick(s, M + 0.28, by + 0.18, 0.22, C.red);
  txt(s, "VNG already staffs a 4-tier creator roster and a player-to-creator pipeline. The 2027 opening in Thailand is not more creators, it is the always-on YouTube layer underneath the ones they already work with.",
    { x: M + 0.47, y: by + 0.12, w: bw - 0.75, h: 0.80, size: 11, bold: true, color: C.white, valign: "middle", lineSpacingMultiple: 1.12 });

  const nx = M + bw + 0.3, nw = CW - bw - 0.3;
  card(s, nx, by, nw, 1.04);
  tick(s, nx + 0.28, by + 0.18, 0.20, C.red);
  txt(s, "Next steps", { x: nx + 0.47, y: by + 0.14, w: nw - 0.75, h: 0.24, size: 11, bold: true, color: C.white });
  txt(s, "1  Verify genre and brand safety on the shortlist.\n2  Confirm creator partnerships boost availability for the Thailand advertiser market with the Google team.\n3  Scope a 1-title pilot.",
    { x: nx + 0.47, y: by + 0.42, w: nw - 0.75, h: 0.54, size: 8.5, color: C.grey, lineSpacingMultiple: 1.08 });

  s.addNotes(
    "This is the ask, so make it a budget line, not a good idea.\n\n" +
    "Move 1: shift from launch bookings to standing creator partnerships. The reason is mechanical. 40% of a video's views on YouTube happen more than a month after it goes live. For a live-ops business that is the difference between a spike and a retention asset. And Garena is already locking Thai creators into its own club programmes, so the timing on relationships is competitive, not administrative.\n\n" +
    "Move 2: put paid behind the creator content with creator partnerships boost. That format lets you promote a creator's own video as an ad across the funnel, running from the creator's account with the brand attached, on Shorts and in-stream. Mechanically the creator adds the brand partner in YouTube Studio and links the video to the Google Ads account. The minimum ad-spend thresholds that used to gate this have been removed. YouTube drives 86% higher incremental long-term ROAS than paid social.\n\n" +
    "Important caveat, and say it plainly if they ask: creator partnerships boost has been rolling out market by market. Availability for the Thailand advertiser market has to be confirmed with the Google team before we promise anything. Do not give them a date.\n\n" +
    "Move 3: measure it like media. YouTube Creator Partnerships, formerly BrandConnect, brings the organic and paid metrics for linked creator videos together in a single view, with Brand Lift, Search Lift and Conversion Lift studies. That is the same reporting standard VNG already applies to user acquisition spend, just extended to creator work.\n\n" +
    "Close on this. VNG already staffs a 4-tier creator roster and a player-to-creator pipeline. The opening in Thailand for 2027 is not more creators. It is the always-on YouTube layer underneath the ones they already work with.\n\n" +
    "Next steps are small and concrete: verify genre and brand safety on the shortlist, confirm creator partnerships boost availability for Thailand with the Google team, and scope a 1-title pilot."
  );
})();

pres.writeFile({ fileName: "vng-thai-creators-2027.pptx" })
  .then(function (f) { console.log("written:", f); })
  .catch(function (e) { console.error(e); process.exit(1); });
