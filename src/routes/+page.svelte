<script>
	// Root landing page: link to the prototypical workflow
	import { goto } from '$app/navigation';
	const start = () => goto('/welcome');
</script>

<div class="min-h-screen flex items-center justify-center p-6">
	<div style="max-width:720px; width:100%; text-align:center;">
		<h1 style="font-size:2rem; margin-bottom:0.5rem;">MentalHealth</h1>
		
		<button on:click={start} style="padding:0.6rem 1.2rem; font-weight:600; border-radius:8px; background:linear-gradient(90deg,#7c3aed,#2563eb); color:white; border:none; cursor:pointer;">Start</button>
		<p style="margin-top:1rem; color:#666">Or navigate to <a href="/dashboard">Dashboard</a></p>
	</div>
</div>
