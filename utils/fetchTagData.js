async function fetchTagData(page = 1, type = "") {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
      const url = `${baseURL}/tags?page=${page}&type=${type}`;
  
      const tagRes = await fetch(url, {
        cache: "no-store",
      });
  
      if (!tagRes.ok) {
        console.error("API error:", tagRes.status);
        return [];
      }
  
      const tagData = await tagRes.json();
  
      // ✅ FIX: Return the data directly instead of accessing `.result`
      return Array.isArray(tagData) ? tagData : [];
    } catch (error) {
      console.error("Error fetching manga data:", error);
      return [];
    }
  }
  
  export default fetchTagData;