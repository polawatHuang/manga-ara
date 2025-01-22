"use client";

import { useState, useEffect } from "react";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import CardComponent from "@/components/CardComponent";
import CardSliderComponent from "@/components/CardSliderComponent";
import mangas from "@/database/mangas";
import { FireIcon, HeartIcon } from "@heroicons/react/24/solid";
import tags from "@/database/tags";
import Link from "next/link";

export default function Home() {
  const [favoriteMangas, setFavoriteMangas] = useState([]);

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
          10 อันดับมังงะยอดฮิต
        </h2>
        <CardSliderComponent mangaList={mangas} hasFevFunction={true} />
      </section>

      {/* Favorite Manga */}
      <section>
        <h2 className="flex items-center gap-2">
          <HeartIcon className="size-7 text-pink-600" />
          มังงะที่กดถูกใจ
        </h2>

        {favoriteMangas.length > 0 ? (
          <CardSliderComponent mangaList={favoriteMangas} hasFevFunction={false} />
        ) : (
          <p className="text-white text-center mt-4">ยังไม่มีมังงะที่คุณกดถูกใจ</p>
        )}
      </section>

      {/* New Manga */}
      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-10 bg-gray-700 px-4 py-5">
          <h3 className="flex items-center gap-2 text-2xl font-[600]">มังงะอัพเดทใหม่</h3>
          <hr className="opacity-50 my-2" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {mangas.map((manga) => (
              <CardComponent key={manga.id} manga={manga} />
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-gray-700 px-4 py-5 relative">
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
    </div>
  );
}