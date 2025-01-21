"use client";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import MobileMenubarComponent from "./MobileMenubar";
import { useState } from "react";

const HeaderComponent = () => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const menubar = [
    { id: 1, name: "สุ่มเลือกอ่านมังงะ", href: "/random" },
    { id: 2, name: "Tag ทั้งหมด", href: "/tags" },
    { id: 3, name: "มังงะที่กดถูกใจ", href: "/fevorited-manga" },
  ];

  return (
    <div className="relative w-full">
      <div className="flex text-white gap-4 justify-between lg:justify-start items-center relative w-full bg-gray-800 h-16 px-2 md:px-12 py-2">
        {/* Logo */}
        <div>
          {/* PC Logo */}
          <Link href="/" className="hidden md:block hover:no-underline text-[24px] font-[600]">MANGA <span className="text-pink-500">ARA</span></Link>
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden hover:no-underline text-[24px] font-[600]">M <span className="text-pink-500">R</span></Link>
        </div>
        {/* Search bar */}
        <div>
          <form className="flex">
            <input
              className="h-[40px] hover:bg-gray-600 md:min-w-[150px] bg-gray-500 px-3"
              placeholder="ค้นหาชื่อมังงะ ..."
            />
            <button className="bg-blue-500 hover:bg-blue-600 py-1 px-2">
              <MagnifyingGlassIcon className="size-6 text-white" />
            </button>
          </form>
        </div>
        {/* Menu bar */}
        <div className="flex items-center">
          <ul className="hidden lg:flex gap-8">
            {menubar.map((item) => {
              return (
                <li key={item.id}>
                  <div className="hover:text-underline cursor-pointer" onClick={()=>window.alert("ขออภัยค่ะ หน้าดังกล่าวยังไม่พร้อมใช้งานในขณะนี้")}>
                    {item.name}
                  </div>
                </li>
              );
            })}
          </ul>
          {/* Menu bar on mobile */}
          <button
            className="md:hidden h-[40px] w-full bg-blue-700 rounded-sm px-1"
            onClick={() => setIsShowMenu(!isShowMenu)}
          >
            <Bars3Icon className="size-6 text-white" />
          </button>
        </div>
      </div>
      {/* Mobile menu bar */}
      <MobileMenubarComponent menuItems={menubar} isShowMenu={isShowMenu} />
    </div>
  );
};

export default HeaderComponent;
