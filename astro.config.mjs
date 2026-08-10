import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tuitui0415.github.io',
  base: '/portfolio-content',
  output: 'static',
  build: { format: 'directory' },
});
