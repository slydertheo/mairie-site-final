import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page } = req.query;
    if (!page) return res.status(400).json({ error: 'Paramètre page manquant' });
    const rows = db.prepare('SELECT section, titre, contenu FROM page_contents WHERE page = ?').all(page);
    const result: Record<string, any> = {};
    rows.forEach(row => {
      // On parse le contenu si possible (pour les tableaux/objets)
      let parsed;
      try {
        parsed = JSON.parse(row.contenu);
      } catch {
        parsed = row.contenu;
      }
      result[row.section] = parsed;
    });
    res.status(200).json([result]);
  } else if (req.method === 'POST') {
    const { page, ...content } = req.body;
    if (!page) return res.status(400).json({ error: 'Paramètre page manquant' });
    Object.entries(content).forEach(([section, value]) => {
      const titre = value && typeof value === 'object' && 'titre' in value ? value.titre : '';
      const contenu = typeof value === 'string' ? value : JSON.stringify(value);
      db.prepare(`
        INSERT INTO page_contents (page, section, titre, contenu)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(page, section) DO UPDATE SET titre=excluded.titre, contenu=excluded.contenu, derniere_modification=CURRENT_TIMESTAMP
      `).run(page, section, titre, contenu);
    });
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}