import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Non autorisé' });

  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
    // decoded contient les infos de l'utilisateur
    res.status(200).json({ message: 'Accès autorisé', user: decoded });
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
}