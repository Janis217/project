<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let mood = null;
	let note = '';
	let loading = false;
	let error = null;
	const EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

	onMount(() => {
		mood = sessionStorage.getItem('selectedMood');
		if (!mood) goto('/checkin');
	});

	async function complete() {
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
				throw new Error(body?.error || 'Failed to save');
			}
			// clear selected mood
			sessionStorage.removeItem('selectedMood');
			goto('/dashboard');
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}
</script>

<div style="min-height:70vh; display:flex; align-items:center; justify-content:center; padding:2rem;">
	<div style="max-width:640px; width:100%; text-align:center;">
		<h2>Exercise</h2>
		<p style="color:#555">Stimmung: <span class="mood-chip" data-role="display" data-level={Number(mood)}>{EMOJIS[Number(mood)]}</span></p>
		<textarea placeholder="Optional: Notiz zur Übung" bind:value={note} style="width:100%; min-height:120px; margin:0.5rem 0; padding:0.6rem; border-radius:8px;"></textarea>
		{#if error}
			<p style="color:#b91c1c">{error}</p>
		{/if}
		<button on:click={complete} disabled={loading} style="padding:0.6rem 1rem; background:#10b981; color:#fff; border:none; border-radius:8px;">{loading ? 'Speichern...' : 'Übung abgeschlossen'}</button>
	</div>
</div>
