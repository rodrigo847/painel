import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    base: '/', // Firebase Hosting serve da raiz
    server: {
        port: 5173,
        host: 'localhost',
        open: false,
        strictPort: false
    },
    build: {
        target: 'ES2020',
        sourcemap: false,
        minify: 'esbuild'
    }
});
