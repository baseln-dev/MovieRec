<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;

	function getImageUrl(path: string | null): string {
		if (!path) return "/placeholder-movie.jpg";
		return `https://image.tmdb.org/t/p/w500${path}`;
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12">
	<div class="max-w-7xl mx-auto">
		<h1 class="text-4xl font-bold text-white mb-8">Trending Movies</h1>
		
		{#if data.error}
			<div class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
				{data.error}
			</div>
		{:else if data.movies.length === 0}
			<div class="p-4 bg-slate-800/50 rounded-lg text-slate-300">
				No movies found.
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{#each data.movies as movie}
					<a href="/movie/{movie.id}" class="bg-slate-800/50 backdrop-blur-md rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 transition-all duration-300 hover:scale-105 block">
						<div class="aspect-[2/3] relative overflow-hidden">
							<img
								src={getImageUrl(movie.poster_path)}
								alt={movie.title}
								class="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>
						<div class="p-4">
							<h3 class="text-white font-semibold text-lg mb-2 line-clamp-2">
								{movie.title}
							</h3>
							<div class="flex items-center justify-between text-sm">
								<span class="text-slate-400">
									{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
								</span>
								<div class="flex items-center gap-1">
									<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									<span class="text-yellow-400 font-medium">
										{movie.vote_average.toFixed(1)}
									</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
