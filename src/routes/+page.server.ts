import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import { getTrendingMovies, getPopularMovies, type Movie } from "$lib/server/tmdb";

import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";

export async function load(event: PageServerLoadEvent) {
	let trendingMovies: Movie[] = [];
	let popularMovies: Movie[] = [];
	
	try {
		trendingMovies = await getTrendingMovies("week");
	} catch (error) {
		console.error("Failed to fetch trending movies for homepage:", error);
	}
	
	try {
		popularMovies = await getPopularMovies();
	} catch (error) {
		console.error("Failed to fetch popular movies for homepage:", error);
	}
	
	return {
		user: event.locals.user,
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
