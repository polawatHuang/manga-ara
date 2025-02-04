// app/api/[manga]/[ep]/route.js

import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import serviceAccount from "../../../../serviceAccount.json";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "manga-ara.firebasestorage.app", // Replace with your bucket name
  });
}

export async function GET(request, { params }) {
  const { manga, ep } = params; // These come from the dynamic segments of the URL

  if (!manga || !ep) {
    return NextResponse.json(
      { error: "Missing manga or episode parameter." },
      { status: 400 }
    );
  }

  try {
    const bucket = getStorage().bucket();
    // Construct folder prefix dynamically
    const prefix = `images/${manga}/${ep}/`;

    // Retrieve all files in the specified folder
    const [files] = await bucket.getFiles({ prefix });

    // Map files to public URLs
    const images = files
      .filter((file) => !file.name.endsWith("/")) // Skip folder markers if any.
      .map((file) => {
        const filePath = encodeURIComponent(file.name);
        return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${filePath}?alt=media`;
      });

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
