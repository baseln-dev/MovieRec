import { getMovieDetails } from "$lib/server/tmdb";
import { isWatched, markAsWatched, unmarkWatched } from "$lib/server/watchlist";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const movieId = parseInt(params.id);
	
	if (isNaN(movieId)) {
		throw error(400, "Invalid movie ID");
	}

	try {
		const movie = await getMovieDetails(movieId);
		const watched = locals.user ? isWatched(locals.user.id, movieId) : false;
		
		return {
			movie,
			watched,
			user: locals.user
		};
	} catch (err) {
		console.error("Failed to fetch movie details:", err);
		throw error(500, "Failed to load movie details");
	}
};

export const actions: Actions = {
	markWatched: async ({ locals, params }) => {
		if (!locals.user) {
			return fail(401, { message: "Not authenticated" });
		}

		const movieId = parseInt(params.id);
		if (isNaN(movieId)) {
			return fail(400, { message: "Invalid movie ID" });
		}

		try {
			markAsWatched(locals.user.id, movieId);
			return { success: true };
		} catch (err) {
			console.error("Failed to mark as watched:", err);
			return fail(500, { message: "Failed to mark as watched" });
		}
	},

	unmarkWatched: async ({ locals, params }) => {
		if (!locals.user) {
			return fail(401, { message: "Not authenticated" });
		}

		const movieId = parseInt(params.id);
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
