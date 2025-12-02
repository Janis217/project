import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'moodflow';
let client;
let inMemory = [];

if (!uri) {
	console.warn('MONGODB_URI not set — using in-memory fallback. Data will not persist.');
}

async function connectClient() {
	if (!uri) return null;
	if (!client) {
		client = new MongoClient(uri);
		await client.connect();
	}
	return client;
}

export async function insertMood(doc) {
	doc.createdAt = doc.createdAt || new Date();
	if (!uri) {
		doc._id = Date.now().toString();
		inMemory.unshift(doc);
		return doc;
	}

	await connectClient();
	const db = client.db(dbName);
	const res = await db.collection('moods').insertOne(doc);
	return { ...doc, _id: res.insertedId };
}

export async function listMoods(limit = 100) {
	if (!uri) return inMemory.slice(0, limit);
	await connectClient();
	const db = client.db(dbName);
	return db.collection('moods')
		.find({})
		.sort({ createdAt: -1 })
		.limit(limit)
		.toArray();
}

export async function clearMoods() {
	if (!uri) {
		const removed = inMemory.length;
		inMemory = [];
		return { deletedCount: removed };
	}
	await connectClient();
	const db = client.db(dbName);
	return db.collection('moods').deleteMany({});
}