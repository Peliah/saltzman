import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const MOODS = ['happy', 'cool', 'love', 'think', 'sleep'] as const;

/** Minimal blocklist — extend in production */
const PROFANITY = ['spam', 'scam'];

function hasProfanity(text: string): boolean {
	const t = text.toLowerCase();
	return PROFANITY.some((w) => t.includes(w));
}

function reactionTotal(r: { heart: number; fire: number; clap: number; laugh: number }): number {
	return r.heart + r.fire + r.clap + r.laugh;
}

export const list = query({
	args: {},
	handler: async (ctx) => {
		const rows = await ctx.db
			.query('guestbookMessages')
			.withIndex('by_created')
			.order('desc')
			.take(200);
		let featuredId: (typeof rows)[0]['_id'] | null = null;
		let best = -1;
		for (const row of rows) {
			const s = reactionTotal(row.reactions);
			if (s > best) {
				best = s;
				featuredId = row._id;
			}
		}
		return { messages: rows, featuredId: best > 0 ? featuredId : null };
	}
});

export const post = mutation({
	args: {
		name: v.string(),
		message: v.string(),
		mood: v.string()
	},
	handler: async (ctx, args) => {
		const name = args.name.trim().slice(0, 80);
		const message = args.message.trim().slice(0, 500);
		if (name.length < 1 || message.length < 1) {
			throw new Error('Name and message are required.');
		}
		if (!MOODS.includes(args.mood as (typeof MOODS)[number])) {
			throw new Error('Invalid mood.');
		}
		if (hasProfanity(name) || hasProfanity(message)) {
			throw new Error('Message contains blocked words.');
		}
		await ctx.db.insert('guestbookMessages', {
			name,
			message,
			mood: args.mood,
			reactions: { heart: 0, fire: 0, clap: 0, laugh: 0 },
			createdAt: Date.now()
		});
	}
});

export const react = mutation({
	args: {
		id: v.id('guestbookMessages'),
		kind: v.union(
			v.literal('heart'),
			v.literal('fire'),
			v.literal('clap'),
			v.literal('laugh')
		)
	},
	handler: async (ctx, { id, kind }) => {
		const doc = await ctx.db.get(id);
		if (!doc) throw new Error('Message not found.');
		const reactions = { ...doc.reactions };
		reactions[kind] += 1;
		await ctx.db.patch(id, { reactions });
	}
});
