import { redirect } from "@tanstack/react-router";
import { createMiddleware, json } from "@tanstack/react-start";
import { auth } from "./server";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			throw redirect({ to: "/login" });
		}

		return await next();
	},
);

export const authApiMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			throw json(
				{
					message: "Unauthorized",
				},
				{ status: 401 },
			);
		}

		return await next();
	},
);
