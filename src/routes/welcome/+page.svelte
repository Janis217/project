<script>
	import { goto } from '$app/navigation';
	const start = () => goto('/checkin');
</script>

<div style="min-height:80vh; display:flex; align-items:center; justify-content:center; padding:2rem;">
	<div style="max-width:480px; width:100%; text-align:center; border-radius:12px; padding:2rem; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
		<h2 style="margin-bottom:0.5rem">Willkommen</h2>
		<p style="color:#555; margin-bottom:1rem">Starte den Mood Check‑In</p>
		<button on:click={start} style="padding:0.6rem 1rem; background:#7c3aed; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Start</button>
	</div>
</div>
