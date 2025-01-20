"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useParams } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

export default function MangaReader({mangaImages}) {
  const [viewMode, setViewMode] = useState("full"); // "full" or "single"
    const params = useParams();

  return (
    <div className="w-full p-4 bg-black text-white min-h-screen">
      {/* Top Menu */}
      <div className="flex justify-between items-center mb-4">
        <ArrowUturnLeftIcon className="p-1 bg-gray-700 hover:bg-gray-800 size-7" />

        <span className="px-3 py-1 bg-gray-700 text-sm">ตอนที่ {params.ep}</span>

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