<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
    import "./discover.css";

	function getImageUrl(path: string | null): string {
		if (!path) return "/placeholder-movie.jpg";
		return `https://image.tmdb.org/t/p/w500${path}`;
	}
</script>

<div class="discover-page">
    <header class="page-header">
        <div class="titles">
            <p class="eyebrow">Discover</p>
            <h1>Find Your Next Favorite Movie</h1>
            <p class="lede">Browse popular and trending movies curated just for you.</p>
        </div>
    </header>

    <section class="grid" aria-live="polite">
        {#each data.movies as movie}
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
                        <p class="card-subtitle">{new Date(movie.release_date).getFullYear()} · Rating: {movie.vote_average.toFixed(1)}</p>
                    </div>
                </header>
            </article>
        {/each}
    </section>
</div>