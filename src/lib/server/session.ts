import { db } from "./db";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { User } from "./user";
import type { RequestEvent } from "@sveltejs/kit";

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await db.queryOne(
		`
SELECT
  s.id AS session_id,
  s.user_id AS session_user_id,
  s.expires_at AS session_expires_at,
  s.two_factor_verified AS session_two_factor_verified,
  u.id AS user_id,
  u.email,
  u.username,
  u.email_verified,
  (u.totp_key IS NOT NULL) AS registered
FROM session s
INNER JOIN "user" u ON s.user_id = u.id
WHERE s.id = $1
`,
		[sessionId]
	);

	if (row === null) {
		return { session: null, user: null };
	}
	const session: Session = {
		id: row.string(0),
		userId: row.number(1),
		expiresAt: new Date(row.number(2) * 1000),
		twoFactorVerified: Boolean(row.number(3))
	};
	const user: User = {
		id: row.number(4),
		email: row.string(5),
		username: row.string(6),
		emailVerified: Boolean(row.number(7)),
		registered2FA: Boolean(row.number(8))
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.execute("DELETE FROM session WHERE id = $1", [session.id]);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db.execute("UPDATE session SET expires_at = $1 WHERE id = $2", [
			Math.floor(session.expiresAt.getTime() / 1000),
			session.id
		]);
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.execute("DELETE FROM session WHERE id = $1", [sessionId]);
}

export async function invalidateUserSessions(userId: number): Promise<void> {
	await db.execute("DELETE FROM session WHERE user_id = $1", [userId]);
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("session", token, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userId: number, flags: SessionFlags): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		twoFactorVerified: flags.twoFactorVerified
	};
	await db.execute("INSERT INTO session (id, user_id, expires_at, two_factor_verified) VALUES ($1, $2, $3, $4)", [
		session.id,
		session.userId,
		Math.floor(session.expiresAt.getTime() / 1000),
		Number(session.twoFactorVerified)
	]);
	return session;
}

export async function setSessionAs2FAVerified(sessionId: string): Promise<void> {
	await db.execute("UPDATE session SET two_factor_verified = 1 WHERE id = $1", [sessionId]);
}

export interface SessionFlags {
	twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
	id: string;
	expiresAt: Date;
	userId: number;
}

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
