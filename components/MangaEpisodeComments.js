import { db } from "@/firebaseConfig"; // Import Firestore configuration
import dayjs from "dayjs";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";

// CommentForm Component: For adding new comments
const CommentForm = ({ mangaID, episodeID }) => {
  const [comment, setComment] = useState("");
  const [commenter, setCommenter] = useState(localStorage.getItem("commenterName") || "");
  const [error, setError] = useState("");

  // Validate inputs
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commenter || !comment) {
      setError("Both name and comment are required!");
      return;
    }

    try {
      // Add the comment to Firestore
      await addDoc(collection(db, "commentOnEpisode"), {
        comment,
        commenter,
        episode: episodeID,
        mangaID,
        status: "published",
        created_date: serverTimestamp(), // Firestore Timestamp for created date
        updated_date: serverTimestamp(), // Firestore Timestamp for updated date
      });

      // Save commenter name to localStorage for future use
      localStorage.setItem("commenterName", commenter);

      // Reset the form
      setComment("");
      setError("");
    } catch (error) {
      console.error("Error adding comment: ", error);
      setError("Failed to submit comment.");
    } finally {
      alert("คอมเมนต์ของคุณถูกส่งแล้ว");
    }
  };

  return (
    <div className="w-full bg-gray-700 px-4 py-5">
      <hr />
      <br />
      <h3>คอมเมนต์กันได้ที่นี่</h3>
      <form onSubmit={handleSubmit} className="mt-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="commenter">ชื่อ * :</label>
          <input
            id="commenter"
            className="h-[40px] rounded-lg px-4 text-black ring-1 ring-gray-300 focus:ring-blue-500"
            type="text"
            value={commenter}
            onChange={(e) => setCommenter(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="comment">คอมเมนต์ * : </label>
          <textarea
            id="comment"
            className="rounded-lg px-4 text-black ring-1 ring-gray-300 focus:ring-blue-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="w-full rounded-full px-4 h-[40px] mt-4 bg-blue-500 hover:bg-blue-600">ส่งคอมเมนต์</button>
      </form>
    </div>
  );
};

// CommentList Component: For displaying the list of comments
const CommentList = ({ mangaID, episodeID }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsQuery = query(
        collection(db, "commentOnEpisode"),
        where("mangaID", "==", mangaID),
        where("episode", "==", episodeID),
        where("status", "==", "published") // Only published comments
      );

      const querySnapshot = await getDocs(commentsQuery);
      const commentsData = querySnapshot.docs.map((doc) => doc.data());
      setComments(commentsData);
    };

    fetchComments();
  }, [mangaID, episodeID]);

  return (
    <div className="w-full bg-gray-700 px-4 py-5">
      <h3>คอมเมนต์จากผู้อ่าน</h3>
      <div className="p-4 bg-gray-300 rounded-lg mt-2 text-gray-700 min-h-[200px]">
      {comments.length === 0 ? (
        <p>ยังไม่มีคอมเมนต์ในตอนนี้</p>
      ) : (
        <ul>
          {comments.map((commentData, index) => (
            <li key={index} className="relative mb-2">
              <p><strong>{commentData.commenter}:</strong></p>
              <div className="flex gap-2 items-end">
              <p className="rounded-b-lg rounded-tr-lg bg-gray-400 p-4 ml-4 mt-1 md:w-[50%]">{commentData.comment}</p>
              <span>{dayjs(commentData.updated_date.seconds * 1000).format('DD/MM/YYYY HH:mm')}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
};

// Main Component that combines the comment form and the comment list
const MangaEpisodeComments = ({ mangaID, episodeID }) => {
  return (
    <div className="manga-episode-comments">
      <CommentList mangaID={mangaID} episodeID={episodeID} />
      <CommentForm mangaID={mangaID} episodeID={episodeID} />
    </div>
  );
};

export default MangaEpisodeComments;