const fs = require('fs');
const Database = require('better-sqlite3');

// Read the SQL file
const sql = fs.readFileSync('./mairie.sql', 'utf8');

// Connect to the database (will create it if it doesn't exist)
const db = new Database(process.env.DB_PATH || './database/mairie.sqlite');

db.pragma('journal_mode = wal');

// Execute the SQL statements
db.exec(sql);

console.log('Database initialized successfully!');

// Close the database connection
db.close();