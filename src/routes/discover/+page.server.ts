import { getTrendingMovies } from "$lib/server/tmdb";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	try {
		const trendingMovies = await getTrendingMovies("week");
		
		return {
			movies: trendingMovies,
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
