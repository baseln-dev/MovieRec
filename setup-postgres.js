import pg from "pg";
import fs from "fs";

const { Pool } = pg;

// Use environment variable for database URL
const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/movierec";

const pool = new Pool({
	connectionString,
	ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
	try {
		console.log("Setting up PostgreSQL database...");
		
		const sql = fs.readFileSync("./setup.sql", "utf-8");
		
		// Execute the SQL schema
		await pool.query(sql);
		
		console.log("✓ Database tables created successfully");
		console.log("✓ Indexes created successfully");
		
		await pool.end();
	} catch (err) {
		console.error("Failed to set up database:", err);
		process.exit(1);
	}
}

setupDatabase();
