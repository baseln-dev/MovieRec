import { db } from "./db";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { generateRandomOTP } from "./utils";
import { sha256 } from "@oslojs/crypto/sha2";
import { Resend } from "resend";

import type { RequestEvent } from "@sveltejs/kit";
import type { User } from "./user";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function createPasswordResetSession(
	token: string,
	userId: number,
	email: string
): Promise<PasswordResetSession> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: PasswordResetSession = {
		id: sessionId,
		userId,
		email,
		expiresAt: new Date(Date.now() + 1000 * 60 * 10),
		code: generateRandomOTP(),
		emailVerified: false,
		twoFactorVerified: false
	};
	await db.execute(
		"INSERT INTO password_reset_session (id, user_id, email, code, expires_at) VALUES ($1, $2, $3, $4, $5)",
		[session.id, session.userId, session.email, session.code, Math.floor(session.expiresAt.getTime() / 1000)]
	);
	return session;
}

export async function validatePasswordResetSessionToken(token: string): Promise<PasswordResetSessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await db.queryOne(
		`SELECT
  prs.id AS reset_id,
  prs.user_id AS reset_user_id,
  prs.email AS reset_email,
  prs.code AS reset_code,
  prs.expires_at AS reset_expires_at,
  prs.email_verified AS reset_email_verified,
  prs.two_factor_verified AS reset_two_factor_verified,
  u.id AS user_id,
  u.email AS user_email,
  u.username,
  u.email_verified,
  (u.totp_key IS NOT NULL) AS registered
FROM password_reset_session prs INNER JOIN "user" u ON u.id = prs.user_id
WHERE prs.id = $1`,
		[sessionId]
	);
	if (row === null) {
		return { session: null, user: null };
	}
	const session: PasswordResetSession = {
		id: row.string(0),
		userId: row.number(1),
		email: row.string(2),
		code: row.string(3),
		expiresAt: new Date(row.number(4) * 1000),
		emailVerified: Boolean(row.number(5)),
		twoFactorVerified: Boolean(row.number(6))
	};
	const user: User = {
		id: row.number(7),
		email: row.string(8),
		username: row.string(9),
		emailVerified: Boolean(row.number(10)),
		registered2FA: Boolean(row.number(11))
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.execute("DELETE FROM password_reset_session WHERE id = $1", [session.id]);
		return { session: null, user: null };
	}
	return { session, user };
}

export async function setPasswordResetSessionAsEmailVerified(sessionId: string): Promise<void> {
	await db.execute("UPDATE password_reset_session SET email_verified = 1 WHERE id = $1", [sessionId]);
}

export async function setPasswordResetSessionAs2FAVerified(sessionId: string): Promise<void> {
	await db.execute("UPDATE password_reset_session SET two_factor_verified = 1 WHERE id = $1", [sessionId]);
}

export async function invalidateUserPasswordResetSessions(userId: number): Promise<void> {
	await db.execute("DELETE FROM password_reset_session WHERE user_id = $1", [userId]);
}

export async function validatePasswordResetSessionRequest(
	event: RequestEvent
): Promise<PasswordResetSessionValidationResult> {
	const token = event.cookies.get("password_reset_session") ?? null;
	if (token === null) {
		return { session: null, user: null };
	}
	const result = await validatePasswordResetSessionToken(token);
	if (result.session === null) {
		deletePasswordResetSessionTokenCookie(event);
	}
	return result;
}

export function setPasswordResetSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("password_reset_session", token, {
		expires: expiresAt,
		sameSite: "lax",
		httpOnly: true,
		path: "/",
		secure: !import.meta.env.DEV
	});
}

export function deletePasswordResetSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("password_reset_session", "", {
		maxAge: 0,
		sameSite: "lax",
		httpOnly: true,
		path: "/",
		secure: !import.meta.env.DEV
	});
}

export async function sendPasswordResetEmail(email: string, code: string): Promise<void> {
	if (!resend) {
		console.log(`[TEST] Password reset code for ${email}: ${code}`);
		return;
	}

	try {
		await resend.emails.send({
			from: process.env.EMAIL_FROM || "onboarding@resend.dev",
			to: email,
			subject: "Reset your password",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Reset your password</h2>
					<p>Your password reset code is:</p>
					<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<code style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${code}</code>
					</div>
					<p>This code expires in 10 minutes.</p>
					<p>If you didn't request this, you can ignore this email.</p>
				</div>
			`
		});
	} catch (err) {
		console.error("Failed to send password reset email:", err);
	}
}

export interface PasswordResetSession {
	id: string;
	userId: number;
	email: string;
	expiresAt: Date;
	code: string;
	emailVerified: boolean;
	twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
	| { session: PasswordResetSession; user: User }
	| { session: null; user: null };
