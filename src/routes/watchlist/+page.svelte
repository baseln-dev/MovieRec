<script lang="ts">
	import { enhance } from "$app/forms";
	import "./watchlist.css";
	import type { PageData } from "./$types";

	export let data: PageData;

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
			<h1>Watchlist</h1>
			<p class="lede">Movies you've saved to watch later.</p>
		</div>
		<a href="/discover" class="btn primary">+ Discover movies</a>
	</header>

	{#if data.error}
		<section class="error" style="margin-top: 2rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.5rem; color: #fca5a5;">
			{data.error}
		</section>
	{:else if data.watchlistMovies.length === 0}
		<section class="empty" style="margin-top: 4rem; text-align: center;">
			<p class="empty-title">Your watchlist is empty</p>
			<p class="empty-subtitle">Browse movies and add them to your watchlist.</p>
			<a href="/discover" class="btn primary">Browse Movies</a>
		</section>
	{:else}
		<section class="stats">
			<div class="stat">
				<p class="stat-label">Movies saved</p>
				<p class="stat-value">{data.watchlistMovies.length}</p>
			</div>
		</section>

		<section class="grid" aria-live="polite">
			{#each data.watchlistMovies as movie}
				<article class="card">
					<a href="/movie/{movie.id}" class="card-poster">
						<img src={getImageUrl(movie.poster_path)} alt={movie.title} style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;" />
					</a>
					<header class="card-head">
						<div>
							<h3 class="card-title">
								<a href="/movie/{movie.id}" style="color: #e2e8f0; text-decoration: none; hover: color: #c7d2e8;">
									{movie.title}
								</a>
							</h3>
							<p class="card-subtitle">{formatYear(movie.release_date)} · Rating: {movie.vote_average.toFixed(1)}</p>
						</div>
						<form method="POST" action="?/remove" use:enhance style="margin-top: 0.5rem;">
							<input type="hidden" name="movieId" value={movie.id} />
							<button
								type="submit"
								class="btn ghost"
								style="padding: 0.5rem; font-size: 0.875rem; width: 100%;"
							>
								Remove
							</button>
						</form>
					</header>
				</article>
			{/each}
		</section>
	{/if}
</div>
