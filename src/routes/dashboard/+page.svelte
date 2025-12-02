<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let history = [];
	let loading = true;
	let error = null;
	let streak = 0;
	const EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

	onMount(async () => {
		await load();
	});

	async function load() {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/moods');
			if (!res.ok) throw new Error('Failed to load');
			history = await res.json();
			computeStreak();
		} catch (err) {
			error = err.message;
		}
		loading = false;
	}

	function computeStreak() {
		if (!history || history.length === 0) {
			streak = 0;
			return;
		}
		// simple consecutive-day streak calculation
		let count = 0;
		let last = null;
		for (const item of history) {
			const d = new Date(item.createdAt);
			if (!last) {
				count = 1;
				last = d;
				continue;
			}
			const diff = Math.floor((last - d) / (1000 * 60 * 60 * 24));
			if (diff <= 1) {
				count += 1;
				last = d;
			} else break;
		}
		streak = count;
	}

	function startCheckin() {
		goto('/checkin');
	}
</script>

<div style="min-height:70vh; padding:2rem; max-width:900px; margin:0 auto;">
	<header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
		<h2>Dashboard</h2>
		<div>
			<button on:click={startCheckin} style="padding:0.4rem 0.8rem; border-radius:8px; background:#7c3aed; color:#fff; border:none;">Neues Check‑In</button>
		</div>
	</header>

	{#if loading}
		<p>Lädt…</p>
	{:else}
		{#if error}
			<p style="color:#b91c1c">{error}</p>
		{:else}
			<section style="margin-bottom:1rem;">
				<p>Aktuelle Streak: <strong>{streak}</strong></p>
			</section>
			<section>
				<h3>Letzte Einträge</h3>
				{#if history.length === 0}
					<p style="color:#666">Keine Einträge vorhanden.</p>
				{:else}
					<ul style="list-style:none; padding:0;">
						{#each history as h}
							<li style="padding:0.6rem; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
								<div style="display:flex; gap:0.6rem; align-items:center;">
									<span class="mood-chip" data-role="display" data-level={h.level}>{EMOJIS[h.level]}</span>
									<div>
										<strong>Level {h.level}</strong>
										<div style="color:#666; font-size:0.9rem">{h.note}</div>
									</div>
								</div>
								<time style="color:#999; font-size:0.85rem">{new Date(h.createdAt).toLocaleString()}</time>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/if}
	{/if}
</div>
