import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

const db = new Database('./database/mairie.sqlite');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const rows = db.prepare('SELECT * FROM commerces ORDER BY categorie, nom').all();
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    const { nom, description, adresse, telephone, horaires, image, site, categorie } = req.body;
    if (!nom || !categorie) return res.status(400).json({ error: 'Champs obligatoires manquants' });
    const result = db.prepare(
      'INSERT INTO commerces (nom, description, adresse, telephone, horaires, image, site, categorie) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(nom, description, adresse, telephone, horaires, image, site, categorie);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } else if (req.method === 'PUT') {
    const { id, nom, description, adresse, telephone, horaires, image, site, categorie } = req.body;
    if (!id || !nom || !categorie) return res.status(400).json({ error: 'Champs obligatoires manquants' });
    db.prepare(
      'UPDATE commerces SET nom=?, description=?, adresse=?, telephone=?, horaires=?, image=?, site=?, categorie=? WHERE id=?'
    ).run(nom, description, adresse, telephone, horaires, image, site, categorie, id);
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID manquant' });
    db.prepare('DELETE FROM commerces WHERE id=?').run(id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}