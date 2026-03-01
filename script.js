/* ---------------------------------------------------
   Pathfinders index - script.js (images.json driven heroes)
   - Hero Chart now loads from images.json (like tiermaker)
   - Keeps Cannizzo-style name casing/overrides
   - Robust image fallback for both Hero Chart + Tier Lists
----------------------------------------------------- */

/* =========================
   Cannizzo-style name formatting
========================= */
// key = filename without extension (lowercase)
const NAME_OVERRIDES = {
  "cloak-dagger": "Cloak & Dagger",
  "cloak_and_dagger": "Cloak & Dagger",
  "cloakdagger": "Cloak & Dagger",
  "cloak_dagger": "Cloak & Dagger",
  "cloak-&-dagger": "Cloak & Dagger",

  "jeff-the-land-shark": "Jeff",
  "jeff_the_land_shark": "Jeff",
  "elsa_bloodstone": "Elsa Bloodstone",
  "elsa-bloodstone": "Elsa Bloodstone",
};

// Common words that stay lowercase (except first word)
const LOWERCASE_WORDS = new Set(["and", "of", "the", "to", "in", "on", "a", "an"]);

// Known compressed names (optional)
const WORD_SPLITS = [
  ["adamwarlock", "Adam Warlock"],
  ["ironman", "Iron Man"],
  ["doctorstrange", "Doctor Strange"],
  ["spiderman", "Spider-Man"],
];

function splitCamelCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function titleCaseSmart(str) {
  const words = str.split(/\s+/).filter(Boolean);
  return words.map((word, index) => {
    const lower = word.toLowerCase();
    if (index > 0 && LOWERCASE_WORDS.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" ");
}

function prettyNameFromFilename(filenameOrKey) {
  let base = String(filenameOrKey || "").replace(/\.[^.]+$/, "");
  const key = base.toLowerCase();

  if (NAME_OVERRIDES[key]) return NAME_OVERRIDES[key];

  for (const [needle, pretty] of WORD_SPLITS) {
    if (key === needle) return pretty;
  }

  base = base.replace(/[_-]+/g, " ");
  base = splitCamelCase(base);

  // Match tiermaker behavior:
  base = base.replace(/\band\b/gi, "&");

  base = base.replace(/\s+/g, " ").trim();
  return titleCaseSmart(base);
}

/* =========================
   Paths (match tiermaker)
========================= */
const BASE_PATH = window.location.pathname.replace(/\/[^/]*$/, "/");
const IMAGES_JSON_URL = BASE_PATH + "images.json";
const IMAGES_DIR = BASE_PATH + "images/characters/";

/* =========================
   Robust image fallback
========================= */
function setHeroImageWithFallback(imgEl, heroSlugOrBase, explicitFile) {
  const base = String(heroSlugOrBase || "");
  const candidates = [];

  // 1) Exact file from images.json (best)
  if (explicitFile) {
    const safeFile = String(explicitFile)
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    candidates.push(IMAGES_DIR + safeFile);
  }

  // 2) Common slug-based options
  if (base) {
    const slug = base.replace(/\.[^.]+$/, "");
    candidates.push(IMAGES_DIR + encodeURIComponent(slug) + ".png");
    candidates.push(IMAGES_DIR + encodeURIComponent(slug.replace(/&/g, "and")) + ".png");
    candidates.push(IMAGES_DIR + encodeURIComponent(slug.replace(/&/g, "and").replace(/-/g, "_")) + ".png");
    candidates.push(IMAGES_DIR + encodeURIComponent(slug.replace(/-/g, "_")) + ".png");
    candidates.push(IMAGES_DIR + encodeURIComponent(slug.replace(/_/g, "-")) + ".png");
    candidates.push(IMAGES_DIR + encodeURIComponent(slug.replace(/&/g, "")) + ".png");
    candidates.push(IMAGES_DIR + encodeURIComponent(slug.replace(/&/g, "").replace(/--+/g, "-")) + ".png");
  }

  // de-dupe
  const seen = new Set();
  const uniq = candidates.filter(u => (u && !seen.has(u) && seen.add(u)));

  let i = 0;
  imgEl.src = uniq[i] || "";
  imgEl.onerror = () => {
    i++;
    if (i < uniq.length) {
      imgEl.src = uniq[i];
    } else {
      imgEl.removeAttribute("src");
    }
  };
}

/* =========================
   Heroes loaded from images.json
========================= */
let allHeroes = [];          // [{ slug, file, role, description, diagram }]
let heroesLoaded = false;

// normalize for matching tierlist names -> hero entries
function normKey(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function buildHeroMetaFromHardcoded() {
  const meta = new Map();
  try {
    if (typeof heroData === "undefined") return meta;
    for (const role of Object.keys(heroData)) {
      for (const h of heroData[role] || []) {
        if (!h || !h.name) continue;
        meta.set(h.name, { role, description: h.description || "", diagram: h.diagram || "" });
      }
    }
  } catch (e) {}
  return meta;
}

async function ensureHeroesLoaded() {
  if (heroesLoaded) return;

  let files = [];
  try {
    const res = await fetch(IMAGES_JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch images.json (" + res.status + ")");
    const json = await res.json();
    files = (Array.isArray(json) ? json : []).filter(f => typeof f === "string");
  } catch (err) {
    console.error("[heroes] Could not load images.json:", err);

    // fallback: build from hardcoded heroData if present
    if (typeof heroData !== "undefined") {
      const fallback = [];
      for (const role of Object.keys(heroData)) {
        for (const h of heroData[role] || []) {
          fallback.push({
            slug: h.name,
            file: h.name + ".png",
            role,
            description: h.description || "",
            diagram: h.diagram || "",
          });
        }
      }
      allHeroes = fallback;
      heroesLoaded = true;
      return;
    }

    allHeroes = [];
    heroesLoaded = true;
    return;
  }

  const meta = buildHeroMetaFromHardcoded();
  const seen = new Set();

  allHeroes = files.map(file => {
    const slug = String(file).replace(/\.[^.]+$/, "");
    if (seen.has(slug)) return null;
    seen.add(slug);

    const m = meta.get(slug);
    return {
      slug,
      file,
      role: (m && m.role) ? m.role : "Duelist",
      description: (m && m.description) ? m.description : "",
      diagram: (m && m.diagram) ? m.diagram : "",
    };
  }).filter(Boolean);

  allHeroes.sort((a, b) => prettyNameFromFilename(a.slug).localeCompare(prettyNameFromFilename(b.slug)));
  heroesLoaded = true;
}

/* ---------------------------------------------------
   HERO CHART (images.json driven)
----------------------------------------------------- */
let currentHeroes = [];
let currentHeroIndex = -1;

async function renderHeroes() {
  await ensureHeroesLoaded();

  const container = document.getElementById("heroGrid");
  const filterElement = document.getElementById("roleFilter");
  const filter = filterElement ? filterElement.value : "all";
  if (!container) return;

  container.innerHTML = "";

  const filtered = allHeroes.filter(h => filter === "all" || h.role === filter);
  currentHeroes = filtered;

  filtered.forEach((hero, idx) => {
    const card = document.createElement("div");
    card.className = "hero-slot";

    const displayName = prettyNameFromFilename(hero.slug);

    const img = document.createElement("img");
    img.alt = displayName;
    setHeroImageWithFallback(img, hero.slug, hero.file);

    const nameDiv = document.createElement("div");
    nameDiv.className = "hero-name";
    nameDiv.textContent = displayName;

    card.appendChild(img);
    card.appendChild(nameDiv);

    card.addEventListener("click", () => {
      currentHeroIndex = idx;
      openHeroModal(hero);
    });

    container.appendChild(card);
  });
}

// ---------------------------------------------------
// HERO MODAL
// ---------------------------------------------------
const modal = document.getElementById("heroModal");
const closeBtn = document.getElementById("closeHeroModal");

function openHeroModal(hero) {
  console.log("[openHeroModal] hero:", hero);
  try {
    if (!modal) return;
    if (!hero || !hero.slug) return;

    const nameEl = document.getElementById("modalHeroName");
    const imgEl = document.getElementById("modalHeroImage");
    const descEl = document.getElementById("modalHeroDescription");
    const diagramEl = document.getElementById("modalHeroDiagram");
    if (!nameEl || !imgEl || !descEl || !diagramEl) return;

    const displayName = prettyNameFromFilename(hero.slug);
    nameEl.textContent = displayName;

    imgEl.alt = displayName;
    setHeroImageWithFallback(imgEl, hero.slug, hero.file);

    descEl.textContent = hero.description ?? "";
    diagramEl.src = hero.diagram ?? "";

    modal.classList.add("show");
  } catch (err) {
    console.error("[openHeroModal] Error:", err, { hero });
  }
}

function closeHeroModal(reason = "unknown") {
  if (!modal) return;
  modal.classList.remove("show");
}

if (closeBtn) closeBtn.addEventListener("click", () => closeHeroModal("close button"));
window.addEventListener("click", (e) => { if (modal && e.target === modal) closeHeroModal("backdrop click"); });

/* ---------------------------------------------------
   TIERLIST RENDER (image fallback)
   - tierlist data comes from script2.js
----------------------------------------------------- */
let heroLookupByNameKey = null;

function buildHeroLookup() {
  const map = new Map();
  for (const h of allHeroes) {
    const disp = prettyNameFromFilename(h.slug);
    map.set(normKey(disp), h);
    map.set(normKey(h.slug), h);
    map.set(normKey(h.file.replace(/\.[^.]+$/, "")), h);
  }
  return map;
}

function renderTierlist() {
  const container = document.getElementById("tierlist");
  if (!container) return;
  container.innerHTML = "";

  (async () => {
    await ensureHeroesLoaded();
    heroLookupByNameKey = heroLookupByNameKey || buildHeroLookup();

    Object.keys(tierlist).forEach(tier => {
      const row = document.createElement("div");
      row.className = "tier";

      const label = document.createElement("div");
      label.className = "tier-label tier-" + tier.toLowerCase();
      label.textContent = tier;

      const slot = document.createElement("div");
      slot.className = "tier-slot";

      tierlist[tier].forEach(name => {
        const char = document.createElement("div");
        char.className = "character";
        char.dataset.name = name;

        const img = document.createElement("img");
        img.alt = name;

        const hit = heroLookupByNameKey.get(normKey(name));
        if (hit) {
          setHeroImageWithFallback(img, hit.slug, hit.file);
        } else {
          const baseSlug = name.toLowerCase().replace(/\s+/g, "-");
          setHeroImageWithFallback(img, baseSlug, null);
        }

        const span = document.createElement("span");
        span.textContent = name;

        char.appendChild(img);
        char.appendChild(span);
        slot.appendChild(char);
      });

      row.appendChild(label);
      row.appendChild(slot);
      container.appendChild(row);
    });
  })();
}

/* ---------------------------------------------------
   NAV + PAGE SWITCHING
----------------------------------------------------- */
function showPage(pageId) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  const page = document.getElementById(pageId);
  if (!page) return;
  page.style.display = "block";

  if (pageId === "heroes") renderHeroes();
  if (pageId === "tierlists") renderTierlist();
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.getAttribute("data-page");
    if (page) showPage(page);
  });
});

const roleFilter = document.getElementById("roleFilter");
if (roleFilter) roleFilter.addEventListener("change", renderHeroes);

showPage("home");

/* ---------------------------------------------------
   TIERLIST SEARCH (unchanged)
----------------------------------------------------- */
const searchInput = document.getElementById("tierlist-search");
const title = document.getElementById("tierlist-title");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim().toLowerCase();
    if (!value) {
      tierlist = JSON.parse(JSON.stringify(defaultTierlist));
      if (title && title.firstChild) title.firstChild.textContent = "Tier List (Season 6.0)";
      renderTierlist();
      return;
    }
    if (tierlistsByCharacter[value]) {
      tierlist = JSON.parse(JSON.stringify(tierlistsByCharacter[value]));
      if (title && title.firstChild) {
        title.firstChild.textContent =
          `Tier List vs ${value.charAt(0).toUpperCase() + value.slice(1)}`;
      }
      renderTierlist();
    }
  });
}

/* ---------------------------------------------------
   GUIDES FILTER (unchanged)
----------------------------------------------------- */
function filterByCharacter(name) {
  document.querySelectorAll('.video-card').forEach(card => {
    card.style.display = card.dataset.character === name ? "block" : "none";
  });
}



/* ---------------------------------------------------
   RANK ANALYZER
----------------------------------------------------- */

let currentPlatform = "pc";
/*
POSITIONING, AWARENESS, ABILITY USAGE, ULTIMATE USAGE, MECHANICS, DECISION MAKING
PARTICIPATING PATHFINDERS : Kingu, Oreo, Nenmi
*/
const rankAverages = {

  pc: {
    bronze:[1,1,2,2,2,2],

    silver:[1,2,2,2,3,2],

    gold:[2,2,3,3,3,2],

    platinum:[5,5,4,5,5,6],

    diamond:[6,6,6,6,6,7],

    grandmaster:[7,7,8,8,8,8]
  },

  console: {
    bronze:[1,0,1,1,0,1],

    silver:[2,0,1,2,1,3],

    gold:[3,2,2,3,2,4],

    platinum:[5,4,4,5,5,6],

    diamond:[7,7,6,6,5,6],

    grandmaster:[8,7,8,8,7,9]
  }

};

document.getElementById("analyze-btn")
.addEventListener("click",animateRadar);
function animateRadar(){
const canvas=document.getElementById("radarChart");
const ctx=canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;
canvas.width = canvas.offsetWidth * dpr;
canvas.height = canvas.offsetHeight * dpr;
ctx.scale(dpr, dpr);

const player=[

+pos.value,
+aware.value,
+ability.value,
+ult.value,
+mech.value,
+decision.value

];

const selectedRank = document.getElementById("rank-select").value;
const rank = rankAverages[currentPlatform][selectedRank];

const grade=calculateGrade(player,rank);
document.getElementById("grade-output").textContent="Grade: "+grade;
document.getElementById("suggestions").innerHTML=
generateSuggestions(player,rank);
let progress=0;
function frame(){
progress+=0.05;
if(progress>1)progress=1;
ctx.clearRect(0,0,canvas.width,canvas.height);
drawGrid(ctx);
drawShape(ctx,rank,"rgba(255,80,80,0.25)",1);
drawShape(ctx,player,"rgba(76,201,240,0.55)",progress);
if(progress<1)requestAnimationFrame(frame);
}
frame();
}

function drawGrid(ctx){

const cx=260;
const cy=260;
const rings=10;
const points=6;
const max=180;
const labels=[

"Positioning",
"Awareness",
"Ability Usage",
"Ulitmate Usage",
"Mechanics",
"Decision Making"

];

ctx.strokeStyle="rgba(76,201,240,0.15)";
ctx.lineWidth=1;
for(let r=1;r<=rings;r++){
ctx.beginPath();
for(let i=0;i<points;i++){
const angle=(Math.PI*2/points)*i-Math.PI/2;
const radius=(r/rings)*max;
const x=cx+Math.cos(angle)*radius;
const y=cy+Math.sin(angle)*radius;
i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
}

ctx.closePath();
ctx.stroke();
}

ctx.strokeStyle="rgba(76,201,240,0.25)";
for(let i=0;i<points;i++){
const angle=(Math.PI*2/points)*i-Math.PI/2;
ctx.beginPath();
ctx.moveTo(cx,cy);
ctx.lineTo(
cx+Math.cos(angle)*max,
cy+Math.sin(angle)*max
);
ctx.stroke();
}

ctx.fillStyle="rgba(255,255,255,0.85)";
ctx.font="14px Orbitron, sans-serif";
ctx.textAlign="center";
ctx.textBaseline="middle";
for(let i=0;i<points;i++){
const angle=(Math.PI*2/points)*i-Math.PI/2;
const lx=cx+Math.cos(angle)*(max+30);
const ly=cy+Math.sin(angle)*(max+30);
ctx.fillText(labels[i],lx,ly);
}
}


function calculateGrade(player,rank){
let total=0;
for(let i=0;i<player.length;i++){
total+=player[i]/rank[i];
}
const avg=total/player.length;
if(avg>=1.25)return "S";
if(avg>=1.1)return "A";
if(avg>=0.95)return "B";
if(avg>=0.8)return "C";
if(avg>=0.65)return "D";
return "F";
}

function generateSuggestions(player,rank){
const labels=[

"Positioning",
"Map Awareness",
"Ability Usage",
"Ultimate Usage",
"Mechanics",
"Decision Making"

];

let tips=[];
for(let i=0;i<player.length;i++){
if(player[i]<rank[i]){
tips.push(`Improve ${labels[i]} — below rank benchmark`);
}
}

if(tips.length===0)tips.push("Performance exceeds rank benchmark — push higher lobbies.");
return tips.join("<br>");
}

document.getElementById("export-btn")
.addEventListener("click",()=>{
const canvas=document.getElementById("radarChart");
const link=document.createElement("a");
link.download="match-analysis.png";
link.href=canvas.toDataURL();
link.click();

});

const tooltip=document.createElement("div");
tooltip.className="tooltip";
document.body.appendChild(tooltip);
document.getElementById("radarChart")
.addEventListener("mousemove",e=>{
const rect=e.target.getBoundingClientRect();
const x=e.clientX-rect.left;
const y=e.clientY-rect.top;
const cx=260;
const cy=260;

const labels=[

"Positioning",
"Map Awareness",
"Ability Usage",
"Ultimate Usage",
"Mechanics",
"Decision Making"

];

for(let i=0;i<6;i++){
const angle=(Math.PI*2/6)*i-Math.PI/2;
const lx=cx+Math.cos(angle)*200;
const ly=cy+Math.sin(angle)*200;
const dist=Math.hypot(x-lx,y-ly);
if(dist<30){
tooltip.textContent=labels[i];
tooltip.style.left=e.pageX+10+"px";
tooltip.style.top=e.pageY+10+"px";
tooltip.style.opacity=1;
return;
}
}
tooltip.style.opacity=0;

});

function drawShape(ctx,data,color,scale){

const cx=260;
const cy=260;
const max=180;
const points=6;
ctx.beginPath();
data.forEach((val,i)=>{
const angle=(Math.PI*2/points)*i-Math.PI/2;
const r=(val/10)*max*scale;
const x=cx+Math.cos(angle)*r;
const y=cy+Math.sin(angle)*r;
if(i===0){
ctx.moveTo(x,y);
}else{
ctx.lineTo(x,y);
}

});

ctx.closePath();

ctx.fillStyle=color;
ctx.fill();

ctx.lineWidth=2;
ctx.strokeStyle=color.replace("0.55","1").replace("0.25","0.6");
ctx.stroke();
}

const rankColors={
bronze:"#dd8e61",
silver:"#738ba1",
gold:"#fdb310",
platinum:"#47e9ed",
diamond:"#0560f7",
grandmaster:"#821ddf"
};

document.getElementById("rank-select")
.addEventListener("change",function(){

const rank=this.value;
const badge=document.getElementById("rank-badge");
badge.textContent=
rank.charAt(0).toUpperCase()+rank.slice(1);
badge.style.background=rankColors[rank];
badge.style.boxShadow=`0 0 10px ${rankColors[rank]}`;

});

const helpBox = document.getElementById("help-box");
if (helpBox) {
    helpBox.addEventListener("click", () => {
        const templateText =

`In-game name/UID:
Platform (PC/Console):
Replay ID (VOD review):
Character(s) played:
Notes:`;

        navigator.clipboard.writeText(templateText).then(() => {
            const originalContent = helpBox.innerHTML;
            helpBox.classList.add("copied");
            helpBox.innerHTML = "<strong>Template copied to clipboard!</strong>";
            setTimeout(() => {
                helpBox.style.opacity = "0";
                setTimeout(() => {
                    helpBox.innerHTML = originalContent;
                    helpBox.style.opacity = "1";
                    helpBox.classList.remove("copied");
                }, 400);
            }, 1200);
        });
    });
}

document.querySelectorAll(".platform-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".platform-btn")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");
    currentPlatform = button.textContent.toLowerCase();
    updateAnalyzer();
  });
});

document.addEventListener("DOMContentLoaded", () => {

    const prev = document.getElementById("prevHero");
    const next = document.getElementById("nextHero");
    if (!prev || !next) return;

    function getAllHeroesFlat() {
        return Object.values(heroData).flat();
    }

    function getCurrentHeroName() {
        const img = document.querySelector("#heroModal img");
        if (!img) return null;

        const src = img.getAttribute("src");
        if (!src) return null;

        const file = src.split("/").pop();
        return file.replace(".png", "");
    }

    function changeHero(direction) {
        const heroes = getAllHeroesFlat();
        const currentName = getCurrentHeroName();

        if (!currentName) return;

        const index = heroes.findIndex(h => h.name === currentName);
        if (index === -1) return;

        let newIndex = index + direction;

        if (newIndex < 0) newIndex = heroes.length - 1;
        if (newIndex >= heroes.length) newIndex = 0;

        openHeroModal(heroes[newIndex]);
    }
    prev.addEventListener("click", () => changeHero(-1));
    next.addEventListener("click", () => changeHero(1));
});