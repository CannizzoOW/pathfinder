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
    run("node slugDownload.js", "Checking if there are missing slugs");

    console.log("\n✅ Update complete!");
} catch (error) {
    console.error("\n❌ Update failed");
    process.exit(1);
}