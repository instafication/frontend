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
						// Work around esbuild parsing issue in better-call ESM by preferring CJS build
						{
							find: 'better-call',
							replacement: resolve(__dirname, 'node_modules/better-call/dist/index.cjs')
						},
						// Avoid default import mismatch by mapping rou3 to its CJS build
						{ find: 'rou3', replacement: resolve(__dirname, 'node_modules/rou3/dist/index.cjs') },
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
		noExternal: ['better-auth-cloudflare', 'better-auth']
	}
}));
