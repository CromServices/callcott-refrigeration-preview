import { createServer } from "node:http";
import { readFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import net from "node:net";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shotsDir = join(root, "checks", "shots");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const failures = [];
function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

function canConnect(host, port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host, port }, () => {
      sock.end();
      resolve(true);
    });
    sock.on("error", () => resolve(false));
    sock.setTimeout(400, () => {
      sock.destroy();
      resolve(false);
    });
  });
}

function startServer() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    let path = decodeURIComponent(url.pathname);
    if (path === "/") path = "/index.html";
    const file = join(root, path.replace(/^\/+/, ""));
    if (!file.startsWith(root) || !existsSync(file)) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    try {
      const buf = await readFile(file);
      res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
      res.end(buf);
    } catch {
      res.writeHead(500);
      res.end("error");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

const BANNED = [
  { re: /\bplaceholder\b/i, name: "placeholder" },
  { re: /\bTODO\b/, name: "TODO" },
  { re: /\bwireframe\b/i, name: "wireframe" },
  { re: /\bbrief\b/i, name: "brief" },
  { re: /L-0/i, name: "L-0" },
  { re: /\binvented\b/i, name: "invented" },
  { re: /\bsample\b/i, name: "sample" },
  { re: /\bdemo\b/i, name: "demo" },
  { re: /\btemplate\b/i, name: "template" },
  { re: /\bconcept\b/i, name: "concept" },
  { re: /\billustrative\b/i, name: "illustrative" },
  { re: /\bAI\b/, name: "AI" },
  { re: /\bbot\b/i, name: "bot" },
  { re: /\bpricing\b/i, name: "pricing" },
  { re: /(?:A\$|\$)\s*\d/, name: "price amount" },
  { re: /stay on this page/i, name: "stay on this page" },
  { re: /does not send/i, name: "does not send" },
  { re: /no online price/i, name: "no online price" },
  { re: /Hargrave/i, name: "street address" },
  { re: /cory@/i, name: "cory@ email" },
  { re: /calendar/i, name: "calendar" },
  { re: /Crom /i, name: "Crom meta" },
  { re: /AU28223/i, name: "ARC number" },
  { re: /\bARC\b/, name: "ARC" },
  { re: /\bvendor\b/i, name: "vendor" },
  { re: /\btool\b/i, name: "tool" },
];

function relLum(rgb) {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return 0;
  const ch = (v) => {
    v = Number(v) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(m[1]) + 0.7152 * ch(m[2]) + 0.0722 * ch(m[3]);
}
function contrastRatio(fg, bg) {
  const L1 = relLum(fg);
  const L2 = relLum(bg);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

async function overflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return {
      client: doc.clientWidth,
      scroll: doc.scrollWidth,
      body: document.body.scrollWidth,
    };
  });
}

async function destick(page) {
  await page.addStyleTag({
    content:
      "header.site{position:static !important}.sticky-call{position:static !important}body{padding-bottom:0 !important}",
  });
}

async function shot(page, name) {
  const path = join(shotsDir, name);
  await page.screenshot({ path, fullPage: true });
  return path;
}

async function setViewport(page, width, height = 900) {
  await page.setViewportSize({ width, height });
}

async function goto(page, origin, theme) {
  await page.addInitScript((t) => {
    localStorage.setItem("callcott-theme", t);
  }, theme);
  await page.goto(origin + "/index.html", { waitUntil: "load" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
}

const { server, origin } = await startServer();
await mkdir(shotsDir, { recursive: true });

const proxyOn = await canConnect("127.0.0.1", 8791);
const launch = { headless: true };
if (proxyOn) launch.proxy = { server: "http://127.0.0.1:8791" };

const browser = await chromium.launch(launch);
const context = await browser.newContext({
  colorScheme: "light",
  locale: "en-AU",
  timezoneId: "Australia/Sydney",
});
const page = await context.newPage();
const shotPaths = [];

await goto(page, origin, "light");

const htmlFiles = (await readdir(root)).filter((n) => n.endsWith(".html"));
for (const name of htmlFiles) {
  const html = await readFile(join(root, name), "utf8");
  assert(/<meta name="robots" content="noindex">/.test(html), `${name} missing noindex meta`);
  assert(!/AU28223/i.test(html), `${name} contains ARC number`);
  assert(!/^---\s*$/m.test(html), `${name} has front matter`);
}
const robots = await readFile(join(root, "robots.txt"), "utf8");
assert(/User-agent:\s*\*/i.test(robots) && /Disallow:\s*\//i.test(robots), "robots.txt is not disallow-all");
assert(!/overflow-x:\s*hidden/.test(await readFile(join(root, "styles.css"), "utf8")), "overflow-x:hidden is present");
assert(existsSync(join(root, "_config.yml")), "missing _config.yml");
assert(!existsSync(join(root, ".nojekyll")), ".nojekyll must not be present");

function photoStem(src) {
  const base = src.split("/").pop().split("?")[0];
  return base.replace(/-\d+\.(webp|jpg|jpeg|png)$/i, "").replace(/\.(webp|jpg|jpeg|png)$/i, "");
}

const contentUses = {};
await page.evaluate(() => {});
const imgInfo = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll("img")];
  return imgs.map((img) => ({
    src: img.getAttribute("src") || "",
    inLightbox: !!img.closest(".lightbox"),
    inLogo: !!img.closest(".logo"),
    inHero: !!img.closest(".hero"),
    inHire: !!img.closest("#hire"),
    inGallery: !!img.closest(".bento"),
  }));
});
for (const img of imgInfo) {
  if (img.inLightbox || img.inLogo) continue;
  const stem = photoStem(img.src);
  contentUses[stem] = (contentUses[stem] || 0) + 1;
}
for (const [stem, n] of Object.entries(contentUses)) {
  const allowed = stem === "gal-ute-sign" || stem === "gal-mobile-room" ? 2 : 1;
  assert(n <= allowed, `photo ${stem} used ${n} times as content`);
}
const hireSrc = imgInfo.filter((i) => i.inHire).map((i) => i.src).join(" ");
assert(/gal-mobile-room/.test(hireSrc), "hire section missing gal-mobile-room");
const gallerySrc = imgInfo.filter((i) => i.inGallery).map((i) => i.src).join(" ");
assert(/gal-mobile-room/.test(gallerySrc), "gallery missing gal-mobile-room");

await setViewport(page, 390, 844);
const ov390 = await overflow(page);
assert(ov390.scroll <= ov390.client + 1, `horizontal overflow at 390: ${ov390.scroll} > ${ov390.client}`);

const bar = page.locator(".sticky-call");
assert(await bar.isVisible(), "Call|Quote bar not visible at 390");
const heroCall = page.locator(".hero .btn-accent");
assert(await heroCall.isVisible(), "hero Call button not visible at 390");
const callColor = await heroCall.evaluate((el) => getComputedStyle(el).backgroundColor);
assert(callColor === "rgb(179, 89, 3)", `hero Call fill ${callColor} is not accent`);
const callFg = await heroCall.evaluate((el) => getComputedStyle(el).color);
assert(callFg === "rgb(255, 255, 255)", `hero Call text ${callFg} is not white`);

const barMetrics = await page.evaluate(() => {
  const el = document.querySelector(".sticky-call");
  const links = [...el.querySelectorAll("a")];
  const tops = new Set(links.map((a) => Math.round(a.getBoundingClientRect().top)));
  return {
    tops: [...tops],
    height: el.getBoundingClientRect().height,
    text: links.map((a) => a.textContent.trim()).join("|"),
    count: links.length,
    callBg: getComputedStyle(links[0]).backgroundColor,
    callFg: getComputedStyle(links[0]).color,
  };
});
assert(barMetrics.count === 2, `expected 2 bar links, got ${barMetrics.count}`);
assert(barMetrics.tops.length === 1, `Call|Quote bar not a single line (tops ${barMetrics.tops})`);
assert(/call/i.test(barMetrics.text) && /quote/i.test(barMetrics.text), `bar text was ${barMetrics.text}`);
assert(barMetrics.callBg === "rgb(179, 89, 3)", `bar Call fill ${barMetrics.callBg}`);
assert(barMetrics.callFg === "rgb(255, 255, 255)", `bar Call text ${barMetrics.callFg}`);

const heroGaps = await page.evaluate(() => {
  const header = document.querySelector("header.site").getBoundingClientRect();
  const hero = document.querySelector(".hero").getBoundingClientRect();
  const bar = document.querySelector(".sticky-call").getBoundingClientRect();
  return {
    above: Math.round(hero.top - header.bottom),
    below: Math.round(bar.top - hero.bottom),
  };
});
assert(heroGaps.above <= 1, `blank gap above hero at 390: ${heroGaps.above}px`);

await setViewport(page, 320, 720);
const ov320 = await overflow(page);
assert(ov320.scroll <= ov320.client + 1, `horizontal overflow at 320: ${ov320.scroll} > ${ov320.client}`);

await setViewport(page, 1440, 900);
const ov1440 = await overflow(page);
assert(ov1440.scroll <= ov1440.client + 1, `horizontal overflow at 1440: ${ov1440.scroll} > ${ov1440.client}`);

const toggle = page.locator('[aria-label="Switch light/dark"]');
assert((await toggle.count()) === 1, "theme toggle missing");

async function iconState() {
  return page.evaluate(() => {
    const sun = document.querySelector(".icon-sun");
    const moon = document.querySelector(".icon-moon");
    const cs = (el) => getComputedStyle(el);
    return {
      theme: document.documentElement.getAttribute("data-theme"),
      sunOp: parseFloat(cs(sun).opacity),
      moonOp: parseFloat(cs(moon).opacity),
      sunDisplay: cs(sun).display,
      moonDisplay: cs(moon).display,
    };
  });
}

const before = await page.locator("html").getAttribute("data-theme");
const iconsBefore = await iconState();
assert(iconsBefore.sunDisplay !== "none" && iconsBefore.moonDisplay !== "none", "toggle still uses display:none");
if (before === "dark") {
  assert(iconsBefore.sunOp > 0.5 && iconsBefore.moonOp < 0.5, `dark theme should show sun, got sun ${iconsBefore.sunOp} moon ${iconsBefore.moonOp}`);
} else {
  assert(iconsBefore.moonOp > 0.5 && iconsBefore.sunOp < 0.5, `light theme should show moon, got sun ${iconsBefore.sunOp} moon ${iconsBefore.moonOp}`);
}
await toggle.click();
await page.waitForTimeout(300);
const after = await page.locator("html").getAttribute("data-theme");
assert(before !== after, `theme did not toggle (still ${after})`);
const iconsAfter = await iconState();
if (after === "dark") {
  assert(iconsAfter.sunOp > 0.5 && iconsAfter.moonOp < 0.5, `after click dark, sun ${iconsAfter.sunOp} moon ${iconsAfter.moonOp}`);
} else {
  assert(iconsAfter.moonOp > 0.5 && iconsAfter.sunOp < 0.5, `after click light, sun ${iconsAfter.sunOp} moon ${iconsAfter.moonOp}`);
}
await toggle.click();
await page.waitForTimeout(300);

async function assertSticky(width, height) {
  await setViewport(page, width, height);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.scrollTo(0, 1500));
  const top = await page.locator("header.site").evaluate((el) => el.getBoundingClientRect().top);
  assert(top === 0, `header top is ${top} after 1500px scroll at ${width}, expected 0`);
  const overlap = await page.evaluate(() => {
    const header = document.querySelector("header.site").getBoundingClientRect();
    const bar = document.querySelector(".sticky-call");
    if (!bar) return false;
    const style = getComputedStyle(bar);
    if (style.display === "none") return false;
    const br = bar.getBoundingClientRect();
    return header.bottom > br.top && header.top < br.bottom;
  });
  assert(!overlap, `header covers the Call|Quote bar at ${width}`);
  await page.evaluate(() => window.scrollTo(0, 0));
}
await assertSticky(1440, 900);
await assertSticky(390, 844);

const weekendInfo = await page.evaluate(() => {
  const chips = [...document.querySelectorAll(".day-chips button")];
  const weekends = chips.filter((b) => b.dataset.dow === "0" || b.dataset.dow === "6");
  return {
    count: chips.length,
    weekendCount: weekends.length,
    weekendsDisabled: weekends.every((b) => b.disabled),
    anyWeekendEnabled: weekends.some((b) => !b.disabled),
  };
});
assert(weekendInfo.count === 14, `expected 14 day chips, got ${weekendInfo.count}`);
assert(weekendInfo.weekendCount > 0, "no weekend chips to assert");
assert(weekendInfo.weekendsDisabled, "weekends are not all disabled");
assert(!weekendInfo.anyWeekendEnabled, "a weekend chip is enabled");

const pills = await page.locator(".time-pills .pill").allTextContents();
assert(pills.map((t) => t.trim()).join("|") === "Morning|Midday|Afternoon", `time pills were ${pills.join("|")}`);

await page.goto(origin + "/index.html#pic-ute", { waitUntil: "load" });
const lb = await page.evaluate(() => {
  const el = document.querySelector("#pic-ute");
  const cs = getComputedStyle(el);
  return { display: cs.display, matches: el.matches(":target") };
});
assert(lb.matches, "lightbox is not :target");
assert(lb.display === "flex", `lightbox display is ${lb.display}, expected flex`);

const visible = await page.evaluate(() => document.body.innerText);
for (const item of BANNED) {
  const hit = visible.match(item.re);
  if (hit) failures.push(`banned text "${item.name}" matched ${JSON.stringify(hit[0])}`);
}

async function contrastPairs(p) {
  return p.evaluate(() => {
    function bgOf(el) {
      let n = el;
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return { bg, el: n };
        n = n.parentElement;
      }
      return { bg: getComputedStyle(document.body).backgroundColor, el: document.body };
    }
    const pairs = [];
    document.querySelectorAll(".kicker, .btn-accent, .sticky-call a.call").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const { bg } = bgOf(el);
      pairs.push({
        text: el.className,
        fg: cs.color,
        bg: cs.backgroundColor !== "rgba(0, 0, 0, 0)" ? cs.backgroundColor : bg,
      });
    });
    return pairs;
  });
}

const contrastLog = [];
async function assertContrast(p, theme) {
  const pairs = await contrastPairs(p);
  for (const pair of pairs) {
    const r = contrastRatio(pair.fg, pair.bg);
    contrastLog.push(`${theme} ${pair.text}: ${r.toFixed(2)}:1 (${pair.fg} on ${pair.bg})`);
    assert(r >= 4.5, `${theme} ${pair.text} contrast ${r.toFixed(2)}:1`);
  }
}
await assertContrast(page, "light");
const darkC = await browser.newPage();
await goto(darkC, origin, "dark");
await assertContrast(darkC, "dark");
await darkC.close();

const lightShots = await browser.newPage();
await goto(lightShots, origin, "light");
await destick(lightShots);
await setViewport(lightShots, 1440, 900);
shotPaths.push(await shot(lightShots, "desktop-1440-light.png"));
await setViewport(lightShots, 390, 844);
shotPaths.push(await shot(lightShots, "mobile-390-light.png"));
await lightShots.close();

const contextDark = await browser.newContext({
  colorScheme: "dark",
  locale: "en-AU",
  timezoneId: "Australia/Sydney",
});
const pageDark = await contextDark.newPage();
await goto(pageDark, origin, "dark");
await destick(pageDark);
await setViewport(pageDark, 1440, 900);
shotPaths.push(await shot(pageDark, "desktop-1440-dark.png"));
await setViewport(pageDark, 390, 844);
shotPaths.push(await shot(pageDark, "mobile-390-dark.png"));
await contextDark.close();

const successPage = await browser.newPage();
await goto(successPage, origin, "light");
await successPage.locator("#b-name").fill("Alex Morgan");
await successPage.locator("#b-phone").fill("0402 334 403");
await successPage.locator('#book-form button[type="submit"]').click();
await successPage.locator("#book-success").waitFor({ state: "visible" });
assert(await successPage.locator("#book-form").isHidden(), "booking form still visible after submit");
await destick(successPage);
await setViewport(successPage, 1440, 900);
shotPaths.push(await shot(successPage, "booking-success-1440.png"));
await setViewport(successPage, 390, 844);
shotPaths.push(await shot(successPage, "booking-success-390.png"));
const successText = await successPage.locator("#book-success").innerText();
await successPage.close();

assert(/Visit request saved/i.test(successText), `unexpected success copy: ${successText}`);
assert(!/email/i.test(successText), "success copy mentions email");
assert(!/call you/i.test(successText), "success copy promises a call");
assert(!/calendar/i.test(successText), "success copy mentions calendar");
assert(!/follow-?up/i.test(successText), "success copy promises follow-up");

await browser.close();
server.close();

if (failures.length) {
  console.error("FAIL");
  for (const f of failures) console.error(" -", f);
  process.exit(1);
}

console.log("PASS");
console.log("proxy", proxyOn ? "http://127.0.0.1:8791" : "off (8791 closed)");
console.log("contrast");
for (const line of contrastLog) console.log(line);
console.log("shots");
for (const p of shotPaths) console.log(p);
