<script lang="ts">
	import type { PageData } from "./$types";
	import "../discover/discover.css";

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

<svelte:head>
	<title>Recommendations - MovieRec</title>
</svelte:head>

<div class="discover-page">
	<header class="page-header">
		<div class="titles">
			<p class="eyebrow">Personalized</p>
			<h1>Recommendations For You</h1>
			<p class="lede">Movies tailored to your taste based on what you've watched.</p>
		</div>
	</header>

	{#if data.error}
		<section class="error">
			{data.error}
		</section>
	{:else if data.message}
		<section class="empty">
			<p class="empty-title">{data.message}</p>
			<p class="empty-subtitle">Start building your movie library to get personalized suggestions.</p>
			<a href="/discover" class="btn primary">Browse Movies</a>
		</section>
	{:else if data.recommendations.length === 0}
		<section class="empty">
			<p class="empty-title">No recommendations yet</p>
			<p class="empty-subtitle">Watch more movies to get better recommendations.</p>
			<a href="/discover" class="btn primary">Browse Movies</a>
		</section>
	{:else}
		<section class="grid" role="list">
			{#each data.recommendations as movie}
			<article class="card" role="listitem">
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
</div>

<style>
	.empty {
		max-width: 600px;
		margin: 4rem auto;
		text-align: center;
		padding: 2rem;
	}

	.empty-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--text-primary, #1a1a1a);
	}

	.empty-subtitle {
		font-size: 1rem;
		color: var(--text-secondary, #666);
		margin-bottom: 2rem;
	}

	.error {
		background: #fee;
		color: #c33;
		padding: 1rem;
		border-radius: 8px;
		margin: 2rem 0;
		text-align: center;
	}

	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn.primary {
		background: var(--primary, #007bff);
		color: white;
	}

	.btn.primary:hover {
		background: var(--primary-dark, #0056b3);
		transform: translateY(-2px);
	}
</style>
