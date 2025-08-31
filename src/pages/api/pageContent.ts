import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page } = req.query;
    const rows = db.prepare('SELECT section, titre, contenu FROM page_contents WHERE page = ?').all(page);
    res.json(rows);
  } else if (req.method === 'POST') {
    const { page, section, titre, contenu } = req.body;
    if (!page || !section) return res.status(400).json({ error: 'page et section requis' });
    db.prepare(`
      INSERT INTO page_contents (page, section, titre, contenu)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(page, section) DO UPDATE SET titre=excluded.titre, contenu=excluded.contenu
    `).run(page, section, titre, contenu);
    res.json({ success: true });
  } else {
    res.status(405).end();
  }
}