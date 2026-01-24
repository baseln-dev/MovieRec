import sqlite3 from 'better-sqlite3';

const db = sqlite3('sqlite.db');

try {
  // Check if watchlist table exists
  const tableExists = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='watchlist'"
  ).get();

  if (!tableExists) {
    console.log('Creating watchlist table...');
    
    db.exec(`
      CREATE TABLE watchlist (
        user_id INTEGER NOT NULL REFERENCES user(id),
        movie_id INTEGER NOT NULL,
        added_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, movie_id)
      );
    `);
    
    db.exec(`
      CREATE INDEX watchlist_user_index ON watchlist(user_id);
    `);
    
    console.log('✓ Watchlist table created successfully');
  } else {
    console.log('✓ Watchlist table already exists');
  }
} catch (error) {
  console.error('Error creating watchlist table:', error);
  process.exit(1);
}

db.close();
