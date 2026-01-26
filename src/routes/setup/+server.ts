import { db } from "$lib/server/db";
import fs from "fs";
import path from "path";

async function initializeDatabase() {
	const sqlPath = path.join(process.cwd(), "setup.sql");
	const sql = fs.readFileSync(sqlPath, "utf-8");
	
	// Split by semicolon and execute each statement
	const statements = sql.split(";").filter(stmt => stmt.trim());
	
	for (const statement of statements) {
		if (statement.trim()) {
			await db.execute(statement.trim());
		}
	}
}

export async function GET() {
	try {
		await initializeDatabase();
		return new Response("Database initialized successfully!", { status: 200 });
	} catch (error) {
		console.error("Database initialization failed:", error);
		return new Response(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 500 });
	}
}
