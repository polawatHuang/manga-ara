"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useParams, useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import mangas from "@/database/mangas"; // Import manga data

export default function MangaReader({ mangaImages }) {
  const [viewMode, setViewMode] = useState("full"); // "full" or "single"
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();
  const router = useRouter();
  const swiperRef = useRef(null);

  // Find the current manga using `slug`
  const manga = mangas.find((item) => item.slug.includes(params.slug));
  const totalPages = mangaImages.length; // Get total pages count

  // Handle click navigation in Single Page Mode
  const handleImageClick = (e) => {
    if (!swiperRef.current) return;
    const { clientX, target } = e;
    const { left, width } = target.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width / 2) {
      swiperRef.current.slidePrev(); // Clicked left side → Previous slide
    } else {
      swiperRef.current.slideNext(); // Clicked right side → Next slide
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!swiperRef.current) return;
      if (e.key === "ArrowLeft") swiperRef.current.slidePrev();
      if (e.key === "ArrowRight") swiperRef.current.slideNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full p-4 bg-black text-white min-h-screen">
      {/* Top Menu */}
      <div className="flex justify-between items-center mb-4">
        {/* Back Button */}
        <Link href={"/" + params.slug}>
          <ArrowUturnLeftIcon className="p-1 bg-gray-700 hover:bg-gray-800 size-7" />
        </Link>

        {/* Episode Selection Dropdown */}
        <select
          className="px-3 py-1 bg-gray-800 text-white text-sm cursor-pointer"
          value={params.ep.slice(2,3)}
          onChange={(e) => router.push(`/${params.slug}/ep${e.target.value}`)}
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
          <div className="hidden md:flex items-center gap-1 md:gap-2">
            <button className="px-1 md:px-3 py-1 bg-gray-700 cursor-pointer" onClick={() => swiperRef.current?.slidePrev()}>
              Prev
            </button>
            <button className="px-1 md:px-3 py-1 bg-gray-700 cursor-pointer" onClick={() => swiperRef.current?.slideNext()}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* ✅ Page Indicator */}
      {viewMode === "single" && (
        <div className="text-center text-gray-400 my-4">
          Page {currentPage} of {totalPages}
        </div>
      )}

      {/* Manga Display */}
      {viewMode === "full" ? (
        // Full Page Mode: Show All Images
        <div className="flex flex-col">
          {mangaImages.map((src, index) => (
            <img key={index} src={src} alt={`Manga Page ${index + 1}`} className="w-full" loading="lazy" />
          ))}
        </div>
      ) : (
        // Single Page Mode: Image Slider with Click Navigation
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: null, nextEl: null }} // Hides default Swiper arrows
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentPage(swiper.realIndex + 1)} // Update current page number
          className="w-full relative"
        >
          {mangaImages.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Manga Page ${index + 1}`}
                className="w-full cursor-pointer"
                onClick={handleImageClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* ✅ Page Indicator */}
      {viewMode === "single" && (
        <div className="text-center text-gray-400 mt-4">
          Page {currentPage} of {totalPages}
        </div>
      )}

      {/* Bottom Menu */}
      <div className="flex justify-between items-center mt-4">
        {/* Back Button */}
        <Link href={"/" + params.slug}>
          <ArrowUturnLeftIcon className="p-1 bg-gray-700 hover:bg-gray-800 size-7" />
        </Link>

        {/* Episode Selection Dropdown */}
        <select
          className="px-3 py-1 bg-gray-800 text-white text-sm cursor-pointer"
          value={params.ep}
          onChange={(e) => router.push(`/${params.slug}/${e.target.value}`)}
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
          <div className="hidden md:flex items-center gap-1 md:gap-2">
            <button className="px-1 md:px-3 py-1 bg-gray-700 cursor-pointer" onClick={() => swiperRef.current?.slidePrev()}>
              Prev
            </button>
            <button className="px-1 md:px-3 py-1 bg-gray-700 cursor-pointer" onClick={() => swiperRef.current?.slideNext()}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}