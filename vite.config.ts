import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Type cast process to any to allow access to cwd() which might be missing in partial node types
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This exposes the system env variable to the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});