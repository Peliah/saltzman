import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	guestbookMessages: defineTable({
		name: v.string(),
		message: v.string(),
		mood: v.string(),
		reactions: v.object({
			heart: v.number(),
			fire: v.number(),
			clap: v.number(),
			laugh: v.number()
		}),
		createdAt: v.number()
	}).index('by_created', ['createdAt'])
});
