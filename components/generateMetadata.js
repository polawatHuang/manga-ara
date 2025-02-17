// ✅ Generate dynamic metadata (SEO)
export async function generateMetadata() {
  const mangas = await fetchMangaData();
  const topManga = mangas.length > 0 ? mangas[0] : null;
  const metaTitle = topManga
    ? `อ่าน ${topManga.name} และการ์ตูนยอดฮิต | Manga`
    : "อ่านการ์ตูนยอดนิยม | Manga";
  const metaDescription = topManga
    ? topManga.description
    : "เว็บไซต์อ่านมังงะยอดนิยม มีมังงะอัพเดทใหม่ทุกวัน";
  const metaImage = topManga ? topManga.imageCover : "/default-meta.jpg";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [{ url: metaImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}
