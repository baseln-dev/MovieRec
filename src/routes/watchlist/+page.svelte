<script lang="ts">
	import "./watchlist.css";

	type WatchedMovie = {
		id: number;
		title: string;
		year: number;
		genre: string;
		rating: number;
		runtime: number;
		watchedAt: string; // ISO date string
		poster: string;
		notes?: string;
	};

	const movies: WatchedMovie[] = [
		{ id: 1, title: "Dune", year: 2021, genre: "Sci-Fi", rating: 8.3, runtime: 155, watchedAt: "2025-12-28", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop", notes: "Stunning sound and scale." },
		{ id: 2, title: "Barbie", year: 2023, genre: "Comedy", rating: 7.9, runtime: 114, watchedAt: "2025-12-20", poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop" },
		{ id: 3, title: "The Batman", year: 2022, genre: "Action", rating: 8.2, runtime: 176, watchedAt: "2025-11-18", poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop", notes: "Great noir tone." },
		{ id: 4, title: "Past Lives", year: 2023, genre: "Drama", rating: 8.5, runtime: 106, watchedAt: "2025-10-02", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop" },
		{ id: 5, title: "Everything Everywhere All at Once", year: 2022, genre: "Sci-Fi", rating: 8.7, runtime: 139, watchedAt: "2025-09-14", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop" },
		{ id: 6, title: "Arrival", year: 2016, genre: "Sci-Fi", rating: 8.5, runtime: 116, watchedAt: "2025-07-22", poster: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop" },
		{ id: 7, title: "The Social Network", year: 2010, genre: "Drama", rating: 8.0, runtime: 120, watchedAt: "2025-05-04", poster: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop" },
		{ id: 8, title: "John Wick", year: 2014, genre: "Action", rating: 7.4, runtime: 101, watchedAt: "2025-03-11", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop" },
		{ id: 9, title: "Spirited Away", year: 2001, genre: "Animation", rating: 8.6, runtime: 125, watchedAt: "2025-01-09", poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop" },
		{ id: 10, title: "Whiplash", year: 2014, genre: "Drama", rating: 8.5, runtime: 106, watchedAt: "2024-12-17", poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop" }
	];

	const filters = ["All", "Action", "Drama", "Comedy", "Sci-Fi", "Animation"];
	const sortOptions = [
		{ id: "recent", label: "Recently watched" },
		{ id: "rating", label: "Highest rated" },
		{ id: "title", label: "Title A–Z" }
	];

	let query = "";
	let activeFilter = "All";
	let sortBy = "recent";

	const formatDate = (iso: string) =>
		new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

	const formatRuntime = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

	$: filtered = movies.filter((movie) => {
		const matchesQuery = movie.title.toLowerCase().includes(query.trim().toLowerCase());
		const matchesFilter = activeFilter === "All" || movie.genre === activeFilter;
		return matchesQuery && matchesFilter;
	});

	$: sorted = filtered.slice().sort((a, b) => {
		if (sortBy === "rating") return b.rating - a.rating;
		if (sortBy === "title") return a.title.localeCompare(b.title);
		return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime();
	});
</script>

<div class="watched-page">
	<header class="page-header">
		<div class="titles">
			<p class="eyebrow">Library</p>
			<h1>Watchlist</h1>
			<p class="lede">Review what you've watched, sort it your way, and queue up the next great watch.</p>
		</div>
		<button class="btn primary" type="button">+ Add movie</button>
	</header>

	<section class="controls">
		<div class="search">
			<input
				type="search"
				placeholder="Search watched titles"
				bind:value={query}
				aria-label="Search watched movies"
			/>
			<button class="btn ghost" type="button">Search</button>
		</div>

		<div class="control-row">
			<div class="sort">
				<p class="label">Sort</p>
				<div class="chip-row">
					{#each sortOptions as option}
						<button
							type="button"
							class={`chip ${sortBy === option.id ? "active" : ""}`}
							on:click={() => (sortBy = option.id)}
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="filters">
				<p class="label">Filter</p>
				<div class="chip-row">
					{#each filters as filter}
						<button
							type="button"
							class={`chip ${activeFilter === filter ? "active" : ""}`}
							on:click={() => (activeFilter = filter)}
						>
							{filter}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="stats">
		<div class="stat">
			<p class="stat-label">Total watched</p>
			<p class="stat-value">{movies.length}</p>
		</div>
		<div class="stat">
			<p class="stat-label">Average rating</p>
			<p class="stat-value">
				{(movies.reduce((acc, m) => acc + m.rating, 0) / movies.length).toFixed(1)}
			</p>
		</div>
		<div class="stat">
			<p class="stat-label">Total runtime</p>
			<p class="stat-value">
				{Math.round(movies.reduce((acc, m) => acc + m.runtime, 0) / 60)}h
			</p>
		</div>
	</section>

	<section class="grid" aria-live="polite">
		{#if sorted.length === 0}
			<div class="empty">
				<p class="empty-title">No matches yet</p>
				<p class="empty-subtitle">Try a different search, clear a filter, or add a new movie.</p>
				<button class="btn primary" type="button">Add movie</button>
			</div>
		{:else}
			{#each sorted as movie}
				<article class="card" aria-label={`${movie.title} (${movie.year})`}>
					<div class="card-poster">
						<img src={movie.poster} alt={movie.title} />
					</div>
					<header class="card-head">
						<div>
							<p class="card-genre">{movie.genre}</p>
							<h3 class="card-title">{movie.title}</h3>
							<p class="card-subtitle">{movie.year} · {formatRuntime(movie.runtime)}</p>
						</div>
						<span class="badge">{movie.rating.toFixed(1)}</span>
					</header>
				</article>
			{/each}
		{/if}
	</section>
</div>
