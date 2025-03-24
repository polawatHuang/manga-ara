import { db } from "@/utils/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useEffect, useState } from "react";

const ViewTracker = ({ mangaSlug }) => {
  const [viewCount, setViewCount] = useState(0);

  // Fetch the current view count from Firestore on initial render (optional)
  useEffect(() => {
    const fetchViewCount = async () => {
      const mangaDocRef = doc(db, "mangas", mangaSlug);  // Firestore path
      const docSnapshot = await getDoc(mangaDocRef);

      if (docSnapshot.exists()) {
        setViewCount(docSnapshot.data().view || 0); // Use Firestore view count
      }
    };

    fetchViewCount();
  }, [mangaSlug]);

  // Increment view count function
  const incrementViewCount = async () => {
    const mangaDocRef = doc(db, "mangas", mangaSlug);

    try {
      // Update the Firestore document, incrementing the view count
      await updateDoc(mangaDocRef, {
        view: increment(1),  // Increment by 1
      });

      // Update local state to reflect the increment immediately
      setViewCount(prev => prev + 1);
    } catch (error) {
      console.error("Error updating view count: ", error);
    }
  };

  // Call incrementViewCount when the user clicks to view manga details
  useEffect(() => {
    incrementViewCount();  // You can control when to call this function
  }, [mangaSlug]);

  return (
    <div>
      <h3>Manga: {mangaSlug}</h3>
      <p>Views: {viewCount}</p>
      {/* Rest of the manga details */}
    </div>
  );
};

export default ViewTracker;