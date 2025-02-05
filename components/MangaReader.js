"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useParams, useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function MangaReader({ mangaImages }) {
  const [viewMode, setViewMode] = useState("full"); // "full" or "single"
  const [currentPage, setCurrentPage] = useState(1);
  const [manga, setManga] = useState(null);
  const params = useParams();
  const router = useRouter();
  const swiperRef = useRef(null);

  const totalPages = mangaImages.length;

  // ✅ Sorting function based on page number
  const sortedImages = [...mangaImages].sort((a, b) => {
    const pageA = parseInt(a.match(/page(\d+)/)?.[1] || 0, 10);
    const pageB = parseInt(b.match(/page(\d+)/)?.[1] || 0, 10);
    return pageA - pageB;
  });

  // ✅ Fetch manga from API or localStorage cache
  const fetchMangaData = async () => {
    try {
      const cachedMangas = JSON.parse(localStorage.getItem("cachedMangas")) || [];

      // ✅ Ensure cachedMangas is an array
      if (!Array.isArray(cachedMangas)) {
        localStorage.removeItem("cachedMangas"); // Clear invalid data
      }

      let mangaData = Array.isArray(cachedMangas)
        ? cachedMangas.find((item) => item.slug.includes(params.slug))
        : null;

      // ✅ Fetch from API if not in cache
      if (!mangaData) {
        const response = await fetch("/api/mangas"); // ✅ Fixed syntax error
        if (!response.ok) {
          throw new Error("Failed to fetch mangas");
        }
        const mangas = await response.json();

        if (Array.isArray(mangas)) {
          localStorage.setItem("cachedMangas", JSON.stringify(mangas));
          mangaData = mangas.find((item) => item.slug.includes(params.slug));
        }
      }

      setManga(mangaData);
    } catch (error) {
      console.error("Error fetching manga:", error);
    }
  };

  // ✅ Handle image click (Single Page Mode)
  const handleImageClick = (e) => {
    if (!swiperRef.current) return;
    const { clientX, target } = e;
    const { left, width } = target.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width / 2) {
      swiperRef.current.slidePrev();
    } else {
      swiperRef.current.slideNext();
    }
  };

  // ✅ Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!swiperRef.current) return;
      if (e.key === "ArrowLeft") swiperRef.current.slidePrev();
      if (e.key === "ArrowRight") swiperRef.current.slideNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ✅ Fetch manga data when component mounts
  useEffect(() => {
    fetchMangaData();
  }, [params.slug]);

  return (
    <div className="w-full p-4 bg-black text-white min-h-screen">
      {/* Top Menu */}
      <div className="flex justify-between items-center mb-4">
        <Link href={"/" + params.slug}>
          <ArrowUturnLeftIcon className="p-1 bg-gray-700 hover:bg-gray-800 size-7" />
        </Link>

        {/* Episode Selection Dropdown */}
        {Array.isArray(manga?.ep) && manga.ep.length > 0 ? (
          <select
            className="px-3 py-1 bg-gray-800 text-white text-sm cursor-pointer"
            value={params.ep}
            onChange={(e) => router.push(`/${params.slug}/ep${e.target.value}`)}
          >
            {manga.ep.map((episode, index) => (
              <option key={index} value={episode.episode}>
                ตอนที่ {episode.episode}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-gray-400">ไม่มีตอนให้เลือก</div>
        )}

        {/* View Mode Dropdown */}
        <select
          className="px-3 py-1 bg-gray-800 text-white text-sm cursor-pointer"
          onChange={(e) => setViewMode(e.target.value)}
          value={viewMode}
        >
          <option value="full">อ่านแบบหน้ายาว</option>
          <option value="single">อ่านแบบทีละหน้า</option>
        </select>

        {/* Navigation Buttons (Single Page Mode) */}
        {viewMode === "single" && (
          <div className="hidden md:flex items-center gap-1 md:gap-2">
            <button
              className="px-1 md:px-3 py-1 bg-gray-700 cursor-pointer"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              Prev
            </button>
            <button
              className="px-1 md:px-3 py-1 bg-gray-700 cursor-pointer"
              onClick={() => swiperRef.current?.slideNext()}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Manga Display */}
      {viewMode === "full" ? (
        <div className="flex flex-col">
          {sortedImages.map((src, index) => (
            <img key={index} src={src} alt={`Manga Page ${index + 1}`} className="w-full" loading="lazy" />
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: null, nextEl: null }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentPage(swiper.realIndex + 1)}
          className="w-full relative"
        >
          {sortedImages.map((src, index) => (
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

      {/* Bottom Menu */}
      <div className="flex justify-between items-center mt-4">
        <Link href={"/" + params.slug}>
          <ArrowUturnLeftIcon className="p-1 bg-gray-700 hover:bg-gray-800 size-7" />
        </Link>

        {/* Episode Selection Dropdown */}
        {Array.isArray(manga?.ep) && manga.ep.length > 0 ? (
          <select
            className="px-3 py-1 bg-gray-800 text-white text-sm cursor-pointer"
            value={params.ep}
            onChange={(e) => router.push(`/${params.slug}/ep${e.target.value}`)}
          >
            {manga.ep.map((episode, index) => (
              <option key={index} value={episode.episode}>
                ตอนที่ {episode.episode}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-gray-400">ไม่มีตอนให้เลือก</div>
        )}

        {/* View Mode Dropdown */}
        <select
          className="px-3 py-1 bg-gray-800 text-white text-sm cursor-pointer"
          onChange={(e) => setViewMode(e.target.value)}
          value={viewMode}
        >
          <option value="full">อ่านแบบหน้ายาว</option>
          <option value="single">อ่านแบบทีละหน้า</option>
        </select>

        {/* Navigation Buttons (Single Page Mode) */}
        {viewMode === "single" && (
          <div className="hidden md:flex items-center gap-1 md:gap-2">
            <button
              className="px-1 md:px-3 py-1 bg-gray-700 cursor-pointer"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              Prev
            </button>
            <button
              className="px-1 md:px-3 py-1 bg-gray-700 cursor-pointer"
              onClick={() => swiperRef.current?.slideNext()}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}