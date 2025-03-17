import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    //const targetUrl = "https://mangasuper.com/manga/guild-no-uketsukejou/%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-3/";
    const targetUrl = "https://mangasuper.com/manga/shall-master-family/%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-0/"

    // Fetch page content
    const response = await axios.get(targetUrl);
    const $ = cheerio.load(response.data);

    // Extract image URLs inside class 'page-break no-gaps'
    const imageUrls = [];
    $(".page-break.no-gaps img").each((index, element) => {
      const imgUrl = $(element).attr("data-src") || $(element).attr("src");
      if (imgUrl) imageUrls.push(imgUrl);
    });

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    // Set the folder path for downloaded images
    const desktopPath = path.join(require("os").homedir(), "Desktop", "MangaImages");
    if (!fs.existsSync(desktopPath)) {
      fs.mkdirSync(desktopPath, { recursive: true });
    }

    // Download images and rename them as page1.jpg, page2.jpg, ...
    for (let i = 0; i < imageUrls.length; i++) {
      const imgUrl = imageUrls[i];
      const imgName = `page${i + 1}.jpg`; // Renaming logic
      const imgPath = path.join(desktopPath, imgName);

      const imgResponse = await axios({ url: imgUrl, responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, imgResponse.data);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Images downloaded and renamed", 
      images: imageUrls.map((_, i) => `page${i + 1}.jpg`) 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}