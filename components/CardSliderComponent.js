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

const cardData = [
  { id: 1, title: "Tensei Kizoku no Isekai Boukenroku เกิดใหม่เป็นขุนนางไปผจญภัยในต่างโลก", image: "/images/tensei-kizoku-no-isekai-boukenroku-jichou-wo-shiranai-kamigami-no-shito/bg.webp" },
];

export default function CardSliderComponent({mangaList}) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.on("slideChange", () => {
        setIsBeginning(swiperRef.current.isBeginning);
        setIsEnd(swiperRef.current.isEnd);
      });
    }
  }, []);

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
        {mangaList.map((card) => (
          <SwiperSlide key={card.id}>
            <Link className="overflow-hidden bg-yellow-500" href={card.slug}>
              <Image width={187} height={268} src={card.backgroundImage} alt={card.name} className="h-[300px] w-full object-cover" loading="lazy" />
              <div className="py-4">
                <h2 className="text-lg font-semibold text-white text-ellipsis line-clamp-3">{card.name}</h2>
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