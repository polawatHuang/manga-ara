const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/test-connection`;

export async function GET() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error("[API ERROR]", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
