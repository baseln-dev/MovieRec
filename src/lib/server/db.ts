import pg from "pg";

const { Pool } = pg;

// Use environment variable for database URL
const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/movierec";

const pool = new Pool({
	connectionString,
	ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// Wrapper to match SQLite-style API
class DatabaseRow {
	private data: any;
	
	constructor(row: any) {
		this.data = row;
	}
	
	number(index: number): number {
		const keys = Object.keys(this.data);
		return Number(this.data[keys[index]]);
	}
	
	string(index: number): string {
		const keys = Object.keys(this.data);
		return String(this.data[keys[index]]);
	}
	
	bytes(index: number): Uint8Array {
		const keys = Object.keys(this.data);
		return this.data[keys[index]];
	}
}

export const db = {
	query: async (sql: string, params: unknown[] = []): Promise<DatabaseRow[]> => {
		const result = await pool.query(sql, params);
		return result.rows.map(row => new DatabaseRow(row));
	},
	
	queryOne: async (sql: string, params: unknown[] = []): Promise<DatabaseRow | null> => {
		const result = await pool.query(sql, params);
		return result.rows.length > 0 ? new DatabaseRow(result.rows[0]) : null;
	},
	
	execute: async (sql: string, params: unknown[] = []): Promise<{ changes: number }> => {
		const result = await pool.query(sql, params);
		return { changes: result.rowCount || 0 };
	}
};
