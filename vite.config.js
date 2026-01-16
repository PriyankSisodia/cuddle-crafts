import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Suppress warnings for Firebase config variables
  // These are safe to expose - Firebase config is public by design
  define: {
    // This helps suppress the Vite warning about AUTH in env vars
    __FIREBASE_CONFIG_IS_PUBLIC__: true
  },
  // Optional: Explicitly mark Firebase env vars as safe
  envPrefix: ['VITE_', 'REACT_APP_']
})
