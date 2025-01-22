"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function FavoriteMangaPage() {
  const [favoriteMangas, setFavoriteMangas] = useState([]);

  // ✅ Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMangas")) || [];
    setFavoriteMangas(storedFavorites);
  }, []);

  // ✅ Remove from favorites
  const removeFavorite = (mangaId) => {
    const updatedFavorites = favoriteMangas.filter((manga) => manga.id !== mangaId);
    setFavoriteMangas(updatedFavorites);
    localStorage.setItem("favoriteMangas", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <h1 className="text-center mb-6">📌 มังงะที่กดถูกใจ</h1>

      {favoriteMangas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteMangas.map((manga) => (
            <div key={manga.id} className="relative">
              <Link href={manga.slug} className="hover:no-underline">
                <div className="bg-gray-800 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 transition-transform duration-300 transform hover:scale-105 peer">
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

              {/* ❌ Remove from favorites button */}
              <button
                onClick={() => removeFavorite(manga.id)}
                className="absolute top-1 right-1 h-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md transition-all flex items-center"
              >
                <HeartIcon className="size-6" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-4">❌ ไม่มีมังงะที่กดถูกใจ</p>
      )}
    </div>
  );
}