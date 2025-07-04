import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const db = new Database(process.env.DB_PATH || './database/mairie.sqlite');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password, nom, prenom } = req.body;
  if (!email || !password || !nom || !prenom) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  const username = email.split('@')[0];
  const hash = bcrypt.hashSync(password, 10);

  try {
    db.prepare(
      `INSERT INTO users (username, password, email, nom, prenom, role_id) VALUES (?, ?, ?, ?, ?, 4)`
    ).run(username, hash, email, nom, prenom);
    const token = jwt.sign({ email, role: 'user' }, process.env.JWT_SECRET || 'votre_secret_jwt', {
      expiresIn: '1d',
    });
    res.status(201).json({ success: true, token });
  } catch (err: any) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}