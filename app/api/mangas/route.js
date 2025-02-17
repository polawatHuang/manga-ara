import { db } from "@/firebaseConfig";
import dayjs from "dayjs";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const mangasCollection = collection(db, "manga");

// GET: Fetch all mangas
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1; // Default to page 1 if not provided

    const response = await fetch(
      `https://mangayuzu.com/api/v1/get/search?orderBy=view&sortBy=desc&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Extract relevant fields and format the response
    const formattedData = data.data.results.map((manga) => ({
      id: manga.id,
      name: manga.name,
      slug: manga.slug,
      description: manga.description,
      backgroundImage: manga.imageCover,
      tag: manga.genres.map((genre) => genre.genreName),
      view: manga.view || 0,
      created_date: dayjs(manga.createdAt).format("YYYY-MM-DD"),
      updated_date: dayjs(manga.updatedAt).format("YYYY-MM-DD"),
    }));

    return Response.json({ success: true, page: parseInt(page), formattedData });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add a new manga
export async function POST(req) {
  try {
    const mangaData = await req.json();
    const docRef = await addDoc(mangasCollection, mangaData);
    return Response.json({ message: "Manga added successfully", id: docRef.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing manga
export async function PUT(req) {
  try {
    const { id, ...updatedManga } = await req.json();
    const mangaDoc = doc(db, "manga", id);
    await updateDoc(mangaDoc, updatedManga);
    return Response.json({ message: "Manga updated successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a manga
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const mangaDoc = doc(db, "manga", id);
    await deleteDoc(mangaDoc);
    return Response.json({ message: "Manga deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}