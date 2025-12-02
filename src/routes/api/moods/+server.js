import { json } from '@sveltejs/kit';
import { insertMood, listMoods, clearMoods } from '$lib/mongo.js';

export const GET = async () => {
	const docs = await listMoods(200);
	return json(docs);
};

export const POST = async ({ request }) => {
	try {
		const body = await request.json();
		const { level, note } = body;
		if (!level || level < 1 || level > 5) {
			return new Response(JSON.stringify({ error: 'Invalid mood level' }), { status: 400 });
		}
		const doc = { level: Number(level), note: note || '', createdAt: new Date() };
		const inserted = await insertMood(doc);
		return json(inserted, { status: 201 });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
	}
};

export const DELETE = async () => {
	await clearMoods();
	return new Response(null, { status: 204 });
};
