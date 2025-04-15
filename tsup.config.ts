import { defineConfig } from 'tsup';
import pkg from './package.json'

export default defineConfig({
  entryPoints: ['src/index.ts'],
  dts: true,
  clean: true,
  format: 'esm',
  splitting: true,
  sourcemap: true,
  minify: false,
  treeshake: true,
  target: 'esnext',
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    '@vue',
    'vue',
    'sm-core'
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.jsxFactory = 'h'
    options.jsxImportSource = 'vue'
    options.jsxFragment = 'Fragment'
    return options
  }
})