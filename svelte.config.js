import adapter from '@sveltejs/adapter-cloudflare';

export default {
  compilerOptions: {
    runes: true
  },
  kit: {
    adapter: adapter({
      config: undefined,
      platformProxy: {
        configPath: undefined,
        environment: undefined,
        persist: undefined
      },
      fallback: 'plaintext',
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    }),
    alias: {
      "@/*": "./src/lib/*",
    },
    paths: {
      relative: false
    }
  }
};