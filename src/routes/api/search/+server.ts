import { searchMovies } from "$lib/server/tmdb";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get("q") || "";
	const page = parseInt(url.searchParams.get("page") || "1", 10);

	if (!query.trim()) {
		return json({
			query: "",
			movies: [],
			totalPages: 0,
			totalResults: 0,
			currentPage: 1
		});
	}

	try {
		const searchResults = await searchMovies(query, page);
		return json({
			query,
			movies: searchResults.results,
			totalPages: searchResults.total_pages,
			totalResults: searchResults.total_results,
			currentPage: page
		});
	} catch (error) {
		console.error("Search API error:", error);
		return json({
			query,
			movies: [],
			totalPages: 0,
			totalResults: 0,
			currentPage: 1,
			error: "Failed to search movies"
		}, { status: 500 });
	}
};
