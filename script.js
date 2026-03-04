/* ---------------------------------------------------
   NAME FORMATTING (Cannizzo-style casing)
----------------------------------------------------- */
const NAME_OVERRIDES = {
  "cloak-dagger": "Cloak & Dagger",
  "cloak_and_dagger": "Cloak & Dagger",
  "cloakdagger": "Cloak & Dagger",
  "cloak_dagger": "Cloak & Dagger",
  "cloak-&-dagger": "Cloak & Dagger",

  "jeff-the-land-shark": "Jeff",
  "jeff_the_land_shark": "Jeff",

  "elsa_bloodstone": "Elsa Bloodstone",
  "elsa-bloodstone": "Elsa Bloodstone"
};

const LOWERCASE_WORDS = new Set(["and", "of", "the", "to", "in", "on", "a", "an"]);

const WORD_SPLITS = [
  ["adamwarlock", "Adam Warlock"],
  ["ironman", "Iron Man"],
  ["doctorstrange", "Doctor Strange"],
  ["spiderman", "Spider-Man"]
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

// Mirrors tiermaker behavior: includes "and" -> "&"
function prettyNameFromFilename(filenameOrKey) {
  let base = String(filenameOrKey || "").replace(/\.[^.]+$/, "");
  const key = base.toLowerCase();

  if (NAME_OVERRIDES[key]) return NAME_OVERRIDES[key];

  for (const [needle, pretty] of WORD_SPLITS) {
    if (key === needle) return pretty;
  }

  base = base.replace(/[_-]+/g, " ");
  base = splitCamelCase(base);
  base = base.replace(/\band\b/gi, "&");
  base = base.replace(/\s+/g, " ").trim();

  return titleCaseSmart(base);
}

/* ---------------------------------------------------
   IMAGE FALLBACK (handles slug differences like & / and / _ / -)
----------------------------------------------------- */
function setHeroImageWithFallback(imgEl, heroSlug) {
  const slug = String(heroSlug || "");
  const base = slug.replace(/\.[^.]+$/, "");
  const cleaned = base.toLowerCase();

  const candidates = [];
  const push = (s) => { if (s && !candidates.includes(s)) candidates.push(s); };

  // Primary
  push(`images/characters/${cleaned}.png`);

  // Common variants
  push(`images/characters/${cleaned.replace(/&/g, "and")}.png`);
  push(`images/characters/${cleaned.replace(/&/g, "and").replace(/-/g, "_")}.png`);
  push(`images/characters/${cleaned.replace(/-/g, "_")}.png`);
  push(`images/characters/${cleaned.replace(/_/g, "-")}.png`);

  // Sometimes '&' is removed entirely
  push(`images/characters/${cleaned.replace(/&/g, "")}.png`);
  push(`images/characters/${cleaned.replace(/&/g, "").replace(/-/g, "_")}.png`);

  // Last-resort: strip anything not a-z/0-9/_/-
  push(`images/characters/${cleaned.replace(/[^a-z0-9_-]/g, "")}.png`);

  let i = 0;
  imgEl.src = candidates[i];

  imgEl.onerror = () => {
    i += 1;
    if (i < candidates.length) {
      imgEl.src = candidates[i];
    } else {
      // stop the broken icon loop
      imgEl.onerror = null;
      imgEl.removeAttribute("src");
    }
  };
}


/* ---------------------------------------------------
   RENDER SYSTEM
----------------------------------------------------- */
function renderHeroes() {
    const container = document.getElementById("heroGrid");
    const filterElement = document.getElementById("roleFilter");
    const filter = filterElement ? filterElement.value : "all";
    if (!container) return;
    container.innerHTML = "";
    Object.keys(heroData).forEach(category => {
        if (filter !== "all" && filter !== category) return;
        heroData[category].forEach(hero => {
            const card = document.createElement("div");
            card.className = "hero-slot";
            const img = document.createElement("img");
            const displayName = prettyNameFromFilename(hero.name);
            img.alt = displayName;
            setHeroImageWithFallback(img, hero.name);
            const nameDiv = document.createElement("div");
            nameDiv.className = "hero-name";
            nameDiv.textContent = displayName;
            card.appendChild(img);
            card.appendChild(nameDiv);
            card.addEventListener("click", () => openHeroModal(hero));
            container.appendChild(card);
        });
    });
}
// ---------------------------------------------------
// HERO MODAL (fixed: use .show class + better logging)
// ---------------------------------------------------
const modal = document.getElementById("heroModal");
const closeBtn = document.getElementById("closeHeroModal");

function openHeroModal(hero) {
    console.log("[openHeroModal] hero:", hero);
    try {
        if (!modal) {
            console.error("[openHeroModal] Missing #heroModal in DOM");
            return;
        }
        if (!hero || !hero.name) {
            console.error("[openHeroModal] Invalid hero object:", hero);
            return;
        }
        const nameEl = document.getElementById("modalHeroName");
        const imgEl = document.getElementById("modalHeroImage");
        const descEl = document.getElementById("modalHeroDescription");
        const diagramEl = document.getElementById("modalHeroDiagram");
        if (!nameEl || !imgEl || !descEl || !diagramEl) {
            console.error("[openHeroModal] Missing modal elements:", {
                modalHeroName: !!nameEl,
                modalHeroImage: !!imgEl,
                modalHeroDescription: !!descEl,
                modalHeroDiagram: !!diagramEl
            });
            return;
        }
        nameEl.textContent = prettyNameFromFilename(hero.name ?? "");
        imgEl.alt = prettyNameFromFilename(hero.name ?? "");
        setHeroImageWithFallback(imgEl, hero.name);
descEl.textContent = hero.description ?? "";
        diagramEl.src = hero.diagram ?? "";
        modal.classList.add("show");

        console.log("[openHeroModal] modal opened; className =", modal.className);
    } catch (err) {
        console.error("[openHeroModal] Error opening modal:", err, { hero });
    }
}

function closeHeroModal(reason = "unknown") {
    if (!modal) return;
    console.log("[closeHeroModal] closing; reason =", reason);
    modal.classList.remove("show");
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => closeHeroModal("close button"));
} else {
    console.warn("[heroModal] Missing #closeHeroModal");
}

window.addEventListener("click", (e) => {
    if (!modal) return;
    if (e.target === modal) closeHeroModal("backdrop click");
});

/* ---------------------------------------------------
   LOAD TIERLIST
----------------------------------------------------- */
async function loadTierlist() {
    try {
        const res = await fetch('/functions/save');
        if(res.ok) {
            tierlist = await res.json();
        }
    } catch(err) {
        console.log('Error loading tierlist:', err);
    }
    renderTierlist();
}
/* ---------------------------------------------------
   INITIAL LOAD
----------------------------------------------------- */
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll(".nav-links a")
      .forEach(l => l.classList.remove("active"));

    link.classList.add("active");
    const page = link.dataset.page;
    if (page) showPage(page);
  });
});

const logoText = document.querySelector(".logo-text");
const lightningContainer = document.querySelector(".lightning-container");

function confettiBurst(x, y, amount = 3) {
    for (let i = 0; i < amount; i++) {
        const bolt = document.createElement("span");
        bolt.className = "lightning";
        bolt.textContent = "🗲";
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        bolt.style.left = `${x}px`;
        bolt.style.top = `${y}px`;
        bolt.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
        bolt.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
        lightningContainer.appendChild(bolt);
        setTimeout(() => bolt.remove(), 1200);
    }
}

let lastBurst = 0;
const cooldown = 200;
logoText.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastBurst < cooldown) return;
    lastBurst = now;
    const rect = logoText.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    confettiBurst(x, y, 4);
});

function renderTierlist() {
    const container = document.getElementById("tierlist");
    container.innerHTML = "";
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
            const baseSlug = name.toLowerCase().replace(/\s+/g, "-");
            setHeroImageWithFallback(img, baseSlug);
            img.alt = name;
            const label = document.createElement("span");
            label.textContent = name;
            char.appendChild(img);
            char.appendChild(label);
            slot.appendChild(char);
        });
        row.appendChild(label);
        row.appendChild(slot);
        container.appendChild(row);
    });
}

const searchInput = document.getElementById("tierlist-search");
const title = document.getElementById("tierlist-title");
if (searchInput && title) {
    searchInput.addEventListener("input", () => {
    });
}
searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim().toLowerCase();
    if (!value) {
        tierlist = JSON.parse(JSON.stringify(defaultTierlist));
        title.firstChild.textContent = "Tier List (Season 6.0)";
        renderTierlist();
        return;
    }
    if (tierlistsByCharacter[value]) {
        tierlist = JSON.parse(JSON.stringify(tierlistsByCharacter[value]));
        title.firstChild.textContent =
            `Tier List vs ${value.charAt(0).toUpperCase() + value.slice(1)}`;
        renderTierlist();
    }
});

function showPage(pageId) {
    document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
    const page = document.getElementById(pageId);
    page.style.display = "block";

      if (pageId === "heroes") {
        renderHeroes();
    }

    if (pageId === "tierlists") {
        renderTierlist();
    }
}
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        if (page) showPage(page);
    });
});

const roleFilter = document.getElementById("roleFilter");
if (roleFilter) {
    roleFilter.addEventListener("change", renderHeroes);
}

function filterByCharacter(name) {
    document.querySelectorAll('.video-card').forEach(card => {
        card.style.display =
            card.dataset.character === name ? "block" : "none"; /* THIS IS NEW*/
    });
}

showPage("home");

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

const canvas = ctx.canvas;
const dpr = window.devicePixelRatio || 1;

const cx = canvas.width / 2 / dpr;
const cy = canvas.height / 2 / dpr;

const rings = 10;
const points = 6;
const max = Math.min(cx, cy) - 40;

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
const lx=cx+Math.cos(angle)*(max+25);
const ly=cy+Math.sin(angle)*(max+25);
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

const canvas = ctx.canvas;
const dpr = window.devicePixelRatio || 1;

const cx = canvas.width / 2 / dpr;
const cy = canvas.height / 2 / dpr;
const max = Math.min(cx, cy) - 40;
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