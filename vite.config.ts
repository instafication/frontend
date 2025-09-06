import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			// '@react-email/render': resolve(__dirname, 'src/shims/react-email-render.ts'),
			// 'resend': resolve(__dirname, 'src/shims/resend.ts'),
			// Work around esbuild parsing issue in better-call ESM by preferring CJS build
			'better-call': resolve(__dirname, 'node_modules/better-call/dist/index.cjs'),
			// Avoid default import mismatch by mapping rou3 to its CJS build
			'rou3': resolve(__dirname, 'node_modules/rou3/dist/index.cjs')
		}
	},
	ssr: {
		noExternal: ['better-auth-cloudflare', 'better-auth']
	}
});
