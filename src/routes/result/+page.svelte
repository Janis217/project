<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let mood = null;
	const EMOJIS = {
		1: '😞',
		2: '😕',
		3: '😐',
		4: '🙂',
		5: '😄'
	};

	const FEEDBACK = {
		1: 'Es tut mir leid, dass du dich so fühlst. Lass uns dir mit einer Achtsamkeitsübung helfen.',
		2: 'Es scheint, dir geht es gerade nicht so gut. Eine kurze Pause könnte helfen.',
		3: 'Du bist in einer neutralen Stimmung. Lass mich dir etwas Energie geben.',
		4: 'Prima! Dir geht es schon besser. Eine kurze Übung könnte dir noch mehr helfen.',
		5: 'Wunderbar! Du hast eine positive Stimmung. Lass sie noch ein wenig verstärken.'
	};

	onMount(() => {
		mood = sessionStorage.getItem('selectedMood') || null;
		if (!mood) {
			goto('/checkin');
		}
	});
</script>

<div class="result-container">
	{#if mood}
		<div class="result-card">
			<div class="result-header">
				<p class="result-subtitle">Dein Check-In</p>
				<div class="mood-display">
					<span class="mood-chip" data-role="display">{EMOJIS[Number(mood)]}</span>
				</div>
			</div>

			<div class="result-feedback">
				<p>{FEEDBACK[Number(mood)]}</p>
			</div>

			<div class="result-actions">
				<button class="btn btn-primary" on:click={() => goto('/micro-break')}>
					Zur Mikro-Pause
				</button>
				<button class="btn btn-secondary" on:click={() => goto('/exercise')}>
					Direkt zur Übung
				</button>
				<button class="btn btn-outline" on:click={() => goto('/dashboard')}>
					Zum Dashboard
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.result-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	.result-card {
		max-width: 500px;
		width: 100%;
		background: white;
		border-radius: 16px;
		padding: 2.5rem;
		box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
		text-align: center;
	}

	.result-header {
		margin-bottom: 2rem;
	}

	.result-subtitle {
		margin: 0;
		color: #64748b;
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.mood-display {
		margin-top: 1rem;
	}

	.result-feedback {
		margin: 1.5rem 0 2rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%);
		border-radius: 12px;
		border-left: 4px solid #7c3aed;
	}

	.result-feedback p {
		margin: 0;
		color: #1e293b;
		font-size: 1rem;
		line-height: 1.6;
	}

	.result-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.btn {
		padding: 0.75rem;
		border: none;
		border-radius: 10px;
		font-size: 0.95rem;
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

	.btn-secondary {
		background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
		color: white;
	}

	.btn-secondary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(6, 182, 212, 0.25);
	}

	.btn-outline {
		background: #f1f5f9;
		color: #1e293b;
		border: 1px solid #cbd5e1;
	}

	.btn-outline:hover {
		background: #e2e8f0;
	}

	@media (max-width: 640px) {
		.result-card {
			padding: 1.5rem;
		}
	}
</style>
