import { json } from '@sveltejs/kit';
import { insertMood, listMoods, clearMoods, deleteMoodById } from '$lib/mongo.js';

/**
 * GET /api/moods
 * Returns list of moods, optionally limited
 */
export const GET = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '200', 10);
		
		if (isNaN(limit) || limit < 1 || limit > 1000) {
			return json(
				{ error: 'Invalid limit parameter. Must be between 1 and 1000.' },
				{ status: 400 }
			);
		}

		const docs = await listMoods(limit);
		
		return json(docs, {
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate'
			}
		});
	} catch (err) {
		console.error('GET /api/moods error:', err);
		return json(
			{ error: 'Failed to fetch moods' },
			{ status: 500 }
		);
	}
};

/**
 * POST /api/moods
 * Creates a new mood entry
 */
export const POST = async ({ request }) => {
	try {
		const body = await request.json();
		const { level, note, createdAt } = body;

		// Validation
		if (typeof level !== 'number') {
			return json(
				{ error: 'Missing or invalid mood level' },
				{ status: 400 }
			);
		}

		if (level < 1 || level > 5 || !Number.isInteger(level)) {
			return json(
				{ error: 'Mood level must be an integer between 1 and 5' },
				{ status: 400 }
			);
		}

		const doc = {
			level: Number(level),
			note: (note || '').trim().slice(0, 500),
			createdAt: createdAt ? new Date(createdAt) : new Date()
		};

		const inserted = await insertMood(doc);
		return json(inserted, { status: 201 });
	} catch (err) {
		console.error('POST /api/moods error:', err);
		return json(
			{ error: 'Server error: failed to save mood' },
			{ status: 500 }
		);
	}
};

/**
 * DELETE /api/moods
 * If `id` query param: delete single mood by ID
 * Else: clears all moods (use with caution)
 */
export const DELETE = async ({ url }) => {
	const id = url.searchParams.get('id');
	
	// Delete single mood by ID
	if (id) {
		try {
			const result = await deleteMoodById(id);
			
			if (result.deletedCount === 0) {
				return json(
					{ error: 'Mood not found' },
					{ status: 404 }
				);
			}

			return json({ success: true, deletedCount: result.deletedCount }, { status: 200 });
		} catch (err) {
			console.error('DELETE /api/moods?id= error:', err);
			return json(
				{ error: 'Failed to delete mood' },
				{ status: 500 }
			);
		}
	}

	// Clear all moods
	try {
		const result = await clearMoods();
		return new Response(null, { status: 204 });
	} catch (err) {
		console.error('DELETE /api/moods error:', err);
		return json(
			{ error: 'Failed to clear moods' },
			{ status: 500 }
		);
	}
};
