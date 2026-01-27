<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";

	export let data: PageData;

	let activeTab: "details" | "cast" | "crew" = "details";

	function getImageUrl(path: string | null, size: "w500" | "original" = "original"): string {
		if (!path) return "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1200&h=600&fit=crop";
		return `https://image.tmdb.org/t/p/${size}${path}`;
	}

	function formatRuntime(minutes: number | null): string {
		if (!minutes) return "N/A";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	}

	function formatDate(dateString: string): string {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",		
		});
	}

	function formatMoney(amount: number): string {
		if (!amount) return "N/A";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0
		}).format(amount);
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
	<!-- Backdrop -->
	<div class="relative">
		<div class="absolute inset-0 overflow-hidden">
			<img
				src={getImageUrl(data.movie.backdrop_path)}
				alt={data.movie.title}
				class="w-full h-full object-cover opacity-30"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
		</div>

		<!-- Content -->
		<div class="relative max-w-7xl mx-auto px-4 py-12">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Poster -->
				<div class="lg:col-span-1">
					<img
						src={getImageUrl(data.movie.poster_path, "w500")}
						alt={data.movie.title}
						class="w-full rounded-lg shadow-2xl"
					/>
					
					<!-- Mark as Watched Button -->
					{#if data.user}
						<form method="POST" action="?/{data.watched ? 'unmarkWatched' : 'markWatched'}" use:enhance class="mt-4">
							<button
								type="submit"
								class="w-full py-3 px-4 rounded-lg font-semibold transition duration-200 {data.watched 
									? 'bg-red-600 hover:bg-red-700 text-white' 
									: 'bg-purple-600 hover:bg-purple-700 text-white'}"
							>
								{data.watched ? "Mark as Unwatched" : "Mark as Watched"}
							</button>
						</form>
					{:else}
						<a
							href="/login"
							class="block w-full mt-4 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white text-center rounded-lg font-semibold transition duration-200"
						>
							Login to Mark as Watched
						</a>
					{/if}
				</div>

				<!-- Details -->
				<div class="lg:col-span-2 text-white">
					<h1 class="text-5xl font-bold mb-2">{data.movie.title}</h1>
					{#if data.movie.tagline}
						<p class="text-xl text-slate-300 italic mb-6">"{data.movie.tagline}"</p>
					{/if}

					<!-- Meta Info -->
					<div class="flex flex-wrap items-center gap-4 mb-6 text-sm">
						<div class="flex items-center gap-2">
							<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<span class="text-yellow-400 font-bold text-lg">{data.movie.vote_average.toFixed(1)}</span>
							<span class="text-slate-400">({data.movie.vote_count} ratings)</span>
						</div>
						<span class="text-slate-400">•</span>
						<span>{formatDate(data.movie.release_date)}</span>
						<span class="text-slate-400">•</span>
						<span>{formatRuntime(data.movie.runtime)}</span>
						{#if data.movie.age_rating}
							<span class="text-slate-400">•</span>
							<span class="bg-slate-700 px-2 py-1 rounded text-xs font-bold">{data.movie.age_rating}</span>
						{/if}
					</div>

					<!-- Genres -->
					<div class="flex flex-wrap gap-2 mb-6">
						{#each data.movie.genres as genre}
							<span class="px-3 py-1 bg-purple-600/50 rounded-full text-sm font-medium">
								{genre.name}
							</span>
						{/each}
					</div>

					<!-- Tabs -->
					<div class="mb-8">
						<div class="flex gap-2 border-b border-slate-700 mb-6">
							<button
								on:click={() => activeTab = "details"}
								class="px-4 py-2 font-semibold text-sm transition-all {activeTab === 'details' 
									? 'text-purple-400 border-b-2 border-purple-400' 
									: 'text-slate-400 hover:text-white'}"
							>
								Details
							</button>
							{#if data.movie.cast && data.movie.cast.length > 0}
								<button
									on:click={() => activeTab = "cast"}
									class="px-4 py-2 font-semibold text-sm transition-all {activeTab === 'cast' 
										? 'text-purple-400 border-b-2 border-purple-400' 
										: 'text-slate-400 hover:text-white'}"
								>
									Cast ({data.movie.cast.length})
								</button>
							{/if}
							{#if data.movie.crew && data.movie.crew.length > 0}
								<button
									on:click={() => activeTab = "crew"}
									class="px-4 py-2 font-semibold text-sm transition-all {activeTab === 'crew' 
										? 'text-purple-400 border-b-2 border-purple-400' 
										: 'text-slate-400 hover:text-white'}"
								>
									Crew ({data.movie.crew.length})
								</button>
							{/if}
						</div>

						<!-- Details Tab -->
						{#if activeTab === "details"}
							<div>
								<h2 class="text-2xl font-bold mb-3">Overview</h2>
								<p class="text-slate-300 leading-relaxed text-lg mb-8">
									{data.movie.overview || "No overview available."}
								</p>

								<!-- Additional Info -->
								<div class="grid grid-cols-2 gap-4">
									<div>
										<h3 class="text-sm text-slate-400 mb-1">Original Language</h3>
										<p class="text-lg font-semibold uppercase">{data.movie.original_language}</p>
									</div>
									<div>
										<h3 class="text-sm text-slate-400 mb-1">User Rating Count</h3>
										<p class="text-lg font-semibold">{data.movie.vote_count.toLocaleString()} ratings</p>
									</div>
								</div>
							</div>
						{/if}

						<!-- Cast Tab -->
						{#if activeTab === "cast" && data.movie.cast && data.movie.cast.length > 0}
							<div>
								<div class="flex flex-wrap gap-6">
									{#each data.movie.cast as member}
										<div class="flex flex-col items-center w-24">
											<img src={getImageUrl(member.profile_path, "w500")} alt={member.name} class="rounded-full w-20 h-20 object-cover mb-2 bg-slate-700" />
											<span class="font-semibold text-sm text-center">{member.name}</span>
											<span class="text-xs text-slate-400 text-center">{member.character}</span>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Crew Tab -->
						{#if activeTab === "crew" && data.movie.crew && data.movie.crew.length > 0}
							<div>
								<div class="flex flex-wrap gap-6">
									{#each data.movie.crew as member}
										<div class="flex flex-col items-center w-24">
											<img src={getImageUrl(member.profile_path, "w500")} alt={member.name} class="rounded-full w-20 h-20 object-cover mb-2 bg-slate-700" />
											<span class="font-semibold text-sm text-center">{member.name}</span>
											<span class="text-xs text-slate-400 text-center">{member.job}</span>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Reviews -->
			{#if data.movie.reviews && data.movie.reviews.length > 0}
				<div class="mt-12">
					<h2 class="text-3xl font-bold text-white mb-6">Reviews</h2>
					<div class="space-y-6">
						{#each data.movie.reviews as review}
							<div class="bg-slate-800/50 backdrop-blur-md rounded-lg p-6 border border-slate-700">
								<div class="flex items-start gap-4 mb-4">
									<div class="flex-1">
										<div class="flex items-center gap-2 mb-2">
											<h3 class="text-lg font-semibold text-white">
												{review.author_details.name || review.author}
											</h3>
											{#if review.author_details.rating}
												<div class="flex items-center gap-1 px-2 py-1 bg-purple-600/30 rounded">
													<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
													<span class="text-yellow-400 font-medium text-sm">{review.author_details.rating}/10</span>
												</div>
											{/if}
										</div>
										<p class="text-sm text-slate-400">
											{new Date(review.created_at).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric"
											})}
										</p>
									</div>
								</div>
								<p class="text-slate-300 leading-relaxed line-clamp-6">
									{review.content}
								</p>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="mt-12">
					<h2 class="text-3xl font-bold text-white mb-6">Reviews</h2>
					<div class="bg-slate-800/50 backdrop-blur-md rounded-lg p-8 border border-slate-700 text-center">
						<p class="text-slate-400 text-lg">No reviews just yet</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
