import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_URL = "https://rivalsmeta.com/_nuxt/CnySgJyP.js";
const OUTPUT_FILE = path.join(__dirname, "..", "data", "heroes.json");

/*
  Convert uppercase names into title case.
*/
function toTitleCase(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

/*
  Name overrides (clean and scalable)
*/
const heroNameOverrides = {
    1011: "Hulk"
};

function getHeroName(heroId, rawName) {
    return heroNameOverrides[heroId] || toTitleCase(rawName);
}

/*
  Extract the object assigned to const e from the source file.
*/
function extractHeroObject(source) {
    const startToken = "const e=";
    const endToken = ";export{e as s};";

    const startIndex = source.indexOf(startToken);
    const endIndex = source.lastIndexOf(endToken);

    if (startIndex === -1) {
        throw new Error("Could not find start token: const e=");
    }

    if (endIndex === -1) {
        throw new Error("Could not find end token: ;export{e as s};");
    }

    const objectText = source
        .slice(startIndex + startToken.length, endIndex)
        .trim();

    if (!objectText.startsWith("{") || !objectText.endsWith("}")) {
        throw new Error("Extracted object text does not look like a valid object literal.");
    }

    return objectText;
}

/*
  Turn the JS object literal into a real object.
*/
function parseHeroObject(objectText) {
    return Function(`"use strict"; return (${objectText});`)();
}

/*
  Smart imageId fix (no overrides)
*/
function getHeroImageId(heroId, baseHero) {
    const bigIcon = baseHero.IconPreview?.BigIcons || null;

    if (bigIcon && String(bigIcon).toLowerCase().startsWith("img_selecthero_")) {
        return bigIcon;
    }

    return `img_selecthero_${heroId}001`;
}

/*
  Build correct image URL
*/
function buildHeroImageUrl(imageId) {
    if (!imageId) return null;

    return `https://rivalsmeta.com/_ipx/q_70&s_100x100/images/heroes/SelectHero/${imageId}.png`;
}

/*
  Build hero map
*/
function buildHeroMap(rawData) {
    const heroes = {};

    for (const [heroId, variants] of Object.entries(rawData)) {
        const baseHero = variants?.[1] || variants?.[0];

        if (!baseHero) continue;

        const rawName = baseHero.Name || `Hero ${heroId}`;
        const imageId = getHeroImageId(heroId, baseHero);

        heroes[heroId] = {
            heroId: Number(heroId),
            name: getHeroName(heroId, rawName),
            imageId,
            image: buildHeroImageUrl(imageId)
        };
    }

    return heroes;
}

/*
  Ensure output directory exists.
*/
async function ensureOutputDirectory() {
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
}

/*
  Main script.
*/
async function main() {
    console.log("Downloading hero data...");

    const response = await axios.get(SOURCE_URL, {
        headers: {
            "user-agent": "Mozilla/5.0"
        },
        timeout: 20000
    });

    const source = response.data;

    console.log("Downloaded source length:", source.length);

    const objectText = extractHeroObject(source);
    console.log("Extracted object length:", objectText.length);

    const rawData = parseHeroObject(objectText);
    const heroes = buildHeroMap(rawData);

    await ensureOutputDirectory();
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(heroes, null, 2), "utf8");

    console.log(`Saved ${Object.keys(heroes).length} heroes to ${OUTPUT_FILE}`);
}

main().catch((error) => {
    console.error("Failed to generate heroes.json:");
    console.error(error.message);
});