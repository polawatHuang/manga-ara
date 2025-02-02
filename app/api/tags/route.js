import { db } from "@/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const tagsCollection = collection(db, "tag");

// ✅ GET: Fetch all tags from Firestore
export async function GET() {
  try {
    const snapshot = await getDocs(tagsCollection);
    const tags = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(tags);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: Add a new tag to Firestore
export async function POST(req) {
  try {
    const newTag = await req.json();
    const docRef = await addDoc(tagsCollection, newTag);
    return Response.json({ message: "Tag added successfully", id: docRef.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: Remove a tag from Firestore
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const tagDoc = doc(db, "tags", id);
    await deleteDoc(tagDoc);
    return Response.json({ message: "Tag deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}