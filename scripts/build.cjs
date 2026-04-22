require("dotenv").config();

const { execSync } = require("child_process");

function run(command, label) {
    console.log(`\n=== ${label} ===`);
    execSync(command, {
        stdio: "inherit",
        cwd: __dirname
    });
}

try {
    run("node enrich-heroes.cjs", "Enriching heroes from MarvelRivalsAPI");
    run("node generate-hero-pages.cjs", "Generating hero pages");
    console.log("\n✅ Build complete!");
} catch (error) {
    console.error("\n❌ Build failed");
    process.exit(1);
}