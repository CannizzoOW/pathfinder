require("dotenv").config();

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const HEROES_JSON_PATH = path.join(ROOT_DIR, "data", "heroes.json");

const API_KEY = process.env.MARVEL_RIVALS_API_KEY;
const BASE_URL = "https://marvelrivalsapi.com/api/v1";
const BASE_IMAGE_URL = "https://marvelrivalsapi.com/rivals";

if (!API_KEY) {
    console.error("Missing MARVEL_RIVALS_API_KEY environment variable.");
    process.exit(1);
}

function readJson(filePath) {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function slugifyHeroName(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeImageUrl(url) {
    if (!url) {
        return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    if (url.startsWith("/")) {
        return `${BASE_IMAGE_URL}${url}`;
    }

    return `${BASE_IMAGE_URL}/${url}`;
}

async function apiGet(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "x-api-key": API_KEY,
            "accept": "application/json"
        }
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API ${endpoint} failed: ${response.status} ${text}`);
    }

    if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`API ${endpoint} returned non-JSON response: ${text.slice(0, 300)}`);
    }

    return response.json();
}

async function fetchHeroList() {
    const data = await apiGet("/heroes");

    // Docs show: { status: "success", heroes: [...] }
    if (!data || !Array.isArray(data.heroes)) {
        console.error("Unexpected /heroes response:", JSON.stringify(data, null, 2));
        throw new Error("Unexpected response from /heroes");
    }

    return data.heroes;
}

async function fetchHeroDetails(query) {
    // Docs show this returns the hero object directly, not wrapped in { hero: ... }
    return apiGet(`/heroes/hero/${encodeURIComponent(query)}`);
}

function mapHeroSummaryToBaseFields(summaryHero) {
    return {
        apiId: summaryHero.id || null,
        name: summaryHero.name || "",
        alias: summaryHero.alias || "",
        role: summaryHero.role || "",
        slug: slugifyHeroName(summaryHero.name || ""),
        image: normalizeImageUrl(summaryHero.imageUrl || summaryHero.image || summaryHero.icon || "")
    };
}

function mapHeroDetailsToFields(details) {
    const abilities = Array.isArray(details.abilities)
        ? details.abilities.map((ability) => ({
            id: ability.id ?? null,
            name: ability.name || ability.ability_name || "",
            type: ability.type || "",
            cooldown: ability.cooldown ?? null,
            description: ability.description || "",
            icon: normalizeImageUrl(ability.icon || ""),
            additional_fields: ability.additional_fields || {}
        }))
        : [];

    const skins = Array.isArray(details.costumes)
        ? details.costumes.map((costume) => ({
            id: costume.id ?? null,
            name: costume.name || "",
            image: normalizeImageUrl(costume.icon || ""),
            itemQuality: costume.quality || "",
            description: costume.description || "",
            appearance: costume.appearance || ""
        }))
        : [];

    return {
        apiId: details.id || null,
        image: normalizeImageUrl(details.imageUrl || ""),
        realName: details.real_name || "",
        role: details.role || "",
        attackType: details.attack_type || "",
        difficulty: details.difficulty || "",
        description: details.bio || "",
        lore: details.lore || "",
        team: Array.isArray(details.team) ? details.team : [],
        abilities,
        skins
    };
}

function buildIndexes(existingHeroes) {
    const byHeroId = new Map();
    const byApiId = new Map();
    const byName = new Map();
    const bySlug = new Map();

    for (const [key, hero] of Object.entries(existingHeroes)) {
        if (!hero || typeof hero !== "object") {
            continue;
        }

        byHeroId.set(String(key), hero);

        if (hero.heroId != null) {
            byHeroId.set(String(hero.heroId), hero);
        }

        if (hero.apiId != null) {
            byApiId.set(String(hero.apiId), hero);
        }

        if (hero.name) {
            byName.set(String(hero.name).toLowerCase(), hero);
            bySlug.set(slugifyHeroName(hero.name), hero);
        }
    }

    return { byHeroId, byApiId, byName, bySlug };
}

function findExistingHero(summaryHero, indexes) {
    const apiId = String(summaryHero.id || "");
    const name = String(summaryHero.name || "").toLowerCase();
    const slug = slugifyHeroName(summaryHero.name || "");

    return (
        indexes.byApiId.get(apiId) ||
        indexes.byName.get(name) ||
        indexes.bySlug.get(slug) ||
        null
    );
}

function mergeHero(existingHero, summaryFields, detailFields) {
    const merged = {
        ...existingHero,
        ...summaryFields,
        ...detailFields
    };

    return {
        ...merged,
        heroId: existingHero.heroId ?? merged.heroId ?? null,
        apiId: merged.apiId ?? existingHero.apiId ?? null,
        name: existingHero.name || merged.name || "Unknown Hero",
        slug: existingHero.slug || merged.slug || slugifyHeroName(existingHero.name || merged.name),
        image: existingHero.image || merged.image || "",
        alias: existingHero.alias || merged.alias || "",
        role: existingHero.role || merged.role || "",
        difficulty: existingHero.difficulty || merged.difficulty || "",
        description: existingHero.description || merged.description || "",
        lore: existingHero.lore || merged.lore || "",
        realName: existingHero.realName || merged.realName || "",
        team: Array.isArray(existingHero.team) && existingHero.team.length ? existingHero.team : merged.team || [],
        abilities: Array.isArray(existingHero.abilities) && existingHero.abilities.length ? existingHero.abilities : merged.abilities || [],
        skins: Array.isArray(existingHero.skins) && existingHero.skins.length ? existingHero.skins : merged.skins || [],
        tips: Array.isArray(existingHero.tips) ? existingHero.tips : [],
        counters: Array.isArray(existingHero.counters) ? existingHero.counters : []
    };
}

async function main() {
    const existingHeroes = readJson(HEROES_JSON_PATH);
    const indexes = buildIndexes(existingHeroes);
    const summaryHeroes = await fetchHeroList();

    const updatedHeroes = { ...existingHeroes };

    for (const summaryHero of summaryHeroes) {
        const existingHero = findExistingHero(summaryHero, indexes) || {};
        const summaryFields = mapHeroSummaryToBaseFields(summaryHero);

        let detailFields = {};
        try {
            const details = await fetchHeroDetails(summaryHero.name || summaryHero.id);
            detailFields = mapHeroDetailsToFields(details);
        } catch (error) {
            console.warn(`Could not fetch details for ${summaryHero.name}: ${error.message}`);
        }

        const targetKey = String(existingHero.heroId || summaryHero.id || summaryFields.slug);
        updatedHeroes[targetKey] = mergeHero(existingHero, summaryFields, detailFields);
    }

    // Preserve/manual synthetic Deadpool role variants
    const deadpoolBase =
        updatedHeroes["1057"] ||
        Object.values(updatedHeroes).find((hero) => Number(hero.heroId) === 1057) ||
        null;

    if (deadpoolBase) {
        const deadpoolVariants = {
            "10571": "Tankpool",
            "10572": "DPSpool",
            "10573": "Healpool"
        };

        for (const [variantId, variantName] of Object.entries(deadpoolVariants)) {
            updatedHeroes[variantId] = {
                ...deadpoolBase,
                ...updatedHeroes[variantId],
                heroId: Number(variantId),
                name: variantName,
                slug: slugifyHeroName(variantName)
            };
        }
    }

    writeJson(HEROES_JSON_PATH, updatedHeroes);
    console.log(`Saved ${Object.keys(updatedHeroes).length} heroes to ${HEROES_JSON_PATH}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});