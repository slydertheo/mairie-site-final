import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const db = new Database(process.env.DB_PATH || './database/mairie.db');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Champs manquants' });

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND actif = 1').get(email);
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET || 'votre_secret_jwt',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role_id: user.role_id,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}