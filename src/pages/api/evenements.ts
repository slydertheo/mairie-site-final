import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const rows = db.prepare('SELECT id, titre, date, description, lieu FROM evenements ORDER BY date ASC').all();
    res.json(rows);
  } else if (req.method === 'POST') {
    const { titre, date, description, lieu } = req.body;
    const result = db.prepare(
      'INSERT INTO evenements (titre, date, description, lieu) VALUES (?, ?, ?, ?)'
    ).run(titre, date, description, lieu);
    res.json({ success: true, id: result.lastInsertRowid });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    db.prepare('DELETE FROM evenements WHERE id = ?').run(id);
    res.json({ success: true });
  } else {
    res.status(405).end();
  }
}