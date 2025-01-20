"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import MangaReader from "@/components/MangaReader";
import mangas from "@/database/mangas";
import Link from "next/link";

export default function EpisodePage() {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [manga, setManga] = useState(null);
  const [mangaImages, setMangaImages] = useState([]);
  const [showScroll, setShowScroll] = useState(false); // ✅ State for "Go to Top" button

  useEffect(() => {
    // Find the manga based on the slug
    const foundManga = mangas.find((item) => item.slug.includes(params.slug));
    if (foundManga) {
      setManga(foundManga);

      // Find the selected episode
      const selectedEpisode = foundManga.ep.find((ep) => ep.episode === params.ep);
      if (selectedEpisode) {
        // Generate images based on `totalPage`
        const images = Array.from(
          { length: selectedEpisode.totalPage },
          (_, i) =>
            `/images/tensei-kizoku-no-isekai-boukenroku-jichou-wo-shiranai-kamigami-no-shito/ep${params.ep}/page${i + 1}.jpg`
        );
        setMangaImages(images);
      }
    }
  }, [params, searchTerm]);

  // ✅ Handle Scroll for "Go to Top" Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Scroll to Top Function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!manga) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <div className="relative w-full min-h-screen md:p-8 pb-20 gap-16 sm:p-2">
      {/* Advertise */}
      <section>
        <AdvertiseComponent />
      </section>

      {/* Tab Navigation */}
      <section className="md:px-[12%]">
        <div className="w-full bg-gray-700 px-4 py-2">
          <Link href="/">Homepage</Link>
          {" / "}
          <Link href="/">{params.slug}</Link>
          {" / "}
          <Link href="/">ตอนที่ {params.ep}</Link>
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
              <Link key={tag} className="px-4 py-1 bg-gray-700 hover:bg-gray-800 rounded" href={`/tags/${tag}`}>
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