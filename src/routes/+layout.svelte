<script>
	import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header style="background:linear-gradient(90deg,#7c3aed,#06b6d4); padding:0.6rem 1rem; color:#fff;">
	<div style="max-width:1000px; margin:0 auto; display:flex; align-items:center; justify-content:space-between;">
		<a href="/" style="color:inherit; text-decoration:none; font-weight:700;">MentalHealth</a>
		<nav style="display:flex; gap:0.6rem; align-items:center;">
			<a href="/welcome" style="color:rgba(255,255,255,0.9); text-decoration:none; padding:0.35rem 0.6rem; border-radius:6px;">Start</a>
			<a href="/checkin" style="color:rgba(255,255,255,0.9); text-decoration:none; padding:0.35rem 0.6rem; border-radius:6px;">Check‑In</a>
			<a href="/dashboard" style="color:rgba(255,255,255,0.9); text-decoration:none; padding:0.35rem 0.6rem; border-radius:6px;">Dashboard</a>
		</nav>
	</div>
</header>

<main style="max-width:1000px; margin:1.2rem auto; padding:0 1rem;">
	<slot />
</main>

<style>
  /* Mood chip styles used across pages */
  :global(.mood-chip) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 144px;
    height: 144px;
    border-radius: 16px;
    font-size: 2.4rem;
    font-weight: 600;
    box-shadow: 0 6px 14px rgba(16,24,40,0.06);
    transition: transform 120ms ease, box-shadow 120ms ease, outline 120ms ease;
    border: none;
    background: #fff;
    cursor: pointer;
  }	:global(button.mood-chip:hover) {
		transform: translateY(-4px);
		box-shadow: 0 10px 24px rgba(16,24,40,0.12);
	}

	:global(button.mood-chip:active) {
		transform: translateY(-1px) scale(0.98);
	}

	:global(button.mood-chip:focus-visible) {
		outline: 3px solid rgba(99,102,241,0.28);
		outline-offset: 4px;
	}

	/* color variations by data-level attribute */
	:global(.mood-chip[data-level="1"]) { background: linear-gradient(180deg,#fee2e2,#fecaca); color:#7f1d1d; }
	:global(.mood-chip[data-level="2"]) { background: linear-gradient(180deg,#fff7ed,#fde68a); color:#92400e; }
	:global(.mood-chip[data-level="3"]) { background: linear-gradient(180deg,#f3f4f6,#e5e7eb); color:#374151; }
	:global(.mood-chip[data-level="4"]) { background: linear-gradient(180deg,#ecfeff,#bbf7d0); color:#065f46; }
	:global(.mood-chip[data-level="5"]) { background: linear-gradient(180deg,#ecfeff,#bbf7d0); color:#065f46; }

	/* make non-button chips slightly smaller and non-interactive */
	:global(.mood-chip[data-role="display"]) {
		width: 56px;
		height: 56px;
		cursor: default;
		box-shadow: none;
		transform: none;
		font-size: 1.25rem;
	}
</style>
