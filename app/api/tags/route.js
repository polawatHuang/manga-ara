const API_URL = "https://www.mangaara.com/api/tags";

// ✅ GET: Fetch all tags from REST API and rename tag_name → name
export async function GET() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const rawTags = await response.json();
    const tags = rawTags.map(tag => ({
      id: tag.tag_id,
      name: tag.tag_name,
    }));

    return Response.json(tags);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: Add a new tag via REST API (convert name → tag_name)
export async function POST(req) {
  try {
    const data = await req.json();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag_name: data.name }),
    });

    const result = await response.json();
    return Response.json({ message: "Tag added successfully", ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: Delete a tag via REST API
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return Response.json({ message: "Tag deleted successfully" });
    } else {
      const error = await response.json();
      return Response.json({ error: error.message }, { status: response.status });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}