import fs from "fs";
import path from "path";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

// File path to mangas.json
const mangasFilePath = path.join(process.cwd(), "database", "mangas.json");

// Read mangas data
const readMangas = () => JSON.parse(fs.readFileSync(mangasFilePath, "utf-8"));

// Write mangas data
const writeMangas = (data) => fs.writeFileSync(mangasFilePath, JSON.stringify(data, null, 2), "utf-8");

export async function GET() {
  return Response.json(readMangas());
}

export async function POST(req, res) {
  if (req.method === "POST") {
    try {
      const mangaData = {
        id: 5,
        name: "Kono Kaisha ni Suki na Hito ga Imasu บริษัทนี้มีความรัก",
        description:
          "ทาเทอิชิ พนักงานบัญชีของบริษัทขนม มีความลับสุดซึ้ง นั่นคือเขากำลังคบกับ มิตสึยะ เพื่อนร่วมงานสาวสวยที่อยู่แผนกวางแผน! ความรักของทั้งคู่เกิดขึ้นในที่ทำงาน และเป็นความสัมพันธ์ที่ต้องเก็บเป็นความลับ แต่ความสนุกสนานและเรื่องราววุ่นๆ ในออฟฟิศก็ทำให้ความรักของทั้งคู่เข้มข้นยิ่งขึ้น",
        ep: [
          {
            episode: "1",
            totalPage: 24,
            view: 214,
            created_date: "2025-01-23",
          },
        ],
        tag: ["คอมมาดี้", "โรแมนติก"],
        backgroundImage: "/images/kono-kaisha-ni-suki-na-hito-ga-imasu/bg.webp",
        slug: "/kono-kaisha-ni-suki-na-hito-ga-imasu",
        created_date: "2025-01-23",
        updated_date: "2025-01-23",
      };

      const docRef = await addDoc(collection(db, "manga"), mangaData);
      res.status(200).json({ message: "Manga added successfully", id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

export async function PUT(req) {
  const updatedManga = await req.json();
  let mangas = readMangas();
  mangas = mangas.map((m) => (m.id === updatedManga.id ? updatedManga : m));
  writeMangas(mangas);
  return Response.json({ message: "Manga updated successfully" });
}

export async function DELETE(req) {
  const { id } = await req.json();
  let mangas = readMangas();
  mangas = mangas.filter((m) => m.id !== id);
  writeMangas(mangas);
  return Response.json({ message: "Manga deleted successfully" });
}