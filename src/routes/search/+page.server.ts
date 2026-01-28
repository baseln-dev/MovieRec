import { searchMovies } from "$lib/server/tmdb";
import type { PageServerLoadEvent } from "./$types";

export async function load(event: PageServerLoadEvent) {
	const query = event.url.searchParams.get("q") || "";
	const page = parseInt(event.url.searchParams.get("page") || "1", 10);

	if (!query.trim()) {
		return {
			query: "",
			movies: [],
			totalPages: 0,
			totalResults: 0,
			currentPage: 1
		};
	}

	try {
		const searchResults = await searchMovies(query, page);
		return {
			query,
			movies: searchResults.results,
			totalPages: searchResults.total_pages,
			totalResults: searchResults.total_results,
			currentPage: page
		};
	} catch (error) {
		console.error("Search error:", error);
		return {
			query,
			movies: [],
			totalPages: 0,
			totalResults: 0,
			currentPage: 1,
			error: "Failed to search movies"
		};
	}
}
