// script4.js
// Fetches heroes automatically from Rivalskins with fallback support

async function fetchHeroesFromRivalskins() {
    const urls = [
        "https://rivalskins.com/heroes/",
        "https://api.allorigins.win/raw?url=https://rivalskins.com/heroes/",
        "https://corsproxy.io/?https://rivalskins.com/heroes/"
    ];

    for (const url of urls) {
        try {
            const res = await fetch(url);
            if (!res.ok) continue;

            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const heroes = [];

            // Attempt to find hero elements
            const elements = doc.querySelectorAll("a, div, span");

            elements.forEach(el => {
                const text = el.textContent.trim();

                if (!text) return;

                // Filter out unwanted text
                if (text.length < 2 || text.length > 30) return;
                if (/policy|discord|terms|cookies|login/i.test(text)) return;

                // Avoid duplicates
                if (!heroes.includes(text)) {
                    heroes.push(text);
                }
            });

            // If we found enough entries, assume success
            if (heroes.length > 10) {
                console.log("Heroes fetched from:", url);

                return {
                    Duelist: heroes.map(h => ({
                        name: h.toLowerCase().replace(/\s+/g, "-"),
                        role: "Duelist"
                    })),
                    Vanguard: [],
                    Strategist: []
                };
            }

        } catch (err) {
            console.warn("Failed to fetch from:", url);
        }
    }

    return null;
}


// Fallback if scraping fails
function getFallbackHeroes() {
    const fallback = [
        "Iron Man",
        "Spider-Man",
        "Hulk",
        "Doctor Strange",
        "Scarlet Witch",
        "Black Panther",
        "Storm",
        "Loki",
        "Thor",
        "Rocket Raccoon",
        "Groot",
        "Magneto",
        "Venom",
        "Deadpool"
    ];

    return {
        Duelist: fallback.map(h => ({
            name: h.toLowerCase().replace(/\s+/g, "-"),
            role: "Duelist"
        })),
        Vanguard: [],
        Strategist: []
    };
}


// Global loader
async function loadHeroData() {
    let data = await fetchHeroesFromRivalskins();

    if (!data) {
        console.warn("Using fallback heroes");
        data = getFallbackHeroes();
    }

    window.heroData = data;
}


// Start loading immediately
loadHeroData();