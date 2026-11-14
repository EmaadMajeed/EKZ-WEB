import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import config from './cloudflare.config.ts';

const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
if (!token) {
  console.error('Add your Cloudflare API token to .cloudflare.env.');
  process.exit(1);
}

const [hostname] = config.worker.domains;
const response = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${hostname}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { result: zones } = await response.json();
const zone = zones?.find((entry) => entry.name === hostname && entry.status === 'active');
if (!response.ok || !zone) {
  console.error(`Cloudflare could not find an active zone for ${hostname} using this token. Check the account and Zone Read access.`);
  process.exit(1);
}

const require = createRequire(import.meta.url);
const packagePath = require.resolve('cf/package.json');
const { bin } = JSON.parse(readFileSync(packagePath, 'utf8'));
const cliPath = resolve(dirname(packagePath), bin.cf);
const result = spawnSync(process.execPath, [cliPath, 'deploy', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, CLOUDFLARE_API_TOKEN: token, CLOUDFLARE_ACCOUNT_ID: zone.account.id },
});
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
