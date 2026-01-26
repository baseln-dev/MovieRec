import { type Handle } from "@sveltejs/kit";
import { validateSessionToken } from "$lib/server/session";

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get("session");
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const { session, user } = await validateSessionToken(sessionToken);
		event.locals.session = session;
		event.locals.user = user;
	}
	return await resolve(event);
};
