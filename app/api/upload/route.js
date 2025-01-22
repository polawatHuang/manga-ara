import fs from "fs-extra";
import path from "path";
import formidable from "formidable";

// Ensure Next.js can handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public/images");
  form.keepExtensions = true;

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(
          Response.json({ error: "File upload failed" }, { status: 500 })
        );
      }

      const { mangaSlug, episode } = fields;
      const mangaPath = path.join(form.uploadDir, mangaSlug, `ep${episode}`);
      await fs.ensureDir(mangaPath);

      const fileArray = Object.values(files);
      fileArray.forEach((file) => {
        const filePath = path.join(mangaPath, file.originalFilename);
        fs.renameSync(file.filepath, filePath);
      });

      resolve(Response.json({ message: "Files uploaded successfully" }));
    });
  });
}
