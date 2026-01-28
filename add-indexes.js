import pg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

async function addIndexes() {
	const databaseUrl = process.env.DATABASE_URL;

	if (!databaseUrl) {
		console.error("DATABASE_URL environment variable is not set");
		process.exit(1);
	}

	const pool = new Pool({
		connectionString: databaseUrl
	});

	try {
		console.log("Adding indexes to watchlist table...");
		
		const sql = readFileSync(join(__dirname, "add-watchlist-indexes.sql"), "utf-8");
		
		await pool.query(sql);
		
		console.log("✓ Indexes added successfully!");
		
		// Verify indexes were created
		const result = await pool.query(`
			SELECT indexname, indexdef 
			FROM pg_indexes 
			WHERE tablename = 'watchlist' 
			ORDER BY indexname;
		`);
		
		console.log("\nCurrent indexes on watchlist table:");
		result.rows.forEach(row => {
			console.log(`  - ${row.indexname}`);
		});
		
	} catch (error) {
		console.error("Failed to add indexes:", error);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

addIndexes();
