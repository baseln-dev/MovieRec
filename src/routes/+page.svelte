<script lang="ts">
	import "./home.css";
	import type { PageData } from "./$types";

	export let data: PageData;

	function getImageUrl(path: string | null): string {
		if (!path) return "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop";
		return `https://image.tmdb.org/t/p/w500${path}`;
	}

	const forYou = [
		{ id: 1, title: "The Matrix", year: 1999, rating: 8.7, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 2, title: "Inception", year: 2010, rating: 8.8, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 3, title: "Interstellar", year: 2014, rating: 8.6, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 4, title: "The Dark Knight", year: 2008, rating: 9.0, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 5, title: "Pulp Fiction", year: 1994, rating: 8.9, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 6, title: "Forrest Gump", year: 1994, rating: 8.8, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" }
	];


</script>



<div class="page-shell">
	<div class="page-overlay"></div>

	<main class="page-main">
		<section class="rail">
			<header class="rail-header">
				<div class="rail-header-text">
					<h3 class="rail-title">For You</h3>
					<p class="rail-subtitle">Fresh picks we think you will like.</p>
				</div>
				<a class="rail-cta" href="#">See more</a>
			</header>
			<div class="scroll-container hide-scrollbar">
				<div class="card-row">
					{#each forYou as movie}
						<div class="card-item">
							<div class="card-poster">
								<img src={movie.poster} alt={movie.title} />
							</div>
							<h4 class="card-title">{movie.title}</h4>
							<div class="card-meta">
								<span>{movie.year}</span>
								<span class="card-rating">
									<span>⭐</span>
									<span>{movie.rating}</span>
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

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
