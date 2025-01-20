"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useParams, useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import mangas from "@/database/mangas"; // Import manga data

export default function MangaReader({ mangaImages }) {
  const [viewMode, setViewMode] = useState("full"); // "full" or "single"
  const params = useParams();
  const router = useRouter(); // ✅ Allows navigation on episode change

  // Find the current manga using `slug`
  const manga = mangas.find((item) => item.slug.includes(params.slug));

  return (
    <div className="w-full p-4 bg-black text-white min-h-screen">
      {/* Top Menu */}
      <div className="flex justify-between items-center mb-4">
        {/* Back Button */}
        <Link href={"/" + params.slug}>
          <ArrowUturnLeftIcon className="p-1 bg-gray-700 hover:bg-gray-800 size-7" />
        </Link>

        {/* ✅ Episode Selection Dropdown */}
        <select
          className="px-3 py-1 bg-gray-800 text-white text-sm cursor-pointer"
          value={params.ep}
          onChange={(e) => {
            router.push(`/${params.slug}/${e.target.value}`);
          }}
        >
          {manga?.ep.map((episode) => (
            <option key={episode.episode} value={episode.episode}>
              ตอนที่ {episode.episode}
            </option>
          ))}
        </select>

        {/* View Mode Dropdown */}
        <select
          className="px-3 py-1 bg-gray-800 text-white text-sm cursor-pointer"
          onChange={(e) => setViewMode(e.target.value)}
          value={viewMode}
        >
          <option value="full">อ่านแบบหน้ายาว</option>
          <option value="single">อ่านแบบที่ละหน้า</option>
        </select>

        {/* Navigation Buttons (Only for Single Page Mode) */}
        {viewMode === "single" && (
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-gray-700 cursor-pointer">
              Prev
            </button>
            <button className="px-3 py-1 bg-gray-700 cursor-not-allowed">
              Next
            </button>
          </div>
        )}
      </div>

      {/* Manga Display */}
      {viewMode === "full" ? (
        // Full Page Mode: Show All Images
        <div className="flex flex-col">
          {mangaImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Manga Page ${index + 1}`}
              className="w-full"
              loading="lazy"
            />
          ))}
        </div>
      ) : (
        // Single Page Mode: Image Slider
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full"
        >
          {mangaImages.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Manga Page ${index + 1}`}
                className="w-full"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
