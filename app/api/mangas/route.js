import fs from "fs";
import path from "path";

const filePath = path.resolve("database/mangas.json");

export async function GET() {
  const data = fs.readFileSync(filePath, "utf8");
  return new Response(data, { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req) {
  try {
    const newData = await req.json();
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    return new Response(JSON.stringify({ message: "Updated Successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update" }), { status: 500 });
  }
}
