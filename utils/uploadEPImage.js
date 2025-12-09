// uploadImages.js
export const uploadImages = async (files, { mangaSlug, episode }) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });
  formData.append("mangaSlug", mangaSlug);
  formData.append("episode", episode);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Upload failed");
    return result;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};
