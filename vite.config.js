import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config as dotenvConfig } from 'dotenv';
import replace from '@rollup/plugin-replace';

dotenvConfig();

export default defineConfig({
  plugins: [
    react(),
    replace({
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify(process.env.REACT_APP_BACKEND_URL),
      'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(process.env.REACT_APP_GOOGLE_CLIENT_ID),
      'process.env.FACEBOOK_OAUTH2_CLIENT_SECRET': JSON.stringify(process.env.FACEBOOK_OAUTH2_CLIENT_SECRET),
      'process.env.FACEBOOK_OAUTH2_CLIENT_ID': JSON.stringify(process.env.FACEBOOK_OAUTH2_CLIENT_ID),
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3033,
  },
});
