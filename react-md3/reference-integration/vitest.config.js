import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/**/*.check.jsx'],
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})
