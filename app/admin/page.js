"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
// All Firebase imports removed. Use REST API endpoints for data and uploads.
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
// import dayjs from "dayjs";
import { useRouter } from "next/navigation";
// import { arrayToString } from "@/utils/arrayToString";

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
  // Auth state
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      setLoading(false);
      return;
    }
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        } else {
          setEmail(data.user.email);
        }
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        setLoading(false);
      });
  }, [router]);

  // Only render admin page if authenticated
  if (loading) {
    return null; // Or a spinner if you prefer
  }

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
  const [advertiseList, setAdvertiseList] = useState([]);
  const [adName, setAdName] = useState("");
  const [adImageFile, setAdImageFile] = useState(null);
  const [editingAdId, setEditingAdId] = useState(null);

  // Fetch existing manga
  const fetchMangaList = async () => {
    try {
      const res = await fetch("/api/mangas");
      const data = await res.json();
      setMangaList(data.map(m => ({ ...m, docId: m.manga_id })));
    } catch (err) {
      console.error("Error fetching manga list:", err);
    }
  };

  // Fetch Advertisements - Not implemented in backend
  const fetchAdvertiseList = async () => {
    // TODO: Implement advertise API endpoint in backend
    setAdvertiseList([]);
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

  // Create Advertisement
  const createAd = async () => {
    alert("Advertisement feature not yet implemented in backend");
    // TODO: Implement /api/advertise endpoint in backend
  };

  // Load existing advertisement into form
  const handleEditAd = (adDocId) => {
    const found = advertiseList.find((ad) => ad.docId === adDocId);
    if (found) {
      setEditingAdId(adDocId);
      setAdName(found.name || "");
    }
  };

  // Update Advertisement
  const updateAd = async () => {
    alert("Advertisement feature not yet implemented in backend");
    // TODO: Implement /api/advertise endpoint in backend
  };

  // Delete Advertisement
  const deleteAd = async (adDocId) => {
    alert("Advertisement feature not yet implemented in backend");
    // TODO: Implement /api/advertise endpoint in backend
  };

  // Reset form
  const resetAdForm = () => {
    setEditingAdId(null);
    setAdName("");
    setAdImageFile(null);
  };

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // remove base64 prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const createManga = async () => {
    const formData = new FormData();
    formData.append('manga_name', mangaName);
    formData.append('manga_slug', mangaSlug);
    formData.append('manga_disc', mangaDescription);

    // Extract values from selectedTags array and convert them to an array of strings
    const tagValues = selectedTags.map(tag => tag.value);

    // If you need to convert it to the specific format "['aaa','bbb']"
    formData.append('tag_id', `['${tagValues.join("','")}']`);

    formData.append('manga_bg_img', mangaBackgroundFile);

    try {
      const res = await fetch('/api/mangas', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Manga created successfully!');
        resetMangaForm();
        fetchMangaList();
      } else {
        alert('Failed to create manga');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating manga');
    }
  };

  // Load existing manga into the form
  const handleEditManga = async (mangaId) => {
    try {
      const res = await fetch(`/api/mangas?id=${mangaId}`);
      if (!res.ok) {
        alert("Manga not found!");
        return;
      }
      const data = await res.json();
      setEditingMangaId(mangaId);
      setMangaName(data.manga_name || "");
      setMangaSlug(data.manga_slug || "");
      setMangaDescription(data.manga_disc || "");
      setMangaBackgroundFile(null);
      // Parse tag_id JSON string to array
      if (data.tag_id) {
        try {
          const tags = JSON.parse(data.tag_id);
          const preSelected = tags.map((t) => ({ value: t, label: t }));
          setSelectedTags(preSelected);
        } catch {
          setSelectedTags([]);
        }
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
      const formData = new FormData();
      formData.append('id', editingMangaId);
      formData.append('manga_name', mangaName);
      formData.append('manga_slug', mangaSlug);
      formData.append('manga_disc', mangaDescription);
      
      const tagValues = selectedTags.map(tag => tag.value);
      formData.append('tag_id', JSON.stringify(tagValues));
      
      if (mangaBackgroundFile) {
        formData.append('manga_bg_img', mangaBackgroundFile);
      }

      const res = await fetch('/api/mangas', {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        alert("Manga updated!");
        resetMangaForm();
        fetchMangaList();
      } else {
        alert("Failed to update manga");
      }
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
    const response = await fetch("/api/mangas");
    if (!response.ok) throw new Error("Failed to fetch manga data");

    const data = await response.json();
    setMangaForEpisodes(data);
  };

  const createEpisode = async () => {
    if (!selectedMangaId || !episodeNumber) {
      alert("Please select a manga and enter an episode number");
      return;
    }
  
    const formData = new FormData();
    formData.append('manga_name', selectedMangaSlug);  // Example: 'metamorphosis'
    formData.append('episode_number', episodeNumber);  // Example: 1
    formData.append('totalPage', episodeFiles ? episodeFiles.length : 0);  // Example: 10
    formData.append('view', 0);  // Example: 1
  
    // Append images to the form data
    for (let i = 0; i < episodeFiles.length; i++) {
      formData.append('episode_images', episodeFiles[i]);
    }
  
    try {
      const response = await fetch('https://manga.cipacmeeting.com/api/episode', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        await response.json();
        alert('Episode created successfully!');
      } else {
        alert('Failed to create episode');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating episode');
    }
  };  

  const handleSelectMangaForEpisode = (mangaId) => {
    setSelectedMangaId(mangaId);
    const found = mangaForEpisodes.find((m) => m.docId === mangaId);
    if (found) {
      setSelectedMangaSlug(found.name || "");
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
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTagList(data.map(t => ({ ...t, docId: t.tag_id })));
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const createTag = async () => {
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName }),
      });
      
      if (res.ok) {
        resetTagForm();
        alert("Tag created!");
        fetchTagList();
      } else {
        const error = await res.json();
        alert(error.error || "Error creating tag");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating tag");
    }
  };

  const handleEditTag = async (tagId) => {
    try {
      const tag = tagList.find(t => t.tag_id === tagId);
      if (!tag) {
        alert("Tag not found!");
        return;
      }
      setEditingTagDocId(tagId);
      setTagName(tag.name || "");
    } catch (err) {
      console.error(err);
      alert("Error fetching tag");
    }
  };

  const updateTag = async () => {
    if (!editingTagDocId) return;
    try {
      const res = await fetch(`/api/tags/${editingTagDocId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag_name: tagName }),
      });
      
      if (res.ok || res.status === 204) {
        alert("Tag updated!");
        resetTagForm();
        fetchTagList();
      } else {
        alert("Error updating tag");
      }
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
    try {
      const res = await fetch("/api/menubar");
      const data = await res.json();
      setMenuList(data.map(m => ({ ...m, docId: m.menu_id })));
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const createMenuItem = async () => {
    try {
      const res = await fetch("/api/menubar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: menuName,
          href: menuHref,
          id: Number(menuIdValue),
          is_active: true
        }),
      });
      
      if (res.ok) {
        resetMenuForm();
        alert("Menu item created!");
        fetchMenuList();
      } else {
        const error = await res.json();
        alert(error.error || "Error creating menu item");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating menu item");
    }
  };

  const handleEditMenuItem = async (menuId) => {
    try {
      const menu = menuList.find(m => m.menu_id === menuId);
      if (!menu) {
        alert("Menu item not found!");
        return;
      }
      setEditingMenuDocId(menuId);
      setMenuName(menu.name || "");
      setMenuHref(menu.href || "");
      setMenuIdValue(menu.id?.toString() || "");
    } catch (err) {
      console.error(err);
      alert("Error fetching menu item");
    }
  };

  const updateMenuItem = async () => {
    if (!editingMenuDocId) return;
    try {
      const res = await fetch(`/api/menubar/${editingMenuDocId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: menuName,
          href: menuHref,
          id: Number(menuIdValue),
        }),
      });
      
      if (res.ok || res.status === 204) {
        alert("Menu item updated!");
        resetMenuForm();
        fetchMenuList();
      } else {
        alert("Error updating menu item");
      }
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

  const deleteTag = async (tagId) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Tag deleted successfully!");
        fetchTagList();
      } else {
        const error = await res.json();
        alert(error.error || "Error deleting tag");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting tag");
    }
  };

  const deleteMenuItem = async (menuId) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const res = await fetch(`/api/menubar/${menuId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Menu item deleted successfully!");
        fetchMenuList();
      } else {
        const error = await res.json();
        alert(error.error || "Error deleting menu item");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting menu item");
    }
  };

  const deleteManga = async (mangaId) => {
    if (!confirm("Are you sure you want to delete this manga?")) return;
    try {
      const res = await fetch(`/api/mangas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mangaId }),
      });
      
      if (res.ok) {
        alert("Manga deleted successfully!");
        fetchMangaList();
      } else {
        const error = await res.json();
        alert(error.error || "Error deleting manga");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting manga");
    }
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
    fetchAdvertiseList();
  }, []);

  /* ======================
   * RENDER
   * ====================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="p-4 md:px-0 md:max-w-6xl mx-auto">
      <h1>Admin Page</h1>

      <div className="flex items-cneter justify-between mb-4">
        {email && <p className="text-lg">Welcome, {email}</p>}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

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
        <button
          className={clsx(
            activeTab === "advertise" ? "bg-gray-700" : "bg-gray-500",
            "px-4 py-1 hover:bg-gray-600 rounded-t-md"
          )}
          onClick={() => setActiveTab("advertise")}
        >
          Advertises
        </button>
      </div>

      {/* ============ MANGA TAB ============ */}
      {activeTab === "manga" && (
        <section>
          <div className="p-4 bg-gray-700 mb-4 relative">
            <h2 className="mb-6">การจัดการ Manga</h2>
            <div className="mb-4 flex gap-2 items-center">
              <label>ชื่อเรื่อง:</label>
              <input
                style={blackInputStyle}
                value={mangaName}
                className="px-2 max-w-[30vw] h-[36px] rounded-[4px]"
                placeholder="กรุณาใส่ชื่อเรื่อง"
                onChange={(e) => {
                  setMangaName(e.target.value);
                  setMangaSlug(
                    e.target.value.toLowerCase().replace(/\s+/g, "-")
                  );
                }}
              />
            </div>
            <div className="mb-4 flex gap-2 items-center">
              <label>Slug: </label>
              <input
                style={blackInputStyle}
                value={mangaSlug}
                className="px-2 h-[36px] rounded-[4px]"
                placeholder="กรุณาใส่ชื่อ URL ของเรื่องนี้"
                onChange={(e) => setMangaSlug(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-4">
              <label>เรื่องย่อ: </label>
              <textarea
                style={blackInputStyle}
                value={mangaDescription}
                className="px-2 rounded-[4px]"
                placeholder="กรุณาใส่เรื่องย่อ"
                onChange={(e) => setMangaDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-4 items-center">
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
            <div className="mb-4 flex gap-2 items-center">
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
                className="h-[36px] bg-gray-500 pl-10 pr-4 rounded-full"
              />
            </div>
            <ul className="p-4 bg-gray-500">
              {mangaList.filter((item) =>
                item.name.toLowerCase().includes(searchKeyword.toLowerCase())
              ).length === 0 ? (
                <li>ขออภัยด้วยค่ะ! ไม่มีชื่อเรื่องดังกล่าว</li>
              ) : null}
              {mangaList
                .filter((item) =>
                  item.name.toLowerCase().includes(searchKeyword.toLowerCase())
                )
                .map((m, index) => (
                  <li key={m.docId} className="mb-[0.5rem]">
                    <strong>{m.name}</strong>
                    <button
                      className="ml-[1rem] rounded-full bg-blue-500 hover:bg-blue-600 px-4"
                      onClick={() => handleEditManga(m.docId)}
                    >
                      Edit
                    </button>
                    {index + 1 !==
                      mangaList.filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchKeyword.toLowerCase())
                      ).length && (
                        <div className="h-[1px] w-full bg-gray-400 my-4" />
                      )}
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
          <div className="mb-4 flex gap-2 items-center">
            <label>ชื่อเรื่อง: </label>
            <select
              style={blackInputStyle}
              className="h-[36px] rounded-[4px] px-2"
              onChange={(e) => handleSelectMangaForEpisode(e.target.value)}
              value={selectedMangaId}
            >
              <option style={blackInputStyle} value="">
                เลือกชื่อเรื่องที่ต้องการ
              </option>
              {mangaForEpisodes.map((m) => (
                <option style={blackInputStyle} key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex gap-2 items-center">
            <label>เลข Episode: </label>
            <input
              type="number"
              className="px-2 h-[36px] rounded-[4px]"
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
          <button
            onClick={createEpisode}
            className="px-4 py-2 bg-green-600 hover:bg-green-700"
          >
            Create Episode
          </button>
        </section>
      )}

      {/* ============ TAGS TAB ============ */}
      {activeTab === "tags" && (
        <section>
          <div className="p-4 bg-gray-700 mb-4">
            <h2 className="mb-4">การจัดการ Tag</h2>
            <div className="mb-4 flex gap-2 items-center">
              <label>ชื่อ Tag: </label>
              <input
                style={blackInputStyle}
                value={tagName}
                placeholder="กรุณาใส่ชื่อ Tag"
                className="px-2 h-[36px] rounded-[4px]"
                onChange={(e) => setTagName(e.target.value)}
              />
            </div>
            <div className="hidden">
              <label>Tag ID: </label>
              <input
                style={blackInputStyle}
                value={tagIdValue === "" ? tagList.length + 1 : tagIdValue}
                onChange={(e) => setTagIdValue(e.target.value)}
              />
            </div>

            {!editingTagDocId ? (
              <button
                onClick={createTag}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 mt-[1rem]"
              >
                Create Tag
              </button>
            ) : (
              <button
                onClick={updateTag}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 mt-[1rem]"
              >
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
          </div>

          <div className="p-4 bg-gray-700 mb-4">
            <h3 className="mb-4">Existing Tags</h3>
            <div className="p-4 bg-gray-500">
              <ul>
                {tagList.map((t, index) => (
                  <li key={t.tag_id} style={{ marginBottom: "0.5rem" }}>
                    {t.name}
                    <button
                      className="ml-[1rem] px-2 bg-blue-500 hover:bg-blue-600 rounded-full"
                      onClick={() => handleEditTag(t.tag_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-[1rem] px-2 bg-red-500 hover:bg-red-600 rounded-full"
                      onClick={() => deleteTag(t.tag_id)}
                    >
                      Delete
                    </button>
                    {index + 1 !== tagList.length ? (
                      <div className="w-full h-[1px] bg-gray-400 my-4" />
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ============ MENU BAR TAB ============ */}
      {activeTab === "menubar" && (
        <section>
          <div className="p-4 bg-gray-700 mb-4">
            <h2 className="mb-4">การจัดการ Menu Bar</h2>
            <div className="mb-4 flex gap-2 items-center">
              <label>ชื่อ Menu: </label>
              <input
                style={blackInputStyle}
                value={menuName}
                placeholder="กรุณาตั้งชื่อเมนู"
                className="px-2 rounded-[4px] h-[36px]"
                onChange={(e) => setMenuName(e.target.value)}
              />
            </div>
            <div className="mb-4 flex gap-2 items-center">
              <label>Href: </label>
              <input
                style={blackInputStyle}
                value={menuHref}
                placeholder="ตั้งชื่อ Link นี้"
                className="px-2 rounded-[4px] h-[36px]"
                onChange={(e) => setMenuHref(e.target.value)}
              />
            </div>
            <div className="mb-4 flex gap-2 items-center hidden">
              <label>Menu ID: </label>
              <input
                style={blackInputStyle}
                value={menuIdValue === "" ? menuList.length + 1 : menuIdValue}
                className="px-2 rounded-[4px] h-[36px]"
                onChange={(e) => setMenuIdValue(e.target.value)}
              />
            </div>

            {!editingMenuDocId ? (
              <button
                onClick={createMenuItem}
                className="mt-[0.5rem] px-4 py-2 bg-green-500 hover:bg-green-600"
              >
                Create Menu Item
              </button>
            ) : (
              <button
                onClick={updateMenuItem}
                className="mt-[0.5rem] px-4 py-2 bg-orange-500 hover:bg-orange-600"
              >
                Update Menu Item
              </button>
            )}

            {editingMenuDocId && (
              <button
                onClick={resetMenuForm}
                className="mt-[0.5rem] px-4 py-2 bg-red-500 hover:bg-red-600 ml-4"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="p-4 bg-gray-700 mb-4">
            <h3 className="mb-4">Existing Menu Items</h3>
            <div className="p-4 bg-gray-500 ">
              <ul>
                {menuList.map((m, index) => (
                  <li key={m.menu_id} style={{ marginBottom: "0.5rem" }}>
                    {m.name} - {m.href}
                    <button
                      className="ml-[1rem] px-2 rounded-full bg-blue-500 hover:bg-blue-600"
                      onClick={() => handleEditMenuItem(m.menu_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-[1rem] px-2 rounded-full bg-red-500 hover:bg-red-600"
                      onClick={() => deleteMenuItem(m.menu_id)}
                    >
                      Delete
                    </button>
                    {index + 1 !== menuList.length ? (
                      <div className="w-full h-[1px] bg-gray-400 my-4" />
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ============ ADVERTISE TAB ============ */}
      {activeTab === "advertise" && (
        <section>
          <div className="p-4 bg-gray-700 mb-4">
            <h2 className="mb-4">Manage Advertisements</h2>
            <div className="mb-4 flex gap-2 items-center">
              <label>Name:</label>
              <input
                value={adName}
                className="px-2 rounded-[4px] h-[36px] text-black"
                placeholder="ตั้งชื่อโฆษณา"
                onChange={(e) => setAdName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label>Upload รูปโฆษณา: </label>
              <input
                type="file"
                onChange={(e) => setAdImageFile(e.target.files[0])}
              />
            </div>
            {!editingAdId ? (
              <button
                onClick={createAd}
                className="px-4 py-2 bg-green-500 hover:bg-green-600"
              >
                Create Ad
              </button>
            ) : (
              <button
                onClick={updateAd}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600"
              >
                Update Ad
              </button>
            )}
            {editingAdId && (
              <button
                onClick={resetAdForm}
                className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="p-4 bg-gray-700">
            <h3 className="mb-4">Existing Advertisements</h3>
            <ul className="p-4">
              {advertiseList.map((ad) => (
                <li
                  key={ad.docId}
                  className="mb-4 bg-gray-500 p-4 flex justify-between"
                >
                  <div>
                    <strong>{ad.name}</strong>
                    {ad.image && (
                      <img
                        src={ad.image}
                        alt={ad.name}
                        className="h-16 w-auto mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => handleEditAd(ad.docId)}
                      className="mr-2 px-4 bg-blue-500 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAd(ad.docId)}
                      className="px-4 bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
