<script>
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	let seconds = 30;
	let timer;
	let progress = 0;
	const TOTAL_SECONDS = 30;

	const BREAK_TIPS = [
		'Atme tief durch: Einatmen auf 4, halten auf 4, ausatmen auf 4',
		'Achte auf deine Schultern – sind sie angespannt? Entspanne sie.',
		'Schau kurz aus dem Fenster oder in die Ferne',
		'Trinke einen Schluck Wasser',
		'Strecke deine Arme über dem Kopf aus'
	];

	let currentTip = BREAK_TIPS[Math.floor(Math.random() * BREAK_TIPS.length)];

	function start() {
		timer = setInterval(() => {
			if (seconds > 0) {
				seconds -= 1;
				progress = ((TOTAL_SECONDS - seconds) / TOTAL_SECONDS) * 100;
			}
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
		if (timer) clearInterval(timer);
		goto('/exercise');
	}

	start();
	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<div class="break-container">
	<div class="break-card">
		<h1>Kurze Pause</h1>
		<p class="break-subtitle">Nimm dir {TOTAL_SECONDS} Sekunden Zeit, um durchzuatmen</p>

		<div class="timer-wrapper">
			<div class="progress-ring">
				<svg width="240" height="240" viewBox="0 0 240 240">
					<circle cx="120" cy="120" r="110" stroke="#e2e8f0" stroke-width="8" fill="none" />
					<circle
						cx="120"
						cy="120"
						r="110"
						stroke="#7c3aed"
						stroke-width="8"
						fill="none"
						stroke-dasharray="692"
						stroke-dashoffset={692 - (progress / 100) * 692}
						stroke-linecap="round"
					/>
				</svg>
				<div class="timer-display">
					<span class="timer-text">{seconds}</span>
					<span class="timer-unit">Sekunden</span>
				</div>
			</div>
		</div>

		<div class="break-tip">
			<p>{currentTip}</p>
		</div>

		<div class="break-actions">
			{#if seconds > 0}
				<button class="btn btn-secondary" on:click={skip}> Überspringen </button>
			{:else}
				<button class="btn btn-primary" on:click={proceed}> Zur Übung </button>
			{/if}
		</div>
	</div>
</div>

<style>
	.break-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	.break-card {
		max-width: 500px;
		width: 100%;
		background: white;
		border-radius: 16px;
		padding: 2.5rem;
		box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
		text-align: center;
	}

	.break-card h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		color: #1e293b;
	}

	.break-subtitle {
		margin: 0 0 2rem 0;
		color: #64748b;
		font-size: 1rem;
	}

	.timer-wrapper {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
	}

	.progress-ring {
		position: relative;
		width: 240px;
		height: 240px;
	}

	.progress-ring svg {
		transform: rotate(-90deg);
	}

	.timer-display {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}

	.timer-text {
		display: block;
		font-size: 3rem;
		font-weight: 700;
		color: #7c3aed;
		line-height: 1;
	}

	.timer-unit {
		display: block;
		font-size: 0.85rem;
		color: #64748b;
		margin-top: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.break-tip {
		margin: 2rem 0;
		padding: 1.5rem;
		background: #f0fdf4;
		border-radius: 12px;
		border-left: 4px solid #10b981;
	}

	.break-tip p {
		margin: 0;
		color: #1e293b;
		font-size: 1rem;
		line-height: 1.6;
	}

	.break-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 10px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 200ms ease;
		min-width: 140px;
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
		background: #f1f5f9;
		color: #1e293b;
		border: 1px solid #cbd5e1;
	}

	.btn-secondary:hover {
		background: #e2e8f0;
	}

	@media (max-width: 640px) {
		.break-card {
			padding: 1.5rem;
		}

		.timer-text {
			font-size: 2.5rem;
		}
	}
</style>
