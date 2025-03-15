async function fetchMangaData(page = 1, type = "") {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
    const url = `${baseURL}/mangas?page=${page}&type=${type}`;

    const mangaRes = await fetch(url, {
      cache: "no-store",
    });

    if (!mangaRes.ok) {
      console.error("API error:", mangaRes.status);
      return [];
    }

    const mangaData = await mangaRes.json();

    // ✅ FIX: Return the data directly instead of accessing `.result`
    return Array.isArray(mangaData) ? mangaData : [];
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return [];
  }
}

export default fetchMangaData;