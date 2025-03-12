// ✅ Use an absolute URL for API calls on the server
async function fetchMangaData(page = 1, type = "") {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const url = `https://mangayuzu.com/api/v1/get/comic/chapterBySlug`; // ✅ Correct absolute URL

    const mangaRes = await fetch(url, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: "หนึ่งเดียวในใจ-1-vision-1" }),
    });

    if (!mangaRes.ok) {
      console.error("API error:", mangaRes.status);
      return [];
    }

    const mangaData = await mangaRes.json()

    return (mangaData.result || []);
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return [];
  }
}

export default fetchMangaData;