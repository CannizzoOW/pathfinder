const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const HEROES_JSON_PATH = path.join(ROOT_DIR, "data", "heroes.json");
const OUTPUT_DIR = path.join(ROOT_DIR, "heroes");

function readJson(filePath) {
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

function renderList(items, emptyText) {
    if (!Array.isArray(items) || items.length === 0) {
        return `<p class="hero-empty">${escapeHtml(emptyText)}</p>`;
    }

    return `
        <ul class="hero-list">
            ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
    `;
}

function renderAbilities(abilities) {
    if (!Array.isArray(abilities) || abilities.length === 0) {
        return `<p class="hero-empty">No abilities added yet.</p>`;
    }

    return abilities.map((ability) => `
        <div class="hero-box">
            <h3>${escapeHtml(ability.name || "Unnamed Ability")}</h3>
            ${ability.type ? `<p><strong>Type:</strong> ${escapeHtml(ability.type)}</p>` : ""}
            ${ability.description ? `<p>${escapeHtml(ability.description)}</p>` : ""}
        </div>
    `).join("");
}

function renderSkins(skins) {
    if (!Array.isArray(skins) || skins.length === 0) {
        return `<p class="hero-empty">No skin data available.</p>`;
    }

    return `
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
    `;
}

function buildHeroPage(hero) {
    const heroName = hero.name || "Unknown Hero";
    const heroSlug = hero.slug || slugify(heroName);

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
        <a href="../tierlist.html" class="guides-cta hero-back-link">← Back to Tier List</a>

        <div class="hero-detail-card">
            <div class="hero-detail-left">
                <div class="hero-detail-image-wrap">
                    <img
                        src="${escapeHtml(hero.image || "")}"
                        alt="${escapeHtml(heroName)}"
                        onerror="this.onerror=null;this.src='https://via.placeholder.com/320x320?text=?'"
                    >
                </div>
            </div>

            <div class="hero-detail-right">
                <h1>${escapeHtml(heroName)}</h1>

                ${hero.role ? `<p><strong>Role:</strong> ${escapeHtml(hero.role)}</p>` : ""}
                ${hero.difficulty ? `<p><strong>Difficulty:</strong> ${escapeHtml(hero.difficulty)}</p>` : ""}
                ${hero.heroId != null ? `<p style="display:none;"><strong>Hero ID:</strong> ${escapeHtml(hero.heroId)}</p>` : ""}
                ${hero.itemQuality ? `<p><strong>Base Quality:</strong> ${escapeHtml(hero.itemQuality)}</p>` : ""}

                <div class="hero-box">
                    <h2>Overview</h2>
                    ${hero.description
            ? `<p>${escapeHtml(hero.description)}</p>`
            : `<p class="hero-empty">No description added yet.</p>`}
                </div>

                <div class="hero-box">
                    <h2>Lore</h2>
                    ${hero.lore
            ? `<p>${escapeHtml(hero.lore)}</p>`
            : `<p class="hero-empty">No lore added yet.</p>`}
                </div>
            </div>
        </div>

        <div class="hero-box hero-section-block">
            <h2>Abilities</h2>
            ${renderAbilities(hero.abilities)}
        </div>

        <div class="hero-box hero-section-block">
            <h2>Tips</h2>
            ${renderList(hero.tips, "No tips added yet.")}
        </div>

        <div class="hero-box hero-section-block">
            <h2>Counters</h2>
            ${renderList(hero.counters, "No counters added yet.")}
        </div>

        <div class="hero-box hero-section-block">
            <h2>Skins</h2>
            ${renderSkins(hero.skins)}
        </div>
    </div>
</body>
</html>`;
}

function main() {
    const heroes = readJson(HEROES_JSON_PATH);
    ensureDir(OUTPUT_DIR);

    for (const hero of Object.values(heroes)) {
        if (!hero || !hero.name) {
            continue;
        }

        const slug = hero.slug || slugify(hero.name);
        const html = buildHeroPage(hero);
        const outPath = path.join(OUTPUT_DIR, `${slug}.html`);

        fs.writeFileSync(outPath, html, "utf8");
        console.log(`Generated ${outPath}`);
    }
}

main();