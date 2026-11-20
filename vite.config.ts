import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dataPlugin from './scripts/vite-data-plugin.mjs';
export default defineConfig({plugins:[react(),dataPlugin()],base:'./'});
