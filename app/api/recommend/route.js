import { db } from "@/firebaseConfig";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const recommendCollection = collection(db, "recommend");

// GET: Fetch all rec
export async function GET() {
  try {
    const snapshot = await getDocs(recommendCollection);
    const rec = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(rec);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add a new recommend
export async function POST(req) {
  try {
    const recommendData = await req.json();
    const docRef = await addDoc(recommendCollection, recommendData);
    return Response.json({ message: "Recommend data added successfully", id: docRef.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing recommend
export async function PUT(req) {
  try {
    const { id, ...updatedRecommend } = await req.json();
    const recommendDoc = doc(db, "manga", id);
    await updateDoc(recommendDoc, updatedRecommend);
    return Response.json({ message: "Recommend data updated successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a recommend
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const recommendDoc = doc(db, "recommend", id);
    await deleteDoc(recommendDoc);
    return Response.json({ message: "Recommend deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}