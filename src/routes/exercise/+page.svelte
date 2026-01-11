<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let mood = null;
	let note = '';
	let loading = false;
	let error = null;
	let success = false;

	const EMOJIS = {
		1: '😞',
		2: '😕',
		3: '😐',
		4: '🙂',
		5: '😄'
	};

	const EXERCISES = {
		1: {
			title: 'Atemübung',
			description: 'Progressive Muskelentspannung – spanne deine Muskeln an und entspanne sie systematisch.',
			duration: '5 Minuten'
		},
		2: {
			title: 'Achtsamkeit',
			description: 'Konzentriere dich auf deine fünf Sinne. Was siehst, hörst, riechst, schmeckst und spürst du?',
			duration: '3 Minuten'
		},
		3: {
			title: 'Meditation',
			description: 'Eine einfache Atemmeditation. Setze dich bequem hin und folge deinem Atem.',
			duration: '5 Minuten'
		},
		4: {
			title: 'Bewegung',
			description: 'Leichte Dehnübungen und Stretching, um Verspannungen zu lösen.',
			duration: '5 Minuten'
		},
		5: {
			title: 'Visualisierung',
			description: 'Stelle dir deinen glücklichsten Ort vor und verweile dort für einen Moment der Dankbarkeit.',
			duration: '3 Minuten'
		}
	};

	onMount(() => {
		mood = sessionStorage.getItem('selectedMood');
		if (!mood) goto('/checkin');
	});

	async function complete() {
		if (!mood) return;

		loading = true;
		error = null;

		try {
			const res = await fetch('/api/moods', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ level: Number(mood), note })
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body?.error || 'Fehler beim Speichern');
			}

			success = true;
			sessionStorage.removeItem('selectedMood');

			// Redirect nach 1.5 Sekunden
			setTimeout(() => {
				goto('/dashboard');
			}, 1500);
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}
</script>

<div class="exercise-container">
	<div class="exercise-card">
		{#if success}
			<div class="success-message">
				<span class="success-icon">✓</span>
				<h2>Danke!</h2>
				<p>Dein Check-In wurde gespeichert.</p>
			</div>
		{:else}
			<div class="exercise-header">
				<div class="mood-display">
					<span class="mood-chip" data-role="display">{mood && EMOJIS[Number(mood)]}</span>
				</div>
				{#if mood && EXERCISES[mood]}
					<h1>{EXERCISES[mood].title}</h1>
					<p class="exercise-duration">⏱️ {EXERCISES[mood].duration}</p>
				{/if}
			</div>

			{#if mood && EXERCISES[mood]}
				<div class="exercise-description">
					<p>{EXERCISES[mood].description}</p>
				</div>
			{/if}

			<div class="exercise-form">
				<label for="note">
					<span>Notiz (optional)</span>
					<p class="label-hint">Wie hast du dich während der Übung gefühlt?</p>
				</label>
				<textarea
					id="note"
					placeholder="Schreibe hier deine Gedanken auf..."
					bind:value={note}
					disabled={loading}
				></textarea>

				{#if error}
					<div class="error-message">
						<span>⚠️</span>
						<p>{error}</p>
					</div>
				{/if}

				<button class="btn btn-primary" on:click={complete} disabled={loading}>
					{loading ? 'Speichert...' : 'Übung abgeschlossen'}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.exercise-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	.exercise-card {
		max-width: 600px;
		width: 100%;
		background: white;
		border-radius: 16px;
		padding: 2.5rem;
		box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
	}

	.success-message {
		text-align: center;
		padding: 2rem 0;
	}

	.success-icon {
		display: block;
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.success-message h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.8rem;
		color: #10b981;
	}

	.success-message p {
		margin: 0;
		color: #64748b;
		font-size: 1rem;
	}

	.exercise-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.mood-display {
		margin-bottom: 1rem;
	}

	.exercise-card h1 {
		margin: 1rem 0 0.25rem 0;
		font-size: 2rem;
		color: #1e293b;
	}

	.exercise-duration {
		margin: 0;
		color: #64748b;
		font-size: 0.95rem;
	}

	.exercise-description {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: #f0f9ff;
		border-radius: 12px;
		border-left: 4px solid #0ea5e9;
	}

	.exercise-description p {
		margin: 0;
		color: #1e293b;
		font-size: 1rem;
		line-height: 1.6;
	}

	.exercise-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		text-align: left;
	}

	label span {
		display: block;
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: #1e293b;
	}

	.label-hint {
		margin: 0.25rem 0 0 0;
		font-size: 0.85rem;
		color: #64748b;
	}

	textarea {
		width: 100%;
		min-height: 120px;
		padding: 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		font-family: inherit;
		font-size: 1rem;
		resize: vertical;
		transition: border-color 150ms ease, box-shadow 150ms ease;
	}

	textarea:focus {
		outline: none;
		border-color: #7c3aed;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	textarea:disabled {
		background: #f1f5f9;
		color: #94a3b8;
		cursor: not-allowed;
	}

	.error-message {
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		background: #fee2e2;
		border-radius: 8px;
		border-left: 4px solid #ef4444;
		color: #991b1b;
		font-size: 0.95rem;
	}

	.error-message span {
		font-size: 1.2rem;
		flex-shrink: 0;
	}

	.error-message p {
		margin: 0;
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
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);
	}

	.btn-primary:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		.exercise-card {
			padding: 1.5rem;
		}

		.exercise-card h1 {
			font-size: 1.5rem;
		}
	}
</style>
