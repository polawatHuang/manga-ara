import AdvertiseComponent from "@/components/AdvertiseComponent";
import CardComponent from "@/components/CardComponent";
import CardSliderComponent from "@/components/CardSliderComponent";
import { FireIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import fetchMangaData from "@/utils/fetchMangaData";
import Link from "next/link";
import fetchTagData from "@/utils/fetchTagData";
import Image from "next/image";
import FBPage from "@/public/images/facebook-page.png";

// ✅ Server-side component
export default async function Home() {
  const mangas = await fetchMangaData();
  const tags = await fetchTagData();

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
        <div className="col-span-12 md:col-span-4">
          {/* Advertise */}
          <div className="col-span-12 md:col-span-2 bg-gray-700 px-4 py-5">
            <h3 className="text-2xl font-semibold">Tag ทั้งหมด</h3>
            <hr className="opacity-50 my-2" />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.name}`}
                  className="rounded-full bg-gray-500 hover:bg-blue-500 hover:no-underline px-2 py-1"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mt-4">
        <h2 className="flex items-center gap-2 mb-4">
          <FireIcon className="size-7 text-red-600" />
          อยากให้แปลการ์ตูนเรื่องไหน ทักเพจเรามาได้เลย
        </h2>
        <Link href="https://www.facebook.com/profile.php?id=100068343493780" target="_blank">
          <Image src={FBPage} alt="Manga Ara Facebook Page" className="w-full h-auto" loading="lazy" />
        </Link>
      </section>
    </div>
  );
}
