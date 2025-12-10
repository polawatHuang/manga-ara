import { notFound } from "next/navigation";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import dayjs from "dayjs";
import Image from "next/image";
import CardComponent from "@/components/CardComponent";
import getRandomFourItems from "@/utils/getRandomFourItems";
import ViewTracker from "@/components/ViewTracker";
import EpisodeList from "@/components/EpisodeList";
import ShareButton from "@/components/ShareButton";
import { generateMangaMetadata } from "./metadata";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = params;
  return await generateMangaMetadata(slug);
}

// Fetch manga data on server
async function getMangaData(slug) {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
    const response = await fetch(`${baseURL}/mangas`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const manga = data.find((item) => item.slug === slug);
    
    if (!manga) {
      return null;
    }

    // Parse episodes
    let episodes = [];
    try {
      episodes = JSON.parse(manga.ep || "[]");
      episodes = Array.isArray(episodes) ? episodes : [];
    } catch {
      episodes = [];
    }

    // Parse tags
    let tags = [];
    try {
      tags = JSON.parse(manga.tag || "[]");
    } catch {
      tags = [];
    }

    return {
      manga: { ...manga, episodes, tags },
      allManga: data,
    };
  } catch (error) {
    console.error("Error fetching manga:", error);
    return null;
  }
}

export default async function MangaDetailPage({ params }) {
  const { slug } = params;
  const data = await getMangaData(slug);

  if (!data || !data.manga) {
    notFound();
  }

  const { manga, allManga } = data;
  const randomManga = getRandomFourItems(allManga);

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `https://mangaara.com/${manga.slug}`,
    "name": manga.name,
    "description": manga.description,
    "image": manga.background_image,
    "url": `https://mangaara.com/${manga.slug}`,
    "genre": manga.tags,
    "datePublished": manga.created_at,
    "dateModified": manga.updated_at,
    "publisher": {
      "@type": "Organization",
      "name": "MANGA ARA",
      "url": "https://mangaara.com"
    },
    "numberOfPages": manga.episodes.length,
    "inLanguage": "th",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "100"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ViewTracker slug={slug} />
      
      <div className="relative w-full min-h-screen max-w-6xl mx-auto md:p-8 pb-20 gap-16 sm:p-2">
        {/* Advertise */}
        <section>
          <AdvertiseComponent />
        </section>

        {/* Manga Details */}
        <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 mt-8">
          <div className="col-span-12 md:col-span-8">
            <div className="w-full bg-gray-700 px-4 py-5 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Manga Cover */}
                <div className="col-span-12 md:col-span-4">
                  <Image
                    src={manga.background_image}
                    alt={`${manga.name} - มังงะแปลไทย`}
                    width={300}
                    height={430}
                    className="w-full h-auto rounded"
                    priority
                  />
                </div>

                {/* Manga Info */}
                <div className="col-span-12 md:col-span-8">
                  <h1 className="text-3xl font-bold mb-4">{manga.name}</h1>
                  
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">แนว:</h2>
                    <div className="flex flex-wrap gap-2">
                      {manga.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-500 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">เรื่องย่อ:</h2>
                    <p className="text-gray-300 leading-relaxed">
                      {manga.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400">
                      อัปเดตล่าสุด: {dayjs(manga.updated_at).format("DD/MM/YYYY")}
                    </p>
                    <p className="text-sm text-gray-400">
                      จำนวนตอน: {manga.episodes.length} ตอน
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <ShareButton 
                      url={`https://mangaara.com/${manga.slug}`}
                      title={manga.name}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Episode List */}
            <div className="w-full bg-gray-700 px-4 py-5">
              <h2 className="text-2xl font-semibold mb-4">รายการตอน</h2>
              <EpisodeList episodes={manga.episodes} slug={manga.slug} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 md:col-span-4">
            <div className="w-full bg-gray-700 px-4 py-5">
              <h3 className="text-xl font-semibold mb-4">มังงะแนะนำ</h3>
              <div className="grid grid-cols-2 gap-4">
                {randomManga.map((item) => (
                  <CardComponent key={item.manga_id} manga={item} hasFevFunction={false} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
