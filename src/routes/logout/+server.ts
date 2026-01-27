import { redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	if (event.locals.session !== null) {
		await invalidateSession(event.locals.session.id);
	}
	deleteSessionTokenCookie(event);
	throw redirect(302, "/login");
};
