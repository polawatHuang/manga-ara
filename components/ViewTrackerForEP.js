import { db } from "@/firebaseConfig"; // Import Firestore configuration
import { doc, updateDoc, increment, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";

const ViewTrackerForEP = ({ mangaID, episodeIndex }) => {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      const mangaDocRef = doc(db, "manga", mangaID); // Firestore path to the manga document
      const docSnapshot = await getDoc(mangaDocRef);

      if (docSnapshot.exists()) {
        const episodeData = docSnapshot.data()?.ep?.[episodeIndex]; // Access episode by index

        if (episodeData) {
          setViewCount(episodeData.view || 0); // Set initial view count
        } else {
          // If the episode data does not exist, initialize it
          await setDoc(
            mangaDocRef,
            {
              ep: arrayUnion({
                episode: `${episodeIndex + 1}`, // Add episode info
                view: 0,
                created_date: new Date().toISOString(), // Optional: current date as created date
                totalPage: 0, // You can adjust this if needed
              }),
            },
            { merge: true }
          );
        }
      }
    };

    fetchEpisodeData();
  }, [mangaID, episodeIndex]);

  // Increment the view count for the episode
  const incrementViewCount = async () => {
    const mangaDocRef = doc(db, "manga", mangaID); // Firestore path to the manga document
    const docSnapshot = await getDoc(mangaDocRef);

    // Find the episode to update by index
    const episodeData = docSnapshot.data()?.ep?.[episodeIndex];

    if (!episodeData) {
      console.log("Episode not found");
      return;
    }

    try {
      // Update the Firestore document: increment the view count
      await updateDoc(mangaDocRef, {
        [`ep.${episodeIndex}.view`]: increment(1), // Increment view count by 1
      });

      // Update local state to reflect the increment immediately
      setViewCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating view count: ", error);
    }
  };

  useEffect(() => {
    incrementViewCount();  // Increment the view count once the component is loaded
  }, [mangaID, episodeIndex]);

  return viewCount;
};

export default ViewTrackerForEP;