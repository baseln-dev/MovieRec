import sqlite3 from 'better-sqlite3';
import { readFileSync } from 'fs';

const db = sqlite3('sqlite.db');
const sql = readFileSync('setup.sql', 'utf-8');

// Split by ; and execute each statement
const statements = sql.split(';').filter(s => s.trim());
for (const statement of statements) {
  db.exec(statement);
}

console.log('Database initialized successfully');
