"use client";
import AdvertiseComponent from "@/components/AdvertiseComponent";
import mangas from "@/database/mangas";
import { filterEpisodes } from "@/utils/filterEpisodes";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

export default function SlugPage({ params }) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredEpisodes = filterEpisodes(mangas[0].ep, searchTerm);

  return (
    <div className="relative w-full min-h-screen md:p-8 pb-20 gap-16 sm:p-2">
      {/* Advertise */}
      <section>
        <AdvertiseComponent />
      </section>
      {/* Tab */}
      <section className="md:px-[12%]">
        <div className="w-full bg-gray-700 px-4 py-2">
          <Link href="/">Homepage</Link>
          {" / "}
          <Link href="/">{params.slug}</Link>
        </div>
      </section>
      {/* Manga detail */}
      <section className="px-4 md:px-[12%] mt-4 grid grid-cols-1 md:grid-cols-12">
        <img
          src={mangas
            .filter((item) => item.slug.includes(params.slug))
            .map((item) => item.backgroundImage)}
          alt={mangas
            .filter((item) => item.slug.includes(params.slug))
            .map((item) => item.name)}
          className="col-span-12 md:col-span-4 h-[350px] w-auto object-cover"
          loading="lazy"
        />
        <div className="col-span-12 md:col-span-8 mt-8">
          <h1>
            ชื่อเรื่อง:{" "}
            {mangas
              .filter((item) => item.slug.includes(params.slug))
              .map((item) => item.name)}
          </h1>
          <hr className="my-2" />
          <br />
          <p className="text-white">
            เรื่องย่อ:{" "}
            {mangas
              .filter((item) => item.slug.includes(params.slug))
              .map((item) => item.description)}
          </p>
          <br />
          <p className="text-white flex items-center gap-4">
            Tags:{" "}
            {mangas
              .filter((item) => item.slug.includes(params.slug))
              .map((manga) =>
                manga.tag.map((tag) => {
                  return (
                    <Link
                      key={tag}
                      className="px-4 py-1 bg-gray-700 hover:bg-gray-800"
                      href={"/tags/" + tag}
                    >
                      {tag}
                    </Link>
                  );
                })
              )}
          </p>
        </div>
      </section>
      <section className="md:px-[12%] mt-4">
        <div className="w-full bg-gray-700 px-4 py-2">
          <h2>รายชื่อตอนทั้งหมด</h2>
          <hr className="my-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link
              href="/"
              className="w-full bg-gray-800 hover:bg-gray-900 p-4 text-center hover:no-underline"
            >
              <span>ตอนแรก</span>
              <h4>ตอนที่ 1</h4>
            </Link>
            <Link
              href="/"
              className="w-full bg-gray-800 hover:bg-gray-900 p-4 text-center hover:no-underline"
            >
              <span>ตอนล่าสุด</span>
              <h4>
                ตอนที่{" "}
                {mangas
                  .filter((item) => item.slug.includes(params.slug))
                  .map((item) => item.ep.length)}
              </h4>
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
                  href={"/"}
                  className="bg-blue-500 hover:bg-blue-600 hover:no-underline px-4 py-2 flex justify-between"
                >
                  <span className="text-white font-[600]">ตอนที่ {episode}</span>
                  <span className="text-white opacity-50">
                    {dayjs(created_date).format("DD/MM/YYYY")}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">ขออภัยค่ะ ไม่มีตอนที่ระบุดังกล่าว แต่สามารถคลิกที่รายชื่อตอนที่มีได้นะคะ</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
