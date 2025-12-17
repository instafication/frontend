import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ command }) => ({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias:
			command === 'build'
				? [
						// Shim @better-auth/utils base import to provide a default export for esbuild compatibility
						{
							find: /^@better-auth\/utils$/,
							replacement: resolve(__dirname, 'src/lib/shims/better-auth-utils.ts')
						}
					]
				: [
						// Only apply the shim in dev mode
						{
							find: /^@better-auth\/utils$/,
							replacement: resolve(__dirname, 'src/lib/shims/better-auth-utils.ts')
						}
					]
	},
	ssr: {
		noExternal: ['better-auth-cloudflare', 'better-auth', 'better-call', 'rou3']
	}
}));
