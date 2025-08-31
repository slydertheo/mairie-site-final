import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Liste toutes les vacances
    const rows = db.prepare('SELECT id, titre, debut, fin FROM vacances ORDER BY debut ASC').all();
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    // Ajoute une période
    const { titre, debut, fin } = req.body;
    if (!titre || !debut || !fin) return res.status(400).json({ error: 'Champs manquants' });
    const result = db.prepare(
      'INSERT INTO vacances (titre, debut, fin) VALUES (?, ?, ?)'
    ).run(titre, debut, fin);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } else if (req.method === 'PUT') {
    // Modifie une période
    const { id, titre, debut, fin } = req.body;
    if (!id || !titre || !debut || !fin) return res.status(400).json({ error: 'Champs manquants' });
    db.prepare(
      'UPDATE vacances SET titre = ?, debut = ?, fin = ? WHERE id = ?'
    ).run(titre, debut, fin, id);
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    // Supprime une période
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    db.prepare('DELETE FROM vacances WHERE id = ?').run(id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}