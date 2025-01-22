"use client";

import { useEffect, useState } from "react";
import mangasData from "@/database/mangas";
import tagsData from "@/database/tags";

export default function AdminPage() {
  const [mangas, setMangas] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedManga, setSelectedManga] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [newEpisode, setNewEpisode] = useState({ episode: "", totalPage: "" });
  const [imageFiles, setImageFiles] = useState([]);

  // ✅ Load data from LocalStorage or Default Data
  useEffect(() => {
    const storedMangas =
      JSON.parse(localStorage.getItem("mangas")) || mangasData;
    const storedTags = JSON.parse(localStorage.getItem("tags")) || tagsData;
    setMangas(storedMangas);
    setTags(storedTags);
  }, []);

  // ✅ Save Data to LocalStorage
  const saveMangas = (data) => {
    setMangas(data);
    localStorage.setItem("mangas", JSON.stringify(data));
  };

  const saveTags = (data) => {
    setTags(data);
    localStorage.setItem("tags", JSON.stringify(data));
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

  // ✅ Select Manga for Adding Episodes
  const handleSelectManga = (manga) => {
    setSelectedManga(manga);
  };

  // ✅ Add Episode to Selected Manga
  const addEpisode = () => {
    if (!selectedManga || !newEpisode.episode || !newEpisode.totalPage) return;

    const updatedMangas = mangas.map((manga) => {
      if (manga.id === selectedManga.id) {
        return {
          ...manga,
          ep: [
            ...manga.ep,
            {
              ...newEpisode,
              view: 0,
              created_date: new Date().toISOString().split("T")[0],
            },
          ],
        };
      }
      return manga;
    });

    saveMangas(updatedMangas);
    setNewEpisode({ episode: "", totalPage: "" });
  };

  // ✅ Handle Image Upload
  const handleImageUpload = async () => {
    if (!selectedManga || !newEpisode.episode || imageFiles.length === 0)
      return;
    const formData = new FormData();
    formData.append("mangaSlug", selectedManga.slug);
    formData.append("episode", newEpisode.episode);
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-white">
      <h1 className="text-center mb-6 text-3xl font-bold">Admin Panel</h1>

      {/* Manga Management Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Manage Mangas</h2>
        <button onClick={addManga} className="bg-green-500 px-4 py-2 rounded">
          + Add New Manga
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {mangas.map((manga, index) => (
            <div key={manga.id} className="bg-gray-800 p-4 rounded shadow-lg">
                <span>ชื่อเรื่อง:</span>
              <input
                type="text"
                value={manga.name}
                onChange={(e) => handleEditManga(index, "name", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-2"
              />
              <span>เรื่องย่อ:</span>
              <textarea
                value={manga.description}
                onChange={(e) =>
                  handleEditManga(index, "description", e.target.value)
                }
                className="w-full min-h-[10vw] bg-gray-700 px-3 py-2 mb-2"
              />
              <span>รูปปก:</span>
              <input
                type="text"
                value={manga.backgroundImage}
                onChange={(e) =>
                  handleEditManga(index, "backgroundImage", e.target.value)
                }
                className="w-full bg-gray-700 px-3 py-2 mb-2"
              />
              <button
                onClick={() => handleSelectManga(manga)}
                className="bg-blue-500 px-3 py-1 rounded mt-2"
              >
                Add Episode
              </button>
              <button
                onClick={() => deleteManga(index)}
                className="bg-red-600 px-3 py-1 mt-2 rounded ml-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Episode Management */}
      {selectedManga && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Add Episode to {selectedManga.name}
          </h2>
          <input
            type="text"
            placeholder="Episode Number"
            value={newEpisode.episode}
            onChange={(e) =>
              setNewEpisode({ ...newEpisode, episode: e.target.value })
            }
            className="bg-gray-700 px-3 py-2 mr-2 mb-2"
          />
          <input
            type="text"
            placeholder="Total Pages"
            value={newEpisode.totalPage}
            onChange={(e) =>
              setNewEpisode({ ...newEpisode, totalPage: e.target.value })
            }
            className="bg-gray-700 px-3 py-2"
          />
          <button
            onClick={addEpisode}
            className="bg-green-500 px-4 py-2 ml-2 rounded"
          >
            + Add
          </button>
          <input
            type="file"
            multiple
            onChange={(e) => setImageFiles([...e.target.files])}
            className="block mt-4"
          />
          <button
            onClick={handleImageUpload}
            className="bg-blue-500 px-4 py-2 mt-2"
          >
            Upload Images
          </button>
        </section>
      )}

      {/* Tag Management */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Manage Tags</h2>
        <input
          type="text"
          value={newTag}
          placeholder="ใส่ชื่อ Tag ใหม่ที่ต้องการ"
          onChange={(e) => setNewTag(e.target.value)}
          className="bg-gray-700 px-3 py-2"
        />
        <button onClick={addTag} className="bg-blue-500 px-4 py-2 ml-2">
          + Add
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-gray-700 px-4 py-2 flex justify-between items-center rounded"
            >
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
