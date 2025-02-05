export async function goToRandomManga(router) {
  if (!router) return;

  try {
    // ✅ Check if cached mangas exist in localStorage
    const cachedMangas = JSON.parse(localStorage.getItem("cachedMangas"));

    let mangas = cachedMangas;

    // ✅ If no cached data, fetch from API
    if (!cachedMangas || cachedMangas.length === 0) {
      const response = await fetch("/api/mangas");
      if (!response.ok) {
        throw new Error("Failed to fetch mangas");
      }
      mangas = await response.json();

      // ✅ Cache the data for future use
      localStorage.setItem("cachedMangas", JSON.stringify(mangas));
    }

    // ✅ Ensure mangas exist
    if (mangas.length === 0) return;

    // ✅ Pick a random manga
    const randomManga = mangas[Math.floor(Math.random() * mangas.length)];

    // ✅ Navigate to the selected manga's page
    router.push(randomManga.slug);
  } catch (error) {
    console.error("Error fetching mangas:", error);
  }
}