import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vitest-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    alias: {
      '@src/': new URL('./src/', import.meta.url).pathname
    }
  }
});
