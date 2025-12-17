/**
 * PBKDF2-HMAC-SHA256 password hashing for Cloudflare Workers
 * Uses Web Crypto API for compatibility with Workers runtime
 */

import {
	fillRandomValues,
	fromBase64,
	resolveSubtle,
	timingSafeEqualBytes,
	toBase64
} from './crypto';

export interface Pbkdf2Options {
	iterations?: number;
	isDev?: boolean;
}

const DEFAULT_ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const DERIVED_KEY_LENGTH = 32;
const HASH_ALGO = 'SHA-256';

/**
 * Creates a PBKDF2 hasher with optional configuration
 */
export function createPbkdf2Hasher(options: Pbkdf2Options = {}) {
	const iterations = options.iterations || DEFAULT_ITERATIONS;

	return {
		/**
		 * Hashes a password using PBKDF2-HMAC-SHA256
		 * Output format: pbkdf2$algo=sha256$it=<iterations>$salt=<b64>$dk=<b64>
		 */
		hash: async (password: string): Promise<string> => {
			const salt = new Uint8Array(SALT_LENGTH);
			fillRandomValues(salt);
			const passwordBytes = new TextEncoder().encode(password);
			const subtle = resolveSubtle();
			const key = await subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveBits']);
			const bits = await subtle.deriveBits(
				{ name: 'PBKDF2', salt, iterations, hash: HASH_ALGO },
				key,
				DERIVED_KEY_LENGTH * 8
			);
			const derivedKey = new Uint8Array(bits);
			return `pbkdf2$algo=sha256$it=${iterations}$salt=${toBase64(salt)}$dk=${toBase64(derivedKey)}`;
		},

		/**
		 * Verifies a password against a PBKDF2 hash
		 */
		verify: async (hash: string, password: string): Promise<boolean> => {
			try {
				if (!hash.startsWith('pbkdf2$')) return false;
				const parts = Object.fromEntries(
					hash
						.split('$')
						.slice(1) // drop 'pbkdf2'
						.map((kv) => kv.split('='))
				) as Record<string, string>;
				const hashIterations = Number(parts.it);
				const salt = fromBase64(parts.salt);
				const expected = fromBase64(parts.dk);
				const passwordBytes = new TextEncoder().encode(password);
				const subtle = resolveSubtle();
				const key = await subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveBits']);
				const bits = await subtle.deriveBits(
					{
						name: 'PBKDF2',
						salt: salt as BufferSource,
						iterations: hashIterations,
						hash: HASH_ALGO
					},
					key,
					expected.length * 8
				);
				const derivedKey = new Uint8Array(bits);
				return timingSafeEqualBytes(derivedKey, expected);
			} catch {
				return false;
			}
		}
	};
}
