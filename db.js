import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import { text, integer, timestamp, pgTable } from 'drizzle-orm/pg-core';

// Database schema definitions
export const users = pgTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    created_at: timestamp('created_at').defaultNow()
});

export const videos = pgTable('videos', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    user_id: text('user_id').references(() => users.id),
    bunny_video_id: text('bunny_video_id').notNull(),
    views: integer('views').default(0),
    created_at: timestamp('created_at').defaultNow()
});

export const likes = pgTable('likes', {
    id: text('id').primaryKey(),
    user_id: text('user_id').references(() => users.id),
    video_id: text('video_id').references(() => videos.id),
    created_at: timestamp('created_at').defaultNow()
});

export const comments = pgTable('comments', {
    id: text('id').primaryKey(),
    content: text('content').notNull(),
    user_id: text('user_id').references(() => users.id),
    video_id: text('video_id').references(() => videos.id),
    created_at: timestamp('created_at').defaultNow()
});

export const subscriptions = pgTable('subscriptions', {
    id: text('id').primaryKey(),
    subscriber_id: text('subscriber_id').references(() => users.id),
    channel_id: text('channel_id').references(() => users.id),
    created_at: timestamp('created_at').defaultNow()
});

// Initialize database connection
const dbConnection = neon(process.env.DATABASE_URL);
export const db = drizzle(dbConnection);

// Database utility functions
export async function createUser({ username, email, password }) {
    return await db.insert(users).values({
        id: crypto.randomUUID(),
        username,
        email,
        password // Note: In production, password should be hashed
    }).returning();
}

export async function getUser(username) {
    return await db.select().from(users).where(sql`username = ${username}`).limit(1);
}

export async function createVideo({ title, description, userId, bunnyVideoId }) {
    return await db.insert(videos).values({
        id: crypto.randomUUID(),
        title,
        description,
        user_id: userId,
        bunny_video_id: bunnyVideoId
    }).returning();
}

export async function incrementViews(videoId) {
    return await db
        .update(videos)
        .set({ views: sql`views + 1` })
        .where(sql`id = ${videoId}`);
}

export async function getVideos({ limit = 20, offset = 0, userId = null }) {
    let query = db.select().from(videos);
    if (userId) {
        query = query.where(sql`user_id = ${userId}`);
    }
    return await query.limit(limit).offset(offset);
}

export async function searchVideos(searchTerm) {
    return await db
        .select()
        .from(videos)
        .where(sql`title ILIKE ${`%${searchTerm}%`} OR description ILIKE ${`%${searchTerm}%`}`);
}

export async function toggleLike(userId, videoId) {
    const existingLike = await db
        .select()
        .from(likes)
        .where(sql`user_id = ${userId} AND video_id = ${videoId}`);

    if (existingLike.length > 0) {
        return await db
            .delete(likes)
            .where(sql`user_id = ${userId} AND video_id = ${videoId}`);
    }

    return await db.insert(likes).values({
        id: crypto.randomUUID(),
        user_id: userId,
        video_id: videoId
    });
}

export async function addComment(userId, videoId, content) {
    return await db.insert(comments).values({
        id: crypto.randomUUID(),
        user_id: userId,
        video_id: videoId,
        content
    });
}

export async function toggleSubscription(subscriberId, channelId) {
    const existingSub = await db
        .select()
        .from(subscriptions)
        .where(sql`subscriber_id = ${subscriberId} AND channel_id = ${channelId}`);

    if (existingSub.length > 0) {
        return await db
            .delete(subscriptions)
            .where(sql`subscriber_id = ${subscriberId} AND channel_id = ${channelId}`);
    }

    return await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        subscriber_id: subscriberId,
        channel_id: channelId
    });
}