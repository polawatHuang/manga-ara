"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

export default function AdminPage() {
  const [mangas, setMangas] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedManga, setSelectedManga] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [newEpisode, setNewEpisode] = useState({ episode: "", totalPage: "" });
  const [imageFiles, setImageFiles] = useState([]);

  // ✅ Load data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mangasResponse = await fetch("/api/mangas");
        const tagsResponse = await fetch("/api/tags");

        const mangasData = await mangasResponse.json();
        const tagsData = await tagsResponse.json();

        setMangas(mangasData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Save Data to API
  const saveMangas = async (data) => {
    try {
      await fetch("/api/mangas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setMangas(data);
    } catch (error) {
      console.error("Error saving mangas:", error);
    }
  };

  const saveTags = async (data) => {
    try {
      await fetch("/api/tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setTags(data);
    } catch (error) {
      console.error("Error saving tags:", error);
    }
  };

  // ✅ Handle Manga Editing
  const handleEditManga = (index, field, value) => {
    const updatedMangas = [...mangas];
    updatedMangas[index][field] = value;
    saveMangas(updatedMangas);
  };

  // ✅ Add New Manga
  const addManga = () => {
    const newManga = {
      id: mangas.length + 1,
      name: "New Manga",
      description: "New manga description...",
      ep: [],
      tag: [],
      view: 0,
      backgroundImage: "/images/default.jpg",
      slug: "/new-manga",
      created_date: new Date().toISOString().split("T")[0],
      updated_date: new Date().toISOString().split("T")[0],
    };
    saveMangas([...mangas, newManga]);
  };

  // ✅ Delete Manga
  const deleteManga = (index) => {
    const updatedMangas = mangas.filter((_, i) => i !== index);
    saveMangas(updatedMangas);
  };

  // ✅ Manage Tags
  const addTag = () => {
    if (!newTag.trim()) return;
    const newTagObj = { id: tags.length + 1, name: newTag };
    saveTags([...tags, newTagObj]);
    setNewTag("");
  };

  const deleteTag = (tagName) => {
    const updatedTags = tags.filter((tag) => tag.name !== tagName);
    saveTags(updatedTags);
  };

  const returnAllTag = (data) => {
    return data && data.map(item => ({ value: item, label: item }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-white">
      <h1 className="text-center mb-6 text-3xl font-bold">Admin Panel</h1>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">จัดการหน้า Manga</h2>
        <h3 className="text-white text-lg">ขั้นตอนการอับโหลดเรื่องใหม่</h3>
        <p className="text-white">1. อับโหลดรูปปกเรื่อง โดยให้ใส่ที่อยู่รูปดังนี้ (/images/ชื่่อเรื่องภาษาอังกฤษ เช่น dan-da-dan มีขีดด้วย!/bg.webp)</p>
        <p className="text-white">2. Copy URL ที่ได้หลังจากอับโหลดรูปปกเสร็จแล้ว</p>
        <p className="text-white">3. กดคลิกเพิ่มเรื่องใหม่และใส่ข้อมูลให้เรียบร้อยและเอา URL ที่ได้จากการ Copy เมื่อกี้มาใส่ใน Background Image</p>
        <p className="text-white">4. กด Upload เรื่อง</p>
        <br />
        <button onClick={addManga} className="bg-green-500 px-4 py-2 rounded">
          + เพิ่มเรื่องใหม่
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {mangas.map((manga, index) => (
            <div key={manga.id} className="bg-gray-800 p-4 rounded shadow-lg">
              <span>ชื่อเรื่อง</span>
              <input
                type="text"
                value={manga.name}
                onChange={(e) => handleEditManga(index, "name", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-2"
              />
              <span>รูปปกเรื่อง</span>
              <input
                type="text"
                value={manga.backgroundImage}
                onChange={(e) => handleEditManga(index, "backgroundImage", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-2"
              />
              <span>Slug (ใส่ / + ชื่อเรื่องภาษาอังกฤษ ใส่ขีดแทนเว้นวรรค)</span>
              <input
                type="text"
                value={manga.slug}
                onChange={(e) => handleEditManga(index, "slug", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-2"
              />
              <span>Tags</span>
              <Select 
                isMulti 
                options={returnAllTag(tags.map(tag => tag.name))} 
                value={returnAllTag(manga.tag)} 
                onChange={(selectedOptions) => handleEditManga(index, "tag", selectedOptions.map(option => option.value))}
                className="mb-2" 
                classNamePrefix="select text-[#808080]"
                styles={{
                  option: (provided) => ({ ...provided, color: "black" }),
                  menu: (provided) => ({ ...provided, color: "black" }),
                }}
              />
              <span>เรื่องย่อ</span>
              <textarea
                value={manga.description}
                onChange={(e) =>
                  handleEditManga(index, "description", e.target.value)
                }
                className="w-full min-h-[10vw] bg-gray-700 px-3 py-2 mb-2"
              />
              <div className="w-full flex justify-end">
              <button
                onClick={() => handleSaveManga(index)}
                className="bg-blue-500 px-4 py-2 rounded mt-2"
              >
                Save
              </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Manage Tags</h2>
        <input
          type="text"
          value={newTag}
          placeholder="Add New Tag"
          onChange={(e) => setNewTag(e.target.value)}
          className="bg-gray-700 px-3 py-2"
        />
        <button onClick={addTag} className="bg-blue-500 px-4 py-2 ml-2">
          + Add
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {tags.map((tag) => (
            <div key={tag.id} className="bg-gray-700 px-4 py-2 rounded">
              <span>{tag.name}</span>
              <button onClick={() => deleteTag(tag.name)} className="text-red-500">
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}