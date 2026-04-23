import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

/*
  Fix __dirname for ES modules.
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "data");
const BASE_URL = "https://rivalsmeta.com/api/heroes/stats";

/*
  Minimal headers.
  You usually do not need every browser header from cURL.
*/
const REQUEST_HEADERS = {
    "accept": "*/*",
    "referer": "https://rivalsmeta.com/tier-list",
    "user-agent": "Mozilla/5.0"
};

/*
  Fetch one season from the API.
*/
async function fetchSeason(seasonId) {
    const response = await axios.get(BASE_URL, {
        params: {
            season: seasonId
        },
        headers: REQUEST_HEADERS,
        timeout: 20000
    });

    return response.data;
}

/*
  Normalize one season payload into a frontend-friendly structure.
*/
function normalizeSeasonData(raw) {
    const ranks = {};

    for (const entry of raw.bans || []) {
        const rank = String(entry.rank);

        if (!ranks[rank]) {
            ranks[rank] = {};
        }

        ranks[rank].bans = entry.bans || [];
    }

    for (const entry of raw.heroes || []) {
        const rank = String(entry.rank);

        if (!ranks[rank]) {
            ranks[rank] = {};
        }

        ranks[rank].heroes = (entry.heroes || []).map((hero) => {
            const wr =
                hero.wr_matches > 0
                    ? Number(((hero.wr_wins / hero.wr_matches) * 100).toFixed(2))
                    : null;

            return {
                heroId: hero.hero_id ?? null,
                matches: hero.matches ?? 0,
                wins: hero.wins ?? 0,
                wrMatches: hero.wr_matches ?? 0,
                wrWins: hero.wr_wins ?? 0,
                mirrorMatches: hero.mirror_matches ?? 0,
                winRate: wr
            };
        });
    }

    return {
        seasonId: raw.season,
        timestamp: raw.timestamp,
        ranks
    };
}

/*
  Ensure output directory exists.
*/
async function ensureOutputDir() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

/*
  Save one season to disk.
*/
async function saveSeason(seasonId, data) {
    await ensureOutputDir();

    const filePath = path.join(OUTPUT_DIR, `season-${seasonId}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    return filePath;
}

/*
  Fetch and save one season.
*/
async function fetchAndSaveSeason(seasonId) {
    console.log(`Fetching season ${seasonId}...`);

    const raw = await fetchSeason(seasonId);
    const normalized = normalizeSeasonData(raw);
    const filePath = await saveSeason(seasonId, normalized);

    console.log(`Saved season ${seasonId} to ${filePath}`);

    return normalized;
}

/*
  Try a range of seasons and keep only valid responses.
*/
async function fetchSeasonRange(startSeason, endSeason) {
    const allData = {};

    for (let seasonId = startSeason; seasonId <= endSeason; seasonId++) {
        try {
            const raw = await fetchSeason(seasonId);

            /*
              Skip obviously invalid responses.
            */
            if (!raw || typeof raw !== "object" || !Array.isArray(raw.heroes)) {
                console.log(`Skipping season ${seasonId}, invalid payload.`);
                continue;
            }

            const normalized = normalizeSeasonData(raw);
            allData[String(seasonId)] = normalized;

            await saveSeason(seasonId, normalized);

            console.log(`Fetched season ${seasonId}`);

            /*
              Small delay to be polite.
            */
            await new Promise((resolve) => setTimeout(resolve, 400));
        } catch (error) {
            console.log(`Season ${seasonId} failed: ${error.message}`);
        }
    }

    const combinedPath = path.join(OUTPUT_DIR, "all-seasons.json");
    await fs.writeFile(combinedPath, JSON.stringify(allData, null, 2), "utf8");

    console.log(`Saved combined file to ${combinedPath}`);

    return allData;
}

/*
  Main entry point.
*/
async function main() {
    /*
      Example: fetch one known season.
    */
    await fetchAndSaveSeason(1);

    /*
      Example: fetch a range.
      Uncomment this if you want to test multiple seasons.
    */
    
    await fetchSeasonRange(1, 20);
    
}

main().catch((error) => {
    console.error("Fatal error:", error.message);
});