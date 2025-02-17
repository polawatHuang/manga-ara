import { Metadata } from "next";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import CardComponent from "@/components/CardComponent";
import CardSliderComponent from "@/components/CardSliderComponent";
import { FireIcon, HeartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import dayjs from "dayjs";
import getRandomFourItems from "@/utils/getRandomFourItems";
import formatNumber from "@/utils/formatNumber";

// ✅ Fetch manga data on the server
async function fetchMangaData() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const params = new URLSearchParams({ page: "1" }).toString();
  const url = `https://mangayuzu.com/api/v1/get/search?orderBy=view&sortBy=desc&page=${params}`;

  const mangaRes = await fetch(url, { cache: "no-store" });

  if (!mangaRes.ok) return [];

  const mangaData = await mangaRes.json();
  console.log("server",mangaData)
  return (
    mangaData.data.results.map((manga) => ({
      id: manga.id,
      name: manga.name,
      slug: manga.slug,
      description: manga.description,
      backgroundImage: manga.imageCover,
      tag: manga.genres.map((genre) => genre.genreName),
      view: manga.view || 0,
      created_date: dayjs(manga.createdAt).format("YYYY-MM-DD"),
      updated_date: dayjs(manga.updatedAt).format("YYYY-MM-DD"),
    })) || []
  );
}

// ✅ Generate dynamic metadata (SEO)
export async function generateMetadata() {
  const mangas = await fetchMangaData();
  const topManga = mangas.length > 0 ? mangas[0] : null;
  const metaTitle = topManga
    ? `อ่าน ${topManga.name} และการ์ตูนยอดฮิต | Manga`
    : "อ่านการ์ตูนยอดนิยม | Manga";
  const metaDescription = topManga
    ? topManga.description
    : "เว็บไซต์อ่านมังงะยอดนิยม มีมังงะอัพเดทใหม่ทุกวัน";
  const metaImage = topManga ? topManga.imageCover : "/default-meta.jpg";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [{ url: metaImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}

// ✅ Server-side component
export default async function Home() {
  const mangas = await fetchMangaData();

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
        <CardSliderComponent
          mangaList={mangas.filter(
            (item) =>
              dayjs(item.updatedAt).format("YYYY-MM") ===
              dayjs().format("YYYY-MM")
          )}
          hasFevFunction={true}
        />
      </section>

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
        </div>
      </section>
    </div>
  );
}
