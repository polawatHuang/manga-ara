"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FavoriteMangaPage() {
  const [favoriteMangas, setFavoriteMangas] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMangas")) || [];
    setFavoriteMangas(storedFavorites);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <h1 className="text-center mb-6">📌 มังงะที่กดถูกใจ</h1>

      {favoriteMangas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteMangas.map((manga) => (
            <Link key={manga.id} href={manga.slug} className="hover:no-underline">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src={manga.backgroundImage}
                  alt={manga.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{manga.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {manga.ep.length} ตอน • {manga.view} วิว
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-4">❌ ไม่มีมังงะที่กดถูกใจ</p>
      )}
    </div>
  );
}