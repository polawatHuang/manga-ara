"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { goToRandomManga } from "@/utils/randomManga";
import MobileMenubarComponent from "./MobileMenubar";

const HeaderComponent = () => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMangas, setFilteredMangas] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [menubar, setMenubar] = useState([]);
  const router = useRouter();

  // ✅ Load data from localStorage (cache) or fetch from API
  const loadData = async (key, apiUrl, setState) => {
    const cachedData = JSON.parse(localStorage.getItem(key));

    if (cachedData) {
      setState(cachedData.data); // Load from cache
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Error fetching ${key}`);
      const apiData = await response.json();

      // ✅ Check if API data is different from cached data
      if (JSON.stringify(apiData) !== JSON.stringify(cachedData?.data)) {
        setState(apiData); // Update state
        localStorage.setItem(key, JSON.stringify({ data: apiData })); // Update cache
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
    }
  };

  // ✅ Load mangas and menubar from API (with caching)
  useEffect(() => {
    loadData("cachedMangas", "/api/mangas", setMangas);
    loadData("cachedMenubar", "/api/menubar", setMenubar);
  }, []);

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
  }, [searchQuery, mangas]);

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
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              className="h-[40px] hover:bg-gray-600 focus:outline-none !rounded-l-full md:min-w-[150px] bg-gray-500 px-3 text-white"
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
                  <button onClick={() => goToRandomManga(router)} className="hover:underline cursor-pointer">
                    {item.name}
                  </button>
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