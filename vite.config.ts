import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { api_proxy_addr, dest_root } from "./target_config";

export default defineConfig({
  plugins: [react()],
  base: dest_root,
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: api_proxy_addr,  // "http://localhost:8000"
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});