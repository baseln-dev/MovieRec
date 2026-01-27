import { generateRandomOTP } from "./utils";
import { db } from "./db";
import { ExpiringTokenBucket } from "./rate-limit";
import { encodeBase32 } from "@oslojs/encoding";
import { Resend } from "resend";

import type { RequestEvent } from "@sveltejs/kit";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function getUserEmailVerificationRequest(
	userId: number,
	id: string
): Promise<EmailVerificationRequest | null> {
	const row = await db.queryOne(
		"SELECT id, user_id, code, email, expires_at FROM email_verification_request WHERE id = $1 AND user_id = $2",
		[id, userId]
	);
	if (row === null) {
		return row;
	}
	const request: EmailVerificationRequest = {
		id: row.string(0),
		userId: row.number(1),
		code: row.string(2),
		email: row.string(3),
		expiresAt: new Date(row.number(4) * 1000)
	};
	return request;
}

export async function createEmailVerificationRequest(
	userId: number,
	email: string
): Promise<EmailVerificationRequest> {
	await deleteUserEmailVerificationRequest(userId);
	const idBytes = new Uint8Array(20);
	crypto.getRandomValues(idBytes);
	const id = encodeBase32(idBytes).toLowerCase();

	const code = generateRandomOTP();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
	await db.queryOne(
		"INSERT INTO email_verification_request (id, user_id, code, email, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		[id, userId, code, email, Math.floor(expiresAt.getTime() / 1000)]
	);

	const request: EmailVerificationRequest = {
		id,
		userId,
		code,
		email,
		expiresAt
	};
	return request;
}

export async function deleteUserEmailVerificationRequest(userId: number): Promise<void> {
	await db.execute("DELETE FROM email_verification_request WHERE user_id = $1", [userId]);
}

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
	if (!resend) {
		console.log(`[TEST] Verification code for ${email}: ${code}`);
		return;
	}

	try {
		await resend.emails.send({
			from: process.env.EMAIL_FROM || "onboarding@resend.dev",
			to: email,
			subject: "Verify your email",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Verify your email</h2>
					<p>Your verification code is:</p>
					<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<code style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${code}</code>
					</div>
					<p>This code expires in 10 minutes.</p>
					<p>If you didn't request this, you can ignore this email.</p>
				</div>
			`
		});
	} catch (err) {
		console.error("Failed to send verification email:", err);
	}
}

export function setEmailVerificationRequestCookie(event: RequestEvent, request: EmailVerificationRequest): void {
	event.cookies.set("email_verification", request.id, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: request.expiresAt
	});
}

export function deleteEmailVerificationRequestCookie(event: RequestEvent): void {
	event.cookies.set("email_verification", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

export async function getUserEmailVerificationRequestFromRequest(
	event: RequestEvent
): Promise<EmailVerificationRequest | null> {
	if (event.locals.user === null) {
		return null;
	}
	const id = event.cookies.get("email_verification") ?? null;
	if (id === null) {
		return null;
	}
	const request = await getUserEmailVerificationRequest(event.locals.user.id, id);
	if (request === null) {
		deleteEmailVerificationRequestCookie(event);
	}
	return request;
}

export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(3, 60 * 10);

export interface EmailVerificationRequest {
	id: string;
	userId: number;
	code: string;
	email: string;
	expiresAt: Date;
}
