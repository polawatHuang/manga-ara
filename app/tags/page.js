"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [sortType, setSortType] = useState("A-Z");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch mangas from API and extract tags
  useEffect(() => {
    async function fetchMangas() {
      try {
        const response = await fetch("/api/mangas");
        if (!response.ok) throw new Error("Failed to fetch mangas");

        const mangas = await response.json();
        const tagCount = {};

        mangas.forEach((manga) => {
          manga.tag.forEach((tag) => {
            if (!tagCount[tag]) tagCount[tag] = 0;
            manga.ep.forEach((episode) => {
              tagCount[tag] += episode.view; // Sum episode views
            });
          });
        });

        const extractedTags = Object.entries(tagCount).map(([name, count]) => ({
          name,
          count,
        }));

        setTags(extractedTags);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMangas();
  }, []);

  // ✅ Sorting logic
  useEffect(() => {
    setTags((prev) =>
      [...prev].sort((a, b) =>
        sortType === "A-Z" ? a.name.localeCompare(b.name) : b.count - a.count
      )
    );
  }, [sortType]);

  // ✅ Filter tags by starting letter
  const filterByLetter = (letter) => {
    setTags((prevTags) =>
      prevTags.filter((tag) =>
        letter === "#" ? true : tag.name.startsWith(letter)
      )
    );
  };

  // ✅ Thai Alphabet (ก-ฮ)
  const thaiAlphabet = "กขคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผพภมยรลวศษสหฬอฮ".split("");

  // ✅ English Alphabet Navigation
  const englishAlphabet = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return <p className="text-center text-red-500">เกิดข้อผิดพลาด: {error}</p>;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white px-6 py-8">
      {/* Page Title */}
      <h1 className="text-center">Tags</h1>

      {/* Sorting Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className={`px-4 py-2 ${sortType === "A-Z" ? "bg-gray-700" : "bg-gray-900"}`}
          onClick={() => setSortType("A-Z")}
        >
          ก-ฮ หรือ A-Z
        </button>
        <button
          className={`px-4 py-2 ${sortType === "Popular" ? "bg-gray-700" : "bg-gray-900"}`}
          onClick={() => setSortType("Popular")}
        >
          ยอดนิยม
        </button>
      </div>

      {/* Thai Alphabet Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 text-gray-400 text-sm">
        {thaiAlphabet.map((letter) => (
          <button key={letter} className="hover:text-white" onClick={() => filterByLetter(letter)}>
            {letter}
          </button>
        ))}
      </div>

      {/* English Alphabet Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 text-gray-400 text-sm">
        {englishAlphabet.map((letter) => (
          <button key={letter} className="hover:text-white" onClick={() => filterByLetter(letter)}>
            {letter}
          </button>
        ))}
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${tag.name}`}
              className="bg-gray-800 p-2 flex flex-col justify-between hover:bg-gray-700 hover:no-underline"
            >
              <span className="text-center font-medium">{tag.name}</span>
              <span className="text-center text-xs opacity-50">{tag.count} Views</span>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-4">ยังไม่มีแท็กที่จะแสดง</p>
        )}
      </div>
    </div>
  );
}