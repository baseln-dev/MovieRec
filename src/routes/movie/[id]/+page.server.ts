import { getMovieDetails } from "$lib/server/tmdb";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "$lib/server/watchlist";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const movieId = parseInt(params.id);
	
	if (isNaN(movieId)) {
		throw error(400, "Invalid movie ID");
	}

	try {
		const movie = await getMovieDetails(movieId);
		const inWatchlist = locals.user ? isInWatchlist(locals.user.id, movieId) : false;
		
		return {
			movie,
			inWatchlist,
			user: locals.user
		};
	} catch (err) {
		console.error("Failed to fetch movie details:", err);
		throw error(500, "Failed to load movie details");
	}
};

export const actions: Actions = {
	addToWatchlist: async ({ locals, params }) => {
		if (!locals.user) {
			return fail(401, { message: "Not authenticated" });
		}

		const movieId = parseInt(params.id);
		if (isNaN(movieId)) {
			return fail(400, { message: "Invalid movie ID" });
		}

		try {
			addToWatchlist(locals.user.id, movieId);
			return { success: true };
		} catch (err) {
			console.error("Failed to add to watchlist:", err);
			return fail(500, { message: "Failed to add to watchlist" });
		}
	},

	removeFromWatchlist: async ({ locals, params }) => {
		if (!locals.user) {
			return fail(401, { message: "Not authenticated" });
		}

		const movieId = parseInt(params.id);
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
