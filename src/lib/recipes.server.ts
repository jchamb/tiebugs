import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";
import { db } from "../db";
import { recipes } from "../db/schema";

export const getRecipeCount = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			const result = await db.select({ count: count() }).from(recipes);
			return result[0]?.count ?? 0;
		} catch {
			// Return 0 if table doesn't exist yet
			return 0;
		}
	},
);
