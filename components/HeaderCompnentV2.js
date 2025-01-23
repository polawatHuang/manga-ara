"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { goToRandomManga } from "@/utils/randomManga"; 
import MobileMenubarComponent from "./MobileMenubar";
import mangas from "@/database/mangas";

const HeaderComponent = () => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMangas, setFilteredMangas] = useState([]);
  const router = useRouter(); 

  const menubar = [
    { id: 1, name: "สุ่มเลือกอ่านมังงะ", href: "" },
    { id: 3, name: "มังฮวาจีนเกาหลี", href: "/manhuas" },
    { id: 2, name: "Tag ทั้งหมด", href: "/tags" },
    { id: 4, name: "มังงะที่กดถูกใจ", href: "/favorite-manga" },
    { id: 5, name: "Hentai 18+", href: "/tags/Hentai" },
  ];

  // ✅ Filter manga list dynamically based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMangas([]);
      return;
    }
    const filtered = mangas.filter((manga) =>
      manga.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMangas(filtered);
  }, [searchQuery]);

  // ✅ Handle selection of manga
  const handleSelectManga = (slug) => {
    setSearchQuery(""); // Clear search bar
    setFilteredMangas([]); // Hide dropdown
    router.push(slug); // Redirect
  };

  return (
    <div className="relative w-full">
      <div className="flex text-white gap-4 justify-between lg:justify-start items-center relative w-full bg-gray-800 h-16 px-2 md:px-12 py-2">
        {/* Logo */}
        <div>
          <Link href="/" className="hidden md:block hover:no-underline text-[24px] font-[600]">
            MANGA <span className="text-pink-500">ARA</span>
          </Link>
          <Link href="/" className="md:hidden hover:no-underline text-[24px] font-[600]">
            M<span className="text-pink-500">A</span>
          </Link>
        </div>

        {/* 🔎 Search bar */}
        <div className="relative">
          <form className="flex">
            <input
              className="h-[40px] hover:bg-gray-600 focus:outline-none !rounded-l-full ring:none md:min-w-[150px] bg-gray-500 px-3 text-white"
              placeholder="ค้นหาชื่อมังงะ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 !rounded-r-full py-1 px-2">
              <MagnifyingGlassIcon className="size-6 text-white" />
            </button>
          </form>

          {/* ✅ Search Suggestion Dropdown */}
          {filteredMangas.length > 0 && (
            <ul className="absolute left-0 w-full bg-gray-700 text-white shadow-lg mt-1 z-50">
              {filteredMangas.map((manga) => (
                <li
                  key={manga.id}
                  onClick={() => handleSelectManga(manga.slug)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-600"
                >
                  {manga.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Menu bar */}
        <div className="flex items-center">
          <ul className="hidden lg:flex gap-8">
            {menubar.map((item) => (
              <li key={item.id}>
                {item.name === "สุ่มเลือกอ่านมังงะ" ? (
                  <div onClick={() => goToRandomManga(router)} className="hover:underline cursor-pointer">
                    {item.name}
                  </div>
                ) : (
                  <Link href={item.href} className="hover:underline cursor-pointer">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Menu bar on mobile */}
          <button className="md:hidden h-[40px] w-full bg-blue-700 rounded-sm px-1" onClick={() => setIsShowMenu(!isShowMenu)}>
            <Bars3Icon className="size-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile menu bar */}
      <MobileMenubarComponent menuItems={menubar} isShowMenu={isShowMenu} toggleMenu={() => setIsShowMenu(false)} />
    </div>
  );
};

export default HeaderComponent;