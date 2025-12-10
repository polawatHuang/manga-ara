"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { filterEpisodes } from "@/utils/filterEpisodes";
import Link from "next/link";

export default function EpisodeList({ episodes, slug }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full">
      <div className="flex items-center mb-4 gap-2">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาตอน..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {filterEpisodes(searchTerm, episodes).map((ep) => (
          <Link
            key={ep.episode}
            href={`/${slug}/${ep.episode}`}
            className="bg-gray-600 hover:bg-blue-500 px-4 py-2 rounded text-center transition-colors"
          >
            ตอนที่ {ep.episode}
          </Link>
        ))}
      </div>
    </div>
  );
}
