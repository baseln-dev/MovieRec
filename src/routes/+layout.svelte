<script lang="ts">
	import '../app.css';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/discover', label: 'Discover' },
		{ href: '/genres', label: 'Genres' },
		{ href: '/watchlist', label: 'Watchlist' }
	];
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="app-shell">
	<header class="nav">
		<a class="brand" href="/">
			<span class="brand-mark">MR</span>
			<span class="brand-text">MovieRec</span>
		</a>
		<nav class="nav-links" aria-label="Primary">
			{#each links as link}
				<a class="nav-link" href={link.href}>{link.label}</a>
			{/each}
		</nav>
		<div class="nav-actions">
			<input
				class="search"
				type="search"
				name="movie-search"
				placeholder="Search movies"
				aria-label="Search movies"
			/>
			<a class="cta" href="/login">Sign in</a>
		</div>
	</header>

	<main class="page"><slot /></main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background: linear-gradient(135deg, #0b1021 0%, #0f1a2f 50%, #0b1021 100%);
		color: #e8ecf5;
	}

	.app-shell {
		min-height: 100vh;
	}

	.nav {
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1.5rem;
		background: rgba(13, 17, 31, 0.9);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		z-index: 10;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
		color: #e8ecf5;
		font-weight: 700;
		letter-spacing: 0.03em;
	}

	.brand-mark {
		display: grid;
		place-items: center;
		width: 2.3rem;
		height: 2.3rem;
		border-radius: 0.8rem;
		background: linear-gradient(135deg, #d73b65 0%, #f0634c 100%);
		color: #0b1021;
		font-size: 0.9rem;
		font-weight: 800;
	}

	.brand-text {
		font-size: 1.1rem;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	.nav-link {
		color: #c4ccdd;
		text-decoration: none;
		padding: 0.45rem 0.6rem;
		border-radius: 0.6rem;
		transition: color 0.18s ease, background 0.18s ease;
		font-weight: 600;
	}

	.nav-link:hover,
	.nav-link:focus-visible {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.08);
		outline: none;
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.search {
		padding: 0.55rem 0.8rem;
		border-radius: 0.7rem;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.04);
		color: #e8ecf5;
		min-width: 14rem;
	}

	.search::placeholder {
		color: #9aa4bd;
	}

	.search:focus {
		border-color: #f0634c;
		outline: none;
		box-shadow: 0 0 0 3px rgba(240, 99, 76, 0.25);
	}

	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.55rem 1rem;
		border-radius: 0.7rem;
		border: none;
		background: linear-gradient(135deg, #f0634c 0%, #d73b65 100%);
		color: #0b1021;
		font-weight: 700;
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
		text-decoration: none;
	}

	.cta:hover,
	.cta:focus-visible {
		transform: translateY(-1px);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
		outline: none;
	}

	.page {
		padding: 2rem 1.5rem 3rem;
		max-width: 1080px;
		margin: 0 auto;
	}

	@media (max-width: 720px) {
		.nav {
			flex-wrap: wrap;
			gap: 0.65rem;
		}

		.nav-links {
			order: 3;
			width: 100%;
			justify-content: space-between;
		}

		.nav-actions {
			flex: 1;
			justify-content: flex-end;
		}

		.search {
			min-width: 0;
			width: 100%;
		}
	}
</style>

