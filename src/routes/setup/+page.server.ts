import { db } from "$lib/server/db";
import fs from "fs";
import path from "path";

export async function load() {
	try {
		const sqlPath = path.join(process.cwd(), "setup.sql");
		console.log("Looking for SQL file at:", sqlPath);
		
		if (!fs.existsSync(sqlPath)) {
			return {
				error: `setup.sql not found at ${sqlPath}`
			};
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
		return {
			success: true,
			message: "Database initialized successfully!"
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error("Setup error:", message);
		return {
			error: message
		};
	}
}
