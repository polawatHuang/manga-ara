import mangas from "@/database/mangas";

export function goToRandomManga(router) {
  if (!router || mangas.length === 0) return;

  // Pick a random manga
  const randomManga = mangas[Math.floor(Math.random() * mangas.length)];

  // Navigate to the selected manga's page
  router.push(randomManga.slug);
}