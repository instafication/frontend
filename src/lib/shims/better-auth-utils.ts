// Minimal shim for "@better-auth/utils" to satisfy Cloudflare's esbuild, matching package v0.3.0 API.
export function getWebcryptoSubtle(): SubtleCrypto {
	const cryptoRef =
		typeof globalThis !== 'undefined'
			? (globalThis as typeof globalThis & { crypto?: Crypto | undefined }).crypto
			: undefined;
	if (cryptoRef && typeof cryptoRef.subtle === 'object' && cryptoRef.subtle != null) {
		return cryptoRef.subtle;
	}
	throw new Error('crypto.subtle must be defined');
}

const utils = { getWebcryptoSubtle };

export default utils;
