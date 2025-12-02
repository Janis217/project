<script>
	import { goto } from '$app/navigation';

	const EMOJIS = {
		1: '😞',
		2: '😕',
		3: '😐',
		4: '🙂',
		5: '😄'
	};

	const pick = (level) => {
		sessionStorage.setItem('selectedMood', String(level));
		goto('/result');
	};
</script>

<div style="min-height:70vh; display:flex; align-items:center; justify-content:center; padding:2rem;">
	<div style="max-width:520px; width:100%; text-align:center;">
		<h2>Wie fühlst du dich gerade?</h2>
		<p style="color:#666; margin-bottom:1rem">Wähle das Emoji, das deine Stimmung am besten beschreibt.</p>
		<div style="display:flex; gap:0.8rem; justify-content:center; margin-bottom:1rem;">
			{#each Object.entries(EMOJIS) as [k, emoji]}
				<button class="mood-chip" data-level={k} on:click={() => pick(Number(k))} aria-label={`Stimmung ${k}`} title={emoji}>{emoji}</button>
			{/each}
		</div>
		
	</div>
</div>
