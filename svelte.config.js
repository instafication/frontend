import preprocess from "svelte-preprocess";
//import adapter from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      runtime: "nodejs18.x",
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    }),
  },

  preprocess: [
    preprocess({
      postcss: false,
    }),
  ],
};

export default config;