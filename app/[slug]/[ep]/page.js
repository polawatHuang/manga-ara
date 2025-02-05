"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import MangaReader from "@/components/MangaReader";
import Link from "next/link";
import { ShareIcon } from "@heroicons/react/24/solid";
import copyToClipboard from "@/utils/copyToClipboard";

export default function EpisodePage() {
  const { slug, ep } = useParams();
  const [mangaData, setMangaData] = useState(null);
  const [mangaImages, setMangaImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  // Holds the episode string that was successfully loaded
  const [currentEpisode, setCurrentEpisode] = useState(ep);

  // Utility: extract a number from an episode string (e.g. "ep3" → 3)
  const getEpisodeNumber = (episodeStr) => {
    const num = parseInt(episodeStr.replace("ep", ""), 10);
    return isNaN(num) ? 1 : num;
  };

  // Fetch images and manga details for a given episode.
  // Expects the images API to return an object like { images: [ ... ] }.
  async function fetchMangaData(episode) {
    try {
      // Fetch manga images for the specific episode.
      const response = await fetch(`/api/${slug}/${episode}`);
      // Fetch overall manga details.
      const mangaRes = await fetch(`/api/mangas`);

      if (!response.ok) throw new Error("Failed to fetch manga image");
      if (!mangaRes.ok) throw new Error("Failed to fetch manga data");

      const data = await response.json();
      const mangaDT = await mangaRes.json();

      // The API returns the slug with a leading slash (e.g. "guild-no-uketsukejou-desu-ga").
      const foundManga = mangaDT.find((item) => item.slug === slug);
      if (foundManga) {
        setMangaData(foundManga);
      }

      // Return the array of image URLs.
      return data.images;
    } catch (error) {
      console.error("Error fetching manga for", episode, error);
      return null;
    }
  }

  // Load images: try the requested episode; if not found, fall back to the previous episode.
  useEffect(() => {
    async function loadManga() {
      let data = await fetchMangaData(ep);
      let episodeToLoad = ep;
      if (!data) {
        const currentEpNumber = getEpisodeNumber(ep);
        if (currentEpNumber > 1) {
          episodeToLoad = `ep${currentEpNumber - 1}`;
          data = await fetchMangaData(episodeToLoad);
        }
      }
      if (data) {
        setMangaImages(data);
        setCurrentEpisode(episodeToLoad);
      } else {
        setMangaImages([]);
      }
      setLoading(false);
    }
    loadManga();
  }, [slug, ep]);

  // Listen for scroll events to show/hide the "Go to Top" button.
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to Top function.
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (mangaImages.length === 0) {
    return <p className="text-center text-white">ไม่พบข้อมูลมังงะที่ระบุ</p>;
  }

  // Determine navigation based on the successfully loaded episode.
  const currentEpNumber = getEpisodeNumber(currentEpisode);
  const prevEpisode = currentEpNumber > 1 ? `ep${currentEpNumber - 1}` : null;
  const nextEpisode = `ep${currentEpNumber + 1}`;

  // Use mangaData.ep.episode as the latest available episode.
  const latestEpisode =
    mangaData && mangaData?.ep ? Number(mangaData?.ep?.episode) : 0;
  const canShowNext = currentEpNumber < latestEpisode;

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
          <Link href={`/manga/${slug}`}>
            {mangaData ? mangaData.name : slug}
          </Link>
          {" / "}
          <Link href={`/manga/${slug}/${currentEpisode}`}>
            ตอนที่ {currentEpNumber}
          </Link>
        </div>
      </section>

      {/* Manga Detail */}
      <section className="px-4 md:px-[12%] mt-4 grid grid-cols-1 md:grid-cols-12">
        <img
          src={
            mangaData && mangaData.backgroundImage
              ? mangaData.backgroundImage
              : "/placeholder.jpg"
          }
          alt={`Background for ${mangaData ? mangaData.name : slug}`}
          className="col-span-12 md:col-span-4 h-[350px] w-auto object-cover"
          loading="lazy"
        />
        <div className="col-span-12 md:col-span-8 mt-8">
          <h1 className="text-xl font-bold">
            ชื่อเรื่อง: {mangaData ? mangaData.name : slug}
          </h1>
          <hr className="my-2" />
          <p className="text-white mt-2">
            {mangaData
              ? mangaData.description
              : "รายละเอียดเพิ่มเติมของมังงะ"}
          </p>
          <div className="text-white flex items-center gap-4 mt-3">
            Tags:{" "}
            {(mangaData && mangaData.tag
              ? mangaData.tag
              : ["Action", "Adventure"]
            ).map((tag) => (
              <Link
                key={tag}
                className="px-4 py-1 bg-gray-700 hover:bg-gray-800"
                href={`/tags/${tag}`}
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className="text-white flex items-center gap-4 mt-3">
            แชร์ตอนนี้ให้เพื่อน:{" "}
            <div
              onClick={() => copyToClipboard()}
              className="px-4 rounded-full bg-gray-700 hover:bg-gray-800 flex gap-1 items-center cursor-pointer"
            >
              แชร์ <ShareIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Episode Navigation (top) */}
      <section className="md:px-[12%] mt-4 flex justify-between">
        {prevEpisode && (
          <Link href={`/${slug}/${prevEpisode}`}>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
              {"< "}ตอนที่แล้ว
            </button>
          </Link>
        )}
        {canShowNext && (
          <Link href={`/${slug}/${nextEpisode}`}>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
              ตอนต่อไป{" >"}
            </button>
          </Link>
        )}
      </section>

      {/* Manga Reader */}
      <section className="md:px-[12%] mt-4 w-full">
        <MangaReader mangaImages={mangaImages} />
      </section>

      {/* Episode Navigation (bottom) */}
      <section className="md:px-[12%] mt-4 flex justify-between">
        {prevEpisode && (
          <Link href={`/${slug}/${prevEpisode}`}>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
              {"< "}ตอนที่แล้ว
            </button>
          </Link>
        )}
        {canShowNext && (
          <Link href={`/${slug}/${nextEpisode}`}>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
              ตอนต่อไป{" >"}
            </button>
          </Link>
        )}
      </section>

      {/* "Go to Top" Button */}
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