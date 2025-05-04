"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRef, useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";

const ChevronLeftIcon = () => (
  <svg
    className="w-10 h-10 text-gray-700 hover:text-gray-900"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    ></path>
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-10 h-10 text-gray-700 hover:text-gray-900"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
  </svg>
);

export default function CommentSliderComponent({ mangaList }) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative w-full px-4 py-6">
      {/* Left Arrow */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-200 transition-opacity ${
          isBeginning ? "cursor-not-allowed" : "opacity-100"
        }`}
        disabled={isBeginning}
      >
        <ChevronLeftIcon />
      </button>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 }, // Tablet
          1024: { slidesPerView: 2 }, // PC
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={false}
        onSlideChange={(swiper) => {
          // Update slide state (isBeginning, isEnd) on slide change
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSwiper={(swiper) => {
          // Initial state setup
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        className="w-full"
      >
        {mangaList.map((manga) => (
          <SwiperSlide key={manga.id} className="relative">
            {/* Manga Card */}
            <div className="overflow-hidden">
              <div className="bg-white p-4 rounded-lg text-black flex gap-4">
                <div className="flex-initial w-[50%] md:w-[40%]">
                  <Image
                    src={`https://mangaara.com${manga.backgroundImage}`}
                    alt="test"
                    width={150}
                    height={300}
                    className="h-[300px] w-auto bg-cover"
                    loading="lazy"
                  />
                </div>
                <div className="relative flex-initial w-[50%] md:w-[60%]">
                  <p>ชื่อเรื่อง: {manga.name}</p>
                  <p>ผู้แนะนำ: {manga.commenter}</p>
                  <p>ข้อความ:</p>
                  <div className="bg-[#f0f2f5] rounded-lg p-4 mt-2 mb-4">
                    {manga.comment}
                  </div>
                  <div className="flex justify-end">
                  <Link
                    href={manga.slug}
                    className="md:absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-full"
                  >
                    คลิกอ่านเลย
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Right Arrow */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-200 transition-opacity ${
          isEnd ? "cursor-not-allowed" : "opacity-100"
        }`}
        disabled={isEnd}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
