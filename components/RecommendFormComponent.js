"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function RecommendFormComponent({ mangaList }) {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [selectedManga, setSelectedManga] = useState(null);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = mangaList;

        if (Array.isArray(data)) {
          const mapped = data.map((manga) => ({
            value: manga.slug,
            label: manga.name,
            slug: manga.slug,
            name: manga.name,
            backgroundImage: manga.backgroundImage,
          }));
          setOptions(mapped);
        } else {
          console.error("Expected array but got:", data);
        }
      } catch (error) {
        console.error("Error fetching manga data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedManga({
        slug: selectedOption.slug,
        name: selectedOption.name,
        backgroundImage: selectedOption.backgroundImage,
      });
    } else {
      setSelectedManga(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !selectedManga || !review) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      await addDoc(collection(db, "recommend"), {
        name: selectedManga.name,
        slug: selectedManga.slug,
        commenter: name,
        comment: review,
        backgroundImage: selectedManga.backgroundImage,
        created_at: serverTimestamp(),
        update_at: serverTimestamp(),
        status: "pending",
      });

      setName("");
      setReview("");
      setSelectedManga(null);
      setError("ส่งรีวิวสำเร็จแล้ว กรุณารอแอดมินยืนยัน ✅");
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("เกิดข้อผิดพลาดในการส่งรีวิว");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black p-4 flex flex-col gap-2 w-full"
    >
      <h4 className="mt-1">รีวิวมังงะที่อยากแนะนำให้ทุกคน</h4>
      <hr />

      {error && <div className="text-red-500 font-medium">{error}</div>}

      <p>
        ชื่อ <sup className="text-red-500">*</sup>
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ใส่ชื่อของคุณที่นี่"
        className="border-[1px] border-solid border-[#ccc] rounded-lg py-2 px-4"
      />

      <p>
        เลือกชื่อเรื่องมังงะ <sup className="text-red-500">*</sup>
      </p>
      <Select
        options={options}
        onChange={handleChange}
        value={
          selectedManga
            ? {
                value: selectedManga.slug,
                label: selectedManga.name,
                ...selectedManga,
              }
            : null
        }
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

      <p>
        รีวิว <sup className="text-red-500">*</sup>
      </p>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="เขียนรีวิวที่นี่"
        className="border-[1px] border-solid border-[#ccc] rounded-lg py-2 px-4 min-h-[100px]"
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