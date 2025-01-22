"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRef, useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";

const ChevronLeftIcon = () => (
  <svg className="w-10 h-10 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-10 h-10 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
  </svg>
);

export default function CardSliderComponent({ mangaList , hasFevFunction = false }) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Load favorite mangas from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMangas")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Toggle favorite manga
  const toggleFavorite = (manga) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === manga.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== manga.id); // Remove favorite
    } else {
      updatedFavorites = [...favorites, manga]; // Add favorite
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteMangas", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="relative w-full px-4 py-6">
      {/* Left Arrow */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`absolute left-0 top-[39%] -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-200 transition-opacity ${
          isBeginning ? "hidden cursor-not-allowed" : "opacity-100"
        }`}
        disabled={isBeginning}
      >
        <ChevronLeftIcon />
      </button>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 }, // Tablet
          1024: { slidesPerView: 5 }, // PC
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        className="w-full"
      >
        {mangaList.map((manga) => (
          <SwiperSlide key={manga.id} className="relative">
            {/* Favorite Button */}
            {hasFevFunction && <button
              onClick={() => toggleFavorite(manga)}
              className="absolute top-1 right-1 p-2 bg-black h-9 bg-opacity-50 rounded-full flex items-center"
            >
              {favorites.some((fav) => fav.id === manga.id) ? (
                <span className="text-pink-500 text-xl">❤️</span>
              ) : (
                <span className="text-white text-xl mt-[2px]">🤍</span>
              )}
            </button>}

            {/* Manga Card */}
            <Link className="overflow-hidden bg-yellow-500" href={manga.slug}>
              <Image width={187} height={268} src={manga.backgroundImage} alt={manga.name} className="h-[300px] w-full object-cover" loading="lazy" />
              <div className="py-4">
                <h2 className="text-lg font-semibold text-white text-ellipsis line-clamp-3">{manga.name}</h2>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Right Arrow */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`absolute right-0 top-[39%] -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-200 transition-opacity ${
          isEnd ? "hidden cursor-not-allowed" : "opacity-100"
        }`}
        disabled={isEnd}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}