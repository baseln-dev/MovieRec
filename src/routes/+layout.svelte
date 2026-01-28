<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/discover', label: 'Discover' },
		{ href: '/recommendations', label: 'For You' },
		{ href: '/watched', label: 'My Movies' }
	];

	let showProfileMenu = false;
	let profileContainer: HTMLDivElement;
	let searchQuery = '';

	function toggleProfileMenu() {
		showProfileMenu = !showProfileMenu;
	}

	function handleClickOutside(event: MouseEvent) {
		if (profileContainer && !profileContainer.contains(event.target as Node)) {
			showProfileMenu = false;
		}
	}

	function handleSearch(event: KeyboardEvent) {
		if (event.key === 'Enter' && searchQuery.trim()) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}

	function getInitials(username: string): string {
		return username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
	}
</script>

<svelte:window on:click={handleClickOutside} />

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
				bind:value={searchQuery}
				on:keydown={handleSearch}
			/>
			{#if data.user}
				<div class="profile-container" bind:this={profileContainer}>
					<button
						class="profile-button"
						on:click={toggleProfileMenu}
						aria-label="User profile menu"
						title={data.user.username}
					>
						<div class="profile-avatar">
							{getInitials(data.user.username)}
						</div>
					</button>
					{#if showProfileMenu}
						<div class="profile-menu">
							<div class="profile-info">
								<p class="profile-name">{data.user.username}</p>
								<p class="profile-email">{data.user.email}</p>
							</div>
							<a href="/settings" class="menu-link" on:click={() => (showProfileMenu = false)}>Settings</a>
							<a href="/logout" class="menu-link logout" on:click={() => (showProfileMenu = false)}>Sign out</a>
						</div>
					{/if}
				</div>
			{:else}
				<a class="cta" href="/login">Sign in</a>
			{/if}
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

	.profile-container {
		position: relative;
	}

	.profile-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 50%;
		border: 2px solid rgba(240, 99, 76, 0.5);
		background: transparent;
		cursor: pointer;
		transition: border-color 0.15s ease, transform 0.15s ease;
		padding: 0;
	}

	.profile-button:hover,
	.profile-button:focus-visible {
		border-color: #f0634c;
		transform: scale(1.05);
		outline: none;
	}

	.profile-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: linear-gradient(135deg, #f0634c 0%, #d73b65 100%);
		color: #0b1021;
		font-weight: 700;
		font-size: 0.85rem;
	}

	.profile-menu {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.5rem;
		min-width: 200px;
		background: rgba(15, 23, 42, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.7rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(12px);
		z-index: 100;
		overflow: hidden;
	}

	.profile-info {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.profile-name {
		margin: 0;
		color: #e8ecf5;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.profile-email {
		margin: 0.25rem 0 0;
		color: #9aa4bd;
		font-size: 0.85rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.menu-link {
		display: block;
		padding: 0.65rem 1rem;
		color: #c4ccdd;
		text-decoration: none;
		transition: background 0.15s ease, color 0.15s ease;
		border: none;
	}

	.menu-link:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
	}

	.menu-link.logout {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		color: #f0634c;
	}

	.menu-link.logout:hover {
		background: rgba(240, 99, 76, 0.1);
	}

	.page {
		padding: 0;
		width: 100%;
		margin: 0;
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

