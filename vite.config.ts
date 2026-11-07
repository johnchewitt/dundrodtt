import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base matches the GitHub Pages project path (johnchewitt/dundrodtt).
export default defineConfig({
  base: '/dundrodtt/',
  plugins: [react()],
});
