import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	users: {
		sessions: r.many.session({
			from: r.user.id,
			to: r.session.userId,
		}),
		accounts: r.many.account({
			from: r.user.id,
			to: r.account.userId,
		}),
	},
	patterns: {
		hatches: r.many.hatches({
			from: r.patterns.id,
			to: r.hatches.patternId,
		}),
	},
}));

export type Relations = typeof relations;
