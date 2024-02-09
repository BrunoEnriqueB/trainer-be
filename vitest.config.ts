import { mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, {
  test: {
    globals: true
  },
  resolve: {
    alias: {
      '@src/': new URL('./src/', import.meta.url).pathname
    }
  }
});
