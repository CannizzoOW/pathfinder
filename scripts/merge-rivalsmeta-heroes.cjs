const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT_DIR = path.join(__dirname, "..");
const HEROES_JSON_PATH = path.join(ROOT_DIR, "data", "heroes.json");
const RIVALSMETA_JS_PATH = path.join(ROOT_DIR, "data", "CnySgJyP.js");

const BIG_ICON_BASE_URL = "https://rivalsmeta.com/_ipx/q_70&s_100x100/images/heroes/SelectHero/";
const POSTER_BASE_URL = "https://rivalsmeta.com/images/heroes/SelectHero/";

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function slugify(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function toTitleCaseFromSource(name) {
    const raw = String(name || "").trim();
    if (!raw) {
        return "";
    }

    const normalized = raw
        .toLowerCase()
        .split(" ")
        .map((part) => {
            if (!part) {
                return part;
            }

            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(" ");

    return normalized
        .replace(/\bAnd\b/g, "&")
        .replace(/\bDpspool\b/g, "DPSpool");
}

function buildImageUrl(iconName) {
    if (!iconName) {
        return "";
    }

    return `${BIG_ICON_BASE_URL}${iconName}.png`;
}

function buildPosterUrl(posterName) {
    if (!posterName) {
        return "";
    }

    return `${POSTER_BASE_URL}${posterName}.png`;
}

function parseRivalsMetaJs(filePath) {
    const source = fs.readFileSync(filePath, "utf8");

    const cleaned = source
        .replace(/export\s*\{[^}]+\};?\s*$/m, "")
        .replace(/^const\s+e\s*=\s*/, "result = ");

    const sandbox = { result: null };
    vm.createContext(sandbox);
    vm.runInContext(cleaned, sandbox);

    if (!sandbox.result || typeof sandbox.result !== "object") {
        throw new Error("Could not parse CnySgJyP.js into an object.");
    }

    return sandbox.result;
}

function getBaseVariant(heroVariants) {
    if (!heroVariants || typeof heroVariants !== "object") {
        return null;
    }

    if (heroVariants["1"]) {
        return { variantId: "1", data: heroVariants["1"] };
    }

    if (heroVariants["0"]) {
        return { variantId: "0", data: heroVariants["0"] };
    }

    const keys = Object.keys(heroVariants).sort((a, b) => Number(a) - Number(b));
    for (const key of keys) {
        if (heroVariants[key] && typeof heroVariants[key] === "object") {
            return { variantId: key, data: heroVariants[key] };
        }
    }

    return null;
}

function mapHeroEntry(heroId, heroVariants) {
    const base = getBaseVariant(heroVariants);

    if (!base || !base.data) {
        return null;
    }

    const baseData = base.data;
    const name = toTitleCaseFromSource(baseData.Name);
    const bigIcon = baseData.IconPreview?.BigIcons || "";
    const poster = baseData.IconPreview?.Poster || "";

    const skins = Object.entries(heroVariants)
        .filter(([variantId]) => variantId !== base.variantId)
        .map(([variantId, skinData]) => {
            return {
                variantId: Number(variantId),
                name: toTitleCaseFromSource(skinData?.Name || ""),
                itemQuality: skinData?.ItemQuality || "",
                released: skinData?.Released || null,
                expires: skinData?.Expires || null,
                imageId: skinData?.IconPreview?.BigIcons || "",
                posterId: skinData?.IconPreview?.Poster || "",
                image: buildImageUrl(skinData?.IconPreview?.BigIcons || ""),
                poster: buildPosterUrl(skinData?.IconPreview?.Poster || "")
            };
        })
        .filter((skin) => skin.name || skin.imageId || skin.posterId);

    return {
        heroId: Number(heroId),
        name,
        slug: slugify(name),
        imageId: bigIcon || null,
        posterId: poster || null,
        image: buildImageUrl(bigIcon),
        poster: buildPosterUrl(poster),
        released: baseData.Released || null,
        expires: baseData.Expires || null,
        itemQuality: baseData.ItemQuality || "",
        skins
    };
}

function mergePreservingManualFields(existingHero, parsedHero) {
    if (!existingHero) {
        return parsedHero;
    }

    return {
        ...parsedHero,
        ...existingHero,
        heroId: existingHero.heroId ?? parsedHero.heroId ?? null,
        name: existingHero.name || parsedHero.name || "",
        slug: existingHero.slug || parsedHero.slug || "",
        imageId: existingHero.imageId || parsedHero.imageId || null,
        posterId: existingHero.posterId || parsedHero.posterId || null,
        image: existingHero.image || parsedHero.image || "",
        poster: existingHero.poster || parsedHero.poster || "",
        released: existingHero.released || parsedHero.released || null,
        expires: existingHero.expires || parsedHero.expires || null,
        itemQuality: existingHero.itemQuality || parsedHero.itemQuality || "",
        skins: Array.isArray(existingHero.skins) && existingHero.skins.length
            ? existingHero.skins
            : parsedHero.skins,
        description: existingHero.description || "",
        role: existingHero.role || "",
        difficulty: existingHero.difficulty || "",
        lore: existingHero.lore || "",
        abilities: Array.isArray(existingHero.abilities) ? existingHero.abilities : [],
        tips: Array.isArray(existingHero.tips) ? existingHero.tips : [],
        counters: Array.isArray(existingHero.counters) ? existingHero.counters : []
    };
}

function main() {
    if (!fs.existsSync(RIVALSMETA_JS_PATH)) {
        throw new Error(`Missing file: ${RIVALSMETA_JS_PATH}`);
    }

    const existingHeroes = fs.existsSync(HEROES_JSON_PATH)
        ? readJson(HEROES_JSON_PATH)
        : {};

    const rivalsMetaData = parseRivalsMetaJs(RIVALSMETA_JS_PATH);

    const mergedHeroes = {};

    for (const [heroId, variants] of Object.entries(rivalsMetaData)) {
        const parsedHero = mapHeroEntry(heroId, variants);

        if (!parsedHero || !parsedHero.name) {
            continue;
        }

        mergedHeroes[heroId] = mergePreservingManualFields(existingHeroes[heroId], parsedHero);
    }

    // behold manuelle entries som ikke finnes i JS-fila
    for (const [heroId, heroData] of Object.entries(existingHeroes)) {
        if (!mergedHeroes[heroId]) {
            mergedHeroes[heroId] = heroData;
        }
    }

    writeJson(HEROES_JSON_PATH, mergedHeroes);

    console.log(`Merged ${Object.keys(mergedHeroes).length} heroes into ${HEROES_JSON_PATH}`);
}

main();