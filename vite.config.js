import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/BiscuitBoss/',  // Adjust this to match your repository path
    plugins: [react()],
    build: {
        outDir: 'build'
    }
});