import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM actualites ORDER BY date DESC').all();
    res.json(rows);
  } else if (req.method === 'POST') {
    const { imgSrc, date, title, id, action } = req.body;
    
    // Si action=update et id existe, c'est une mise à jour
    if (action === 'update' && id) {
      db.prepare(
        'UPDATE actualites SET imgSrc = ?, date = ?, title = ? WHERE id = ?'
      ).run(imgSrc, date, title, id);
      res.json({ success: true, id });
    } else {
      // Sinon c'est une création
      const result = db.prepare(
        'INSERT INTO actualites (imgSrc, date, title) VALUES (?, ?, ?)'
      ).run(imgSrc, date, title);
      res.json({ success: true, id: result.lastInsertRowid });
    }
  } else if (req.method === 'PUT') {
    // Support explicite de PUT
    const { imgSrc, date, title, id } = req.body;
    db.prepare(
      'UPDATE actualites SET imgSrc = ?, date = ?, title = ? WHERE id = ?'
    ).run(imgSrc, date, title, id);
    res.json({ success: true });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    db.prepare('DELETE FROM actualites WHERE id = ?').run(id);
    res.json({ success: true });
  } else {
    res.status(405).end();
  }
}