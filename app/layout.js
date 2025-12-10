import { Kanit } from "next/font/google";
import "./globals.css";
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL('https://mangaara.com'),
  title: {
    default: "MANGA ARA - อ่านมังงะแปลไทย อัปเดตไวที่สุด!",
    template: "%s | MANGA ARA"
  },
  description:
    "อ่านการ์ตูนออนไลน์ฟรี มังงะแปลไทย อัปเดตใหม่ทุกวัน! รวมมังงะแอ็กชัน โรแมนซ์ แฟนตาซี ดราม่า ผู้ใหญ่ คุณภาพ HD โหลดเร็ว ไม่สะดุด อ่านได้ทุกแพลตฟอร์ม",
  keywords: [
    "อ่านการ์ตูน",
    "มังงะแปลไทย",
    "อ่านมังงะออนไลน์",
    "การ์ตูนญี่ปุ่น",
    "manga online",
    "อ่านการ์ตูนฟรี",
    "มังงะแนะนำ",
    "manga ara",
    "อัปเดตมังงะใหม่",
    "การ์ตูนแอ็กชัน",
    "การ์ตูนโรแมนซ์"
  ],
  authors: [{ name: "MANGA ARA" }],
  creator: "MANGA ARA",
  publisher: "MANGA ARA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://mangaara.com",
    siteName: "MANGA ARA",
    title: "MANGA ARA - อ่านมังงะแปลไทย อัปเดตไวที่สุด!",
    description: "อ่านการ์ตูนออนไลน์ฟรี มังงะแปลไทย อัปเดตใหม่ทุกวัน! รวมมังงะทุกแนว คุณภาพ HD โหลดเร็ว",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MANGA ARA - เว็บอ่านมังงะออนไลน์อันดับ 1",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MANGA ARA - อ่านมังงะแปลไทย อัปเดตไวที่สุด!",
    description: "อ่านการ์ตูนออนไลน์ฟรี มังงะแปลไทย อัปเดตใหม่ทุกวัน!",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MANGA ARA",
    "url": "https://mangaara.com",
    "description": "เว็บไซต์อ่านการ์ตูนออนไลน์ มังงะแปลไทย อัปเดตใหม่ทุกวัน",
    "publisher": {
      "@type": "Organization",
      "name": "MANGA ARA",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mangaara.com/images/logo.png"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "mangaara2025@gmail.com",
        "contactType": "Customer Service"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mangaara.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="th">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0"
          nonce="your_nonce"
        ></script>
      </head>
      <body className={`${kanit.variable} antialiased`}>
        <HeaderComponent />
        {children}
        <FooterComponent />
      </body>
    </html>
  );
}
