import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_URL = "https://rivalsmeta.com/_nuxt/CnySgJyP.js";
const OUTPUT_FILE = path.join(__dirname, "..", "data", "heroes.json");

function toTitleCase(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

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

function parseHeroObject(objectText) {
    return Function(`"use strict"; return (${objectText});`)();
}

function getHeroImageId(heroId, baseHero) {
    const bigIcon = baseHero.IconPreview?.BigIcons || null;

    if (bigIcon && String(bigIcon).toLowerCase().startsWith("img_selecthero_")) {
        return bigIcon;
    }

    return `img_selecthero_${heroId}001`;
}

function buildHeroImageUrl(imageId) {
    if (!imageId) {
        return null;
    }

    const id = String(imageId).toLowerCase();

    if (id.includes("heroportrait")) {
        return `https://rivalsmeta.com/_ipx/q_70&s_100x100/images/heroes/HeroPortrait/${imageId}.png`;
    }

    if (id.includes("squarehead")) {
        return `https://rivalsmeta.com/_ipx/q_70&s_100x100/images/heroes/SquareHead/${imageId}.png`;
    }

    return `https://rivalsmeta.com/_ipx/q_70&s_100x100/images/heroes/SelectHero/${imageId}.png`;
}

function buildHeroMap(rawData) {
    const heroes = {};

    for (const [heroId, variants] of Object.entries(rawData)) {
        const baseHero = variants?.[1] || variants?.[0];

        if (!baseHero) {
            continue;
        }

        const rawName = baseHero.Name || `Hero ${heroId}`;
        const imageId = getHeroImageId(heroId, baseHero);

        heroes[heroId] = {
            heroId: Number(heroId),
            name: toTitleCase(rawName),
            imageId,
            image: buildHeroImageUrl(imageId)
        };
    }

    return heroes;
}

async function ensureOutputDirectory() {
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
}

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