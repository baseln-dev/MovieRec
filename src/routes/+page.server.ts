import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import { getUserWatchedMovies } from "$lib/server/watchlist";
import { 
	getTrendingMovies, 
	getPopularMovies, 
	getMoviesByIds,
	getSimilarMovies,
	getMovieRecommendations,
	discoverMoviesByGenres,
	type Movie 
} from "$lib/server/tmdb";

import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";

interface MovieScore {
	movie: Movie;
	score: number;
}

export async function load(event: PageServerLoadEvent) {
	let recommendedMovies: Movie[] = [];
	let trendingMovies: Movie[] = [];
	let popularMovies: Movie[] = [];
	
	// Get personalized recommendations if user is logged in
	if (event.locals.user) {
		try {
			const watchedMovieIds = await getUserWatchedMovies(event.locals.user.id);
			
			if (watchedMovieIds.length > 0) {
				const watchedMovies = await getMoviesByIds(watchedMovieIds);
				
				// Analyze genre preferences
				const genreCount = new Map<number, number>();
				for (const movie of watchedMovies) {
					for (const genreId of movie.genre_ids || []) {
						genreCount.set(genreId, (genreCount.get(genreId) || 0) + 1);
					}
				}

				const topGenres = Array.from(genreCount.entries())
					.sort((a, b) => b[1] - a[1])
					.slice(0, 3)
					.map(([genreId]) => genreId);

				const recommendationMap = new Map<number, MovieScore>();

				// Get similar movies for recently watched (last 3)
				const recentMovies = watchedMovieIds.slice(0, 3);
				for (const movieId of recentMovies) {
					const similar = await getSimilarMovies(movieId);
					for (const movie of similar) {
						if (!watchedMovieIds.includes(movie.id)) {
							const current = recommendationMap.get(movie.id);
							if (current) {
								current.score += 3;
							} else {
								recommendationMap.set(movie.id, { movie, score: 3 });
							}
						}
					}
				}

				// Get TMDB recommendations
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

				// Discover by favorite genres
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

				recommendedMovies = Array.from(recommendationMap.values())
					.sort((a, b) => {
						if (b.score !== a.score) return b.score - a.score;
						return b.movie.popularity - a.movie.popularity;
					})
				.slice(0, 7)
					.map(item => item.movie);
			}
		} catch (error) {
			console.error("Failed to generate recommendations:", error);
		}
	}
	
	try {
		trendingMovies = (await getTrendingMovies("week")).slice(0, 7);
	} catch (error) {
		console.error("Failed to fetch trending movies for homepage:", error);
	}
	
	try {
		popularMovies = (await getPopularMovies()).slice(0, 7);
	} catch (error) {
		console.error("Failed to fetch popular movies for homepage:", error);
	}
	
	return {
		user: event.locals.user,
		recommendedMovies,
		trendingMovies,
		popularMovies
	};
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	if (event.locals.session === null) {
		return fail(401, {
			message: "Not authenticated"
		});
	}
	invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);
	return redirect(302, "/login");
}
