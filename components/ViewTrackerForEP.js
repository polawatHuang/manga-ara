import { db } from "@/firebaseConfig"; // Import Firestore configuration
import { doc, updateDoc, increment, getDoc } from "firebase/firestore"; // Import Firestore functions
import { useEffect, useState } from "react";

const ViewTrackerForEP = ({ mangaID, episodeIndex }) => {
  const [viewCount, setViewCount] = useState(0);

  // Fetch the current view count for the episode when the component is mounted
  useEffect(() => {
    const fetchEpisodeData = async () => {
      const mangaDocRef = doc(db, "manga", mangaID); // Firestore path to the manga document
      const docSnapshot = await getDoc(mangaDocRef);

      if (docSnapshot.exists()) {
        // Access episode data by index from the 'ep' array
        const episodeData = docSnapshot.data()?.ep?.[episodeIndex];

        if (episodeData) {
          setViewCount(episodeData.view || 0); // Set the initial view count from Firestore
        }
      }
    };

    fetchEpisodeData();
  }, [mangaID, episodeIndex]);

  // Increment the view count for the specific episode
  const incrementViewCount = async () => {
    const mangaDocRef = doc(db, "manga", mangaID); // Firestore path to the manga document
    const docSnapshot = await getDoc(mangaDocRef);

    if (docSnapshot.exists()) {
      // Access the specific episode data
      const episodeData = docSnapshot.data()?.ep?.[episodeIndex];

      if (!episodeData) {
        console.log("Episode not found");
        return; // If episode is not found, do not proceed with the update
      }

      try {
        // Only update the 'view' field of the specific episode, without touching other fields
        await updateDoc(mangaDocRef, {
          [`ep.${episodeIndex}.view`]: increment(1), // Increment the view count by 1 for the specific episode
        });

        // Immediately reflect the increment in local state
        setViewCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error updating view count: ", error);
      }
    }
  };

  // Trigger the view count increment when the component loads or the episode changes
  useEffect(() => {
    if (mangaID && episodeIndex >= 0) {
      incrementViewCount();  // Increment view count if mangaID and episodeIndex are valid
    }
  }, [mangaID, episodeIndex]);

  return viewCount;  // Return the updated view count for display
};

export default ViewTrackerForEP;
