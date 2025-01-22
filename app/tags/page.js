"use client";

import { useState, useEffect } from "react";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import CardComponent from "@/components/CardComponent";
import CardSliderComponent from "@/components/CardSliderComponent";
import { FireIcon, HeartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  const [mangas, setMangas] = useState([]);
  const [tags, setTags] = useState([]);
  const [favoriteMangas, setFavoriteMangas] = useState([]);

  // ✅ Fetch mangas from API
  useEffect(() => {
    async function fetchMangas() {
      try {
        const response = await fetch("/api/mangas");
        if (!response.ok) throw new Error("Failed to fetch mangas");
        const data = await response.json();
        setMangas(data);
      } catch (error) {
        console.error("Error fetching mangas:", error);
      }
    }
    fetchMangas();
  }, []);

  // ✅ Fetch tags from API
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/tags");
        if (!response.ok) throw new Error("Failed to fetch tags");
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    fetchTags();
  }, []);

  // ✅ Load favorite mangas from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMangas")) || [];
    setFavoriteMangas(storedFavorites);
  }, []);

  return (
    <div className="relative w-full min-h-screen max-w-6xl mx-auto md:p-8 pb-20 gap-16 sm:p-2">
      {/* Advertise */}
      <section>
        <AdvertiseComponent />
      </section>

      {/* Top 10 manga this month */}
      <section>
        <h2 className="flex items-center gap-2">
          <FireIcon className="size-7 text-red-600" />
          10 อันดับมังงะยอดฮิต
        </h2>
        {mangas.length > 0 ? (
          <CardSliderComponent mangaList={mangas.slice(0, 10)} hasFevFunction={true} />
        ) : (
          <p className="text-center text-gray-400 mt-4">📌 ไม่มีข้อมูลมังงะ</p>
        )}
      </section>

      {/* Favorite Manga */}
      {favoriteMangas.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2">
            <HeartIcon className="size-7 text-pink-600" />
            มังงะที่กดถูกใจ
          </h2>

          {favoriteMangas.length > 0 ? (
            <CardSliderComponent mangaList={favoriteMangas} hasFevFunction={false} />
          ) : (
            <div className="w-full h-[280px] flex items-center justify-center bg-gray-500 opacity-50 my-4">
              <p className="text-white text-center mt-4">❌ ยังไม่มีมังงะที่คุณกดถูกใจ</p>
            </div>
          )}
        </section>
      )}

      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-10">
          {/* New Manga */}
          <div className="w-full bg-gray-700 px-4 py-5 mb-4">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">มังงะอัพเดทใหม่</h3>
            <hr className="opacity-50 my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {mangas.length > 0 ? (
                mangas.map((manga) => <CardComponent key={manga.id} manga={manga} />)
              ) : (
                <p className="text-center text-gray-400 col-span-4">📌 ไม่มีข้อมูลมังงะ</p>
              )}
            </div>
          </div>

          {/* New Manhua */}
          <div className="w-full bg-gray-700 px-4 py-5 mb-4">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">มังฮวา (จีน เกาหลี)</h3>
            <hr className="opacity-50 my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {mangas.length > 0 ? (
                mangas.map((manga) => <CardComponent key={manga.id} manga={manga} />)
              ) : (
                <p className="text-center text-gray-400 col-span-4">📌 ไม่มีข้อมูลมังงะ</p>
              )}
            </div>
          </div>

          {/* Recommended Manga */}
          <div className="w-full bg-gray-700 px-4 py-5">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">แนะนำสำหรับคุณโดยเฉพาะ</h3>
            <hr className="opacity-50 my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {mangas.length > 0 ? (
                mangas.map((manga) => <CardComponent key={manga.id} manga={manga} />)
              ) : (
                <p className="text-center text-gray-400 col-span-4">📌 ไม่มีข้อมูลมังงะ</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-2 bg-gray-700 px-4 py-5 relative">
          <h3 className="flex items-center gap-2 text-2xl font-[600]">Tag ทั้งหมด</h3>
          <hr className="opacity-50 my-2" />
          <div className="w-full flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((item) => (
                <Link
                  key={item.name}
                  href={`/tags/${item.name}`}
                  className="rounded-full bg-gray-500 hover:bg-blue-500 hover:no-underline px-2 py-1"
                >
                  {item.name}
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400">📌 ไม่มีข้อมูลแท็ก</p>
            )}
          </div>
        </div>
      </section>

      {/* Advertise */}
      <section className="mt-[60px]">
        <AdvertiseComponent />
      </section>
    </div>
  );
}