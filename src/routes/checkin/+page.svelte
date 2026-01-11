<script>
	import { goto } from '$app/navigation';

	const MOODS = [
		{ level: 1, emoji: '😞', label: 'Sehr schlecht', color: '#ef4444' },
		{ level: 2, emoji: '😕', label: 'Schlecht', color: '#f97316' },
		{ level: 3, emoji: '😐', label: 'Neutral', color: '#eab308' },
		{ level: 4, emoji: '🙂', label: 'Gut', color: '#84cc16' },
		{ level: 5, emoji: '😄', label: 'Sehr gut', color: '#22c55e' }
	];

	let hoveredMood = null;

	const pick = (level) => {
		sessionStorage.setItem('selectedMood', String(level));
		goto('/result');
	};
</script>

<div class="checkin-container">
	<div class="checkin-content">
		<h1>Wie fühlst du dich gerade?</h1>
		<p class="description">Wähle das Emoji, das deine aktuelle Stimmung am besten beschreibt.</p>

		<div class="mood-grid">
			{#each MOODS as mood (mood.level)}
				<div
					class="mood-option"
					role="group"
					aria-label={mood.label}
					on:mouseenter={() => (hoveredMood = mood.level)}
					on:mouseleave={() => (hoveredMood = null)}
				>
					<button
						class="mood-chip {hoveredMood === mood.level ? 'hovering' : ''}"
						on:click={() => pick(mood.level)}
						aria-label={mood.label}
						title={mood.label}
						style="--mood-color: {mood.color}"
					>
						{mood.emoji}
					</button>
					{#if hoveredMood === mood.level}
						<p class="mood-label">{mood.label}</p>
					{/if}
				</div>
			{/each}
		</div>

		<p class="hint">💡 Hinweis: Du kannst diese Übung jederzeit vom Dashboard aus wiederholen.</p>
	</div>
</div>

<style>
	.checkin-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	.checkin-content {
		max-width: 700px;
		width: 100%;
		text-align: center;
	}

	.checkin-content h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		color: #1e293b;
	}

	.description {
		color: #64748b;
		font-size: 1.1rem;
		margin: 0 0 2rem 0;
		line-height: 1.6;
	}

	.mood-grid {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.mood-option {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.mood-chip.hovering) {
		transform: scale(1.1) translateY(-8px);
		box-shadow: 0 16px 32px rgba(124, 58, 237, 0.25);
	}

	.mood-label {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: #1e293b;
		min-height: 1.2rem;
	}

	.hint {
		color: #64748b;
		font-size: 0.95rem;
		margin: 2rem 0 0 0;
	}

	@media (max-width: 640px) {
		.mood-grid {
			gap: 1rem;
		}

		.checkin-content h1 {
			font-size: 1.5rem;
		}
	}
</style>
