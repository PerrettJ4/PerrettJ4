// Renders each CV page to pdf/ as one continuous page, matching how the site
// looks in a desktop browser.
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

    const height = await page.evaluate(() =>
      Math.ceil(document.documentElement.scrollHeight)
    );

    await page.pdf({
      path: outFile,
      width: `${WIDTH}px`,
      height: `${height + 1}px`,
      printBackground: true,
      pageRanges: "1",
    });
    console.log(`✓ ${outFile} (${Date.now() - started}ms)`);
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
