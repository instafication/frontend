import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-cloudflare';
// import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    alias: { 'lib/': './src/routes/lib/' }
  },  
  plugins: {
    ServiceWorker: {
      register: false
    }
  },
};

export default config;