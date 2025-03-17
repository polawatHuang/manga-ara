const filterMangaItems = (tags = [], updatedDate = "", itemLimit = "all", apiResponse) => {

  let filteredItems = apiResponse.filter((item) => {
    // Filter by tags (if provided)
    const matchesTags =
      tags.length === 0 || tags.some((tag) => item.tag.includes(tag));

    // Filter by updated_date (if provided)
    const matchesUpdatedDate =
      !updatedDate || item.updated_date === updatedDate;

    return matchesTags && matchesUpdatedDate;
  });

  // Handle the itemLimit parameter
  if (itemLimit !== "all") {
    const limit = parseInt(itemLimit, 10);
    if (!isNaN(limit) && limit > 0) {
      filteredItems = filteredItems.slice(0, limit);
    }
  }

  return filteredItems;
};

export default filterMangaItems;
