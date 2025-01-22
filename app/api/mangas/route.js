import fs from "fs";
import path from "path";

// File path to mangas.json
const mangasFilePath = path.join(process.cwd(), "database", "mangas.json");

// Read mangas data
const readMangas = () => JSON.parse(fs.readFileSync(mangasFilePath, "utf-8"));

// Write mangas data
const writeMangas = (data) => fs.writeFileSync(mangasFilePath, JSON.stringify(data, null, 2), "utf-8");

export async function GET() {
  return Response.json(readMangas());
}

export async function POST(req) {
  const newManga = await req.json();
  const mangas = readMangas();
  mangas.push(newManga);
  writeMangas(mangas);
  return Response.json({ message: "Manga added successfully" });
}

export async function PUT(req) {
  const updatedManga = await req.json();
  let mangas = readMangas();
  mangas = mangas.map((m) => (m.id === updatedManga.id ? updatedManga : m));
  writeMangas(mangas);
  return Response.json({ message: "Manga updated successfully" });
}

export async function DELETE(req) {
  const { id } = await req.json();
  let mangas = readMangas();
  mangas = mangas.filter((m) => m.id !== id);
  writeMangas(mangas);
  return Response.json({ message: "Manga deleted successfully" });
}