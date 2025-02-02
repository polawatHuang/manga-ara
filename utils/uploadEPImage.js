// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

// uploadImages.js
export const uploadImages = async (files) => {
  const uploadPromises = Array.from(files).map(async (file) => {
    const storageRef = ref(storage, `/images/manga/ep1/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });

  try {
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs; // Array of URLs
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};
