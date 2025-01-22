"use client";

import { useEffect, useState } from "react";
import mangasData from "@/database/mangas";
import tagsData from "@/database/tags";

export default function AdminPage() {
  const [mangas, setMangas] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedManga, setSelectedManga] = useState(null);
  const [newTag, setNewTag] = useState("");

  // ✅ Load data from localStorage or default data
  useEffect(() => {
    const storedMangas = JSON.parse(localStorage.getItem("mangas")) || mangasData;
    const storedTags = JSON.parse(localStorage.getItem("tags")) || tagsData;
    setMangas(storedMangas);
    setTags(storedTags);
  }, []);

  // ✅ Save to localStorage
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-white">
      <h1 className="text-center mb-6">Admin Panel</h1>

      {/* Manga Management Section */}
      <section className="mb-12">
        <h2 className="mb-4">Manage Mangas</h2>
        <button onClick={addManga} className="bg-green-500 px-4 py-2 rounded">+ Add New Manga</button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {mangas.map((manga, index) => (
            <div key={manga.id} className="bg-gray-800 p-4 rounded shadow-lg">
              <input
                type="text"
                value={manga.name}
                onChange={(e) => handleEditManga(index, "name", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-2"
              />
              <textarea
                value={manga.description}
                onChange={(e) => handleEditManga(index, "description", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-2"
              />
              <input
                type="text"
                value={manga.backgroundImage}
                onChange={(e) => handleEditManga(index, "backgroundImage", e.target.value)}
                className="w-full bg-gray-700 px-3 py-2 mb-2"
              />
              <button
                onClick={() => deleteManga(index)}
                className="bg-red-600 px-3 py-1 mt-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tag Management Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Manage Tags</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag..."
            className="bg-gray-700 px-3 py-2"
          />
          <button onClick={addTag} className="bg-blue-500 px-4 py-2 rounded">+ Add</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <div key={tag.id} className="bg-gray-700 px-4 py-2 flex justify-between items-center rounded">
              <span>{tag.name}</span>
              <button onClick={() => deleteTag(tag.name)} className="text-red-500">✕</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}