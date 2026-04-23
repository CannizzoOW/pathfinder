const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "images", "characters");
const outputFile = path.join(__dirname, "images.json");

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error("Failed to read images/characters directory:", err);
    return;
  }

  const imageFiles = files
    .filter(file => {
      try {
        return fs.statSync(path.join(imagesDir, file)).isFile();
      } catch {
        return false;
      }
    })
    .filter(file =>
      /\.(png|jpg|jpeg|webp|gif)$/i.test(file)
    )
    .sort((a, b) => a.localeCompare(b));

  fs.writeFile(outputFile, JSON.stringify(imageFiles, null, 2), (err) => {
    if (err) {
      console.error("Failed to write images.json:", err);
      return;
    }

    console.log(`images.json successfully created with ${imageFiles.length} images.`);
  });
});