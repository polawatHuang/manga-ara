import fs from "fs";
import path from "path";

// File path to tags.json
const tagsFilePath = path.join(process.cwd(), "database", "tags.json");

// Read tags data
const readTags = () => JSON.parse(fs.readFileSync(tagsFilePath, "utf-8"));

// Write tags data
const writeTags = (data) => fs.writeFileSync(tagsFilePath, JSON.stringify(data, null, 2), "utf-8");

export async function GET() {
  return Response.json(readTags());
}

export async function POST(req) {
  const newTag = await req.json();
  const tags = readTags();
  tags.push(newTag);
  writeTags(tags);
  return Response.json({ message: "Tag added successfully" });
}

export async function DELETE(req) {
  const { id } = await req.json();
  let tags = readTags();
  tags = tags.filter((t) => t.id !== id);
  writeTags(tags);
  return Response.json({ message: "Tag deleted successfully" });
}