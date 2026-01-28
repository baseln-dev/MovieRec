<script lang="ts">
	import type { PageData } from "./$types";
	import type { Movie } from "$lib/server/tmdb";
	import "../discover/discover.css";

	export let data: PageData;

	let allMovies: Movie[] = [...data.movies];
	let currentPage = data.currentPage;
	let isLoading = false;

	$: hasMore = currentPage < data.totalPages;

	async function loadMore() {
		if (isLoading || !hasMore) return;
		
		isLoading = true;
		const nextPage = currentPage + 1;
		
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(data.query)}&page=${nextPage}`);
			const json = await response.json();
			
			if (json.movies && json.movies.length > 0) {
				allMovies = [...allMovies, ...json.movies];
				currentPage = nextPage;
			}
		} catch (error) {
			console.error("Failed to load more movies:", error);
		} finally {
			isLoading = false;
		}
	}

	function getImageUrl(path: string | null): string {
		if (!path) return "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop";
		return `https://image.tmdb.org/t/p/w500${path}`;
	}

	function formatYear(dateString: string): number | string {
		if (!dateString) return 'N/A';
		return new Date(dateString).getFullYear();
	}

	// Reset when search query changes
	$: if (data.query) {
		allMovies = [...data.movies];
		currentPage = data.currentPage;
	}
</script>

<svelte:head>
	<title>{data.query ? `Search: ${data.query}` : 'Search'} - MovieRec</title>
</svelte:head>

<div class="discover-page">
	<header class="page-header">
		<div class="titles">
			<p class="eyebrow">Search</p>
			{#if data.query}
				<h1>Results for "{data.query}"</h1>
				{#if data.totalResults > 0}
					<p class="lede">Found {data.totalResults} movie{data.totalResults !== 1 ? 's' : ''}</p>
				{/if}
			{:else}
				<h1>Search Movies</h1>
				<p class="lede">Enter a search term in the navbar to find movies</p>
			{/if}
		</div>
	</header>

	{#if data.query && allMovies.length > 0}
		<section class="grid" aria-live="polite">
			{#each allMovies as movie}
				<article class="card">
					<a href="/movie/{movie.id}" class="card-poster">
						<img src={getImageUrl(movie.poster_path)} alt={movie.title} />
					</a>
					<header class="card-head">
						<div>
							<h3 class="card-title">
								<a href="/movie/{movie.id}">{movie.title}</a>
							</h3>
							<p class="card-subtitle">
								<span class="year">{formatYear(movie.release_date)}</span>
								<span class="rating">⭐ {movie.vote_average.toFixed(1)}</span>
							</p>
						</div>
					</header>
				</article>
			{/each}
		</section>

		{#if hasMore}
			<div class="load-more-container">
				<button 
					class="load-more-btn" 
					on:click={loadMore}
					disabled={isLoading}
				>
					{isLoading ? 'Loading...' : 'Show More'}
				</button>
			</div>
		{/if}
	{:else if data.query && allMovies.length === 0}
		<div class="empty">
			<h2>No results found</h2>
			<p>Try a different search term</p>
		</div>
	{:else if !data.query}
		<div class="empty">
			<h2>Start searching</h2>
			<p>Use the search bar in the navigation to find movies</p>
		</div>
	{/if}
</div>

<style>
	.empty {
		text-align: center;
		padding: 4rem 2rem;
		color: #94a3b8;
	}

	.empty h2 {
		margin: 0 0 0.5rem;
		color: #e2e8f0;
		font-size: 1.5rem;
	}

	.empty p {
		margin: 0;
		font-size: 1rem;
	}

	.load-more-container {
		display: flex;
		justify-content: center;
		padding: 2rem 0;
		margin-top: 2rem;
	}

	.load-more-btn {
		padding: 0.75rem 2rem;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
	}

	.load-more-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
	}

	.load-more-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
