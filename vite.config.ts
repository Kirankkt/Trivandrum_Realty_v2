import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
// Type cast process to any to allow access to cwd()
const env = loadEnv(mode, (process as any).cwd(), '');
return {
plugins: [react()],
define: {
// Robustly capture API_KEY: Check loaded env OR system process.env
// This ensures it works on Netlify even if .env file is missing
'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
}
};
});
