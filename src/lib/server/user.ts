import { db } from "./db";
import { decrypt, decryptToString, encrypt, encryptString } from "./encryption";
import { hashPassword } from "./password";
import { generateRandomRecoveryCode } from "./utils";

export function verifyUsernameInput(username: string): boolean {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
	const passwordHash = await hashPassword(password);
	const recoveryCode = generateRandomRecoveryCode();
	const encryptedRecoveryCode = encryptString(recoveryCode);
	const row = await db.queryOne(
		"INSERT INTO \"user\" (email, username, password_hash, recovery_code) VALUES ($1, $2, $3, $4) RETURNING id",
		[email, username, passwordHash, encryptedRecoveryCode]
	);
	if (row === null) {
		throw new Error("Unexpected error");
	}
	const user: User = {
		id: row.number(0),
		username,
		email,
		emailVerified: false,
		registered2FA: false
	};
	return user;
}

export async function updateUserPassword(userId: number, password: string): Promise<void> {
	const passwordHash = await hashPassword(password);
	await db.execute("UPDATE \"user\" SET password_hash = $1 WHERE id = $2", [passwordHash, userId]);
}

export async function updateUserEmailAndSetEmailAsVerified(userId: number, email: string): Promise<void> {
	await db.execute("UPDATE \"user\" SET email = $1, email_verified = 1 WHERE id = $2", [email, userId]);
}

export async function setUserAsEmailVerifiedIfEmailMatches(userId: number, email: string): Promise<boolean> {
	const result = await db.execute("UPDATE \"user\" SET email_verified = 1 WHERE id = $1 AND email = $2", [userId, email]);
	return result.changes > 0;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
	const row = await db.queryOne("SELECT password_hash FROM \"user\" WHERE id = $1", [userId]);
	if (row === null) {
		throw new Error("Invalid user ID");
	}
	return row.string(0);
}

export async function getUserRecoverCode(userId: number): Promise<string> {
	const row = await db.queryOne("SELECT recovery_code FROM \"user\" WHERE id = $1", [userId]);
	if (row === null) {
		throw new Error("Invalid user ID");
	}
	return decryptToString(row.bytes(0));
}

export async function getUserTOTPKey(userId: number): Promise<Uint8Array | null> {
	const row = await db.queryOne("SELECT totp_key FROM \"user\" WHERE id = $1", [userId]);
	if (row === null) {
		throw new Error("Invalid user ID");
	}
	const encrypted = row.bytesNullable(0);
	if (encrypted === null) {
		return null;
	}
	return decrypt(encrypted);
}

export async function updateUserTOTPKey(userId: number, key: Uint8Array): Promise<void> {
	const encrypted = encrypt(key);
	await db.execute("UPDATE \"user\" SET totp_key = $1 WHERE id = $2", [encrypted, userId]);
}

export async function resetUserRecoveryCode(userId: number): Promise<string> {
	const recoveryCode = generateRandomRecoveryCode();
	const encrypted = encryptString(recoveryCode);
	await db.execute("UPDATE \"user\" SET recovery_code = $1 WHERE id = $2", [encrypted, userId]);
	return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
	const row = await db.queryOne(
		"SELECT id, email, username, email_verified, (totp_key IS NOT NULL) AS registered FROM \"user\" WHERE email = $1",
		[email]
	);
	if (row === null) {
		return null;
	}
	const user: User = {
		id: row.number(0),
		email: row.string(1),
		username: row.string(2),
		emailVerified: Boolean(row.number(3)),
		registered2FA: Boolean(row.number(4))
	};
	return user;
}

export interface User {
	id: number;
	email: string;
	username: string;
	emailVerified: boolean;
	registered2FA: boolean;
}
