import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';  // Changez cette ligne

// Désactiver le parsing automatique du corps de la requête
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Créer un dossier public/uploads s'il n'existe pas déjà
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Erreur lors de la création du dossier uploads:', error);
  }

  try {
    // Créer et configurer un nouveau formulaire
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024 // 100 MB
    });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });
    
    // Vérifier si le fichier existe
    const fileField = files.file;
    if (!fileField) {
      return res.status(400).json({ error: 'Aucun fichier n\'a été fourni' });
    }

    // Accéder au fichier (en tenant compte de la structure de formidable v4)
    const file = Array.isArray(fileField) ? fileField[0] : fileField;
    
    // Vérifier que le chemin du fichier existe
    if (!file.filepath) {
      return res.status(500).json({ error: 'Fichier invalide' });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'document.pdf';
    const newFilename = `${timestamp}-${originalName}`;
    const newPath = path.join(uploadDir, newFilename);

    // Copier le fichier (plus fiable que de renommer)
    await fs.copyFile(file.filepath, newPath);
    
    // Supprimer le fichier temporaire
    try {
      await fs.unlink(file.filepath);
    } catch (err) {
      console.warn('Impossible de supprimer le fichier temporaire:', err);
    }

    // Renvoyer l'URL du fichier
    const fileUrl = `/uploads/${newFilename}`;
    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error('Erreur lors du traitement du fichier:', error);
    res.status(500).json({ error: 'Erreur lors du traitement du fichier' });
  }
}