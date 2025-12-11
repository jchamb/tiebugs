import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	users: {
		sessions: r.many.sessions({
			from: r.users.id,
			to: r.sessions.userId,
		}),
		accounts: r.many.account({
			from: r.users.id,
			to: r.account.userId,
		}),
	},
	patterns: {
		videos: r.many.videos({
			from: r.patterns.id,
			to: r.videos.patternId,
		}),
		references: r.many.references({
			from: r.patterns.id,
			to: r.references.patternId,
		}),
		hatches: r.many.hatches({
			from: r.patterns.id,
			to: r.hatches.patternId,
		}),
	},
}));

export type Relations = typeof relations;
