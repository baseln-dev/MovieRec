<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import "./watched.css";
	import type { PageData } from "./$types";

	export let data: PageData;

	let searchQuery = data.searchQuery || "";

	async function handleSearch() {
		if (searchQuery.trim()) {
			await goto(`?q=${encodeURIComponent(searchQuery)}`);
		} else {
			await goto("?");
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Enter") {
			handleSearch();
		}
	}

	function handleInput() {
		// Reset to show all movies when search is cleared
		if (!searchQuery.trim()) {
			handleSearch();
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
</script>

<div class="watched-page">
	<header class="page-header">
		<div class="titles">
			<p class="eyebrow">Library</p>
			<h1>Watched Movies</h1>
			<p class="lede">Keep track of all the movies you've watched.</p>
		</div>
	</header>

	{#if data.error}
		<section class="error">
			{data.error}
		</section>
	{:else if data.watchedMovies.length === 0}
		<section class="empty">
			<p class="empty-title">No watched movies yet</p>
			<p class="empty-subtitle">Browse movies and mark them as watched.</p>
			<a href="/discover" class="btn primary">Browse Movies</a>
		</section>
	{:else}
		<section class="stats">
			<div class="stat">
				<p class="stat-label">Movies watched</p>
				<p class="stat-value">{data.stats.moviesWatched}</p>
			</div>
			<div class="stat">
				<p class="stat-label">Hours watched</p>
				<p class="stat-value">{data.stats.hoursWatched}h {data.stats.minutesWatched}m</p>
			</div>
			<div class="stat">
				<p class="stat-label">Favorite genre</p>
				<p class="stat-value">{data.stats.favoriteGenre}</p>
			</div>
		</section>

		<div class="search-container">
			<input
				type="text"
				placeholder="Search movies..."
				class="search-input"
				bind:value={searchQuery}
				on:keydown={handleKeydown}
				on:input={handleInput}
				aria-label="Search watched movies"
			/>
			<button class="search-button" on:click={handleSearch}>Search</button>
		</div>

		{#if data.watchedMovies.length === 0}
			<section class="empty">
				<p class="empty-title">No results found</p>
				<p class="empty-subtitle">Try a different search term.</p>
			</section>
		{:else}
			<section class="grid" aria-live="polite">
				{#each data.watchedMovies as movie}
				<article class="card">
					<a href="/movie/{movie.id}" class="card-poster">
						<img src={getImageUrl(movie.poster_path)} alt={movie.title} />
					</a>
					<header class="card-head">
						<div>
							<h3 class="card-title">
								<a href="/movie/{movie.id}">
									{movie.title}
								</a>
							</h3>
							<p class="card-subtitle">{formatYear(movie.release_date)} · Rating: {movie.vote_average.toFixed(1)}</p>
						</div>
					</header>
				</article>
				{/each}
			</section>
		{/if}
	{/if}
</div>
