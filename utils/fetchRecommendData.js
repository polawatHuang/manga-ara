async function fetchRecommendData(page = 1, type = "") {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
    const url = `${baseURL}/recommend?page=${page}&type=${type}`;

    const recommendRes = await fetch(url, {
      cache: "no-store",
    });

    if (!recommendRes.ok) {
      console.error("API error:", recommendRes.status);
      return [];
    }

    const recommendData = await recommendRes.json();

    // ✅ FIX: Return the data directly instead of accessing `.result`
    return Array.isArray(recommendData) ? recommendData : [];
  } catch (error) {
    console.error("Error fetching recommend data:", error);
    return [];
  }
}

export default fetchRecommendData;