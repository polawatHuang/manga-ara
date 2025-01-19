import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700"]
});
export const metadata = {
  title: "MANGA LOVER - อ่านมังงะแปลไทย อัปเดตไวที่สุด!",
  description: "MANGA LOVER คือเว็บไซต์อ่านการ์ตูนออนไลน์ที่ออกแบบมาให้ใช้งานง่าย สะดวก รวดเร็ว พร้อมอัปเดตมังงะใหม่ทุกวัน! พบกับมังงะหลากหลายแนว ทั้งแอ็กชัน โรแมนซ์ แฟนตาซี และอีกมากมาย ทุกเรื่องแปลไทยให้อ่านฟรี คุณภาพคมชัด โหลดไว ไม่พลาดทุกตอนสำคัญ!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${kanit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
