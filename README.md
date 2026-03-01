# 🗲 Marvel Rivals Pathfinders

A community-driven Marvel Rivals toolkit featuring:

# 📊 Tier Lists
View the current and previous Tier lists (currently being worked on)
and also the ability to make your own Tier lists (based on the drag and drop from tiermaker)

# 🧠 Match Analyzer (Radar Chart + Rank Benchmarking)
A tool used for VOD review etc

# 🦸 Hero Chart with Modal System
WIP

# 🖼 Avatar Auto Downloader 📁 Automatic images.json Generator and 💾 Local Storage Persistence
New characters are added each season, this tool takes the slugs downloaded with the Avatar Auto Downloader (slugDownload.js) and parses the image's name in a JSON format to be read by the system. This way the images of characters like Cloak & Dagger, Jeff the Landshark Doctor Strange, don't go missing, corrupt etc. because of file not found. 

# 

📁 Project Structure
project-root/
│
├─ index.html
├─ tiermaker.html
├─ script.js
├─ script2.js
├─ script3.js
│
├─ download-characters.js
├─ generateImagesJson.cjs
├─ images.json
│
└─ images/
   └─ characters/
🌐 Main Website

index

Contains:

Navigation system

Multi-page section routing

FAQ

Hero Chart

Tier List viewer

Match Analyzer

External links

Powered by:

some javascript nonsense


📊 Tier Lists

Inside main site:

Search-based tier viewing

Character-specific tierlists

Seasonal title updates (e.g. Season 6.5)

Separate Tier Maker Tool:

tiermaker.html 

tiermaker

Features:

Drag & Drop S–F tiers

Rename on double click

Copy formatted tier output

LocalStorage persistence

🧠 Match Analyzer

Interactive radar chart comparing:

Positioning

Awareness

Ability Usage

Ultimate Usage

Mechanics

Decision Making

Features:

Rank benchmark comparison

PC / Console toggle

Grade calculation (S → F)

Improvement suggestions

PNG export

Animated rendering

Hover tooltips

🖼 Hero Image System
Smart Name Formatting

Handles:

cloak-dagger

cloak_and_dagger

cloak&dagger

ironman

camelCase

and → & replacement

Automatically formats to clean display names.

Defined in:

script.js 

Image Fallback Logic

If an image fails, it tries:

dash ↔ underscore swaps

& → and

stripped special characters

lowercase normalization

Prevents broken image icons.

🛠 Avatar Downloader (Dev Tool)

download-characters.js 

slugDownload

Downloads hero avatars from:

https://rivalskins.com/assets/hero-icons-avatars/

Saves to:

images/characters/

Skips if file already exists.

Requirements

Node.js 18+

Internet connection

Install dependency:

npm install cheerio

Run:

node download-characters.js
📁 Auto Generate images.json

generateImagesJson.cjs

Scans:

images/characters/

Generates:

images.json

Run:

node generateImagesJson.cjs

Output format:

[
  "ironman.png",
  "doctorstrange.webp"
]
🚀 How To Run Locally

⚠ Do NOT use file://

Use Live Server or any local web server.

Example (VS Code):

Install Live Server

Right-click index.html

Open with Live Server

💾 Persistence

Tier Maker stores state in:

localStorage

Key:

tierlist_pathfinders_style_v3
📌 External Links Section

Includes:

Official Marvel Rivals site

Balance posts

Live stats

Crosshair hub

Wiki

Rivalsmeta

Rivalskins

(All linked from index.html 

index

)

🔁 Full Dev Workflow
node download-characters.js
node generateImagesJson.cjs
# then run local server
⚠ Common Issues
Images Not Showing

Run JSON generator

Confirm images.json exists

Use Live Server

Modal Not Opening

Check required DOM IDs exist in index.html.

Clipboard Copy Fails

Requires HTTP origin.

🧩 Credits

All contributors listed directly inside:

index.html 

index

If your name is missing, contact Fae.
