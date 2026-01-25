import { getUserWatchedMovies, unmarkWatched } from "$lib/server/watchlist";
import { getMoviesByIds, type Movie } from "$lib/server/tmdb";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, "/login");
	}

	let watchedMovies: Movie[] = [];
	let error = null;
	const searchQuery = url.searchParams.get("q") || "";

	try {
		const movieIds = getUserWatchedMovies(locals.user.id);
		
		// Filter by search query on client side with movie titles
		// (after we get full movie data from TMDB)
		let filteredIds = movieIds;
		if (searchQuery && movieIds.length > 0) {
			watchedMovies = await getMoviesByIds(movieIds);
			const matchingMovies = watchedMovies.filter(m =>
				m.title.toLowerCase().includes(searchQuery.toLowerCase())
			);
			filteredIds = matchingMovies.map(m => m.id);
			watchedMovies = matchingMovies;
		} else if (movieIds.length > 0) {
			watchedMovies = await getMoviesByIds(movieIds);
		}
	} catch (err) {
		console.error("Failed to fetch watched movies:", err);
		error = "Failed to load watched movies";
	}
	
	return {
		watchedMovies,
		error,
		user: locals.user,
		searchQuery
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
			unmarkWatched(locals.user.id, movieId);
			return { success: true };
		} catch (err) {
			console.error("Failed to unmark as watched:", err);
			return fail(500, { message: "Failed to unmark as watched" });
		}
	}
};
