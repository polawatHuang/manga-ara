import AdvertiseComponent from "@/components/AdvertiseComponent";
import CardComponent from "@/components/CardComponent";
import CardSliderComponent from "@/components/CardSliderComponent";
import mangas from "@/database/mangas";
import { FireIcon, HeartIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen md:p-8 pb-20 gap-16 sm:p-2">
      {/* Advertise */}
      <section>
        <AdvertiseComponent />
      </section>
      {/* Top 10 anime on this month */}
      <section>
        <h2 className="flex items-center gap-2">
          <FireIcon className="size-7 text-red-600" />
          10 อันดับมังงะยอดฮิต
        </h2>
        <CardSliderComponent mangaList={mangas}  />
      </section>
      {/* Favorite manga */}
      <section>
        <h2 className="flex items-center gap-2">
          <HeartIcon className="size-7 text-pink-600" />
          มังงะที่กดถูกใจ
        </h2>
        <CardSliderComponent mangaList={mangas} />
      </section>
      {/* New Manga */}
      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-10 bg-gray-700 px-4 py-5">
          <h3 className="flex items-center gap-2">มังงะอัพเดทใหม่</h3>
          <hr className="opacity-50 my-2" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
            {mangas.map(manga=>{return(<CardComponent key={manga.id} manga={manga} />)})}
          </div>
        </div>
        <div className="col-span-2 bg-gray-700 px-4 py-5">
            <h3 className="flex items-center gap-2">Tag ทั้งหมด</h3>
            <hr className="opacity-50 my-2" />
        </div>
      </section>
    </div>
  );
}
