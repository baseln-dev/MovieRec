import { db } from "$lib/server/db";
import fs from "fs";
import path from "path";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	try {
		const sqlPath = path.join(process.cwd(), "setup.sql");
		console.log("Looking for SQL file at:", sqlPath);
		
		if (!fs.existsSync(sqlPath)) {
			return new Response(`Error: setup.sql not found at ${sqlPath}`, { status: 500 });
		}
		
		const sql = fs.readFileSync(sqlPath, "utf-8");
		console.log("SQL file read successfully, length:", sql.length);
		
		// Split by semicolon and execute each statement
		const statements = sql.split(";").filter(stmt => stmt.trim());
		console.log("Found", statements.length, "SQL statements");
		
		for (let i = 0; i < statements.length; i++) {
			const statement = statements[i].trim();
			if (statement) {
				console.log(`Executing statement ${i + 1}/${statements.length}`);
				await db.execute(statement);
			}
		}
		
		console.log("Database initialization completed successfully");
		return new Response("Database initialized successfully!", { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error("Setup endpoint error:", message);
		return new Response(`Error: ${message}`, { status: 500 });
	}
};
