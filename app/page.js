"use client";

import { useState, useEffect } from "react";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import CardComponent from "@/components/CardComponent";
import CardSliderComponent from "@/components/CardSliderComponent"
import { FireIcon, HeartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  const [favoriteMangas, setFavoriteMangas] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mangaAPI = await fetch("/api/mangas");
        const tagAPI = await fetch("/api/tags");  // ✅ Corrected the route from '/api/tag' to '/api/tags'
  
        if (!mangaAPI.ok) {
          throw new Error(`Manga API error: ${mangaAPI.status}`); // ✅ Fixed incorrect reference to response.status
        }
        if (!tagAPI.ok) {
          throw new Error(`Tag API error: ${tagAPI.status}`);     // ✅ Fixed incorrect reference to response.status
        }
  
        const mangaData = await mangaAPI.json();
        const tagData = await tagAPI.json();
  
        setMangas(mangaData);
        setTags(tagData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);  

  // Load favorite mangas from localStorage
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

      {/* Top 10 anime this month */}
      <section>
        <h2 className="flex items-center gap-2">
          <FireIcon className="size-7 text-red-600" />
          อ่านการ์ตูนยอดนิยมประจำวัน
        </h2>
        <CardSliderComponent mangaList={mangas} hasFevFunction={true} />
      </section>

      {/* Favorite Manga */}
      {favoriteMangas.length > 0 && <section>
        <h2 className="flex items-center gap-2">
          <HeartIcon className="size-7 text-pink-600" />
          มังงะที่กดถูกใจ
        </h2>

        {favoriteMangas.length > 0 ? (
          <CardSliderComponent mangaList={favoriteMangas} hasFevFunction={false} />
        ) : (
          <div className="w-full h-[280px] flex items-center justify-center bg-gray-500 opacity-50 my-4">
            <p className="text-white text-center mt-4">ยังไม่มีมังงะที่คุณกดถูกใจ</p>
          </div>
        )}
      </section>}

      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8">
          {/* New Manga */}
          <div className="w-full bg-gray-700 px-4 py-5 mb-4">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">มังงะอัพเดทใหม่</h3>
            <hr className="opacity-50 my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {mangas.map((manga) => (
                <CardComponent key={manga.id} manga={manga} />
              ))}
            </div>
          </div>

          {/* New Manhua */}
          {/* <div className="w-full bg-gray-700 px-4 py-5 mb-4">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">มังฮวา (จีน เกาหลี)</h3>
            <hr className="opacity-50 my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {mangas.map((manga) => (
                <CardComponent key={manga.id} manga={manga} />
              ))}
            </div>
          </div> */}

          {/* Recomman Manga */}
          <div className="w-full bg-gray-700 px-4 py-5">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">แนะนำสำหรับคุณโดยเฉพาะ</h3>
            <hr className="opacity-50 my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {mangas.map((manga) => (
                <CardComponent key={manga.id} manga={manga} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-gray-700 px-4 py-5 relative">
          <h3 className="flex items-center gap-2 text-2xl font-[600]">Tag ทั้งหมด</h3>
          <hr className="opacity-50 my-2" />
          <div className="w-full flex flex-wrap gap-2">
            {tags.map(item=>{
              return (
                <Link key={item.name} href={"/tags/"+item.name} className="rounded-full bg-gray-500 hover:bg-blue-500 hover:no-underline px-2 py-1">
                  {item.name}
                </Link>
              )
            })}
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