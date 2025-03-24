"use client";

import React, { useState } from "react";
import Select from "react-select";

// Dummy data (replace with your manga API or imported data)
const mangaList = [
  {
    slug: "my-lucky-encounter-from-the-game-turned-into-reality",
    name: "My Lucky Encounter From The Game Turned Into Reality",
    backgroundImage: "https://firebasestorage.googleapis.com/v0/b/...bg.jpg",
  },
  {
    slug: "reality-quest",
    name: "Reality Quest",
    backgroundImage: "https://firebasestorage.googleapis.com/v0/b/...bg.webp",
  },
  {
    slug: "guild-no-uketsukejou-desu-ga",
    name: "Guild no Uketsukejou desu ga",
    backgroundImage: "https://firebasestorage.googleapis.com/v0/b/...bg.jpg",
  },
  // ...add more as needed
];

// Convert to react-select format
const options = mangaList.map((manga) => ({
  value: manga.slug,
  label: manga.name,
  slug: manga.slug,
  name: manga.name,
  backgroundImage: manga.backgroundImage,
}));

export default function RecommendFormComponent() {
  const [selectedManga, setSelectedManga] = useState(null);

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedManga({
        slug: selectedOption.slug,
        name: selectedOption.name,
        backgroundImage: selectedOption.backgroundImage,
      });
    }
  };

  return (
    <form className="bg-white text-black p-4 flex flex-col gap-2 w-full">
      <h4>รีวิวมังงะที่อยากแนะนำให้ทุกคน</h4>
      <p>ชื่อ <sup className="text-red-500">*</sup></p>
      <input
        type="text"
        placeholder="ใส่ชื่อของคุณที่นี่"
        className="border-[1px] border-solid boder-[#ccc] rounded-lg py-2 px-4"
      />
      <p>เลือกชื่อเรื่องมังงะ <sup className="text-red-500">*</sup></p>
      <Select
        options={options}
        onChange={handleChange}
        isClearable={true}
        placeholder="Select a manga..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "8px",
            borderColor: "#ccc",
            boxShadow: "none",
            overflow: "hidden",
            padding: "2px 4px",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#3a82f3" : "white",
            color: state.isSelected ? "white" : "black",
            padding: "10px 15px",
          }),
        }}
      />
      <p>รีวิว <sup className="text-red-500">*</sup></p>
      <textarea
        type="text"
        placeholder="เขียนรีวิวที่นี่"
        className="border-[1px] border-solid boder-[#ccc] rounded-lg py-2 px-4 min-h-[100px]"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-full mt-2"
      >
        ส่งรีวิว
      </button>
    </form>
  );
}
