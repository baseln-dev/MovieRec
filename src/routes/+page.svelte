<script lang="ts">
	import "./home.css";
	import type { PageData } from "./$types";

	export let data: PageData;

	function getImageUrl(path: string | null): string {
		if (!path) return "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop";
		return `https://image.tmdb.org/t/p/w500${path}`;
	}


</script>



<div class="page-shell">
	<div class="page-overlay"></div>

	<main class="page-main">
		{#if data.user && data.recommendedMovies.length > 0}
		<section class="rail">
			<header class="rail-header">
				<div class="rail-header-text">
					<h3 class="rail-title">For You</h3>
					<p class="rail-subtitle">Personalized picks based on your taste.</p>
				</div>
				<a class="rail-cta" href="/recommendations">See more</a>
			</header>
			<div class="scroll-container hide-scrollbar">
				<div class="card-row">
					{#each data.recommendedMovies as movie}
						<a href="/movie/{movie.id}" class="card-item">
							<div class="card-poster">
								<img src={getImageUrl(movie.poster_path)} alt={movie.title} />
							</div>
							<h4 class="card-title">{movie.title}</h4>
							<div class="card-meta">
								<span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
								<span class="card-rating">
									<span>⭐</span>
									<span>{movie.vote_average.toFixed(1)}</span>
								</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
		{/if}

		<section class="rail">
			<header class="rail-header">
				<div class="rail-header-text">
					<h3 class="rail-title">Trending Now</h3>
					<p class="rail-subtitle">What's hot this week.</p>
				</div>
				<a class="rail-cta" href="/discover">See more</a>
			</header>
			<div class="scroll-container hide-scrollbar">
				<div class="card-row">
					{#each data.trendingMovies as movie}
					<a href="/movie/{movie.id}" class="card-item">
						<div class="card-poster">
							<img src={getImageUrl(movie.poster_path)} alt={movie.title} />
						</div>
						<h4 class="card-title">{movie.title}</h4>
						<div class="card-meta">
							<span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
							<span class="card-rating">
								<span>⭐</span>
								<span>{movie.vote_average.toFixed(1)}</span>
							</span>
						</div>
					</a>
					{/each}
				</div>
			</div>
		</section>

		<section class="rail">
			<header class="rail-header">
				<div class="rail-header-text">
					<h3 class="rail-title">Popular & Classics</h3>
					<p class="rail-subtitle">Stories to settle into and savor.</p>
				</div>
				<a class="rail-cta" href="/discover">See more</a>
			</header>
			<div class="scroll-container hide-scrollbar">
				<div class="card-row">
					{#each data.popularMovies as movie}
					<a href="/movie/{movie.id}" class="card-item">
						<div class="card-poster">
							<img src={getImageUrl(movie.poster_path)} alt={movie.title} />
						</div>
						<h4 class="card-title">{movie.title}</h4>
						<div class="card-meta">
							<span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
							<span class="card-rating">
								<span>⭐</span>
								<span>{movie.vote_average.toFixed(1)}</span>
							</span>
						</div>
					</a>
					{/each}
				</div>
			</div>
		</section>
	</main>
</div>
