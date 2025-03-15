import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Extract URL from query parameters
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "Missing URL parameter" });
        }

        // Decode and normalize the URL
        const decodedUrl = decodeURIComponent(url);

        // Define directory to store images
        const imagesDir = path.join(process.cwd(), "public", "manga_images");
        fs.ensureDirSync(imagesDir);

        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        console.log(`Opening page: ${decodedUrl}`);

        await page.goto(decodedUrl, { waitUntil: "networkidle2" });

        // Extract image URLs from the page
        const imageUrls = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".page-break.no-gaps img")).map(img => img.src);
        });

        await browser.close();

        if (imageUrls.length === 0) {
            return res.status(404).json({ error: "No images found on the page." });
        }

        // Download and save images
        let downloadedImages = [];
        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];
            const imageName = `page${i + 1}.jpg`;
            const imagePath = path.join(imagesDir, imageName);

            const response = await fetch(imageUrl);
            const buffer = await response.arrayBuffer();
            fs.writeFileSync(imagePath, Buffer.from(buffer));

            downloadedImages.push(`/manga_images/${imageName}`);
        }

        console.log("✅ Images downloaded successfully.");

        return res.status(200).json({
            message: "Images downloaded successfully.",
            images: downloadedImages
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}