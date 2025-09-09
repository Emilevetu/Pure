import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement selon le mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: env.VITE_SERVER_HOST || "::",
      port: parseInt(env.VITE_SERVER_PORT) || 8080,
      proxy: {
        // Proxy pour JPL Horizons de la NASA
        '/api/jpl-horizons': {
          target: 'https://ssd.jpl.nasa.gov',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jpl-horizons/, '/api/horizons'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Configuration des variables d'environnement
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_TIMESTAMP__: JSON.stringify(env.VITE_BUILD_TIMESTAMP || new Date().toISOString()),
    },
    // Configuration du build
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-select'],
          },
        },
      },
    },
    // Configuration des variables d'environnement pour le client
    envPrefix: 'VITE_',
    // Configuration pour la production et Render
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '8080'),
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'astro-alignement.onrender.com',
        '.onrender.com'
      ]
    },
  };
});
