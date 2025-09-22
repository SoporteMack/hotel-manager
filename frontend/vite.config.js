import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs'

export default defineConfig({
  server: {
    port: 5173,
    // Permitir todos los hosts ngrok
    allowedHosts: [
      'localhost',
      '.ngrok-free.app'  // Permite cualquier subdominio de ngrok
    ],
    host: '0.0.0.0', 
    /*https: {
      key: fs.readFileSync('localhost+2-key.pem'),
      cert: fs.readFileSync('localhost+2.pem')
    },*/
    
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Pension Monet',
        short_name: 'Pension Monet',
        description: 'App para administración de hoteles',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        version: '1.1.3',
        icons: [
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
