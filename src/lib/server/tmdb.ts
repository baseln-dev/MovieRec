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

export interface CastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}

export interface CrewMember {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
}

export interface MovieDetails extends Movie {
	genres: Genre[];
	runtime: number | null;
	status: string;
	tagline: string | null;
	budget: number;
	revenue: number;
	reviews?: Review[];
	cast?: CastMember[];
	crew?: CrewMember[];
	age_rating?: string;
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
		return data.results; // Return all available results
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
	       // Fetch details, reviews, credits, and release info in parallel
	       const [detailsResponse, reviewsResponse, creditsResponse, releaseResponse] = await Promise.all([
		       fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`, {
			       headers: { "Content-Type": "application/json" }
		       }),
		       fetch(`${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${apiKey}`, {
			       headers: { "Content-Type": "application/json" }
		       }),
		       fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${apiKey}`, {
			       headers: { "Content-Type": "application/json" }
		       }),
		       fetch(`${TMDB_BASE_URL}/movie/${movieId}/release_dates?api_key=${apiKey}`, {
			       headers: { "Content-Type": "application/json" }
		       })
	       ]);

	       if (!detailsResponse.ok) {
		       throw new Error(`TMDB API error: ${detailsResponse.status} ${detailsResponse.statusText}`);
	       }

	       const details: MovieDetails = await detailsResponse.json();

	       // Reviews
	       if (reviewsResponse.ok) {
		       const reviewsData = await reviewsResponse.json();
		       details.reviews = reviewsData.results.slice(0, 5);
	       } else {
		       details.reviews = [];
	       }

	       // Credits
	       if (creditsResponse.ok) {
		       const creditsData = await creditsResponse.json();
		       details.cast = creditsData.cast?.slice(0, 8) || [];
		       details.crew = creditsData.crew?.filter((c: any) => ["Director", "Writer", "Screenplay"].includes(c.job)).slice(0, 6) || [];
	       } else {
		       details.cast = [];
		       details.crew = [];
	       }

	       // Age rating (certification)
	       details.age_rating = undefined;
	       if (releaseResponse.ok) {
		       const releaseData = await releaseResponse.json();
		       // Try to find US or GB certification, fallback to any
		       let found = null;
		       if (releaseData.results) {
			       found = releaseData.results.find((r: any) => r.iso_3166_1 === "US")
				       || releaseData.results.find((r: any) => r.iso_3166_1 === "GB")
				       || releaseData.results[0];
			       if (found && found.release_dates && found.release_dates.length > 0) {
				       const cert = found.release_dates.find((rd: any) => rd.certification);
				       if (cert && cert.certification) {
					       details.age_rating = cert.certification;
				       }
			       }
		       }
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

export async function getSimilarMovies(movieId: number, page: number = 1): Promise<Movie[]> {
	const apiKey = env.TMDB_API_KEY;
	
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured");
	}

	try {
		const response = await fetch(
			`${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${apiKey}&page=${page}`,
			{
				headers: { "Content-Type": "application/json" }
			}
		);

		if (!response.ok) {
			return [];
		}

		const data: TMDBResponse = await response.json();
		return data.results;
	} catch (error) {
		console.error("Error fetching similar movies:", error);
		return [];
	}
}

export async function getMovieRecommendations(movieId: number, page: number = 1): Promise<Movie[]> {
	const apiKey = env.TMDB_API_KEY;
	
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured");
	}

	try {
		const response = await fetch(
			`${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${apiKey}&page=${page}`,
			{
				headers: { "Content-Type": "application/json" }
			}
		);

		if (!response.ok) {
			return [];
		}

		const data: TMDBResponse = await response.json();
		return data.results;
	} catch (error) {
		console.error("Error fetching movie recommendations:", error);
		return [];
	}
}

export async function discoverMoviesByGenres(genreIds: number[], page: number = 1): Promise<Movie[]> {
	const apiKey = env.TMDB_API_KEY;
	
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured");
	}

	if (genreIds.length === 0) {
		return [];
	}

	try {
		const genreString = genreIds.join(',');
		const response = await fetch(
			`${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${genreString}&sort_by=popularity.desc&page=${page}`,
			{
				headers: { "Content-Type": "application/json" }
			}
		);

		if (!response.ok) {
			return [];
		}

		const data: TMDBResponse = await response.json();
		return data.results;
	} catch (error) {
		console.error("Error discovering movies by genres:", error);
		return [];
	}
}

export async function searchMovies(query: string, page: number = 1): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
	const apiKey = env.TMDB_API_KEY;
	
	if (!apiKey) {
		throw new Error("TMDB_API_KEY is not configured");
	}

	if (!query.trim()) {
		return { results: [], total_pages: 0, total_results: 0 };
	}

	try {
		const response = await fetch(
			`${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`,
			{
				headers: { "Content-Type": "application/json" }
			}
		);

		if (!response.ok) {
			return { results: [], total_pages: 0, total_results: 0 };
		}

		const data: TMDBResponse = await response.json();
		return {
			results: data.results,
			total_pages: data.total_pages,
			total_results: data.total_results
		};
	} catch (error) {
		console.error("Error searching movies:", error);
		return { results: [], total_pages: 0, total_results: 0 };
	}
}
