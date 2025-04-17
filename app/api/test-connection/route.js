// pages/api/test-connection.js
import db from "@/utils/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT NOW() AS time");
    return Response.json({ server_time: rows[0].time });
  } catch (err) {
    console.error("[DB ERROR]", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
