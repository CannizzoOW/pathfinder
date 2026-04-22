const {
    HEROES_JSON_PATH,
    readJson,
    writeJson,
    slugifyHeroName,
    normalizeImageUrl,
    normalizeTextArray
} = require("./helpers.cjs");

const API_KEY = process.env.MARVEL_RIVALS_API_KEY;
const HEROES_URL = "https://marvelrivalsapi.com/api/v1/heroes";

if (!API_KEY) {
    console.error("Missing MARVEL_RIVALS_API_KEY environment variable.");
    process.exit(1);
}

async function fetchHeroesFromApi() {
    const response = await fetch(HEROES_URL, {
        method: "GET",
        headers: {
            "x-api-key": API_KEY,
            "accept": "application/json"
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch heroes: ${response.status} ${text}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.heroes)) {
        throw new Error("Unexpected API response. Expected { heroes: [] }.");
    }

    return data.heroes;
}

function buildApiIndexes(apiHeroes) {
    const byId = new Map();
    const byName = new Map();
    const bySlug = new Map();

    for (const hero of apiHeroes) {
        if (hero.id != null) {
            byId.set(String(hero.id), hero);
        }

        if (hero.name) {
            byName.set(String(hero.name).toLowerCase(), hero);
            bySlug.set(slugifyHeroName(hero.name), hero);
        }
    }

    return { byId, byName, bySlug };
}

function pickBestImage(existingHero, apiHero) {
    const candidates = [
        existingHero.image,
        apiHero.image,
        apiHero.icon,
        apiHero.thumbnail,
        apiHero.avatar,
        apiHero.portrait
    ];

    for (const candidate of candidates) {
        const normalized = normalizeImageUrl(candidate);
        if (normalized) {
            return normalized;
        }
    }

    return existingHero.image || "";
}

function mapApiHeroToExtraFields(existingHero, apiHero) {
    const abilities = Array.isArray(apiHero.abilities)
        ? apiHero.abilities.map((ability) => ({
            name: ability.ability_name || ability.name || "",
            description: ability.description || "",
            cooldown: ability.cooldown ?? null
        })).filter((ability) => ability.name || ability.description)
        : [];

    const parsedHeroId = Number(String(apiHero.id).replace(/[^\d]/g, ""));

    return {
        heroId: existingHero.heroId ?? (Number.isNaN(parsedHeroId) ? null : parsedHeroId),
        slug: existingHero.slug || slugifyHeroName(existingHero.name || apiHero.name),
        alias: existingHero.alias || apiHero.alias || "",
        role: existingHero.role || apiHero.role || "",
        difficulty: existingHero.difficulty || apiHero.difficulty || null,
        description: existingHero.description || apiHero.description || apiHero.bio || "",
        lore: existingHero.lore || apiHero.lore || "",
        species: existingHero.species || apiHero.species || "",
        team: existingHero.team || apiHero.team || "",
        realName: existingHero.realName || apiHero.real_name || "",
        abilities: existingHero.abilities?.length ? existingHero.abilities : abilities,
        tags: existingHero.tags?.length ? existingHero.tags : normalizeTextArray(apiHero.tags),
        image: pickBestImage(existingHero, apiHero)
    };
}

function mergeHero(existingHero, extraFields) {
    return {
        ...existingHero,
        ...extraFields,
        heroId: existingHero.heroId ?? extraFields.heroId ?? null,
        name: existingHero.name || extraFields.name || "Unknown Hero",
        image: existingHero.image || extraFields.image || ""
    };
}

function findMatchingApiHero(existingHero, indexes) {
    const heroId = existingHero.heroId != null ? String(existingHero.heroId) : "";
    const heroName = String(existingHero.name || "").toLowerCase();
    const heroSlug = slugifyHeroName(existingHero.name || "");

    if (heroId && indexes.byId.has(heroId)) {
        return indexes.byId.get(heroId);
    }

    if (heroName && indexes.byName.has(heroName)) {
        return indexes.byName.get(heroName);
    }

    if (heroSlug && indexes.bySlug.has(heroSlug)) {
        return indexes.bySlug.get(heroSlug);
    }

    return null;
}

async function main() {
    const existingHeroes = readJson(HEROES_JSON_PATH);
    const apiHeroes = await fetchHeroesFromApi();
    const indexes = buildApiIndexes(apiHeroes);

    let updatedCount = 0;
    let unmatchedCount = 0;

    for (const heroKey of Object.keys(existingHeroes)) {
        const existingHero = existingHeroes[heroKey];
        const apiHero = findMatchingApiHero(existingHero, indexes);

        if (!apiHero) {
            unmatchedCount += 1;
            continue;
        }

        const extraFields = mapApiHeroToExtraFields(existingHero, apiHero);
        existingHeroes[heroKey] = mergeHero(existingHero, extraFields);
        updatedCount += 1;
    }

    writeJson(HEROES_JSON_PATH, existingHeroes);

    console.log(`Updated heroes: ${updatedCount}`);
    console.log(`Unmatched heroes: ${unmatchedCount}`);
    console.log(`Saved: ${HEROES_JSON_PATH}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});