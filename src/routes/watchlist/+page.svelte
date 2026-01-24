<script lang="ts">
	import { enhance } from "$app/forms";
	import "./watchlist.css";
	import type { PageData } from "./$types";

	export let data: PageData;

	function getImageUrl(path: string | null): string {
		if (!path) return "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop";
		return `https://image.tmdb.org/t/p/w500${path}`;
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

	{#if data.movieIds.length === 0}
		<section class="empty" style="margin-top: 4rem; text-align: center;">
			<p class="empty-title">Your watchlist is empty</p>
			<p class="empty-subtitle">Browse movies and add them to your watchlist.</p>
			<a href="/discover" class="btn primary">Browse Movies</a>
		</section>
	{:else}
		<section class="stats">
			<div class="stat">
				<p class="stat-label">Movies saved</p>
				<p class="stat-value">{data.movieIds.length}</p>
			</div>
		</section>

		<section class="grid" aria-live="polite">
			{#each data.movieIds as movieId}
				<article class="card" aria-label="Movie {movieId}">
					<a href="/movie/{movieId}" class="card-poster">
						<div style="background: rgba(30, 41, 59, 0.6); aspect-ratio: 2/3; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem;">
							<span style="font-size: 3rem; opacity: 0.3;">🎬</span>
						</div>
					</a>
					<header class="card-head">
						<div>
							<h3 class="card-title">Movie #{movieId}</h3>
							<p class="card-subtitle">
								<a href="/movie/{movieId}" style="color: #a78bfa;">View Details</a>
							</p>
						</div>
						<form method="POST" action="?/remove" use:enhance>
							<input type="hidden" name="movieId" value={movieId} />
							<button
								type="submit"
								class="btn ghost"
								style="padding: 0.5rem; font-size: 0.875rem;"
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
