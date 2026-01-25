import { db } from "./db";

export interface WatchedMovie {
	userId: number;
	movieId: number;
	watchedAt: Date;
}

export async function markAsWatched(userId: number, movieId: number): Promise<void> {
	const timestamp = Math.floor(Date.now() / 1000);
	await db.execute(
		"INSERT INTO watchlist (user_id, movie_id, added_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
		[userId, movieId, timestamp]
	);
}

export async function unmarkWatched(userId: number, movieId: number): Promise<void> {
	await db.execute("DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2", [userId, movieId]);
}

export async function isWatched(userId: number, movieId: number): Promise<boolean> {
	const row = await db.queryOne("SELECT 1 FROM watchlist WHERE user_id = $1 AND movie_id = $2", [
		userId,
		movieId
	]);
	return row !== null;
}

export async function getUserWatchedMovies(userId: number): Promise<number[]> {
	const rows = await db.query("SELECT movie_id FROM watchlist WHERE user_id = $1 ORDER BY added_at DESC", [
		userId
	]);
	const movieIds: number[] = [];
	for (const row of rows) {
		movieIds.push(row.number(0));
	}
	return movieIds;
}

export async function getWatchedMoviesWithTimestamps(userId: number): Promise<WatchedMovie[]> {
	const rows = await db.query(
		"SELECT user_id, movie_id, added_at FROM watchlist WHERE user_id = $1 ORDER BY added_at DESC",
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

export async function searchUserWatchedMovies(userId: number, searchQuery: string): Promise<number[]> {
	const searchPattern = `%${searchQuery}%`;
	const rows = await db.query(
		`SELECT DISTINCT w.movie_id 
		FROM watchlist w 
		WHERE w.user_id = $1 
		ORDER BY w.added_at DESC`,
		[userId]
	);
	
	const movieIds: number[] = [];
	for (const row of rows) {
		movieIds.push(row.number(0));
	}
	return movieIds;
}
