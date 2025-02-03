"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import { db, storage } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

/**
 * React Select custom styles to force black text.
 */
const selectStyles = {
  control: (provided) => ({
    ...provided,
    color: "black",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "black",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "black",
  }),
  option: (provided, state) => ({
    ...provided,
    color: "black",
    backgroundColor: state.isFocused ? "#eee" : "#fff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999",
  }),
};

/**
 * A simple style object for all <input>, <textarea>, <select> fields.
 */
const blackInputStyle = { color: "black" };

export default function AdminPage() {
  // Tab selection: 'manga', 'episodes', 'tags', 'menubar'
  const [activeTab, setActiveTab] = useState("manga");

  /* ======================
   * MANGA MANAGEMENT
   * ====================== */
  const [mangaList, setMangaList] = useState([]);
  const [mangaName, setMangaName] = useState("");
  const [mangaSlug, setMangaSlug] = useState("");
  const [mangaDescription, setMangaDescription] = useState("");
  const [mangaBackgroundFile, setMangaBackgroundFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [editingMangaId, setEditingMangaId] = useState(null);

  // Fetch existing manga
  const fetchMangaList = async () => {
    const snapshot = await getDocs(collection(db, "manga"));
    const data = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    setMangaList(data);
  };

  // Fetch /api/tags (example) and convert to react-select options
  const fetchTagOptions = async () => {
    try {
      const res = await fetch("/api/tags");
      const tagsData = await res.json(); // e.g. [{ name: 'Action' }, { name: 'Romance' }]
      const options = tagsData.map((t) => ({ value: t.name, label: t.name }));
      setTagOptions(options);
    } catch (err) {
      console.error("Error fetching tag options:", err);
    }
  };

  // Create new manga
  const createManga = async () => {
    try {
      let backgroundUrl = "";
      if (mangaBackgroundFile && mangaSlug) {
        const storageRef = ref(
          storage,
          `images/${mangaSlug}/${mangaBackgroundFile.name}`
        );
        await uploadBytes(storageRef, mangaBackgroundFile);
        backgroundUrl = await getDownloadURL(storageRef);
      }
      const tagArray = selectedTags.map((t) => t.value);

      await addDoc(collection(db, "manga"), {
        name: mangaName,
        slug: mangaSlug,
        description: mangaDescription,
        backgroundImage: backgroundUrl,
        tag: tagArray,
        view: 0,
        created_date: Timestamp.now().toDate().toISOString(),
        updated_date: Timestamp.now().toDate().toISOString(),
      });

      resetMangaForm();
      alert("Manga created!");
      fetchMangaList();
    } catch (err) {
      console.error(err);
      alert("Error creating manga");
    }
  };

  // Load existing manga into the form
  const handleEditManga = async (mangaDocId) => {
    try {
      const docRef = doc(db, "manga", mangaDocId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        alert("Manga not found!");
        return;
      }
      const data = docSnap.data();
      setEditingMangaId(mangaDocId);
      setMangaName(data.name || "");
      setMangaSlug(data.slug || "");
      setMangaDescription(data.description || "");
      setMangaBackgroundFile(null);
      if (Array.isArray(data.tag)) {
        const preSelected = data.tag.map((t) => ({ value: t, label: t }));
        setSelectedTags(preSelected);
      } else {
        setSelectedTags([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching manga");
    }
  };

  // Update existing manga
  const updateManga = async () => {
    if (!editingMangaId) return;
    try {
      const docRef = doc(db, "manga", editingMangaId);
      let newBgUrl = null;

      if (mangaBackgroundFile && mangaSlug) {
        const storageRef = ref(
          storage,
          `images/${mangaSlug}/${mangaBackgroundFile.name}`
        );
        await uploadBytes(storageRef, mangaBackgroundFile);
        newBgUrl = await getDownloadURL(storageRef);
      }
      const updatedFields = {
        name: mangaName,
        slug: mangaSlug,
        description: mangaDescription,
        tag: selectedTags.map((t) => t.value),
        updated_date: Timestamp.now().toDate().toISOString(),
      };
      if (newBgUrl) {
        updatedFields.backgroundImage = newBgUrl;
      }

      await updateDoc(docRef, updatedFields);
      alert("Manga updated!");
      resetMangaForm();
      fetchMangaList();
    } catch (err) {
      console.error(err);
      alert("Error updating manga");
    }
  };

  // Reset form after create/update
  const resetMangaForm = () => {
    setEditingMangaId(null);
    setMangaName("");
    setMangaSlug("");
    setMangaDescription("");
    setMangaBackgroundFile(null);
    setSelectedTags([]);
  };

  /* ======================
   * EPISODE MANAGEMENT
   * ====================== */
  const [mangaForEpisodes, setMangaForEpisodes] = useState([]);
  const [selectedMangaId, setSelectedMangaId] = useState("");
  const [selectedMangaSlug, setSelectedMangaSlug] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [episodeFiles, setEpisodeFiles] = useState(null);

  const fetchMangaForEpisodes = async () => {
    const snapshot = await getDocs(collection(db, "manga"));
    const data = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    setMangaForEpisodes(data);
  };

  const createEpisode = async () => {
    if (!selectedMangaId || !episodeNumber) {
      alert("Please select a manga and enter an episode number");
      return;
    }
    if (episodeFiles && selectedMangaSlug) {
      for (let i = 0; i < episodeFiles.length; i++) {
        const file = episodeFiles[i];
        const storageRef = ref(
          storage,
          `images/${selectedMangaSlug}/ep${episodeNumber}/${file.name}`
        );
        await uploadBytes(storageRef, file);
      }
    }
    try {
      await addDoc(collection(db, `manga/${selectedMangaId}/episodes`), {
        episode: episodeNumber,
        created_date: new Date().toISOString(),
        totalPage: episodeFiles ? episodeFiles.length : 0,
        view: 0,
      });
      setEpisodeNumber("");
      setEpisodeFiles(null);
      alert("Episode created!");
    } catch (err) {
      console.error(err);
      alert("Error creating episode");
    }
  };

  const handleSelectMangaForEpisode = (mangaId) => {
    setSelectedMangaId(mangaId);
    const found = mangaForEpisodes.find((m) => m.docId === mangaId);
    if (found) {
      setSelectedMangaSlug(found.slug || "");
    }
  };

  /* ======================
   * TAG MANAGEMENT
   * ====================== */
  const [tagList, setTagList] = useState([]);
  const [tagName, setTagName] = useState("");
  const [tagIdValue, setTagIdValue] = useState("");
  const [editingTagDocId, setEditingTagDocId] = useState(null);

  const fetchTagList = async () => {
    const snapshot = await getDocs(collection(db, "tag"));
    const data = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    setTagList(data);
  };

  const createTag = async () => {
    try {
      await addDoc(collection(db, "tag"), {
        name: tagName,
        id: Number(tagIdValue),
      });
      resetTagForm();
      alert("Tag created!");
      fetchTagList();
    } catch (err) {
      console.error(err);
      alert("Error creating tag");
    }
  };

  const handleEditTag = async (docId) => {
    try {
      const tagRef = doc(db, "tag", docId);
      const snap = await getDoc(tagRef);
      if (!snap.exists()) {
        alert("Tag not found!");
        return;
      }
      const data = snap.data();
      setEditingTagDocId(docId);
      setTagName(data.name || "");
      setTagIdValue(data.id || "");
    } catch (err) {
      console.error(err);
      alert("Error fetching tag");
    }
  };

  const updateTag = async () => {
    if (!editingTagDocId) return;
    try {
      const tagRef = doc(db, "tag", editingTagDocId);
      await updateDoc(tagRef, {
        name: tagName,
        id: Number(tagIdValue),
      });
      alert("Tag updated!");
      resetTagForm();
      fetchTagList();
    } catch (err) {
      console.error(err);
      alert("Error updating tag");
    }
  };

  const resetTagForm = () => {
    setEditingTagDocId(null);
    setTagName("");
    setTagIdValue("");
  };

  /* ======================
   * MENU BAR MANAGEMENT
   * ====================== */
  const [menuList, setMenuList] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [menuHref, setMenuHref] = useState("");
  const [menuIdValue, setMenuIdValue] = useState("");
  const [editingMenuDocId, setEditingMenuDocId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchMenuList = async () => {
    const snapshot = await getDocs(collection(db, "menubar"));
    const data = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    setMenuList(data);
  };

  const createMenuItem = async () => {
    try {
      await addDoc(collection(db, "menubar"), {
        name: menuName,
        href: menuHref,
        id: Number(menuIdValue),
      });
      resetMenuForm();
      alert("Menu item created!");
      fetchMenuList();
    } catch (err) {
      console.error(err);
      alert("Error creating menu item");
    }
  };

  const handleEditMenuItem = async (docId) => {
    try {
      const menuRef = doc(db, "menubar", docId);
      const snap = await getDoc(menuRef);
      if (!snap.exists()) {
        alert("Menu item not found!");
        return;
      }
      const data = snap.data();
      setEditingMenuDocId(docId);
      setMenuName(data.name || "");
      setMenuHref(data.href || "");
      setMenuIdValue(data.id || "");
    } catch (err) {
      console.error(err);
      alert("Error fetching menu item");
    }
  };

  const updateMenuItem = async () => {
    if (!editingMenuDocId) return;
    try {
      const menuRef = doc(db, "menubar", editingMenuDocId);
      await updateDoc(menuRef, {
        name: menuName,
        href: menuHref,
        id: Number(menuIdValue),
      });
      alert("Menu item updated!");
      resetMenuForm();
      fetchMenuList();
    } catch (err) {
      console.error(err);
      alert("Error updating menu item");
    }
  };

  const resetMenuForm = () => {
    setEditingMenuDocId(null);
    setMenuName("");
    setMenuHref("");
    setMenuIdValue("");
  };

  /* ======================
   * ON MOUNT
   * ====================== */
  useEffect(() => {
    fetchMangaList();
    fetchTagOptions();
    fetchMangaForEpisodes();
    fetchTagList();
    fetchMenuList();
  }, []);

  /* ======================
   * RENDER
   * ====================== */
  return (
    <main className="p-4 md:px-0 md:max-w-6xl mx-auto">
      <h1 className="mb-4">Admin Page</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          className={clsx(
            activeTab === "manga" ? "bg-gray-700" : "bg-gray-500",
            "px-4 py-1 hover:bg-gray-600 rounded-t-md"
          )}
          onClick={() => setActiveTab("manga")}
        >
          Manga
        </button>
        <button
          className={clsx(
            activeTab === "episodes" ? "bg-gray-700" : "bg-gray-500",
            "px-4 py-1 hover:bg-gray-600 rounded-t-md"
          )}
          onClick={() => setActiveTab("episodes")}
        >
          Episodes
        </button>
        <button
          className={clsx(
            activeTab === "tags" ? "bg-gray-700" : "bg-gray-500",
            "px-4 py-1 hover:bg-gray-600 rounded-t-md"
          )}
          onClick={() => setActiveTab("tags")}
        >
          Tags
        </button>
        <button
          className={clsx(
            activeTab === "menubar" ? "bg-gray-700" : "bg-gray-500",
            "px-4 py-1 hover:bg-gray-600 rounded-t-md"
          )}
          onClick={() => setActiveTab("menubar")}
        >
          Menu Bar
        </button>
      </div>

      {/* ============ MANGA TAB ============ */}
      {activeTab === "manga" && (
        <section>
          <div className="p-4 bg-gray-700 mb-4">
            <h2 className="mb-6">การจัดการ Manga</h2>
            <div className="mb-4 flex gap-2">
              <label>ชื่อเรื่อง:</label>
              <input
                style={blackInputStyle}
                value={mangaName}
                className="bg-gray-500 px-2"
                placeholder="กรุณาใส่ชื่อเรื่อง"
                onChange={(e) => {
                  setMangaName(e.target.value);
                  setMangaSlug(
                    e.target.value.toLowerCase().replace(/\s+/g, "-")
                  );
                }}
              />
            </div>
            <div className="mb-4 flex gap-2">
              <label>Slug: </label>
              <input
                style={blackInputStyle}
                value={mangaSlug}
                className="bg-gray-500 px-2"
                placeholder="กรุณาใส่ชื่อ URL ของเรื่องนี้"
                onChange={(e) => setMangaSlug(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-4">
              <label>เรื่องย่อ: </label>
              <textarea
                style={blackInputStyle}
                value={mangaDescription}
                className="bg-gray-500 px-2"
                placeholder="กรุณาใส่เรื่องย่อ"
                onChange={(e) => setMangaDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-4">
              <label>Tags ของเรื่อง: </label>
              <Select
                isMulti
                styles={selectStyles} // applies black text in dropdown
                options={tagOptions}
                value={selectedTags}
                className="md:w-[20vw]"
                onChange={(values) => setSelectedTags(values || [])}
              />
            </div>
            <div className="mb-4 flex gap-2">
              <label>รูปปกเรื่อง: </label>
              <input
                style={blackInputStyle}
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setMangaBackgroundFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {!editingMangaId ? (
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700"
                onClick={createManga}
                style={{ marginTop: "0.5rem" }}
              >
                Create Manga
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700"
                onClick={updateManga}
                style={{ marginTop: "0.5rem" }}
              >
                Update Manga
              </button>
            )}

            {editingMangaId && (
              <button
                onClick={resetMangaForm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 ml-[1rem]"
              >
                Cancel
              </button>
            )}
          </div>
          <div className="p-4 bg-gray-700">
            <h3 className="mb-6">Manga ทั้งหมด</h3>
            <div className="mb-4 relative w-full">
              <MagnifyingGlassIcon className="size-7 absolute top-1 left-2" />
              <input
                onChange={(e) => setSearchKeyword(e.target.value)}
                type="text"
                placeholder="ค้นหาชื่อเรื่อง ..."
                className="w-[30vw] h-[36px] bg-gray-500 pl-10 pr-4 rounded-full"
              />
            </div>
            <ul className="p-4 bg-gray-500">
              {mangaList.filter((item) => item.name.toLowerCase().includes(searchKeyword.toLowerCase()))
                .length === 0 ? (
                <li>ขออภัยด้วยค่ะ! ไม่มีชื่อเรื่องดังกล่าว</li>
              ) : null}
              {mangaList
                .filter((item) => item.name.toLowerCase().includes(searchKeyword.toLowerCase()))
                .map((m, index) => (
                  <li key={m.docId} className="mb-[0.5rem]">
                    <strong>{m.name}</strong>
                    <button
                      className="ml-[1rem] rounded-full bg-blue-500 hover:bg-blue-600 px-4"
                      onClick={() => handleEditManga(m.docId)}
                    >
                      Edit
                    </button>
                    {index+1 !== mangaList.filter((item) => item.name.toLowerCase().includes(searchKeyword.toLowerCase())).length && <div className="h-[1px] w-full bg-gray-400 my-4" />}
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

      {/* ============ EPISODES TAB ============ */}
      {activeTab === "episodes" && (
        <section className="p-4 bg-gray-700 mb-4">
          <h2 className="mb-4">การจัดการ Episode</h2>
          <div className="mb-4 flex gap-2">
            <label>ชื่อเรื่อง: </label>
            <select
              style={blackInputStyle}
              onChange={(e) => handleSelectMangaForEpisode(e.target.value)}
              value={selectedMangaId}
            >
              <option style={blackInputStyle} value="">
                เลือกชื่อเรื่องที่ต้องการ
              </option>
              {mangaForEpisodes.map((m) => (
                <option style={blackInputStyle} key={m.docId} value={m.docId}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex gap-2">
            <label>เลข Episode: </label>
            <input
              type="number"
              className="px-2"
              style={blackInputStyle}
              value={episodeNumber}
              placeholder="ระบุเลขตอน"
              onChange={(e) => setEpisodeNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label>อับโหลดรูปของ EP นั้นๆ (multiple): </label>
            <input
              style={blackInputStyle}
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setEpisodeFiles(e.target.files);
                }
              }}
            />
          </div>
          <button onClick={createEpisode} className="px-4 py-2 bg-green-600 hover:bg-green-700">
            Create Episode
          </button>
        </section>
      )}

      {/* ============ TAGS TAB ============ */}
      {activeTab === "tags" && (
        <section style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h2>Tag Management</h2>
          <div>
            <label>Tag Name: </label>
            <input
              style={blackInputStyle}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
          </div>
          <div>
            <label>Tag ID: </label>
            <input
              style={blackInputStyle}
              value={tagIdValue}
              onChange={(e) => setTagIdValue(e.target.value)}
            />
          </div>

          {!editingTagDocId ? (
            <button onClick={createTag} style={{ marginTop: "0.5rem" }}>
              Create Tag
            </button>
          ) : (
            <button onClick={updateTag} style={{ marginTop: "0.5rem" }}>
              Update Tag
            </button>
          )}

          {editingTagDocId && (
            <button
              onClick={resetTagForm}
              style={{ marginLeft: "1rem", marginTop: "0.5rem" }}
            >
              Cancel
            </button>
          )}

          <hr style={{ margin: "1rem 0" }} />

          <h3>Existing Tags</h3>
          <ul>
            {tagList.map((t) => (
              <li key={t.docId} style={{ marginBottom: "0.5rem" }}>
                {t.name} (ID: {t.id})
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => handleEditTag(t.docId)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============ MENU BAR TAB ============ */}
      {activeTab === "menubar" && (
        <section style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h2>Menu Bar Management</h2>
          <div>
            <label>Menu Name: </label>
            <input
              style={blackInputStyle}
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />
          </div>
          <div>
            <label>Href: </label>
            <input
              style={blackInputStyle}
              value={menuHref}
              onChange={(e) => setMenuHref(e.target.value)}
            />
          </div>
          <div>
            <label>Menu ID: </label>
            <input
              style={blackInputStyle}
              value={menuIdValue}
              onChange={(e) => setMenuIdValue(e.target.value)}
            />
          </div>

          {!editingMenuDocId ? (
            <button onClick={createMenuItem} style={{ marginTop: "0.5rem" }}>
              Create Menu Item
            </button>
          ) : (
            <button onClick={updateMenuItem} style={{ marginTop: "0.5rem" }}>
              Update Menu Item
            </button>
          )}

          {editingMenuDocId && (
            <button
              onClick={resetMenuForm}
              style={{ marginLeft: "1rem", marginTop: "0.5rem" }}
            >
              Cancel
            </button>
          )}

          <hr style={{ margin: "1rem 0" }} />

          <h3>Existing Menu Items</h3>
          <ul>
            {menuList.map((m) => (
              <li key={m.docId} style={{ marginBottom: "0.5rem" }}>
                {m.name} – {m.href} (ID: {m.id})
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => handleEditMenuItem(m.docId)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
