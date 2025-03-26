import { db } from "@/firebaseConfig"; // Import Firestore configuration
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const ViewTracker = ({ mangaID }) => {
  const [viewCount, setViewCount] = useState(0);

  // Check if mangaID is defined before fetching view count
  useEffect(() => {
    if (!mangaID) {
      console.error("mangaID is undefined");
      return; // Exit if mangaID is not provided
    }

    const fetchViewCount = async () => {
      const mangaDocRef = doc(db, "manga", mangaID);  // Firestore path
      const docSnapshot = await getDoc(mangaDocRef);

      if (docSnapshot.exists()) {
        setViewCount(docSnapshot.data().view || 0); // Use Firestore view count
      } else {
        // If document doesn't exist, initialize it with the view count of 0 without overwriting other fields
        await updateDoc(mangaDocRef, { view: 0 });
      }
    };

    fetchViewCount();
  }, [mangaID]);

  // Increment view count function
  const incrementViewCount = async () => {
    if (!mangaID) {
      console.error("mangaID is undefined");
      return; // Exit if mangaID is not provided
    }

    const mangaDocRef = doc(db, "manga", mangaID);  // Firestore path

    try {
      // Update the Firestore document, incrementing the view count
      await updateDoc(mangaDocRef, {
        view: increment(1),  // Increment by 1
      });

      // Update local state to reflect the increment immediately
      setViewCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating view count: ", error);
    }
  };

  // Call incrementViewCount when the user clicks to view manga details
  useEffect(() => {
    if (mangaID) {
      incrementViewCount();  // Increment the view count if mangaID is defined
    }
  }, [mangaID]);

  return viewCount;
};

export default ViewTracker;