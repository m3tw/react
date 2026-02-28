import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  test: {
    include: ['tests/**/*.check.jsx'],
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})
