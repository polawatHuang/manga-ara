"use client";

import { goToRandomManga } from "@/utils/randomManga";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const FooterComponent = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/menubar");
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container px-4 mx-auto flex gap-4 flex-wrap justify-start">
        <div className="flex-1 sm:w-1/3 mb-6 sm:mb-0">
          <h4 className="text-lg font-semibold mb-2">เกี่ยวกับเรา</h4>
          <p>
            MANGA ARA คือเว็บไซต์อ่านการ์ตูนออนไลน์ที่ออกแบบมาให้ใช้งานง่าย
            สะดวก รวดเร็ว พร้อมอัปเดตมังงะใหม่ทุกวัน! พบกับมังงะหลากหลายแนว
            ทั้งแอ็กชัน โรแมนซ์ แฟนตาซี และอีกมากมาย ทุกเรื่องแปลไทยให้อ่านฟรี
            คุณภาพคมชัด โหลดไว ไม่พลาดทุกตอนสำคัญ!
          </p>
          <p className="mt-4">
            ติดต่อโฆษณา:{" "}
            <a href="mailto:kaitolovemiku@hotmail.com" target="_blank">
              kaitolovemiku@hotmail.com
            </a>
          </p>
        </div>
        <div className="flex-1 sm:w-1/3 mb-6 sm:mb-0">
          <h4 className="text-lg font-semibold mb-2">เมนู</h4>
          <ul>
            {menuItems.filter(item=>item.name !== "สุ่มเลือกอ่านมังงะ").map((item) => (
              <li key={item.id} className="mb-2">
                <a href={`${item.href}`} className="hover:underline">
                  {item.name}
                </a>
              </li>
            ))}
            {menuItems.filter(item=>item.name === "สุ่มเลือกอ่านมังงะ").map((item) => (
              <li key={item.id} className="mb-2">
                <button onClick={()=>goToRandomManga()} className="hover:underline cursor-pointer">
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 sm:w-1/3">
          <h4 className="text-lg font-semibold mb-2">ติดตามเราได้ที่</h4>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm">
        <p>&copy; {dayjs().format("YYYY")} Manga Ara. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
