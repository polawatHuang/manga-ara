import * as admin from "firebase-admin";
import { cookies } from "next/headers";

// Initialize Firebase Admin SDK only once
const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

export const verifyAuth = async () => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) throw new Error("No token");

    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    return null;
  }
};