import { getTrendingMovies } from "$lib/server/tmdb";
import { getUserWatchedMovies } from "$lib/server/watchlist";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import type { Movie } from "$lib/server/tmdb";

interface TMDBResponse {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/login");
	}

	try {
		const [watchedMovieIds] = await Promise.all([
			getUserWatchedMovies(locals.user.id)
		]);

		// Fetch multiple pages of trending movies to ensure we get 16 unwatched ones
		let unwatchedMovies: Movie[] = [];
		let page = 1;
		const apiKey = env.TMDB_API_KEY;
		
		while (unwatchedMovies.length < 16 && page <= 3) {
			const response = await fetch(
				`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}`,
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			if (!response.ok) {
				break;
			}

			const data: TMDBResponse = await response.json();
			
			// Add unwatched movies until we have 16
			for (const movie of data.results) {
				if (!watchedMovieIds.includes(movie.id)) {
					unwatchedMovies.push(movie);
					if (unwatchedMovies.length === 16) {
						break;
					}
				}
			}
			
			page++;
		}
		
		return {
			movies: unwatchedMovies,
			error: null
		};
	} catch (error) {
		console.error("Failed to fetch trending movies:", error);
		return {
			movies: [],
			error: error instanceof Error ? error.message : "Failed to fetch movies"
		};
	}
};
