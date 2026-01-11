<script>
	import { goto } from '$app/navigation';
	const start = () => goto('/welcome');
</script>

<div class="home">
	<div class="hero">
		<h1>MentalHealth</h1>
		<p class="tagline">Deine Reise zu besserem Wohlbefinden</p>
		<button class="btn btn-primary" on:click={start}>Jetzt starten</button>
		<p class="cta-hint">Oder navigiere direkt zum <a href="/dashboard">Dashboard</a></p>
	</div>
</div>

<style>
	.home {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	.hero {
		max-width: 700px;
		width: 100%;
		text-align: center;
	}

	.hero h1 {
		margin: 0 0 0.5rem 0;
		font-size: 3rem;
		background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.tagline {
		margin: 0 0 2rem 0;
		font-size: 1.3rem;
		color: #64748b;
		line-height: 1.6;
	}

	.btn {
		padding: 1rem 2rem;
		border: none;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 200ms ease;
		margin-bottom: 1.5rem;
	}

	.btn-primary {
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		color: white;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 24px rgba(124, 58, 237, 0.3);
	}

	.btn-primary:active {
		transform: translateY(0);
	}

	.cta-hint {
		color: #64748b;
		font-size: 0.95rem;
		margin: 0;
	}

	.cta-hint a {
		color: #7c3aed;
		text-decoration: none;
		font-weight: 600;
	}

	.cta-hint a:hover {
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.hero h1 {
			font-size: 2rem;
		}

		.tagline {
			font-size: 1.1rem;
		}
	}
</style>
