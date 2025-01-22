"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import mangas from "@/database/mangas";

export default function TagsPage() {
  const [sortType, setSortType] = useState("A-Z");

  // Extract and count tags from mangas' episodes
  const extractTags = () => {
    const tagCount = {};
    mangas.forEach((manga) => {
      manga.tag.forEach((tag) => {
        if (!tagCount[tag]) tagCount[tag] = 0;
        manga.ep.forEach((episode) => {
          tagCount[tag] += episode.view; // Sum episode views
        });
      });
    });

    return Object.entries(tagCount).map(([name, count]) => ({ name, count }));
  };

  const [tags, setTags] = useState(extractTags());

  useEffect(() => {
    if (sortType === "A-Z") {
      setTags((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setTags((prev) => [...prev].sort((a, b) => b.count - a.count)); // Sort by most views
    }
  }, [sortType]);

  // Filter tags by starting letter
  const filterByLetter = (letter) => {
    if (letter === "#") {
      setTags(extractTags());
    } else {
      setTags(
        extractTags().filter((tag) =>
          tag.name.toLowerCase().startsWith(letter.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white px-6 py-8">
      {/* Page Title */}
      <h1 className="text-center">Tags</h1>

      {/* Sorting Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className={`px-4 py-2 ${
            sortType === "A-Z" ? "bg-gray-700" : "bg-gray-900"
          }`}
          onClick={() => setSortType("A-Z")}
        >
          A-Z
        </button>
        <button
          className={`px-4 py-2 ${
            sortType === "Popular" ? "bg-gray-700" : "bg-gray-900"
          }`}
          onClick={() => setSortType("Popular")}
        >
          Popular
        </button>
      </div>

      {/* Alphabet Navigation */}
      <div className="flex justify-center gap-2 mt-4 text-gray-400">
        {["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => (
          <button
            key={letter}
            className="hover:text-white"
            onClick={() => filterByLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.name}`}
            className="bg-gray-800 p-2 flex flex-col md:flex-row justify-between rounded hover:bg-gray-700"
          >
            <span>{tag.name}</span>
            <span className="opacity-50">{tag.count} Views</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
