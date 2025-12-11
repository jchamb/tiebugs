import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

import { authApiMiddleware } from "@/lib/auth/middleware";

export const Route = createFileRoute("/api/patterns/")({
	server: {
		handlers: ({ createHandlers }) =>
			createHandlers({
				GET: async () => {
					return json({ message: "Patterns fetched" });
				},
				POST: {
					middleware: [authApiMiddleware],
					handler: async () => {
						return json({ message: "Pattern created" });
					},
				},
			}),
	},
});
