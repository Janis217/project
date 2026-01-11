import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

const dbName = 'moodflow';
let client;

async function connectClient() {
	const uri = env.MONGODB_URI;
	
	if (!uri) {
		throw new Error('MONGODB_URI environment variable is required. Please add it to your .env file.');
	}
	if (!client) {
		try {
			client = new MongoClient(uri, {
				maxPoolSize: 10,
				minPoolSize: 2,
				serverSelectionTimeoutMS: 5000,
				socketTimeoutMS: 45000,
			});
			await client.connect();
		} catch (err) {
			client = null;
			throw err;
		}
	}
	return client;
}

export async function insertMood(doc) {
	if (!doc || typeof doc.level !== 'number') {
		throw new Error('Invalid mood document');
	}

	// Ensure createdAt is a Date object
	if (doc.createdAt) {
		if (!(doc.createdAt instanceof Date)) {
			doc.createdAt = new Date(doc.createdAt);
		}
	} else {
		doc.createdAt = new Date();
	}
	
	doc.note = (doc.note || '').trim();

	try {
		const client = await connectClient();
		const db = client.db(dbName);
		const res = await db.collection('moods').insertOne(doc);
		return { ...doc, _id: res.insertedId };
	} catch (err) {
		console.error('Insert error:', err);
		throw new Error('Failed to save mood');
	}
}

export async function listMoods(limit = 100) {
	try {
		const client = await connectClient();
		const db = client.db(dbName);
		const docs = await db
			.collection('moods')
			.find({})
			.sort({ _id: -1 })
			.limit(Math.max(1, limit))
			.toArray();
		
		return docs;
	} catch (err) {
		console.error('List error:', err);
		throw new Error('Failed to fetch moods');
	}
}

export async function deleteMoodById(id) {
	if (!id) {
		throw new Error('Mood ID required');
	}

	try {
		const client = await connectClient();
		const db = client.db(dbName);
		const { ObjectId } = await import('mongodb');
		
		// Handle both string and ObjectId formats
		let filter = { _id: id };
		try {
			filter = { _id: new ObjectId(id) };
		} catch {
			// If not a valid ObjectId, use as string
			filter = { _id: id };
		}

		const result = await db.collection('moods').deleteOne(filter);
		return result;
	} catch (err) {
		console.error('Delete error:', err);
		throw new Error('Failed to delete mood');
	}
}

export async function clearMoods() {
	try {
		const client = await connectClient();
		const db = client.db(dbName);
		return db.collection('moods').deleteMany({});
	} catch (err) {
		console.error('Clear error:', err);
		throw new Error('Failed to clear moods');
	}
}

export async function getMoodStats() {
	try {
		const moods = await listMoods(1000);
		if (moods.length === 0) {
			return { count: 0, avg: 0, min: 0, max: 0 };
		}
		const levels = moods.map((m) => m.level);
		return {
			count: moods.length,
			avg: (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(2),
			min: Math.min(...levels),
			max: Math.max(...levels)
		};
	} catch (err) {
		console.error('Stats error:', err);
		return { count: 0, avg: 0, min: 0, max: 0 };
	}
}