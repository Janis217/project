<script>
	import { goto } from '$app/navigation';
	const start = () => goto('/checkin');
</script>

<div class="welcome-container">
	<div class="welcome-card">
		<div class="welcome-header">
			<h1>Willkommen bei MentalHealth</h1>
			<p class="subtitle">Tracke deine Stimmung, verstehe deine Muster</p>
		</div>

		<div class="features">
			<div class="feature">
				<span class="feature-icon">📊</span>
				<h3>Tägliches Tracking</h3>
				<p>Halte deine Stimmungen fest und erkenne Muster über die Zeit</p>
			</div>
			<div class="feature">
				<span class="feature-icon">💪</span>
				<h3>Kurze Übungen</h3>
				<p>Wirksame Micro-Breaks und Achtsamkeitsübungen zur Stressreduktion</p>
			</div>
			<div class="feature">
				<span class="feature-icon">📈</span>
				<h3>Insights</h3>
				<p>Visualisiere deine Fortschritte mit Statistiken</p>
			</div>
		</div>

		<button class="btn btn-primary" on:click={start}>Check-In starten</button>
		<p class="hint">
			<strong>Tipp:</strong> Deine Daten sind privat und werden sicher gespeichert.
		</p>
	</div>
</div>

<style>
	.welcome-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	.welcome-card {
		max-width: 600px;
		width: 100%;
		background: white;
		border-radius: 16px;
		padding: 3rem;
		box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
	}

	.welcome-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.welcome-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		color: #64748b;
		font-size: 1.1rem;
		margin: 0;
	}

	.features {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.feature {
		padding: 1rem;
		background: #f8fafc;
		border-radius: 12px;
		border-left: 4px solid #7c3aed;
	}

	.feature-icon {
		font-size: 1.8rem;
		display: block;
		margin-bottom: 0.5rem;
	}

	.feature h3 {
		margin: 0.5rem 0;
		font-size: 1rem;
		color: #1e293b;
	}

	.feature p {
		margin: 0;
		font-size: 0.9rem;
		color: #64748b;
	}

	.btn {
		width: 100%;
		padding: 1rem;
		border: none;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 200ms ease;
	}

	.btn-primary {
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		color: white;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(124, 58, 237, 0.25);
	}

	.btn-primary:active {
		transform: translateY(0);
	}

	.btn-primary:focus-visible {
		outline: 2px solid #7c3aed;
		outline-offset: 2px;
	}

	.hint {
		text-align: center;
		margin-top: 1.5rem;
		color: #64748b;
		font-size: 0.9rem;
	}

	@media (max-width: 640px) {
		.welcome-card {
			padding: 1.5rem;
		}

		.welcome-header h1 {
			font-size: 1.6rem;
		}

		.features {
			gap: 1rem;
		}
	}
</style>
