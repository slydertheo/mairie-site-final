const Database = require('better-sqlite3');
const db = new Database('./database/mairie.sqlite');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const users = db.prepare('SELECT id, nom, prenom, email FROM users').all();
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const { nom, prenom, email, password } = req.body;
    db.prepare('INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)').run(nom, prenom, email, password);
    res.status(201).json({ success: true });
  } else if (req.method === 'PUT') {
    const { id, nom, prenom, email } = req.body;
    db.prepare('UPDATE users SET nom=?, prenom=?, email=? WHERE id=?').run(nom, prenom, email, id);
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    db.prepare('DELETE FROM users WHERE id=?').run(id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}