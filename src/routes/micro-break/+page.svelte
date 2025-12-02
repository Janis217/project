<script>
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	let seconds = 20;
	let timer;

	function start() {
		timer = setInterval(() => {
			seconds -= 1;
			if (seconds <= 0) {
				clearInterval(timer);
			}
		}, 1000);
	}

	function skip() {
		if (timer) clearInterval(timer);
		goto('/exercise');
	}

	function proceed() {
		goto('/exercise');
	}

	start();
	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div style="min-height:80vh; display:flex; align-items:center; justify-content:center; padding:2rem;">
	<div style="max-width:520px; width:100%; text-align:center;">
		<h2>Kleine Pause</h2>
		<p style="color:#666; margin-bottom:1rem">Atme kurz durch. Mikro‑Pause endet in {seconds}s.</p>
		<div style="display:flex; gap:0.6rem; justify-content:center;">
			<button on:click={proceed} style="padding:0.5rem 0.9rem; background:#60a5fa; color:#fff; border:none; border-radius:8px;">Start Exercise</button>
			<button on:click={skip} style="padding:0.5rem 0.9rem; background:#e5e7eb; border:none; border-radius:8px;">Überspringen</button>
		</div>
	</div>
</div>
