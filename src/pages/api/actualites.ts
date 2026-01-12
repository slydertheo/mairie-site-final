import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

// Configuration pour accepter les grandes requêtes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
    responseLimit: '500mb',
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Possibilité de filtrer par afficherDans
    const { afficherDans } = req.query;
    let query = 'SELECT * FROM actualites';
    let params: any[] = [];
    
    if (afficherDans) {
      // Cherche si la valeur contient le tag (ex: "carrousel,calendrier")
      query += ' WHERE afficherDans LIKE ?';
      params.push(`%${afficherDans}%`);
    }
    
    query += ' ORDER BY date DESC';
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } else if (req.method === 'POST') {
    const { imgSrc, date, title, description, pdfUrl, id, action, afficherDans } = req.body;
    
    // Si action=update et id existe, c'est une mise à jour
    if (action === 'update' && id) {
      db.prepare(
        'UPDATE actualites SET imgSrc = ?, date = ?, title = ?, description = ?, pdfUrl = ?, afficherDans = ? WHERE id = ?'
      ).run(imgSrc, date, title, description, pdfUrl || null, afficherDans || 'carrousel', id);
      res.json({ success: true, id });
    } else {
      // Sinon c'est une création
      const result = db.prepare(
        'INSERT INTO actualites (imgSrc, date, title, description, pdfUrl, afficherDans) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(imgSrc, date, title, description, pdfUrl || null, afficherDans || 'carrousel');
      res.json({ success: true, id: result.lastInsertRowid });
    }
  } else if (req.method === 'PUT') {
    // Support explicite de PUT
    const { imgSrc, date, title, description, pdfUrl, id, afficherDans } = req.body;
    db.prepare(
      'UPDATE actualites SET imgSrc = ?, date = ?, title = ?, description = ?, pdfUrl = ?, afficherDans = ? WHERE id = ?'
    ).run(imgSrc, date, title, description, pdfUrl || null, afficherDans || 'carrousel', id);
    res.json({ success: true });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    db.prepare('DELETE FROM actualites WHERE id = ?').run(id);
    res.json({ success: true });
  } else {
    res.status(405).end();
  }
}