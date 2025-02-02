import { db } from "@/firebaseConfig";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const mangasCollection = collection(db, "manga");

// GET: Fetch all mangas
export async function GET() {
  try {
    const snapshot = await getDocs(mangasCollection);
    const mangas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(mangas);
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