import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: false, // Social login only
	},
	socialProviders: {
		google: {
			// @ts-ignore: Better Auth expects undefined, env vars are strings
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			// @ts-ignore: Better Auth expects undefined, env vars are strings
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		},
		facebook: {
			// @ts-ignore
			clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
			// @ts-ignore
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
		},
		twitter: {
			// @ts-nocheck
			clientId: process.env.TWITTER_CLIENT_ID ?? "",
			// @ts-ignore
			clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
		},
		tiktok: {
			// @ts-ignore
			clientId: process.env.TIKTOK_CLIENT_ID ?? "",
			// @ts-ignore
			clientSecret: process.env.TIKTOK_CLIENT_SECRET ?? "",
		},
		github: {
			// @ts-ignore
			clientId: process.env.GITHUB_CLIENT_ID ?? "",
			// @ts-ignore
			clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
		},
	},
	trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
	experimental: { joins: true },
});
