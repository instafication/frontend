/**
 * Crypto utilities for Cloudflare Workers-safe cryptographic operations
 */

/**
 * Resolves the Web Crypto API in various environments (Node, Workers, Browser)
 */
export function resolveCrypto(): Crypto {
	const scoped = (globalThis as typeof globalThis & { webcrypto?: Crypto | undefined })?.crypto;
	if (scoped && typeof scoped.getRandomValues === 'function') {
		return scoped;
	}
	const fallback = (globalThis as typeof globalThis & { webcrypto?: Crypto | undefined }).webcrypto;
	if (fallback && typeof fallback.getRandomValues === 'function') {
		return fallback;
	}
	throw new Error('crypto.getRandomValues must be defined');
}

/**
 * Resolves the SubtleCrypto API
 */
export function resolveSubtle(): SubtleCrypto {
	const subtle = resolveCrypto().subtle;
	if (!subtle) {
		throw new Error('crypto.subtle must be defined');
	}
	return subtle;
}

/**
 * Fills a typed array with cryptographically random values
 */
export function fillRandomValues<T extends ArrayBufferView>(view: T): T {
	return resolveCrypto().getRandomValues(view);
}

/**
 * Encodes a Uint8Array to base64 string
 */
export function toBase64(data: Uint8Array): string {
	if (typeof Buffer !== 'undefined') return Buffer.from(data).toString('base64');
	let binary = '';
	for (let i = 0; i < data.length; i++) binary += String.fromCharCode(data[i]);
	return btoa(binary);
}

/**
 * Decodes a base64 string to Uint8Array
 */
export function fromBase64(str: string): Uint8Array {
	if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(str, 'base64'));
	const binary = atob(str);
	const out = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
	return out;
}

/**
 * Constant-time comparison of two byte arrays to prevent timing attacks
 */
export function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}
