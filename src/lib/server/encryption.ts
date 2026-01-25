import { decodeBase64 } from "@oslojs/encoding";
import { createCipheriv, createDecipheriv } from "crypto";
import { DynamicBuffer } from "@oslojs/binary";

// Lazy load key to avoid build-time errors
let key: Uint8Array | null = null;

function getKey(): Uint8Array {
	if (key === null) {
		const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
		if (!ENCRYPTION_KEY) {
			throw new Error("ENCRYPTION_KEY environment variable is not set");
		}
		key = decodeBase64(ENCRYPTION_KEY);
	}
	return key;
}

export function encrypt(data: Uint8Array): Uint8Array {
	const iv = new Uint8Array(16);
	crypto.getRandomValues(iv);
	const cipher = createCipheriv("aes-128-gcm", getKey(), iv);
	const encrypted = new DynamicBuffer(0);
	encrypted.write(iv);
	encrypted.write(cipher.update(data));
	encrypted.write(cipher.final());
	encrypted.write(cipher.getAuthTag());
	return encrypted.bytes();
}

export function encryptString(data: string): Uint8Array {
	return encrypt(new TextEncoder().encode(data));
}

export function decrypt(encrypted: Uint8Array): Uint8Array {
	if (encrypted.byteLength < 33) {
		throw new Error("Invalid data");
	}
	const decipher = createDecipheriv("aes-128-gcm", getKey(), encrypted.slice(0, 16));
	decipher.setAuthTag(encrypted.slice(encrypted.byteLength - 16));
	const decrypted = new DynamicBuffer(0);
	decrypted.write(decipher.update(encrypted.slice(16, encrypted.byteLength - 16)));
	decrypted.write(decipher.final());
	return decrypted.bytes();
}

export function decryptToString(data: Uint8Array): string {
	return new TextDecoder().decode(decrypt(data));
}
