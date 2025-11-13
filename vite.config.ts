import { defineConfig } from 'vite'
import pkg from './package.json'

export default defineConfig({
  build: {
    lib: {
      entry: './src/aim-components.ts',
      fileName: () => `aim-components.esm.js`,
      formats: ['es']
    },
    minify: false,
    target: 'es2020',
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [...Object.keys(pkg.peerDependencies || {})],
      output: {
        globals: {},
        entryFileNames: '[name].esm.js',
        preserveModules: false
      }
    }
  },
  test: {
    environment: 'node',
    includeSource: ['./src/**/*.{ts,js}']
  }
})