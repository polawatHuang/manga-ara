"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import { filterEpisodes } from "@/utils/filterEpisodes";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import Link from "next/link";

export default function SlugPage() {
  const { slug } = useParams();
  const decodedSlug = decodeURIComponent(slug); // ✅ Decode Thai slugs properly
  const [searchTerm, setSearchTerm] = useState("");
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch manga details dynamically
  useEffect(() => {
    async function fetchManga() {
      try {
        const response = await fetch("/api/mangas");
        if (!response.ok) throw new Error("Failed to fetch manga data");

        const data = await response.json();
        const foundManga = data.find((item) => item.slug === `/${decodedSlug}`);
        setManga(foundManga || null);
      } catch (error) {
        console.error("Error fetching manga:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchManga();
  }, [decodedSlug]);

  // ✅ Loading animation (Spinner)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /><span>กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  // Show error message if manga is not found
  if (!manga) {
    return <p className="text-center text-white">ไม่พบข้อมูลมังงะที่ระบุ</p>;
  }

  // ✅ Filter episodes based on search term
  const filteredEpisodes = filterEpisodes(manga.ep, searchTerm);

  return (
    <div className="relative w-full min-h-screen max-w-6xl mx-auto md:p-8 pb-20 gap-16 sm:p-2">
      {/* Advertise */}
      <section>
        <AdvertiseComponent />
      </section>

      {/* Tab */}
      <section className="md:px-[12%]">
        <div className="w-full bg-gray-700 px-4 py-2">
          <Link href="/">Homepage</Link>
          {" / "}
          <Link href="/">{decodedSlug}</Link>
        </div>
      </section>

      {/* Manga detail */}
      <section className="px-4 md:px-[12%] mt-4 grid grid-cols-1 md:grid-cols-12">
        <img
          src={manga.backgroundImage}
          alt={manga.name}
          className="col-span-12 md:col-span-4 h-[350px] w-auto object-cover"
          loading="lazy"
        />
        <div className="col-span-12 md:col-span-8 mt-8">
          <h1>ชื่อเรื่อง: {manga.name}</h1>
          <hr className="my-2" />
          <br />
          <p className="text-white">เรื่องย่อ: {manga.description}</p>
          <br />
          <p className="text-white flex items-center gap-4">
            Tags:{" "}
            {manga.tag.map((tag) => (
              <Link
                key={tag}
                className="px-4 py-1 bg-gray-700 hover:bg-gray-800"
                href={`/tags/${tag}`}
              >
                {tag}
              </Link>
            ))}
          </p>
        </div>
      </section>

      {/* Episode Section */}
      <section className="md:px-[12%] mt-4">
        <div className="w-full bg-gray-700 px-4 py-2">
          <h2>รายชื่อตอนทั้งหมด</h2>
          <hr className="my-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link
              href={`${decodedSlug}/1`}
              className="w-full bg-gray-800 hover:bg-gray-900 p-4 text-center hover:no-underline"
            >
              <span>ตอนแรก</span>
              <h4>ตอนที่ 1</h4>
            </Link>
            <Link
              href={`${decodedSlug}/${manga.ep.length}`}
              className="w-full bg-gray-800 hover:bg-gray-900 p-4 text-center hover:no-underline"
            >
              <span>ตอนล่าสุด</span>
              <h4>ตอนที่ {manga.ep.length}</h4>
            </Link>
          </div>
          <div className="mt-4 w-full relative">
            <MagnifyingGlassIcon className="size-6 text-gray-300 absolute top-2 left-2" />
            <input
              type="text"
              className="w-full bg-gray-500 py-2 px-10"
              placeholder="ค้นหาชื่อตอน (Ex. ใส่เลข 1,2 หรือ 1-12)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            {filteredEpisodes.length > 0 ? (
              filteredEpisodes.map(({ episode, created_date }) => (
                <Link
                  key={episode}
                  href={`${decodedSlug}/${episode}`}
                  className="bg-blue-500 hover:bg-blue-600 hover:no-underline px-4 py-2 flex justify-between"
                >
                  <span className="text-white font-[600]">
                    ตอนที่ {episode}
                  </span>
                  <span className="text-white opacity-50">
                    {dayjs(created_date).format("DD/MM/YYYY")}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">
                ขออภัยค่ะ ไม่มีตอนที่ระบุดังกล่าว
                แต่สามารถคลิกที่รายชื่อตอนที่มีได้นะคะ
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
