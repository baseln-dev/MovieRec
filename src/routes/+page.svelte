<script lang="ts">
	import "./home.css";

	const forYou = [
		{ id: 1, title: "The Matrix", year: 1999, rating: 8.7, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 2, title: "Inception", year: 2010, rating: 8.8, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 3, title: "Interstellar", year: 2014, rating: 8.6, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 4, title: "The Dark Knight", year: 2008, rating: 9.0, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 5, title: "Pulp Fiction", year: 1994, rating: 8.9, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 6, title: "Forrest Gump", year: 1994, rating: 8.8, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" }
	];

	const trendingMovies = [
		{ id: 7, title: "Die Hard", year: 1988, rating: 8.5, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 8, title: "Mad Max Fury Road", year: 2015, rating: 8.1, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 9, title: "John Wick", year: 2014, rating: 7.4, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 10, title: "The Raid", year: 2011, rating: 7.6, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 11, title: "Mission Impossible", year: 1996, rating: 7.1, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 12, title: "Fast Five", year: 2011, rating: 7.3, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" }
	];

	const popularMovies = [
		{ id: 13, title: "The Shawshank Redemption", year: 1994, rating: 9.3, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 14, title: "Parasite", year: 2019, rating: 8.6, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 15, title: "Moonlight", year: 2016, rating: 7.4, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 16, title: "La La Land", year: 2016, rating: 8.0, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 17, title: "The Godfather", year: 1972, rating: 9.2, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" },
		{ id: 18, title: "Schindler's List", year: 1993, rating: 9.0, poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop" }
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
				<a class="rail-cta" href="#">See more</a>
			</header>
			<div class="scroll-container hide-scrollbar">
				<div class="card-row">
					{#each trendingMovies as movie}
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
					<h3 class="rail-title">Popular & Classics</h3>
					<p class="rail-subtitle">Stories to settle into and savor.</p>
				</div>
				<a class="rail-cta" href="#">See more</a>
			</header>
			<div class="scroll-container hide-scrollbar">
				<div class="card-row">
					{#each popularMovies as movie}
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
	</main>
</div>
