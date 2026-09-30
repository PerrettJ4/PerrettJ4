// Renders each CV page to pdf/ as A4 pages, laid out as the site looks in a
// desktop browser (1280px wide, scaled to fit the page width). Sections are kept
// whole across page breaks, and symbols with no glyph in Exo 2 (arrows, stars,
// emoji) are swapped for plain text so every font embeds as TrueType: recruiting
// systems often can't open oversized pages or read Type 3 fonts.
//
//   npm run pdf         build all CVs once
//   npm run pdf:watch   rebuild whenever an .html / styles.css / image changes
//
// If tailored.json exists (gitignored), it also builds company-specific PDFs:
// each entry loads a base page and swaps one profile sentence before printing,
// so the published pages stay generic.
//   [{ "base": "sports.html", "out": "James-Perrett-CV-Hudl.pdf",
//      "from": "<sentence in the profile>", "to": "<replacement>" }]

import { watch } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "pdf");
const WIDTH = 1280;
const A4_WIDTH_PX = 793.7; // 210mm at 96dpi
const A4_HEIGHT_PX = 1122.5; // 297mm at 96dpi
const SCALE = A4_WIDTH_PX / WIDTH;
const PAGE_GAP_PX = 56; // space above a section that starts a new page

// page -> output PDF name
const CVS = {
  "index.html": "James-Perrett-CV-Product.pdf",
  "enterprise.html": "James-Perrett-CV-Enterprise.pdf",
  "sports.html": "James-Perrett-CV-Sports.pdf",
};

const browser = await puppeteer.launch();

async function loadTailored() {
  try {
    return JSON.parse(await readFile(join(root, "tailored.json"), "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function buildOne(file, pdfName, edit) {
  const started = Date.now();
  const outFile = join(outDir, pdfName);
  const pageUrl = pathToFileURL(join(root, file)).href;
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: WIDTH, height: 1000 });
    await page.emulateMediaType("screen");
    await page.goto(pageUrl, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);

    if (edit) {
      await page.evaluate(({ from, to }) => {
        const clean = (el) => el.textContent.replace(/\s+/g, " ").trim();
        const p = [...document.querySelectorAll("#profile p")].find((el) =>
          clean(el).includes(from)
        );
        if (!p) throw new Error(`profile sentence not found: "${from}"`);
        p.textContent = clean(p).replace(from, to);
      }, edit);
    }

    await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let node; (node = walker.nextNode()); ) {
        node.textContent = node.textContent
          .replace(/\s*→\s*/g, " to ")
          .replace(/★/g, "-star")
          .replace(/\s*\p{Extended_Pictographic}\uFE0F?/gu, "");
      }
    });
    // At the site's 0.1em letter-spacing, text extractors read the name as "JAM ES".
    await page.addStyleTag({ content: ".heading-box .headings { letter-spacing: 0.06em; }" });

    // Paginate by hand in screen layout: page margins print white, so instead
    // push any section that would straddle an A4 break onto the next page (with
    // a gap above it), then stretch the page so the background fills every page.
    const pages = await page.evaluate(
      ({ pageHeight, gap }) => {
        const top = (el) => el.getBoundingClientRect().top + window.scrollY;
        for (const col of document.querySelectorAll("#page-cols .col")) {
          for (const el of col.children) {
            const start = top(el);
            const end = start + el.getBoundingClientRect().height;
            const pageEnd = (Math.floor(start / pageHeight) + 1) * pageHeight;
            if (end > pageEnd) {
              el.style.marginTop = `${pageEnd - start + gap}px`;
            }
          }
        }
        const count = Math.ceil(document.documentElement.scrollHeight / pageHeight);
        document.body.style.minHeight = `${count * pageHeight - 2}px`;
        return count;
      },
      { pageHeight: A4_HEIGHT_PX / SCALE, gap: PAGE_GAP_PX }
    );

    await page.pdf({
      path: outFile,
      format: "A4",
      scale: SCALE,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      printBackground: true,
    });
    console.log(`✓ ${outFile} (${pages} pages, ${Date.now() - started}ms)`);
  } catch (err) {
    console.error(`✗ ${file} failed:`, err.message);
  } finally {
    await page.close();
  }
}

async function build() {
  await mkdir(outDir, { recursive: true });
  const tailored = await loadTailored();
  await Promise.all([
    ...Object.entries(CVS).map(([file, pdfName]) => buildOne(file, pdfName)),
    ...tailored.map((t) => buildOne(t.base, t.out, t)),
  ]);
}

await build();

if (!process.argv.includes("--watch")) {
  await browser.close();
} else {
  let timer;
  let running = Promise.resolve();
  const ignored = /^(pdf|node_modules|scripts|\.git)\b|\.DS_Store$|\.pdf$/;

  watch(root, { recursive: true }, (_event, file) => {
    if (!file || ignored.test(file)) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(`↻ ${file} changed`);
      running = running.then(build);
    }, 200);
  });

  console.log("Watching for changes… (Ctrl+C to stop)");
  process.on("SIGINT", async () => {
    await browser.close();
    process.exit(0);
  });
}
