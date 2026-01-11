<script>
	import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="header">
	<div class="header-container">
		<a href="/" class="logo">MentalHealth</a>
		<nav class="nav">
			<a href="/welcome" class="nav-link">Start</a>
			<a href="/checkin" class="nav-link">Check-In</a>
			<a href="/dashboard" class="nav-link">Dashboard</a>
		</nav>
	</div>
</header>

<main class="main-content">
	<slot />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background: #f8fafc;
		color: #1e293b;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.header {
		background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
		padding: 1rem;
		color: white;
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.header-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
	}

	.logo {
		color: inherit;
		text-decoration: none;
		font-weight: 700;
		font-size: 1.5rem;
		letter-spacing: -0.5px;
	}

	.nav {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.nav-link {
		color: rgba(255, 255, 255, 0.95);
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.95rem;
		font-weight: 500;
		transition: background-color 150ms ease, color 150ms ease;
	}

	.nav-link:hover {
		background-color: rgba(255, 255, 255, 0.15);
	}

	.nav-link:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
	}

	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		min-height: calc(100vh - 80px);
	}

	/* Mood chip styles */
	:global(.mood-chip) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 120px;
		height: 120px;
		border-radius: 20px;
		font-size: 3rem;
		font-weight: 600;
		box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);
		transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms ease, outline 150ms ease;
		border: 2px solid transparent;
		background: white;
		cursor: pointer;
	}

	:global(button.mood-chip) {
		border: 2px solid #e2e8f0;
	}

	:global(button.mood-chip:hover) {
		transform: translateY(-6px);
		box-shadow: 0 12px 24px rgba(16, 24, 40, 0.12);
		border-color: #cbd5e1;
	}

	:global(button.mood-chip:active) {
		transform: translateY(-2px) scale(0.98);
	}

	:global(button.mood-chip:focus-visible) {
		outline: 3px solid #7c3aed;
		outline-offset: 2px;
	}

	:global([data-role="display"].mood-chip) {
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		border: none;
		background: #f1f5f9;
		width: 80px;
		height: 80px;
		font-size: 2rem;
	}
</style>
