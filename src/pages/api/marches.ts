import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM marches ORDER BY id DESC').all();
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    const { titre, texte, adresse, jour, horaires, produits, image } = req.body;
    const result = db.prepare(
      'INSERT INTO marches (titre, texte, adresse, jour, horaires, produits, image) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(titre, texte, adresse, jour, horaires, produits, image);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } else if (req.method === 'PUT') {
    const { id, titre, texte, adresse, jour, horaires, produits, image } = req.body;
    db.prepare(
      'UPDATE marches SET titre=?, texte=?, adresse=?, jour=?, horaires=?, produits=?, image=? WHERE id=?'
    ).run(titre, texte, adresse, jour, horaires, produits, image, id);
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    db.prepare('DELETE FROM marches WHERE id=?').run(id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}