const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "public/images/amagami-san-chi-no-enmusubi/ep1");
const outputDir = path.join(__dirname, "public/images/amagami-san-chi-no-enmusubi/ep1-copy");

async function convertImagesToWebP() {
  try {
    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Read all files from input directory
    const files = await fs.readdir(inputDir);

    for (const file of files) {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(outputDir, `${path.parse(file).name}.webp`);

      // Check if it's a valid image file
      if (/\.(jpg|jpeg|png)$/i.test(file)) {
        console.log(`Converting: ${file} → ${path.parse(file).name}.webp`);

        await sharp(inputFilePath)
          .toFormat("webp")
          .webp({ quality: 80 })
          .toFile(outputFilePath);

        console.log(`✅ Converted: ${outputFilePath}`);
      }
    }

    console.log("🎉 Conversion complete!");
  } catch (error) {
    console.error("❌ Error converting images:", error);
  }
}

convertImagesToWebP();