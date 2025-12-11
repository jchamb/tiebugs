import { config } from "dotenv";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import { relations } from "./relations";
import * as schema from "./schema.ts";

config();

export const db: NeonDatabase<typeof schema, typeof relations> = drizzle(
	process.env.DATABASE_URL!,
	{
		relations,
	},
);

// export type { Database } from "drizzle-orm/neon-http";
