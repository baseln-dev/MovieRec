import { getUserWatchlist, removeFromWatchlist } from "$lib/server/watchlist";
import { getMoviesByIds } from "$lib/server/tmdb";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/login");
	}

	let watchlistMovies = [];
	let error = null;

	try {
		const movieIds = getUserWatchlist(locals.user.id);
		if (movieIds.length > 0) {
			watchlistMovies = await getMoviesByIds(movieIds);
		}
	} catch (err) {
		console.error("Failed to fetch watchlist movies:", err);
		error = "Failed to load watchlist movies";
	}
	
	return {
		watchlistMovies,
		error,
		user: locals.user
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
			removeFromWatchlist(locals.user.id, movieId);
			return { success: true };
		} catch (err) {
			console.error("Failed to remove from watchlist:", err);
			return fail(500, { message: "Failed to remove from watchlist" });
		}
	}
};
