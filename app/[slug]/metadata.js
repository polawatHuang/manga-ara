// Helper function to generate metadata for manga pages
export async function generateMangaMetadata(slug) {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
    const response = await fetch(`${baseURL}/mangas`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      return {
        title: "มังงะ | MANGA ARA",
        description: "อ่านมังงะออนไลน์ฟรี แปลไทย คุณภาพ HD",
      };
    }

    const data = await response.json();
    const manga = data.find((item) => item.slug === slug);

    if (!manga) {
      return {
        title: "ไม่พบมังงะที่ค้นหา | MANGA ARA",
        description: "ขออภัย ไม่พบมังงะที่คุณค้นหา กรุณาลองค้นหาใหม่อีกครั้ง",
      };
    }

    // Parse tags
    let tags = [];
    try {
      tags = JSON.parse(manga.tag || "[]");
    } catch {
      tags = [];
    }

    // Parse episodes to get episode count
    let episodeCount = 0;
    try {
      const episodes = JSON.parse(manga.ep || "[]");
      episodeCount = Array.isArray(episodes) ? episodes.length : 0;
    } catch {
      episodeCount = 0;
    }

    const title = `${manga.name} - อ่านมังงะแปลไทย ${episodeCount} ตอน`;
    const description = manga.description 
      ? `${manga.description.substring(0, 150)}... อ่านต่อได้ฟรีที่ MANGA ARA | ${tags.slice(0, 3).join(", ")} | อัปเดตล่าสุด: ${new Date(manga.updated_at).toLocaleDateString('th-TH')}`
      : `อ่านมังงะ ${manga.name} แปลไทย ${episodeCount} ตอน ฟรี คุณภาพ HD อัปเดตใหม่ทุกสัปดาห์ | ${tags.slice(0, 3).join(", ")}`;

    return {
      title,
      description,
      keywords: `${manga.name}, อ่านมังงะ ${manga.name}, ${tags.join(", ")}, manga ${manga.slug}, มังงะแปลไทย, อ่านการ์ตูน`,
      openGraph: {
        title: `${manga.name} - ${episodeCount} ตอน | MANGA ARA`,
        description: description,
        url: `https://mangaara.com/${manga.slug}`,
        type: "book",
        images: [
          {
            url: manga.background_image || "/images/default-manga.jpg",
            width: 1200,
            height: 630,
            alt: `${manga.name} - มังงะแปลไทย`,
          },
        ],
        book: {
          authors: ["MANGA ARA"],
          tags: tags,
          releaseDate: manga.created_at,
        },
      },
      twitter: {
        card: "summary_large_image",
        title: `${manga.name} - อ่านมังงะแปลไทย`,
        description: description.substring(0, 200),
        images: [manga.background_image || "/images/default-manga.jpg"],
      },
      alternates: {
        canonical: `https://mangaara.com/${manga.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "มังงะ | MANGA ARA",
      description: "อ่านมังงะออนไลน์ฟรี แปลไทย คุณภาพ HD",
    };
  }
}
