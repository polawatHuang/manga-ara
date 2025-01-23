"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/solid"; // ✅ Heart icon for favorites

export default function TagPage() {
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag); // ✅ Fix Thai encoding issue
  const [filteredMangas, setFilteredMangas] = useState([]);
  const [favoriteMangas, setFavoriteMangas] = useState([]);

  // ✅ Fetch mangas from API
  useEffect(() => {
    async function fetchMangas() {
      try {
        const response = await fetch("/api/mangas");
        if (!response.ok) throw new Error("Failed to fetch mangas");
        const mangas = await response.json();

        // ✅ Filter mangas by tag
        const matchedMangas = mangas.filter((manga) => manga.tag.includes(decodedTag));
        setFilteredMangas(matchedMangas);
      } catch (error) {
        console.error("Error fetching mangas:", error);
      }
    }

    fetchMangas();
  }, [decodedTag]);

  // ✅ Load favorite mangas from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMangas")) || [];
    setFavoriteMangas(storedFavorites);
  }, []);

  // ✅ Toggle Favorite Manga
  const toggleFavorite = (manga) => {
    let updatedFavorites;
    if (favoriteMangas.some((fav) => fav.id === manga.id)) {
      updatedFavorites = favoriteMangas.filter((fav) => fav.id !== manga.id);
    } else {
      updatedFavorites = [...favoriteMangas, manga];
    }
    setFavoriteMangas(updatedFavorites);
    localStorage.setItem("favoriteMangas", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      {/* Tag Header */}
      <h1 className="text-center mb-6">
        มังงะแนว <span className="text-pink-500">{decodedTag}</span>
      </h1>

      {/* Manga Grid */}
      {filteredMangas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMangas.map((manga) => (
            <div key={manga.id} className="relative group">
              <Link href={manga.slug} className="hover:no-underline">
                <div className="bg-gray-800 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 transition-transform duration-300 transform hover:scale-105">
                  <img
                    src={manga.backgroundImage}
                    alt={manga.name}
                    className="w-full h-[300px] object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-3">{manga.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {manga.ep.length} ตอน • {manga.view} วิว
                    </p>
                  </div>
                </div>
              </Link>

              {/* ✅ Favorite Button */}
              <button
                onClick={() => toggleFavorite(manga)}
                className="absolute top-1 right-1 p-2 bg-black bg-opacity-50 rounded-full"
              >
                <HeartIcon
                  className={`w-6 h-6 ${
                    favoriteMangas.some((fav) => fav.id === manga.id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-4">❌ ยังไม่มีมังงะสำหรับแท็กนี้</p>
      )}
    </div>
  );
}