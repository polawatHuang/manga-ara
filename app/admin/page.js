"use client";

import { useEffect, useRef, useState } from "react";
import Select from "react-select";

export default function AdminPage() {
  const [mangas, setMangas] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedManga, setSelectedManga] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [newEpisode, setNewEpisode] = useState({ episode: "", totalPage: "" });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedURLs, setUploadedURLs] = useState([]);
  const fileInputRef = useRef(null);

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

  const uploadImagesToFirebase = async (mangaName, ep, imageFiles) => {
    try {
      const uploadPromises = imageFiles.map(async (file, index) => {
        const storageRef = ref(
          storage,
          `/images/${mangaName}/ep${ep}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      });

      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs; // Returns array of image URLs
    } catch (error) {
      console.error("Error uploading images:", error);
      return [];
    }
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    const urls = await uploadImagesToFirebase(mangaName, ep, imageFiles);
    setUploadedURLs(urls);
  };

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
    return data && data.map((item) => ({ value: item, label: item }));
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-white">
      <h1 className="text-center mb-6 text-3xl font-bold">Admin Panel</h1>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">จัดการหน้า Manga</h2>
        <h3 className="text-white text-lg">ขั้นตอนการอับโหลดเรื่องใหม่</h3>
        <p className="text-white">
          1. อับโหลดรูปปกเรื่อง โดยให้ใส่ที่อยู่รูปดังนี้
          (/images/ชื่่อเรื่องภาษาอังกฤษ เช่น dan-da-dan มีขีดด้วย!/bg.webp)
        </p>
        <p className="text-white">
          2. Copy URL ที่ได้หลังจากอับโหลดรูปปกเสร็จแล้ว
        </p>
        <p className="text-white">
          3. กดคลิกเพิ่มเรื่องใหม่และใส่ข้อมูลให้เรียบร้อยและเอา URL
          ที่ได้จากการ Copy เมื่อกี้มาใส่ใน Background Image
        </p>
        <p className="text-white">4. กด Upload เรื่อง</p>
        <br />
        <button onClick={addManga} className="bg-green-500 px-4 py-2 rounded">
          + เพิ่มเรื่องใหม่
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          className="hidden" // Hide the input
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {mangas.map((manga, index) => (
            <div key={manga.id} className="bg-gray-800 p-4 rounded shadow-lg">
              <span>ชื่อเรื่อง</span>
              <input
                type="text"
                value={manga.name}
                onChange={(e) => handleEditManga(index, "name", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-4 mt-2"
              />
              <span>รูปปกเรื่อง</span>
              <input
                type="text"
                value={manga.backgroundImage}
                onChange={(e) =>
                  handleEditManga(index, "backgroundImage", e.target.value)
                }
                className="w-full bg-gray-700 px-3 py-2 mb-4 mt-2"
              />
              <span>Slug (ใส่ / + ชื่อเรื่องภาษาอังกฤษ ใส่ขีดแทนเว้นวรรค)</span>
              <input
                type="text"
                value={manga.slug}
                onChange={(e) => handleEditManga(index, "slug", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-4 mt-2"
              />
              <span>Tags</span>
              <Select
                isMulti
                options={returnAllTag(tags.map((tag) => tag.name))}
                value={returnAllTag(manga.tag)}
                onChange={(selectedOptions) =>
                  handleEditManga(
                    index,
                    "tag",
                    selectedOptions.map((option) => option.value)
                  )
                }
                className="mt-2 mb-4"
                classNamePrefix="select text-[#808080] rounded-none"
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
                className="w-full min-h-[10vw] bg-gray-700 px-3 py-2 mt-2 mb-4"
              />
              <div className="w-full flex justify-between items-center">
                <span>Episode</span>
                <button
                  onClick={handleButtonClick}
                  className="bg-green-500 px-4 rounded"
                >
                  <span>+ เพิ่มตอนใหม่</span>
                  <br />
                  <span className="text-gray-200">(เพิ่มเซ็ตรูปตอนใหม่ได้เลย)</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileChange}
                  className="hidden" // Hide the input
                />
              </div>
              <div className="w-full max-max-h-[10vw] overflow-y-scroll">
                {(Array.isArray(manga.ep) ? manga.ep : []).length === 0 && (
                  <div className="w-full bg-gray-700 px-3 py-2 mb-2 flex justify-center mt-2 text-gray-300 text-center">
                    ยังไม่มีตอนใหม่ในขณะนี้
                  </div>
                )}
                {(Array.isArray(manga.ep) ? manga.ep : [])
                  .sort((a, b) => a - b)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="w-full overflow-hidden bg-gray-700 px-3 py-2 mb-2 grid grid-cols-2 mt-2"
                    >
                      <div>
                        <b>ตอนที่: {item.episode}</b>
                        <br />
                        <span>
                          จำนวนหน้าทั้งหมด: {item.totalPage} หน้า
                        </span>
                      </div>
                      <div className="w-full">
                        <span>อับโหลดไฟล์รูป (.webp)</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="bg-gray-700 text-white p-2 rounded"
                        />
                      </div>
                    </div>
                  ))}
              </div>
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
              <button
                onClick={() => deleteTag(tag.name)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
