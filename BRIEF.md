# Callcott Refrigeration & Air Conditioning — static GitHub Pages preview brief

For a Cursor cloud agent. Write the site code only. Do not contact the business, or Cory. Do not push this URL to Nate, or to the client, until Audit passes the L-103 gate. The parent launches this run; do not start further cloud agents.

Written 10 Nov 2026, ~23:45 AWST (Australia/Perth), from Production’s approved wireframe (`wireframe.html` md5 `ed530a5d6e7d2a24e92bf59219a8ef53`) and Director’s job card (Nate GO 23:37 AWST). This is a **static noindex GitHub Pages** preview, not a Wix build, and nothing may touch the client’s site or account.

---

## 1. Route

Public repo `CromServices/callcott-refrigeration-preview`, branch `main`, GitHub Pages from `main` `/`. Expected URL:

https://cromservices.github.io/callcott-refrigeration-preview/

The repo already has `assets/`, `fonts/`, `robots.txt` (`User-agent: *` / `Disallow: /`), this `BRIEF.md`, and a placeholder `index.html` with `<meta name="robots" content="noindex">`. Replace the placeholder with the finished Home. Keep the noindex meta on every page. Keep `robots.txt` as disallow-all. Add an empty `.nojekyll` if it is not already there.

Commit as Crom Services `<cromservices@gmail.com>`. Do not add a custom domain. Do not edit any other CromServices repo. A read-only reference for the sun/moon toggle, booking widget, and CSS `:target` lightbox (not for brand or copy) is https://cromservices.github.io/ozzy-gyprock-preview/ — do not modify that repo.

Deliverable: a single Home page (`index.html` plus CSS/JS as needed) that matches the attached `wireframe.html` layout, with the colour, chrome, booking, and copy rules in this brief. Inner marketing pages are optional; Home is what Audit will gate.

---

## 2. Source files

Canonical production pack (do not overwrite): `/workspace/crom/projects/crom-desk/02-working/production/outbound-spec-sites-2026-11-10/callcott-refrigeration/`

A working copy sits in `/workspace/crom/projects/crom-desk/02-working/coder2/outbound-spec-sites-2026-11-10/callcott-refrigeration/`. The parent attaches `wireframe.html` and `wireframe.md` to the cloud run. Approved images and fonts are already in this repo (no `assets/source/` folder).

| File | md5 | Role |
|---|---|---|
| `wireframe.html` | `ed530a5d6e7d2a24e92bf59219a8ef53` | Home layout, spacing, visible copy (upgrade booking and drop banned lines) |
| `wireframe.md` | `6c139ba7ae1c163f93ef2f968810c831` | Facts, sourcing, structure |
| `assets/logo.png` / `assets/logo-400.webp` | `2ab8ed9c14a418542beded52398bfb15` / `a5bbfe6fa9d1599245792d3416e35f72` | **Original** logo, kept |
| `assets/logo-on-dark.png` | `5a5ebf4019e1613d767a95abed4b1d8e` | Same mark, transparent, for dark grounds |
| `assets/hero-480.webp` (plus `.jpg` / 768) | `4ed606a934d802b0d179de933e47f73a` | Hero — branded Hilux, once |
| `fonts/manrope-400.woff2` / `manrope-700.woff2` / `sourcesans3.woff2` | `700bdb48f816f3a1cfe09e57bbc4397e` / `f473cffa9febfb6c91827efb2cafdee7` / `9ef356ea553ac473c76cc863ff644c35` | Self-host |

**Logo refresh: no.** The original swoosh mark is already strong (CALLCOTT with a fan in the O, and the licence line). A trial redraw was weaker than the original and is **not** presented as a refresh. Use the original mark (`logo.png` / `logo-400.webp` / `logo-800.webp` on light grounds; `logo-on-dark.*` on dark grounds). **Ignore** any leftover `logo-before-after.png` in the production proofs folder — do not cite it, do not commit it, do not put a comparison on the page or in the public repo.

Old-site shots already exist in the production pack as `proofs/current-desktop-1440.png` and `proofs/current-mobile-390.png` (there are no files named `current-desktop-1440-first.png` / `current-mobile-390-first.png`; `desktop-1440-first.png` / `mobile-390-first.png` are first-view crops of the new wireframe). After the build, compose `proofs/before-after-desktop.png` and `proofs/before-after-mobile.png` only — no logo before/after.

Correct typos in the live copy in all visible text; do not add facts. Do not put `cory@callref.com.au` on the page.

---

## 3. Hard rules

- `<meta name="robots" content="noindex">` on every page, and `robots.txt` disallow-all, before any URL is announced.
- No pricing on the page. Drop the wireframe line “There is no online price.” Published hire durations (daily, weekend, weekly, long-term) and room size / kW ranges may stay, because they are already on their site and are not dollar prices.
- **No street address and no ABN.** No street address is published as visible copy anyway. The published postal address (PO Box 3453, West Tamworth NSW 2340) may appear in Contact. Do not print the ABN, even though it is published.
- No invented reviews, ratings, stats, opening hours, or licence numbers. Published ARC AU28223 and Lic. 240646C may appear. Do not invent hours. No reviews block. No map.
- No builder/demo/AI wording. Public copy uses only facts published on `https://www.callref.com.au/`, fetched 10 Nov 2026, typo-corrected.
- Do not email service@callref.com.au, cory@callref.com.au, or anyone at the business. Widgets are in-page only and must not send mail.
- Honour `prefers-reduced-motion`. Tap targets ≥ 44px.

## Shared build standards (write these into the page behaviour, not as on-page copy)

These come from locks.md, the 10 Nov Ozzy/Subzero job, Production research.md, and Director’s 23:37 job card. Do not print lock names, file paths, or “per the brief” on the rendered page.

### L-103 (locks.md, 10 Nov 2026 21:54 AWST)

Every preview is read as the client would read it. Scan rendered visible text for internal or builder notes. Ban-list: as listed, no invented, placeholder, TODO, per wireframe, brief, L-0, Crom meta-talk, “This form does not send.” Any hit is a BLOCK. The only allowed placeholder is a marked photo slot: **Your photo here**. Copy where the client site gives no detail is written in the client voice from facts on their site only. Sourcing notes live in `wireframe.md`, never on the page.

Also **L-101**: no sample, demo, template, concept, or “illustrative” wording on the pages, titles, metas, or alt text. Honesty that this is a Crom pitch preview belongs in `README.md` only.

### L-105 (locks.md, 10 Nov 2026 22:06 AWST)

Keep the business’s own photos, logo and brand colours, modernised. No stock that could pass as theirs. A marked photo slot only where no usable photograph exists. No empty panels. Real copy on every card. Each photograph is used once as a content image (a CSS lightbox of that same image is not a second use).

### L-072 sun/moon toggle (locks.md, amended 10 Nov 2026 22:59 AWST)

Every site ships light and dark themes. Default follows the device (`prefers-color-scheme`). A **single small sun/moon icon button** (about 36px) sits at the **right of the nav**, `aria-label="Switch light/dark"`, switches light/dark, and is remembered per device. **No visible System option.** Dark keeps the brand accents and headings with contrast ≥ 4.5:1 (3:1 for large text). Check both themes at 390 and 1440 (also 320 and 1920).

### Date chips and time pills (Ozzy/Subzero job card + this Director card; upgrades the wireframe widget)

The wireframe’s booking block is a static 10-day row that includes Saturday and Sunday as selectable, and time pills **Morning / Afternoon / Either**, plus walkthrough copy that promises emails and calendars and the banned line “This preview form does not send.” Do not copy that behaviour.

Required shape on Home:

1. **14 date chips** for the next 14 calendar days in the business’s local timezone (named in this brief). **Weekends disabled** (Saturday and Sunday may be visible or omitted, but must not be selectable). Do not invent clock opening hours.
2. Time-window pills: **Morning, Midday, Afternoon** (not “Either”).
3. Job-type chips from their real services only (listed below).
4. A summary line of the selected day, window, and job type (and, for RPL, the plant).
5. Name and phone fields (email and a customer site-address field are fine).
6. A **full-width Book** button.
7. A **success state** that only restates the saved summary. No step copy that promises emails or calendars, or says “you’ll stay on this page.” No “This form does not send.”

Safe help line, trimmed: “Pick a day that suits you. This holds a visit or a call. The job is confirmed once we reply.”

### Big-image lightbox (Production research.md + each pack’s wireframe)

**Definition**, from `/workspace/crom/projects/crom-desk/02-working/production/outbound-spec-sites-2026-11-10/research.md` (section “Masonry or bento job gallery, with a lightbox”): a bento / masonry gallery of the business’s own job photographs, with fixed aspect ratios, `srcset` in WebP (JPEG fallback), lazy-load below the fold, and a **CSS `:target` lightbox** so a visitor can open a shot without a heavy script. Captions stay short and factual. No shader or scroll libraries.

The pack wireframes already implement this as `.lightbox` panels (`display:none` until `:target { display:flex }`), a full-viewport dark veil, the larger derivative of the same photograph, and a close control with `aria-label="Close"` that returns to `#photos`. See `wireframe.html` in this folder. Where the gallery is marked “Your photo here” slots, still ship the lightbox CSS so it is ready once real photographs are supplied; do not lightbox an empty slot as if it were a photo.

### Sticky chrome the wireframe already asks for

- Sticky header on desktop and at 390.
- At 390: a sticky **Call | Request a quote** (or the site’s Book label) bar on **one line** at the bottom. Call uses the published `tel:` number. No hamburger that hides the phone number. Tap targets ≥ 44px. No horizontal scroll from 320px to 1440px (also check 1920). Honour `prefers-reduced-motion`.


---


---

## 4. Colours and type

Dark navy from the current header, with a deeper orange so white type on the accent meets WCAG AA.

| Token | Hex | Role |
|---|---|---|
| `--dark` | `#243038` | Dark field, footer |
| `--accent` | `#C44A10` | Buttons and selected chips (white ink) |
| `--accent-ink` | `#FFFFFF` | Ink on the accent |
| `--mark` | `#7EC8E8` | Kickers, from the logo swoosh |
| `--paper` / `--header-bg` | `#FFFFFF` | Paper and light header, so the original logo reads cleanly |
| `--ink` | `#1A1F24` | Body text |
| `--muted` | `#3E4A52` | Secondary text |
| `--line` | `#D5DCE1` | Rules |
| `--wash` | `#F3F6F8` | Soft fills |
| `--on-dark` | `#F7FBFC` | On-dark text |

**Type:** Manrope 700 for headings, `clamp(30px, 7.7vw, 56px)` on the H1; Manrope 400 and Source Sans 3 for body (18px desktop, 17px phone), self-hosted latin woff2, SIL OFL. A clean, normal-width bold sans — not Syne, and not an ultra-wide display face.

---

## 5. Copy and facts (published only)

- Name: Callcott Refrigeration & Air Conditioning
- Started: since 2011 / “Keeping cool since 2011”; footer ©2011–2026
- People: “A small, locally owned family business.” Cory Callcott is a fourth-generation Tamworthian who started his apprenticeship locally in 2001. On the page he may be “Cory” as in the live About copy; “Cory Callcott” is fine in Contact.
- Area: Tamworth, the North West and New England
- Postal address: PO Box 3453, West Tamworth NSW 2340
- Phone: 0402 334 403 (`tel:+61402334403`)
- Email: service@callref.com.au
- Licensing: ARC AU28223; Lic. 240646C
- Cool room hire (published): Daily, weekend, weekly and long-term hire. Room size 1500 mm wide × 2100 mm long × 2250 mm high (7 m³). Lockable door, bright internal LED light, adjustable temperature, easy-tow trailer, walk-in design with or without shelving, and two 1200 mm meat rails. HACCP temperature monitoring is available if the room is located within IoT network range.

**Home title:** `Air conditioning and refrigeration, Tamworth | Callcott` plus noindex.

**Meta:** `Air conditioning, refrigeration and cool room hire in Tamworth, the North West and New England. Call 0402 334 403.`

**Nav:** Work, About, Quote, Book a visit, Contact, Cool room hire, 0402 334 403, Request a quote, then the theme button on the right.

**Hero eyebrow:** Tamworth, the North West and New England

**H1:** Keeping Tamworth cool since 2011.

**Hero lead (verbatim):** A small, locally owned family business. Cory is a fourth-generation Tamworthian who started his apprenticeship locally in 2001.

**Hero proof row:** Since 2011 · ARC AU28223 · Lic. 240646C · Tamworth NSW

**Hero CTAs:** Call 0402 334 403 / Request a quote

**Services heading:** Air conditioning, refrigeration and cool rooms

**Service cards (job-type chips use these labels):** Ducted systems; Split systems; Evaporative cooling; Cool rooms and freezer rooms; Cabinets and plant upgrades; Maintenance and monitoring; Cool room hire; Beverage system / beer reticulation (as published). Keep the short published blurbs from `wireframe.html`, including the published kW ranges. Quote-form work types may also include Breakdown and Other — do not invent names beyond the live services.

**About heading / copy:** A small family business in Tamworth / We are a small, locally owned and operated family business. We service most of the North West and New England region, as well as many of the little places in between. / Cory is a fourth-generation Tamworthian and has been working on air-conditioning and refrigeration systems since starting his apprenticeship locally in 2001. We have a wealth of experience on domestic and commercial systems across the region.

**Hire heading / copy:** Mobile cool room hire / Planning an event or a party and need serious fridge space? Then the published size, features, and hire durations in §5.

**Where we work:** Tamworth · North West · New England

**Contact:** Cory Callcott · Callcott Refrigeration & Air Conditioning · 0402 334 403 · service@callref.com.au · Postal address: PO Box 3453, West Tamworth NSW 2340 · ARC AU28223 · Lic. 240646C. No ABN, no street address, no hours, no map.

**Footer:** © 2011–2026 Callcott Refrigeration & Air Conditioning

No reviews block.

**Quote form** (in-page only, must not email the business): Name, Phone, Email, Suburb or address, Type of work, short description, preferred time to talk. Submit: Request a quote. Honest in-page success only. Rewrite the wireframe walkthrough so it does not promise emails, calendars, or “you stay on this page,” and drop “There is no online price” and “This preview form does not send.”

---

## 6. Photographs (each used once)

Prefer the `.webp`; keep the `.jpg` as fallback. Each distinct photograph once as a content image; the CSS `:target` lightbox shows the larger derivative of that same image and does not count as a second use. Alts describe the work, short and factual.

| Asset (use 480 and, where present, 640/768) | Use once as |
|---|---|
| `hero-480` / `hero-768` | Home hero only — the branded Hilux |
| `gal-ute-sign-480` / `-640` | Gallery — tray sign |
| `gal-ac-front-480` | Gallery — outdoor unit on a verandah |
| `gal-ac-indoor-480` / `-640` | Gallery — indoor wall-mounted split |
| `gal-ac-gauges-480` / `-640` | Gallery — unit open for service |
| `gal-coolroom-door-480` | Gallery — finished cool room door |
| `gal-coolroom-inside-480` | Gallery — cool room interior (this file is in the pack and listed in `wireframe.md`; the wireframe HTML omitted it — use it once in the gallery) |
| `gal-coolroom-crane-480` / `-640` | Gallery — crane lift on a refrigeration install |
| `gal-mobile-room-480` | **Hire section only** (not also in the gallery — the wireframe HTML reused it in both places; this brief requires once) |
| `gal-roof-plant-480` / `-640` | Gallery — roof plant |
| `gal-beer-system-480` / `-640` | Gallery — beer reticulation install |

Do not use leftover source JPEGs that were not turned into these derivatives. Do not use the ARC tick as a job photograph. No stock, no empty panels, no “Your photo here” slots (real photographs were available).

---

## 7. Booking widget

Label: **Book a visit**. 14 date chips in **Australia/Sydney**, weekends disabled, Morning / Midday / Afternoon, job-type chips from the real service labels in §5, summary line, full-width Book a visit button, success state. Follow the shared standard in this brief, not the wireframe’s 10-day / Either / email-promise widget.

---

## 8. Verification to return

Save 1440 and 390 shots, light and dark, plus a booking success state and a lightbox-open shot, under the parent’s proof folder (`…/coder2/outbound-spec-sites-2026-11-10/callcott-refrigeration/`), and as cloud-agent artifacts, with MD5SUMS. Compose `proofs/before-after-desktop.png` and `proofs/before-after-mobile.png`. **Do not** produce or publish a logo before/after.

Return:

- [ ] Repo URL, branch, and head SHA. Pages URL, HTTP 200, logged-out curl shows `<meta name="robots" content="noindex">`.
- [ ] Original logo (not the trial redraw) in the header; `logo-on-dark` on dark grounds.
- [ ] Theme button at the right of the nav, `aria-label="Switch light/dark"`, defaults to system. Shots of light and dark at 1440 and 390.
- [ ] Sticky header; at 390 the Call | Request a quote bar is one line.
- [ ] CSS `:target` big-image lightbox on the gallery; each photograph used once; `gal-coolroom-inside` used; `gal-mobile-room` only in hire.
- [ ] Booking: 14 day chips, weekends disabled, Morning/Midday/Afternoon, real service chips, summary line, full-width Book, success state. No email/calendar/“you’ll stay on this page” / “does not send” copy.
- [ ] Visible-text scan (L-103 / L-101): no builder notes, no sample/demo/template wording, no pricing, no ABN, no street address, no invented reviews or hours, no bots/AI, no cory@ email.
- [ ] No email was sent to the business.
