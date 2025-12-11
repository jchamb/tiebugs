import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

import { authApiMiddleware } from "@/lib/auth/middleware";

export const Route = createFileRoute("/api/patterns/$id")({
	server: {
		handlers: ({ createHandlers }) =>
			createHandlers({
				GET: async ({ params }) => {
					return json({ message: `Pattern ${params.id} fetched` });
				},
				PATCH: {
					middleware: [authApiMiddleware],
					handler: async () => {
						return json({ message: "Pattern updated" });
					},
				},
			}),
	},
});
