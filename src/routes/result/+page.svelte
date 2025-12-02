<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let mood = null;
	const EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

	onMount(() => {
		mood = sessionStorage.getItem('selectedMood') || null;
		if (!mood) {
			goto('/checkin');
		}
	});
</script>

<div style="min-height:70vh; display:flex; align-items:center; justify-content:center; padding:2rem;">
	<div style="max-width:520px; width:100%; text-align:center;">
		{#if mood}
			<h2>Danke für dein Check‑In</h2>
			<p style="margin-bottom:1rem">Du hast gewählt: <span class="mood-chip" data-role="display" data-level={Number(mood)}>{EMOJIS[Number(mood)]}</span></p>
			<button on:click={() => goto('/micro-break')} style="padding:0.6rem 1rem; background:#06b6d4; color:#fff; border:none; border-radius:8px; cursor:pointer;">Weiter zum Micro‑Break</button>
		{/if}
	</div>
</div>
