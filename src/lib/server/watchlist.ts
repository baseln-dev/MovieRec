import { db } from "./db";

export interface WatchedMovie {
	userId: number;
	movieId: number;
	watchedAt: Date;
}

export function markAsWatched(userId: number, movieId: number): void {
	const timestamp = Math.floor(Date.now() / 1000);
	db.execute(
		"INSERT OR IGNORE INTO watchlist (user_id, movie_id, added_at) VALUES (?, ?, ?)",
		[userId, movieId, timestamp]
	);
}

export function unmarkWatched(userId: number, movieId: number): void {
	db.execute("DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?", [userId, movieId]);
}

export function isWatched(userId: number, movieId: number): boolean {
	const row = db.queryOne("SELECT 1 FROM watchlist WHERE user_id = ? AND movie_id = ?", [
		userId,
		movieId
	]);
	return row !== null;
}

export function getUserWatchedMovies(userId: number): number[] {
	const rows = db.query("SELECT movie_id FROM watchlist WHERE user_id = ? ORDER BY added_at DESC", [
		userId
	]);
	const movieIds: number[] = [];
	for (const row of rows) {
		movieIds.push(row.number(0));
	}
	return movieIds;
}

export function getWatchedMoviesWithTimestamps(userId: number): WatchedMovie[] {
	const rows = db.query(
		"SELECT user_id, movie_id, added_at FROM watchlist WHERE user_id = ? ORDER BY added_at DESC",
		[userId]
	);
	const items: WatchedMovie[] = [];
	for (const row of rows) {
		items.push({
			userId: row.number(0),
			movieId: row.number(1),
			watchedAt: new Date(row.number(2) * 1000)
		});
	}
	return items;
}

export function searchUserWatchedMovies(userId: number, searchQuery: string): number[] {
	const searchPattern = `%${searchQuery}%`;
	const rows = db.query(
		`SELECT DISTINCT w.movie_id 
		FROM watchlist w 
		WHERE w.user_id = ? 
		ORDER BY w.added_at DESC`,
		[userId]
	);
	
	const movieIds: number[] = [];
	for (const row of rows) {
		movieIds.push(row.number(0));
	}
	return movieIds;
}
