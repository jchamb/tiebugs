import { relations } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	geometry,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	vector,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const skill_levels = pgEnum("skill_levels", [
	"beginner",
	"intermediate",
	"advanced",
]);

export const classifications = pgEnum("classifications", [
	"Midge",
	"Mayfly",
	"Stonefly",
	"Caddis",
	"Terrestrial",
	"Scud/Sowbug",
	"Worms",
	"Baitfish, Leeches & Minnow",
	"Other",
]);

// export const stages = pgEnum("stages", [
// 	"Nymph",
// 	"Emerger",
// 	"Dun",
// 	"Spinner",
// 	"Dry Fly / General",
// 	"Wet Fly / General",
// 	"Streamer",
// ]);

// Fly tying recipe tables
export const patterns = pgTable(
	"patterns",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		description: text("description"),
		materials: jsonb("materials").notNull(),
		videos: jsonb("videos").notNull(),
		references: jsonb("references").notNull(),
		imageUrl: text("image_url"),
		skillLevel: skill_levels("skill_level"),
		classification: classifications("classification"),
		stage: jsonb("stage").notNull(),
		image: text("image"),
		embedding: vector("embedding", { dimensions: 1536 }),
		parentId: integer("parent_id").references((): AnyPgColumn => patterns.id),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		index("patterns_parent_id_idx").on(table.parentId),
		index("patterns_materials_idx").using("gin", table.materials),
		index("patterns_stage_idx").using("gin", table.stage),
	],
);

export const hatches = pgTable("hatches", {
	id: serial("id").primaryKey(),
	patternId: integer("pattern_id"),
	location: geometry("lat_lng", { type: "point", mode: "tuple", srid: 4326 }),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const user_favorites = pgTable("user_favorites", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	patternId: integer("pattern_id")
		.notNull()
		.references(() => patterns.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
