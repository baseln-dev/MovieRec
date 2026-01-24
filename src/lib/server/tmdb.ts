import { env } from "$env/dynamic/private";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	popularity: number;
	adult: boolean;
	genre_ids: number[];
	original_language: string;
	original_title: string;
	video: boolean;
}

export interface Genre {
	id: number;
	name: string;
}

export interface Review {
	id: string;
	author: string;
	author_details: {
		name: string;
		username: string;
		avatar_path: string | null;
		rating: number | null;
	};
	content: string;
	created_at: string;
	updated_at: string;
}

export interface MovieDetails extends Movie {
	genres: Genre[];
	runtime: number | null;
	status: string;
	tagline: string | null;
	budget: number;
	revenue: number;
	reviews?: Review[];
}

interface TMDBResponse {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

export async function getTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<Movie[]> {
	const apiKey = env.TMDB_API_KEY;
	
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured");
	}

	try {
		const response = await fetch(
			`${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${apiKey}`,
			{
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		if (!response.ok) {
			throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
		}

		const data: TMDBResponse = await response.json();
		return data.results.slice(0, 10); // Return top 10 movies
	} catch (error) {
		console.error("Error fetching trending movies:", error);
		throw error;
	}
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
	const apiKey = env.TMDB_API_KEY;
	
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured");
	}

	try {
		const response = await fetch(
			`${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&page=${page}`,
			{
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		if (!response.ok) {
			throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
		}

		const data: TMDBResponse = await response.json();
		return data.results.slice(0, 10); // Return top 10 movies
	} catch (error) {
		console.error("Error fetching popular movies:", error);
		throw error;
	}
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
	const apiKey = env.TMDB_API_KEY;
	
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured");
	}

	try {
		// Fetch movie details and reviews in parallel
		const [detailsResponse, reviewsResponse] = await Promise.all([
			fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`, {
				headers: { "Content-Type": "application/json" }
			}),
			fetch(`${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${apiKey}`, {
				headers: { "Content-Type": "application/json" }
			})
		]);

		if (!detailsResponse.ok) {
			throw new Error(`TMDB API error: ${detailsResponse.status} ${detailsResponse.statusText}`);
		}

		const details: MovieDetails = await detailsResponse.json();
		
		if (reviewsResponse.ok) {
			const reviewsData = await reviewsResponse.json();
			details.reviews = reviewsData.results.slice(0, 5); // Get top 5 reviews
		} else {
			details.reviews = [];
		}

		return details;
	} catch (error) {
		console.error("Error fetching movie details:", error);
		throw error;
	}
}

export async function getMoviesByIds(movieIds: number[]): Promise<Movie[]> {
	const apiKey = env.TMDB_API_KEY;
	
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured");
	}

	try {
		const movies: Movie[] = [];
		
		// Fetch all movies in parallel
		const responses = await Promise.all(
			movieIds.map(id =>
				fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}`, {
					headers: { "Content-Type": "application/json" }
				})
			)
		);

		for (const response of responses) {
			if (response.ok) {
				const movie: Movie = await response.json();
				movies.push(movie);
			}
		}

		return movies;
	} catch (error) {
		console.error("Error fetching movies by IDs:", error);
		throw error;
	}
}

export function getImageUrl(path: string | null, size: "w500" | "original" = "w500"): string {
	if (!path) return "/placeholder-movie.jpg";
	return `https://image.tmdb.org/t/p/${size}${path}`;
}
