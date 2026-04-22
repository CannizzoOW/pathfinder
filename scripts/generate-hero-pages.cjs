const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const HEROES_JSON_PATH = path.join(ROOT_DIR, "data", "heroes.json");
const HERO_DETAILS_JSON_PATH = path.join(ROOT_DIR, "data", "hero-details.json");
const OUTPUT_DIR = path.join(ROOT_DIR, "heroes");

function readJson(filePath, fallback = {}) {
    if (!fs.existsSync(filePath)) {
        return fallback;
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function slugify(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function mergeHeroData(baseHero, extraHero) {
    return {
        ...baseHero,
        ...extraHero,
        abilities: Array.isArray(extraHero?.abilities) && extraHero.abilities.length
            ? extraHero.abilities
            : (Array.isArray(baseHero?.abilities) ? baseHero.abilities : []),
        tips: Array.isArray(extraHero?.tips) ? extraHero.tips : (Array.isArray(baseHero?.tips) ? baseHero.tips : []),
        counters: Array.isArray(extraHero?.counters) ? extraHero.counters : (Array.isArray(baseHero?.counters) ? baseHero.counters : []),
        skins: Array.isArray(extraHero?.skins) && extraHero.skins.length
            ? extraHero.skins
            : (Array.isArray(baseHero?.skins) ? baseHero.skins : [])
    };
}

function renderKeyValueRow(label, value) {
    if (value == null || value === "") {
        return "";
    }

    return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function renderTextSection(title, value) {
    if (!value) {
        return "";
    }

    return `
        <section class="hero-box hero-section-block">
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(value)}</p>
        </section>
    `;
}

function renderListSection(title, items) {
    if (!Array.isArray(items) || items.length === 0) {
        return "";
    }

    return `
        <section class="hero-box hero-section-block">
            <h2>${escapeHtml(title)}</h2>
            <ul class="hero-list">
                ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
        </section>
    `;
}

function renderAbilitiesSection(abilities) {
    if (!Array.isArray(abilities) || abilities.length === 0) {
        return "";
    }

    return `
        <section class="hero-box hero-section-block">
            <h2>Abilities</h2>
            <div class="hero-abilities">
                ${abilities.map((ability) => `
                    <div class="hero-box">
                        <h3>${escapeHtml(ability.name || "Unnamed Ability")}</h3>
                        ${ability.type ? `<p><strong>Type:</strong> ${escapeHtml(ability.type)}</p>` : ""}
                        ${ability.cooldown != null ? `<p><strong>Cooldown:</strong> ${escapeHtml(ability.cooldown)}</p>` : ""}
                        ${ability.description ? `<p>${escapeHtml(ability.description)}</p>` : ""}
                    </div>
                `).join("")}
            </div>
        </section>
    `;
}

function renderSkinsSection(skins) {
    if (!Array.isArray(skins) || skins.length === 0) {
        return "";
    }

    return `
        <section class="hero-box hero-section-block">
            <h2>Skins</h2>
            <div class="hero-skin-grid">
                ${skins.map((skin) => `
                    <div class="hero-box">
                        <div class="hero-skin-thumb">
                            <img
                                src="${escapeHtml(skin.image || "")}"
                                alt="${escapeHtml(skin.name || "Skin")}"
                                onerror="this.onerror=null;this.src='https://via.placeholder.com/120x120?text=?'"
                            >
                        </div>
                        <h3>${escapeHtml(skin.name || "Unnamed Skin")}</h3>
                        ${skin.itemQuality ? `<p><strong>Quality:</strong> ${escapeHtml(skin.itemQuality)}</p>` : ""}
                        ${skin.released ? `<p><strong>Released:</strong> ${escapeHtml(skin.released)}</p>` : ""}
                        ${skin.expires ? `<p><strong>Expires:</strong> ${escapeHtml(skin.expires)}</p>` : ""}
                    </div>
                `).join("")}
            </div>
        </section>
    `;
}

function buildHeroPage(hero) {
    const heroName = hero.name || "Unknown Hero";
    const heroSlug = hero.slug || slugify(heroName);
    const heroImage = hero.image || "https://via.placeholder.com/320x320?text=?";

    const topInfo = [
        renderKeyValueRow("Role", hero.role),
        renderKeyValueRow("Difficulty", hero.difficulty),
        renderKeyValueRow("Base Quality", hero.itemQuality)
    ].join("");

    const sections = [
        renderTextSection("Overview", hero.description),
        renderTextSection("Lore", hero.lore),
        renderListSection("Tips", hero.tips),
        renderListSection("Counters", hero.counters),
        renderAbilitiesSection(hero.abilities),
        renderSkinsSection(hero.skins)
    ].filter(Boolean).join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(heroName)} - Marvel Rivals</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body class="tier-page hero-page">
    <div class="section hero-page-section">
        <a href="../index.html" class="guides-cta hero-back-link">← Back to Tier List</a>

        <div class="hero-detail-card">
            <div class="hero-detail-left">
                <div class="hero-detail-image-wrap">
                    <img
                        src="${escapeHtml(heroImage)}"
                        alt="${escapeHtml(heroName)}"
                        onerror="this.onerror=null;this.src='https://via.placeholder.com/320x320?text=?'"
                    >
                </div>
            </div>

            <div class="hero-detail-right">
                <h1>${escapeHtml(heroName)}</h1>
                ${topInfo}
            </div>
        </div>

        ${sections || `
            <section class="hero-box hero-section-block">
                <h2>Info</h2>
                <p class="hero-empty">No extra hero data has been added yet.</p>
            </section>
        `}
    </div>
</body>
</html>`;
}

function main() {
    const heroes = readJson(HEROES_JSON_PATH, {});
    const heroDetails = readJson(HERO_DETAILS_JSON_PATH, {});

    ensureDir(OUTPUT_DIR);

    for (const [heroId, baseHero] of Object.entries(heroes)) {
        if (!baseHero || !baseHero.name) {
            continue;
        }

        const extraHero = heroDetails[heroId] || {};
        const mergedHero = mergeHeroData(baseHero, extraHero);

        const slug = mergedHero.slug || slugify(mergedHero.name);
        const html = buildHeroPage(mergedHero);
        const outputPath = path.join(OUTPUT_DIR, `${slug}.html`);

        fs.writeFileSync(outputPath, html, "utf8");
        console.log(`Generated ${outputPath}`);
    }
}

main();