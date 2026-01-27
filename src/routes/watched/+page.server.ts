import { getUserWatchedMovies, unmarkWatched } from "$lib/server/watchlist";
import { getMoviesByIds, type Movie } from "$lib/server/tmdb";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

interface Stats {
	moviesWatched: number;
	hoursWatched: number;	minutesWatched: number;	favoriteGenre: string;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, "/login");
	}

	let watchedMovies: Movie[] = [];
	let error = null;
	let stats: Stats = {
		moviesWatched: 0,
		hoursWatched: 0,		minutesWatched: 0,		favoriteGenre: "N/A"
	};
	const searchQuery = url.searchParams.get("q") || "";

	try {
		const movieIds = await getUserWatchedMovies(locals.user.id);
		
		// Get all watched movies for stats calculation
		let allWatchedMovies: Movie[] = [];
		if (movieIds.length > 0) {
			allWatchedMovies = await getMoviesByIds(movieIds);
			
			// Calculate stats
			stats.moviesWatched = allWatchedMovies.length;
			
			// Calculate total hours and minutes (estimated using 110 minutes average)
			const totalMinutes = allWatchedMovies.reduce((acc, movie) => {
				// Estimate runtime as 110 minutes average if not available
				return acc + (110);
			}, 0);
			stats.hoursWatched = Math.floor(totalMinutes / 60);
			stats.minutesWatched = totalMinutes % 60;
			
			// Calculate favorite genre
			const genreCount = new Map<number, number>();
			for (const movie of allWatchedMovies) {
				// Handle both genre_ids and genres formats
				const genres = (movie as any).genres || movie.genre_ids || [];
				const genreIds = Array.isArray(genres) && genres.length > 0 && typeof genres[0] === 'object'
					? (genres as any[]).map(g => g.id)
					: genres as number[];
				
				for (const genreId of genreIds) {
					genreCount.set(genreId, (genreCount.get(genreId) || 0) + 1);
				}
			}
			
			// Genre ID to name mapping
			const genreMap: Record<number, string> = {
				28: "Action",
				12: "Adventure",
				16: "Animation",
				35: "Comedy",
				80: "Crime",
				99: "Documentary",
				18: "Drama",
				10751: "Family",
				14: "Fantasy",
				27: "Horror",
				36: "History",
				10402: "Music",
				9648: "Mystery",
				10749: "Romance",
				878: "Sci-Fi",
				10770: "TV Movie",
				53: "Thriller",
				10752: "War",
				37: "Western",
				10398: "Sports",
				10405: "Action & Adventure",
				10759: "Action & Adventure"
			};
			
			if (genreCount.size > 0) {
				const topGenreId = Array.from(genreCount.entries())
					.sort((a, b) => b[1] - a[1])[0][0];
				stats.favoriteGenre = genreMap[topGenreId] || "Unknown";
			}
		}
		
		// Filter by search query
		let filteredIds = movieIds;
		if (searchQuery && allWatchedMovies.length > 0) {
			const matchingMovies = allWatchedMovies.filter(m =>
				m.title.toLowerCase().includes(searchQuery.toLowerCase())
			);
			filteredIds = matchingMovies.map(m => m.id);
			watchedMovies = matchingMovies;
		} else {
			watchedMovies = allWatchedMovies;
		}
	} catch (err) {
		console.error("Failed to fetch watched movies:", err);
		error = "Failed to load watched movies";
	}
	
	return {
		watchedMovies,
		error,
		user: locals.user,
		searchQuery,
		stats
	};
};

export const actions: Actions = {
	remove: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { message: "Not authenticated" });
		}

		const formData = await request.formData();
		const movieId = parseInt(formData.get("movieId") as string);

		if (isNaN(movieId)) {
			return fail(400, { message: "Invalid movie ID" });
		}

		try {
			await unmarkWatched(locals.user.id, movieId);
			return { success: true };
		} catch (err) {
			console.error("Failed to unmark as watched:", err);
			return fail(500, { message: "Failed to unmark as watched" });
		}
	}
};
