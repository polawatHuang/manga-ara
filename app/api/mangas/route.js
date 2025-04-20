const API_URL = "https://www.mangaara.com/api/mangas";

// ✅ GET: Fetch all mangas
export async function GET() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const rawMangas = await response.json();
    const mangas = rawMangas.map(manga => ({
      id: manga.manga_id,
      name: manga.manga_name,
      slug: manga.manga_slug,
      description: manga.manga_disc,
      backgroundImage: manga.manga_bg_img,
      tag: manga.tag_id,
      view: manga.view,
      createdAt: manga.created_at,
      updatedAt: manga.updated_at,
    }));

    return Response.json(mangas);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: Add a new manga
export async function POST(req) {
  try {
    const data = await req.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manga_name: data.name,
        manga_slug: data.slug,
        manga_disc: data.description,
        manga_bg_img: data.backgroundImage,
        tag_id: data.tag,
      }),
    });

    const result = await response.json();
    return Response.json({ message: "Manga added successfully", ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT: Update an existing manga
export async function PUT(req) {
  try {
    const { id, ...updated } = await req.json();

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manga_name: updated.name,
        manga_slug: updated.slug,
        manga_disc: updated.description,
        manga_bg_img: updated.backgroundImage,
        tag_id: updated.tag,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return Response.json({ message: "Manga updated successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: Remove a manga
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return Response.json({ message: "Manga deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}