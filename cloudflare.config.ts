import { defineConfig } from 'cf/config';

export default defineConfig({
  worker: {
    name: 'ekz-technologies-placeholder',
    compatibilityDate: '2026-11-14',
    domains: ['ekztechnologies.com'],
    workersDev: false,
    previewUrls: false,
    observability: { enabled: true, traces: { enabled: true } },
  },
});
