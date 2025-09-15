import multer from "multer";
import path from "path";

const upload = multer({ dest: "uploads/" });

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("file")(req, {}, err => {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de l'upload du fichier." });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ fileUrl });
    });
  } else {
    res.status(405).json({ error: "Méthode non autorisée." });
  }
}