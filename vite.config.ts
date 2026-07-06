import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const SHEET_ID = '1VHEtEdSHVGsCS70DbVXfXUbPpNgoUlNgsB7hph2JzOM'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/schedule': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        rewrite: () =>
          `/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('시트1')}`,
      },
    },
  },
})
