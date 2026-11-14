import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [cloudflare()],
  server: { fs: { deny: ['.cloudflare.env', '.env', '.env.*', '*.{crt,pem}', '**/.git/**'] } },
});
