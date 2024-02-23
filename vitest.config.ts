import { mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, {
  test: {
    setupFiles: ['./src/tests/setup.ts'],
    globals: true
  },
  resolve: {
    alias: {
      '@src/': new URL('./src/', import.meta.url).pathname
    }
  }
});
