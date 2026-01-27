import { getUserWatchedMovies } from "$lib/server/watchlist";
import { 
	getMoviesByIds, 
	getSimilarMovies, 
	getMovieRecommendations,
	discoverMoviesByGenres,
	type Movie 
} from "$lib/server/tmdb";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

interface MovieScore {
	movie: Movie;
	score: number;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/login");
	}

	let recommendations: Movie[] = [];
	let error = null;

	try {
		// Get user's watched movies
		const watchedMovieIds = await getUserWatchedMovies(locals.user.id);
		
		if (watchedMovieIds.length === 0) {
			return {
				recommendations: [],
				error: null,
				user: locals.user,
				message: "Watch some movies to get personalized recommendations!"
			};
		}

		// Get full details of watched movies (to analyze genres)
		const watchedMovies = await getMoviesByIds(watchedMovieIds);
		
		// Analyze genre preferences
		const genreCount = new Map<number, number>();
		for (const movie of watchedMovies) {
			for (const genreId of movie.genre_ids || []) {
				genreCount.set(genreId, (genreCount.get(genreId) || 0) + 1);
			}
		}

		// Get top genres (sorted by frequency)
		const topGenres = Array.from(genreCount.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.map(([genreId]) => genreId);

		// Fetch recommendations from multiple sources
		const recommendationMap = new Map<number, MovieScore>();

		// 1. Get similar movies for recently watched
		const recentMovies = watchedMovieIds.slice(0, 5);
		for (const movieId of recentMovies) {
			const similar = await getSimilarMovies(movieId);
			for (const movie of similar) {
				if (!watchedMovieIds.includes(movie.id)) {
					const current = recommendationMap.get(movie.id);
					if (current) {
						current.score += 3; // Boost score for each occurrence
					} else {
						recommendationMap.set(movie.id, { movie, score: 3 });
					}
				}
			}
		}

		// 2. Get TMDB recommendations for recently watched
		for (const movieId of recentMovies) {
			const tmdbRecs = await getMovieRecommendations(movieId);
			for (const movie of tmdbRecs) {
				if (!watchedMovieIds.includes(movie.id)) {
					const current = recommendationMap.get(movie.id);
					if (current) {
						current.score += 2;
					} else {
						recommendationMap.set(movie.id, { movie, score: 2 });
					}
				}
			}
		}

		// 3. Discover popular movies in user's favorite genres
		if (topGenres.length > 0) {
			const genreMovies = await discoverMoviesByGenres(topGenres);
			for (const movie of genreMovies) {
				if (!watchedMovieIds.includes(movie.id)) {
					const current = recommendationMap.get(movie.id);
					if (current) {
						current.score += 1;
					} else {
						recommendationMap.set(movie.id, { movie, score: 1 });
					}
				}
			}
		}

		// Sort by score and return top recommendations
		recommendations = Array.from(recommendationMap.values())
			.sort((a, b) => {
				// Primary sort: by score
				if (b.score !== a.score) {
					return b.score - a.score;
				}
				// Secondary sort: by popularity
				return b.movie.popularity - a.movie.popularity;
			})
			.slice(0, 20)
			.map(item => item.movie);

	} catch (err) {
		console.error("Failed to generate recommendations:", err);
		error = "Failed to load recommendations";
	}
	
	return {
		recommendations,
		error,
		user: locals.user,
		message: null
	};
};
