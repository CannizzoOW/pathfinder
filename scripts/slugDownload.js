// download-characters.js
// Node 18+
// Downloads hero avatar images and saves them as: images/characters/<slug>.<ext>
// If either <slug>.png or <slug>.webp already exists locally, it skips download.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_URL = "https://rivalskins.com/assets/hero-icons-avatars/";
const OUT_DIR = path.join(__dirname, "images", "characters");

const CONCURRENCY = 6;
const TIMEOUT_MS = 30000;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.promises.access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchText(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { "User-Agent": "character-downloader/1.0" }
    });

    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

async function downloadToFile(url, outPath) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { "User-Agent": "character-downloader/1.0" }
    });

    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.promises.writeFile(outPath, buffer);
    return buffer.length;
  } finally {
    clearTimeout(t);
  }
}

function extractAvatarImages(html) {
  const $ = cheerio.load(html);
  const results = [];
  const seen = new Set();

  $("img").each((_, img) => {
    const srcRaw = ($(img).attr("src") || "").trim();
    if (!srcRaw) return;

    // Normalize relative URLs
    const src = srcRaw.startsWith("http")
      ? srcRaw
      : new URL(srcRaw, ASSETS_URL).toString();

    // Only match files like *_avatar.webp/png/jpg/jpeg
    if (!/_avatar\.(webp|png|jpg|jpeg)$/i.test(src)) return;

    const fileName = path.basename(new URL(src).pathname);
    if (seen.has(fileName)) return;
    seen.add(fileName);

    // Extract slug and extension from filename
    const match = fileName.match(/^(.+)_avatar\.(webp|png|jpg|jpeg)$/i);
    if (!match) return;

    const slug = match[1].toLowerCase();
    const ext = match[2].toLowerCase();

    results.push({ slug, ext, url: src });
  });

  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function runPool(items, worker, concurrency) {
  let i = 0;

  const workers = Array.from({ length: concurrency }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      await worker(items[idx]);
    }
  });

  await Promise.all(workers);
}

async function main() {
  ensureDir(OUT_DIR);

  console.log("Fetching avatar list...");
  const html = await fetchText(ASSETS_URL);
  const avatars = extractAvatarImages(html);

  if (!avatars.length) {
    console.error("No avatar images found.");
    process.exit(1);
  }

  console.log(`Found ${avatars.length} avatars.`);

  await runPool(
    avatars,
    async ({ slug, ext, url }) => {

      const pngPath = path.join(OUT_DIR, `${slug}.png`);
      const webpPath = path.join(OUT_DIR, `${slug}.webp`);

      // If either PNG or WEBP already exists, skip download
      if (await fileExists(pngPath) || await fileExists(webpPath)) {
        console.log(`- ${slug} already exists (.png or .webp), skipping`);
        return;
      }

      const outFile = path.join(OUT_DIR, `${slug}.${ext}`);

      try {
        const bytes = await downloadToFile(url, outFile);
        console.log(`+ ${slug}.${ext} downloaded (${bytes} bytes)`);
      } catch (err) {
        console.warn(`! ${slug} failed: ${err.message}`);
      }
    },
    CONCURRENCY
  );

  console.log("Done ✅");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});