<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let history = [];
	let loading = true;
	let error = null;
	let deleteConfirmId = null; // Track which mood we're confirming delete for
	let filterRange = 'all'; // all | today | last7 | last30 | last365
	let trendRange = '7'; // 7 | 30 | 365 | all
	let stats = {
		streak: 0,
		average: 0,
		total: 0,
		trend: 'stable'
	};

	const EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };
	const MOODS_LABELS = { 1: 'Sehr schlecht', 2: 'Schlecht', 3: 'Neutral', 4: 'Gut', 5: 'Sehr gut' };
	const MOODS_COLORS = {
		1: '#ef4444',
		2: '#f97316',
		3: '#eab308',
		4: '#84cc16',
		5: '#22c55e'
	};

	onMount(async () => {
		await load();
	});

	async function load() {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/moods');
			if (!res.ok) throw new Error('Fehler beim Laden');
			history = await res.json();
			// Sort by createdAt descending (newest first)
			history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			computeStats();
		} catch (err) {
			error = err.message;
		}
		loading = false;
	}

	async function deleteMood(id) {
		try {
			const res = await fetch(`/api/moods?id=${encodeURIComponent(id)}`, {
				method: 'DELETE'
			});
			if (!res.ok) throw new Error('Fehler beim Löschen');
			
			// Remove from local list
			history = history.filter(item => item._id !== id);
			computeStats();
			deleteConfirmId = null;
		} catch (err) {
			error = err.message;
		}
	}

	function confirmDelete(id) {
		deleteConfirmId = id;
	}

	function cancelDelete() {
		deleteConfirmId = null;
	}

	function computeStats() {
		if (!history || history.length === 0) {
			stats = { streak: 0, average: 0, total: 0, trend: 'stable' };
			return;
		}

		// Total
		stats.total = history.length;

		// Average
		const avg = history.reduce((sum, h) => sum + h.level, 0) / history.length;
		stats.average = avg.toFixed(1);

		// Streak
		let streak = 0;
		let last = null;
		for (const item of history) {
			const d = new Date(item.createdAt);
			if (!last) {
				streak = 1;
				last = d;
				continue;
			}
			const diff = Math.floor((last - d) / (1000 * 60 * 60 * 24));
			if (diff <= 1) {
				streak += 1;
				last = d;
			} else break;
		}
		stats.streak = streak;

		// Trend (compare last 7 with previous 7)
		const recent = history.slice(0, Math.min(7, history.length));
		const previous = history.slice(Math.min(7, history.length), Math.min(14, history.length));
		if (previous.length > 0) {
			const recentAvg = recent.reduce((s, h) => s + h.level, 0) / recent.length;
			const prevAvg = previous.reduce((s, h) => s + h.level, 0) / previous.length;
			if (recentAvg > prevAvg + 0.5) stats.trend = 'improving';
			else if (recentAvg < prevAvg - 0.5) stats.trend = 'declining';
			else stats.trend = 'stable';
		}
	}

	function getFilteredHistory() {
		if (!history || history.length === 0) return [];
		
		let items = [...history];
		
		if (filterRange === 'today') {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const todayTime = today.getTime();
			items = items.filter((entry) => {
				const entryDate = new Date(entry.createdAt);
				entryDate.setHours(0, 0, 0, 0);
				return entryDate.getTime() === todayTime;
			});
		} else if (filterRange === 'last7') {
			const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
			items = items.filter((entry) => new Date(entry.createdAt).getTime() >= cutoff);
		} else if (filterRange === 'last30') {
			const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
			items = items.filter((entry) => new Date(entry.createdAt).getTime() >= cutoff);
		} else if (filterRange === 'last365') {
			const cutoff = Date.now() - 365 * 24 * 60 * 60 * 1000;
			items = items.filter((entry) => new Date(entry.createdAt).getTime() >= cutoff);
		}
		
		return items;
	}

	function getMoodCounts() {
		const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		history.forEach((h) => {
			counts[h.level]++;
		});
		return counts;
	}

	function startCheckin() {
		goto('/checkin');
	}

	function getChartHTML() {
		const counts = getMoodCounts();
		const max = Math.max(...Object.values(counts), 1);
		let html = '<div class="chart">';
		Object.entries(counts).forEach(([level, count]) => {
			const height = (count / max) * 100;
			const color = MOODS_COLORS[level];
			html += `<div class="chart-bar" style="height: ${height}%; background: ${color};" title="${MOODS_LABELS[level]}: ${count}">
                <span class="chart-emoji">${EMOJIS[level]}</span>
                <span class="chart-count">${count}</span>
            </div>`;
		});
		html += '</div>';
		return html;
	}

	// Trend Chart Data for selectable range
	function getTrendData(range) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// determine number of days
		let daysCount = 7;
		if (range === '30') daysCount = 30;
		else if (range === '365') daysCount = 365;
		else if (range === 'all') {
			if (history.length > 0) {
				const earliest = history.reduce((min, h) => {
					const d = new Date(h.createdAt); d.setHours(0,0,0,0);
					return (!min || d < min) ? d : min;
				}, null);
				const diffDays = Math.max(1, Math.floor((today.getTime() - earliest.getTime()) / (24*60*60*1000)) + 1);
				daysCount = diffDays;
			} else {
				daysCount = 7;
			}
		}

		const useMonthlyBuckets = range === '365' || (range === 'all' && daysCount > 120);

		if (useMonthlyBuckets) {
			const months = [];
			const start = new Date(today);
			start.setDate(1);
			if (range === '365') {
				start.setMonth(start.getMonth() - 11);
			} else {
				const earliest = history.reduce((min, h) => {
					const d = new Date(h.createdAt); d.setHours(0,0,0,0); d.setDate(1);
					return (!min || d < min) ? d : min;
				}, start);
				start.setTime(earliest.getTime());
			}

			const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
			const labelsYear = range === 'all' && start.getFullYear() !== today.getFullYear();

			const cursor = new Date(start);
			while (cursor <= today) {
				months.push({
					date: new Date(cursor),
					label: cursor.toLocaleDateString('de-CH', { month: 'short', year: labelsYear ? '2-digit' : undefined }),
					moods: []
				});
				cursor.setMonth(cursor.getMonth() + 1);
			}

			history.forEach(entry => {
				const entryDate = new Date(entry.createdAt);
				entryDate.setHours(0, 0, 0, 0);
				if (entryDate < start || entryDate > today) return;
				entryDate.setDate(1);
				const bucket = months.find(m => monthKey(m.date) === monthKey(entryDate));
				if (bucket) bucket.moods.push(entry.level);
			});

			// If all-time spans mehr als 12 Monate, auf Jahres-Buckets verdichten
			if (range === 'all' && months.length > 12) {
				const yearsMap = new Map();
				history.forEach(entry => {
					const d = new Date(entry.createdAt);
					d.setHours(0,0,0,0);
					if (d < start || d > today) return;
					const y = d.getFullYear();
					if (!yearsMap.has(y)) yearsMap.set(y, []);
					yearsMap.get(y).push(entry.level);
				});
				const years = Array.from(yearsMap.entries()).sort((a,b) => a[0]-b[0]).map(([year, moods]) => ({
					date: new Date(year, 0, 1),
					label: String(year),
					moods
				}));
				return years.map(year => ({
					...year,
					average: year.moods.length > 0 ? (year.moods.reduce((s,l) => s + l, 0) / year.moods.length) : null,
					count: year.moods.length
				}));
			}

			return months.map(month => ({
				...month,
				average: month.moods.length > 0 ? (month.moods.reduce((s, l) => s + l, 0) / month.moods.length) : null,
				count: month.moods.length
			}));
		}

		const days = [];
		for (let i = daysCount - 1; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			days.push({
				date,
				label: date.toLocaleDateString('de-CH', { day: 'numeric', month: daysCount > 30 ? 'short' : undefined, weekday: daysCount <= 7 ? 'short' : undefined }),
				moods: []
			});
		}

		// Group moods by day
		history.forEach(entry => {
			const entryDate = new Date(entry.createdAt);
			entryDate.setHours(0, 0, 0, 0);
			const dayData = days.find(d => d.date.getTime() === entryDate.getTime());
			if (dayData) dayData.moods.push(entry.level);
		});

		// Calculate averages
		return days.map(day => ({
			...day,
			average: day.moods.length > 0 ? (day.moods.reduce((s, l) => s + l, 0) / day.moods.length) : null,
			count: day.moods.length
		}));
	}

	function getTrendColor(avg) {
		if (avg === null) return '#cbd5e1';
		if (avg >= 4.5) return '#22c55e';
		if (avg >= 3.5) return '#84cc16';
		if (avg >= 2.5) return '#eab308';
		if (avg >= 1.5) return '#f97316';
		return '#ef4444';
	}
</script>

<div class="dashboard">
	<div aria-hidden="true" class="chart chart-bar chart-emoji chart-count" style="display: none;"></div>
	<div class="dashboard-header">
		<div>
			<h1>Dashboard</h1>
			<p class="header-subtitle">Verfolge deine Stimmungen und erkenne Muster</p>
		</div>
		<div class="header-actions">
			<button class="btn btn-primary" on:click={startCheckin}> + Neues Check-In </button>
		</div>
	</div>

	{#if loading}
		<div class="loading">
			<p>Lädt deine Daten…</p>
		</div>
	{:else if error}
		<div class="error">
			<p>⚠️ {error}</p>
		</div>
	{:else}
		<!-- Stats Cards -->
		<div class="stats-grid">
			<div class="stat-card">
				<p class="stat-label">🔥 Streak</p>
				<p class="stat-value">{stats.streak}</p>
				<p class="stat-hint">aufeinanderfolgende Tage</p>
			</div>
			<div class="stat-card">
				<p class="stat-label">⭐ Durchschnitt</p>
				<p class="stat-value">{stats.average}</p>
				<p class="stat-hint">von 5.0</p>
			</div>
			<div class="stat-card">
				<p class="stat-label">📈 Trend</p>
				<p class="stat-value">
					{#if stats.trend === 'improving'}
						📈 Besser
					{:else if stats.trend === 'declining'}
						📉 Schwächer
					{:else}
						➡️ Stabil
					{/if}
				</p>
				<p class="stat-hint">letzte 7 Tage</p>
			</div>
			<div class="stat-card">
				<p class="stat-label">📊 Einträge</p>
				<p class="stat-value">{stats.total}</p>
				<p class="stat-hint">insgesamt</p>
			</div>
		</div>

		<!-- Trend Chart with selectable range -->
		{#if history.length > 0}
			{@const trendData = getTrendData(trendRange)}
			{@const labelStep = trendData.length > 24 ? Math.ceil(trendData.length / 10) : trendData.length > 14 ? 2 : 1}
			<div class="trend-section">
				<div style="display:flex; align-items:center; justify-content: space-between; gap: 12px;">
					<div>
						<h2>Verlauf</h2>
						<p class="trend-subtitle">Durchschnittliche Stimmung pro Tag</p>
					</div>
					<label class="filter-label">
						<span>Zeitraum:</span>
						<select bind:value={trendRange}>
							<option value="7">7 Tage</option>
							<option value="30">Monat</option>
							<option value="365">Letztes Jahr</option>
							<option value="all">Gesamter Zeitraum</option>
						</select>
					</label>
				</div>
				<div class="trend-chart">
					<svg viewBox="0 0 400 200" class="trend-svg">
						<!-- Grid lines -->
						{#each [1, 2, 3, 4, 5] as level}
							<line 
								x1="40" 
								y1={160 - (level - 1) * 30} 
								x2="380" 
								y2={160 - (level - 1) * 30} 
								stroke="#e2e8f0" 
								stroke-width="1"
								stroke-dasharray="4,4"
							/>
							<text x="25" y={165 - (level - 1) * 30} fill="#94a3b8" font-size="10" text-anchor="end">
								{level}
							</text>
						{/each}

						<!-- Line path -->
						{#if trendData.filter(d => d.average !== null).length > 1}
							{@const validPoints = trendData.filter(d => d.average !== null)}
							{@const pathData = validPoints.map((d, i) => {
								const dayIndex = trendData.indexOf(d);
								const denom = Math.max(1, trendData.length - 1);
								const x = 60 + (dayIndex * 280 / denom);
								const y = 160 - (d.average - 1) * 30;
								return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
							}).join(' ')}
							<path 
								d={pathData} 
								fill="none" 
								stroke="#7c3aed" 
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						{/if}

						<!-- Data points -->
						{#each trendData as day, i}
							{@const denom = Math.max(1, trendData.length - 1)}
							{@const x = 60 + (i * 280 / denom)}
							{@const y = day.average !== null ? 160 - (day.average - 1) * 30 : null}
							
							{#if y !== null}
								<circle 
									cx={x} 
									cy={y} 
									r="5" 
									fill={getTrendColor(day.average)}
									stroke="white"
									stroke-width="2"
								/>
								<circle 
									cx={x} 
									cy={y} 
									r="8" 
									fill={getTrendColor(day.average)}
									opacity="0.2"
								/>
								
								<!-- Hover info -->
								<title>{day.label}: {day.average.toFixed(1)} ({day.count} Einträge)</title>
							{:else}
								<circle 
									cx={x} 
									cy={100} 
									r="3" 
									fill="#cbd5e1"
									opacity="0.5"
								/>
							{/if}

							<!-- Day labels -->
							{#if i % labelStep === 0 || i === trendData.length - 1}
								<text 
									x={x} 
									y="185" 
									fill="#64748b" 
									font-size={trendData.length > 24 ? 8 : trendData.length > 14 ? 9 : 11} 
									text-anchor="middle"
								>
									{day.label}
								</text>
							{/if}
						{/each}
					</svg>
				</div>

				<div class="trend-legend">
					<div class="legend-item">
						<span class="legend-color" style="background: #22c55e;"></span>
						<span>Sehr gut (4.5-5.0)</span>
					</div>
					<div class="legend-item">
						<span class="legend-color" style="background: #84cc16;"></span>
						<span>Gut (3.5-4.5)</span>
					</div>
					<div class="legend-item">
						<span class="legend-color" style="background: #eab308;"></span>
						<span>Neutral (2.5-3.5)</span>
					</div>
					<div class="legend-item">
						<span class="legend-color" style="background: #f97316;"></span>
						<span>Schlecht (1.5-2.5)</span>
					</div>
					<div class="legend-item">
						<span class="legend-color" style="background: #ef4444;"></span>
						<span>Sehr schlecht (&lt;1.5)</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Chart -->
		{#if history.length > 0}
			<div class="chart-section">
				<h2>Stimmungsverteilung</h2>
				{@html getChartHTML()}
			</div>
		{/if}

		<!-- History -->
		<div class="history-section">
			<div class="history-header">
				<h2>Letzte Einträge</h2>
				{#if history.length > 0}
					<label class="filter-label">
						<span>Zeitraum:</span>
						<select bind:value={filterRange}>
							<option value="all">Alle</option>						<option value="today">Heute</option>							<option value="last7">Letzte 7 Tage</option>
							<option value="last30">Letzter Monat</option>
							<option value="last365">Letztes Jahr</option>
						</select>
					</label>
				{/if}
			</div>
			{#if history.length === 0}
				<p class="empty-state">
					Noch keine Einträge. <a href="/checkin">Starte einen Check-In!</a>
				</p>
			{:else}
				{@const filtered = getFilteredHistory()}
				{#if filtered.length === 0}
					<p class="empty-state">
						Keine Einträge im gewählten Zeitraum.
						<button class="btn btn-secondary" on:click={() => filterRange = 'all'}>
							Alle anzeigen
						</button>
					</p>
				{:else}
					<ul class="history-list">
						{#each filtered as entry (entry._id)}
							<li class="history-item">
								<div class="item-mood">
									<span class="mood-chip" data-role="display">{EMOJIS[entry.level]}</span>
									<div class="item-info">
										<p class="item-label">{MOODS_LABELS[entry.level]}</p>
										<time class="item-time">
											{new Date(entry.createdAt).toLocaleDateString('de-CH')}
											{new Date(entry.createdAt).toLocaleTimeString('de-CH', {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</time>
									</div>
								</div>
								{#if entry.note}
									<p class="item-note">"{entry.note}"</p>
								{/if}
								
								{#if deleteConfirmId === entry._id}
									<div class="delete-confirm">
										<p class="confirm-text">Eintrag wirklich löschen?</p>
										<div class="confirm-buttons">
											<button class="btn btn-danger" on:click={() => deleteMood(entry._id)}>
												Ja, löschen
											</button>
											<button class="btn btn-secondary" on:click={cancelDelete}>
												Abbrechen
											</button>
										</div>
									</div>
								{:else}
									<button class="btn-delete" on:click={() => confirmDelete(entry._id)}>
										🗑️ Löschen
									</button>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			{/if}
	</div>
{/if}
</div>

<style>
	.dashboard {
		max-width: 1000px;
		margin: 0 auto;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: start;
		margin-bottom: 2rem;
		gap: 2rem;
	}

	.dashboard-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2.5rem;
		color: #1e293b;
	}

	.header-subtitle {
		margin: 0;
		color: #64748b;
		font-size: 1.1rem;
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 10px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 200ms ease;
		white-space: nowrap;
	}

	.btn-primary {
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		color: white;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(124, 58, 237, 0.25);
	}

	.loading,
	.error {
		text-align: center;
		padding: 2rem;
		background: white;
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.error {
		background: #fee2e2;
		color: #991b1b;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(16, 24, 40, 0.06);
		border-left: 4px solid #7c3aed;
	}

	.stat-label {
		margin: 0 0 0.5rem 0;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #64748b;
		font-weight: 600;
	}

	.stat-value {
		margin: 0 0 0.5rem 0;
		font-size: 2.5rem;
		font-weight: 700;
		color: #1e293b;
		line-height: 1;
	}

	.stat-hint {
		margin: 0;
		font-size: 0.85rem;
		color: #94a3b8;
	}

	.trend-section {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 12px rgba(16, 24, 40, 0.06);
		margin-bottom: 2rem;
	}

	.trend-section h2 {
		margin: 0 0 0.25rem 0;
		font-size: 1.3rem;
		color: #1e293b;
	}

	.trend-subtitle {
		margin: 0 0 1.5rem 0;
		font-size: 0.9rem;
		color: #64748b;
	}

	.trend-chart {
		margin-bottom: 1.5rem;
		padding: 1rem 0;
	}

	.trend-svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.trend-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #e2e8f0;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: #475569;
	}

	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: block;
	}

	.chart-section {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 12px rgba(16, 24, 40, 0.06);
		margin-bottom: 2rem;
	}

	.chart-section h2 {
		margin: 0 0 1.5rem 0;
		font-size: 1.3rem;
		color: #1e293b;
	}

	/* @svelte-ignore css-unused-selector */
	.chart {
		display: flex;
		align-items: flex-end;
		gap: 1rem;
		height: 200px;
		margin-bottom: 1rem;
	}

	/* @svelte-ignore css-unused-selector */
	.chart-bar {
		flex: 1;
		border-radius: 8px 8px 0 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 0.5rem;
		min-height: 40px;
		position: relative;
	}

	/* @svelte-ignore css-unused-selector */
	.chart-emoji {
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	/* @svelte-ignore css-unused-selector */
	.chart-count {
		font-size: 0.85rem;
		font-weight: 700;
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.history-section {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 12px rgba(16, 24, 40, 0.06);
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.history-section h2 {
		margin: 0;
		font-size: 1.3rem;
		color: #1e293b;
	}

	.filter-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: #475569;
	}

	.filter-label select {
		padding: 0.5rem 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		background: white;
		font-size: 0.9rem;
		color: #1e293b;
		cursor: pointer;
	}

	.filter-label select:hover {
		border-color: #7c3aed;
	}

	.empty-state {
		color: #64748b;
		text-align: center;
		padding: 2rem;
		background: #f8fafc;
		border-radius: 8px;
		margin: 0;
	}

	.empty-state button {
		margin-top: 1rem;
	}

	.empty-state a {
		color: #7c3aed;
		text-decoration: none;
		font-weight: 600;
	}

	.history-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.history-item {
		padding: 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.history-item:last-child {
		border-bottom: none;
	}

	.item-mood {
		display: flex;
		gap: 1rem;
		align-items: start;
		margin-bottom: 0.5rem;
	}

	.item-info {
		flex: 1;
	}

	.item-label {
		margin: 0 0 0.25rem 0;
		font-weight: 600;
		color: #1e293b;
		font-size: 0.95rem;
	}

	.item-time {
		margin: 0;
		font-size: 0.85rem;
		color: #94a3b8;
	}

	.item-note {
		margin: 0.75rem 0 0 0;
		font-size: 0.95rem;
		color: #475569;
		font-style: italic;
		padding-left: 1rem;
		border-left: 3px solid #cbd5e1;
	}

	.btn-delete {
		display: inline-block;
		padding: 0.5rem 0.75rem;
		margin-top: 0.75rem;
		font-size: 0.85rem;
		background: none;
		border: 1px solid #ef4444;
		color: #ef4444;
		border-radius: 6px;
		cursor: pointer;
		transition: all 150ms ease;
		font-weight: 500;
	}

	.btn-delete:hover {
		background: #fee2e2;
		transform: scale(1.05);
	}

	.delete-confirm {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: #fef2f2;
		border-left: 3px solid #ef4444;
		border-radius: 6px;
	}

	.confirm-text {
		margin: 0 0 0.75rem 0;
		font-weight: 600;
		color: #991b1b;
		font-size: 0.9rem;
	}

	.confirm-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.btn-danger {
		background: #ef4444;
		color: white;
		padding: 0.4rem 0.8rem;
		font-size: 0.85rem;
	}

	.btn-danger:hover {
		background: #dc2626;
		transform: translateY(-1px);
	}

	.btn-secondary {
		background: #e2e8f0;
		color: #475569;
		padding: 0.4rem 0.8rem;
		font-size: 0.85rem;
	}

	.btn-secondary:hover {
		background: #cbd5e1;
	}

	@media (max-width: 640px) {
		.dashboard-header {
			flex-direction: column;
			align-items: start;
		}

		.dashboard-header h1 {
			font-size: 1.8rem;
		}

		.btn {
			width: 100%;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.trend-legend {
			flex-direction: column;
			gap: 0.5rem;
		}

		.trend-section {
			padding: 1.25rem;
		}
	}
</style>
