import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(import.meta.dirname, 'node_modules/react'),
      'react/jsx-runtime': path.resolve(import.meta.dirname, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(import.meta.dirname, 'node_modules/react/jsx-dev-runtime.js'),
      'react-dom': path.resolve(import.meta.dirname, 'node_modules/react-dom'),
      'react-dom/client': path.resolve(import.meta.dirname, 'node_modules/react-dom/client.js'),
    },
  },
  test: { environment: 'jsdom', setupFiles: ['./src/test-setup.ts'] },
})