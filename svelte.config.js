import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-cloudflare';
// import adapter from '@sveltejs/adapter-vercel';


export default {
  compilerOptions: {
    runes: true
  },
  kit: {
    alias: { 'lib/': './src/routes/lib/' }
  },  
  plugins: {
    ServiceWorker: {
      register: false
    }
  },
};