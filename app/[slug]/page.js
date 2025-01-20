import AdvertiseComponent from "@/components/AdvertiseComponent";
import mangas from "@/database/mangas";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SlugPage({ params }) {
    return (
        <div className="relative w-full min-h-screen md:p-8 pb-20 gap-16 sm:p-2">
        {/* Advertise */}
        <section>
          <AdvertiseComponent />
        </section>
        {/* Tab */}
        <section className="md:px-[12%]">
            <div className="w-full bg-gray-700 px-4 py-2">
                <Link href="/" >Homepage</Link>
                {" / "}
                <Link href="/" >{params.slug}</Link>
            </div>
        </section>
        {/* Manga detail */}
        <section className="md:px-[12%] mt-4 grid grid-cols-1 md:grid-cols-12">
            <img src={mangas.filter(item=>item.slug.includes(params.slug)).map(item=>item.backgroundImage)} alt={mangas.filter(item=>item.slug.includes(params.slug)).map(item=>item.name)} className="col-span-12 md:col-span-4 h-[350px] w-auto object-cover" loading="lazy" />
            <div className="col-span-12 md:col-span-8">
                <h1>ชื่อเรื่อง: {mangas.filter(item=>item.slug.includes(params.slug)).map(item=>item.name)}</h1>
                <hr className="my-2" />
                <br />
                <p className="text-white">เรื่องย่อ: {mangas.filter(item=>item.slug.includes(params.slug)).map(item=>item.description)}</p>
                <br />
                <p className="text-white">Tags: {mangas.filter(item=>item.slug.includes(params.slug)).map((item,index)=>{return (<Link key={item.index} href={"/tags/"+item.tag[index]}>{item.tag[index]}</Link>)})}</p>
            </div>
        </section>
        <section className="md:px-[12%] mt-4">
            <div className="w-full bg-gray-700 px-4 py-2">
                <h2>รายชื่อตอนทั้งหมด</h2>
                <hr className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Link href="/" className="w-full bg-gray-800 hover:bg-gray-900 p-4 text-center hover:no-underline"><span>ตอนแรก</span><h4>ตอนที่ 1</h4></Link>
                    <Link href="/" className="w-full bg-gray-800 hover:bg-gray-900 p-4 text-center hover:no-underline"><span>ตอนล่าสุด</span><h4>ตอนที่ 1</h4></Link>
                </div>
                <div className="mt-4 w-full relative">
                    <MagnifyingGlassIcon className="size-6 text-gray-300 absolute top-2 left-2" />
                    <input className="w-full bg-gray-500 py-2 px-10" placeholder="ค้นหาชื่อตอน (Ex. 28, 29)" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                {mangas.filter(item=>item.slug.includes(params.slug)).map(item=>{
                    return (
                        <Link key={item.id} href="/" className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-center">ตอนที่ {item.ep}</Link>
                    )
                })}
                </div>
            </div>
        </section>
      </div>
    );
  }