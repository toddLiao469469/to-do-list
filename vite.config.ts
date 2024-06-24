import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': '/src/modules/components',
      '@api': '/src/api',
      '@pages': '/src/modules/pages',
      '@utils': '/src/utils'
    }
  },
  plugins: [react()],
})
