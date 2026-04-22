const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.join(__dirname, "..");
const HEROES_JSON_PATH = path.join(PROJECT_ROOT, "data", "heroes.json");
const HERO_PAGES_DIR = path.join(PROJECT_ROOT, "heroes");

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function slugifyHeroName(name) {
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

function normalizeImageUrl(url) {
    if (!url) {
        return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    if (url.startsWith("/premium/")) {
        return `https://marvelrivalsapi.com${url}`;
    }

    if (url.startsWith("/")) {
        return `https://marvelrivalsapi.com/rivals${url}`;
    }

    return url;
}

function normalizeTextArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (typeof item === "string") {
                return item.trim();
            }

            if (item && typeof item === "object") {
                if (typeof item.name === "string") {
                    return item.name.trim();
                }

                if (typeof item.title === "string") {
                    return item.title.trim();
                }
            }

            return "";
        })
        .filter(Boolean);
}

module.exports = {
    PROJECT_ROOT,
    HEROES_JSON_PATH,
    HERO_PAGES_DIR,
    readJson,
    writeJson,
    ensureDir,
    slugifyHeroName,
    escapeHtml,
    normalizeImageUrl,
    normalizeTextArray
};