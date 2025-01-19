import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderComponent from "@/components/HeaderCompnent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MANGA LOVER - อ่านมังงะแปลไทย อัปเดตไวที่สุด!",
  description: "MANGA LOVER คือเว็บไซต์อ่านการ์ตูนออนไลน์ที่ออกแบบมาให้ใช้งานง่าย สะดวก รวดเร็ว พร้อมอัปเดตมังงะใหม่ทุกวัน! พบกับมังงะหลากหลายแนว ทั้งแอ็กชัน โรแมนซ์ แฟนตาซี และอีกมากมาย ทุกเรื่องแปลไทยให้อ่านฟรี คุณภาพคมชัด โหลดไว ไม่พลาดทุกตอนสำคัญ!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <HeaderComponent />
        {children}
      </body>
    </html>
  );
}
