"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import MangaReader from "@/components/MangaReader";
import Link from "next/link";

export default function EpisodePage() {
  const { slug, ep } = useParams();
  const [manga, setManga] = useState(null);
  const [mangaImages, setMangaImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    async function fetchManga() {
      try {
        const response = await fetch("/api/mangas");
        if (!response.ok) throw new Error("Failed to fetch manga data");

        const data = await response.json();
        const foundManga = data.find((item) => item.slug.includes(slug));
        setManga(foundManga || null);

        if (foundManga) {
          const selectedEpisode = foundManga.ep.find((episode) => episode.episode === ep);
          if (selectedEpisode) {
            const images = Array.from(
              { length: selectedEpisode.totalPage },
              (_, i) => `/images/${slug}/ep${ep}/page${i + 1}.jpg`
            );
            setMangaImages(images);
          }
        }
      } catch (error) {
        console.error("Error fetching manga:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchManga();
  }, [slug, ep]);

  // ✅ Handle Scroll for "Go to Top" Button
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Scroll to Top Function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Loading animation (Spinner)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (!manga) {
    return <p className="text-center text-white">ไม่พบข้อมูลมังงะที่ระบุ</p>;
  }

  return (
    <div className="relative w-full min-h-screen max-w-6xl mx-auto md:p-8 pb-20 gap-16 sm:p-2">
      {/* Advertise */}
      <section>
        <AdvertiseComponent />
      </section>

      {/* Tab Navigation */}
      <section className="md:px-[12%]">
        <div className="w-full bg-gray-700 px-4 py-2">
          <Link href="/">Homepage</Link>
          {" / "}
          <Link href={`/manga/${slug}`}>{slug}</Link>
          {" / "}
          <Link href={`/manga/${slug}/ep${ep}`}>ตอนที่ {ep}</Link>
        </div>
      </section>

      {/* Manga Detail */}
      <section className="px-4 md:px-[12%] mt-4 grid grid-cols-1 md:grid-cols-12">
        <img
          src={manga.backgroundImage}
          alt={manga.name}
          className="col-span-12 md:col-span-4 h-[350px] w-auto object-cover"
          loading="lazy"
        />
        <div className="col-span-12 md:col-span-8 mt-8">
          <h1 className="text-xl font-bold">ชื่อเรื่อง: {manga.name}</h1>
          <hr className="my-2" />
          <p className="text-white mt-2">เรื่องย่อ: {manga.description}</p>

          {/* Tags Section */}
          <p className="text-white flex items-center gap-4 mt-3">
            Tags:{" "}
            {manga.tag.map((tag) => (
              <Link key={tag} className="px-4 py-1 bg-gray-700 hover:bg-gray-800" href={`/tags/${tag}`}>
                {tag}
              </Link>
            ))}
          </p>
        </div>
      </section>

      {/* Manga Reader */}
      <section className="md:px-[12%] mt-4 w-full">
        <MangaReader mangaImages={mangaImages} />
      </section>

      {/* ✅ "Go to Top" Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-opacity duration-300"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}