import { db } from "./db";

export interface WatchlistItem {
	userId: number;
	movieId: number;
	addedAt: Date;
}

export function addToWatchlist(userId: number, movieId: number): void {
	const timestamp = Math.floor(Date.now() / 1000);
	db.execute(
		"INSERT OR IGNORE INTO watchlist (user_id, movie_id, added_at) VALUES (?, ?, ?)",
		[userId, movieId, timestamp]
	);
}

export function removeFromWatchlist(userId: number, movieId: number): void {
	db.execute("DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?", [userId, movieId]);
}

export function isInWatchlist(userId: number, movieId: number): boolean {
	const row = db.queryOne("SELECT 1 FROM watchlist WHERE user_id = ? AND movie_id = ?", [
		userId,
		movieId
	]);
	return row !== null;
}

export function getUserWatchlist(userId: number): number[] {
	const rows = db.query("SELECT movie_id FROM watchlist WHERE user_id = ? ORDER BY added_at DESC", [
		userId
	]);
	const movieIds: number[] = [];
	for (const row of rows) {
		movieIds.push(row.number(0));
	}
	return movieIds;
}

export function getWatchlistWithTimestamps(userId: number): WatchlistItem[] {
	const rows = db.query(
		"SELECT user_id, movie_id, added_at FROM watchlist WHERE user_id = ? ORDER BY added_at DESC",
		[userId]
	);
	const items: WatchlistItem[] = [];
	for (const row of rows) {
		items.push({
			userId: row.number(0),
			movieId: row.number(1),
			addedAt: new Date(row.number(2) * 1000)
		});
	}
	return items;
}
