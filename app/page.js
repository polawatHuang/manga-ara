"use client";

import { useState, useEffect } from "react";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import CardComponent from "@/components/CardComponent";
import CardSliderComponent from "@/components/CardSliderComponent";
import { FireIcon, HeartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  const [favoriteMangas, setFavoriteMangas] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  const filterMostView = (data, slice = 5) => {
    const sorted = [...data].sort((a, b) => b.view - a.view);
    return sorted.slice(0, slice);
  };

  // ✅ Check for cached data
  const loadFromCache = () => {
    const cachedMangas = JSON.parse(localStorage.getItem("cachedMangas"));
    const cachedTags = JSON.parse(localStorage.getItem("cachedTags"));

    if (cachedMangas) setMangas(cachedMangas.data);
    if (cachedTags) setTags(cachedTags.data);
  };

  // ✅ Save data to cache with timestamp
  const saveToCache = (key, data) => {
    const cacheData = {
      data,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  };

  const fetchData = async () => {
    setLoading(true); // Start loading

    try {
      const mangaAPI = await fetch("/api/mangas");
      const tagAPI = await fetch("/api/tags");

      if (!mangaAPI.ok) throw new Error(`Manga API error: ${mangaAPI.status}`);
      if (!tagAPI.ok) throw new Error(`Tag API error: ${tagAPI.status}`);

      const mangaData = await mangaAPI.json();
      const tagData = await tagAPI.json();

      // ✅ Compare with cache
      const cachedMangas = JSON.parse(localStorage.getItem("cachedMangas"));
      const cachedTags = JSON.parse(localStorage.getItem("cachedTags"));

      if (
        !cachedMangas ||
        JSON.stringify(cachedMangas.data) !== JSON.stringify(mangaData)
      ) {
        saveToCache("cachedMangas", mangaData);
      }

      if (
        !cachedTags ||
        JSON.stringify(cachedTags.data) !== JSON.stringify(tagData)
      ) {
        saveToCache("cachedTags", tagData);
      }

      setMangas(mangaData);
      setTags(tagData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    loadFromCache(); // ✅ Load cached data first
    fetchData(); // ✅ Fetch fresh data
  }, []);

  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem("favoriteMangas")) || [];
    setFavoriteMangas(storedFavorites);
  }, []);

  // ✅ Loading animation
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-white">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen max-w-6xl mx-auto md:p-8 pb-20 gap-16 sm:p-2">
      {/* Advertise */}
      <section>
        <AdvertiseComponent />
      </section>

      {/* Top 10 Mangas */}
      <section>
        <h2 className="flex items-center gap-2">
          <FireIcon className="size-7 text-red-600" />
          อ่านการ์ตูนยอดนิยมประจำเดือนนี้
        </h2>
        <CardSliderComponent mangaList={mangas} hasFevFunction={true} />
      </section>

      {/* Favorite Mangas */}
      {favoriteMangas.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2">
            <HeartIcon className="size-7 text-pink-600" />
            มังงะที่กดถูกใจ
          </h2>

          <CardSliderComponent
            mangaList={favoriteMangas}
            hasFevFunction={false}
          />
        </section>
      )}

      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8">
          {/* New Manga */}
          <div className="w-full bg-gray-700 px-4 py-5 mb-4">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">
              มังงะอัพเดทใหม่
            </h3>
            <hr className="opacity-50 my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {mangas.map((manga) => (
                <CardComponent key={manga.id} manga={manga} />
              ))}
            </div>
          </div>

          {/* Recommended Manga */}
          <div className="w-full bg-gray-700 px-4 py-5">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">
              แนะนำสำหรับคุณโดยเฉพาะ
            </h3>
            <hr className="opacity-50 my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {mangas.map((manga) => (
                <CardComponent key={manga.id} manga={manga} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 relative">
          <div className="w-full bg-gray-700 px-4 py-5 mb-4">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">
              5 เรื่องยอดนิยมตลอดกาล
            </h3>
            <hr className="opacity-50 my-2" />
            <div className="w-full flex flex-wrap gap-2 mt-4">
              {filterMostView(mangas).map((item) => (
                <Link
                  href={item.slug}
                  key={item.name}
                  className="flex hover:bg-gray-500 p-2 w-full hover:no-underline"
                >
                  <img
                    src={item.backgroundImage}
                    alt={item.name}
                    className="h-[150px] w-[100px] object-cover"
                    loading="lazy"
                  />
                  <div className="px-2">
                    <b className="text-white mb-1 line-clamp-3">{item.name}</b>
                    <p className="text-white mb-1">ยอดวิว: {item.view} วิว</p>
                    <div className="text-white mb-1 flex gap-2">
                      Tags:{" "}
                      <div className="flex gap-2 flex-wrap w-full">
                        {item.tag?.map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${tag}`}
                            className="rounded-full bg-blue-500 hover:bg-blue-600 hover:no-underline px-2"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full bg-gray-700 px-4 py-5 mb-2">
            <h3 className="flex items-center gap-2 text-2xl font-[600]">
              Tag ทั้งหมด
            </h3>
            <hr className="opacity-50 my-2" />
            <div className="w-full flex flex-wrap gap-2">
              {tags.map((item) => (
                <Link
                  key={item.name}
                  href={`/tags/${item.name}`}
                  className="rounded-full bg-gray-500 hover:bg-blue-500 hover:no-underline px-2 py-1"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[60px]">
        <AdvertiseComponent />
      </section>
    </div>
  );
}