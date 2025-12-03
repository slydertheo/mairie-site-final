import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

type NavbarImagesResponse = {
  images?: Record<string, string>;
  success?: boolean;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<NavbarImagesResponse>
) {
  if (req.method === 'GET') {
    try {
      const row = db.prepare('SELECT contenu FROM page_contents WHERE page = ? AND section = ?').get('navbar_images', 'images') as { contenu: string } | undefined;
      
      if (!row) {
        return res.status(200).json({ images: {} });
      }

      let images: Record<string, string> = {};
      try {
        images = JSON.parse(row.contenu);
      } catch (e) {
        console.error('Erreur parsing images:', e);
      }

      res.status(200).json({ images });
    } catch (error) {
      console.error('Erreur GET navbar-images:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'POST') {
    try {
      const { images } = req.body;
      
      if (!images || typeof images !== 'object') {
        return res.status(400).json({ error: 'Format de données invalide' });
      }

      const contenu = JSON.stringify(images);

      db.prepare(`
        INSERT INTO page_contents (page, section, titre, contenu)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(page, section) DO UPDATE SET contenu = excluded.contenu
      `).run('navbar_images', 'images', '', contenu);

      res.status(200).json({ success: true, images });
    } catch (error) {
      console.error('Erreur POST navbar-images:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}