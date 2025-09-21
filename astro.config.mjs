// @ts-check
import { defineConfig } from 'astro/config';

const integrations = [];

try {
  const { default: sitemap } = await import('@astrojs/sitemap');
  integrations.push(sitemap());
} catch (error) {
  const hint = error instanceof Error ? error.message : String(error);
  console.warn('[@astrojs/sitemap] integration unavailable, continuing without it:', hint);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://raynald-art.com',
  integrations,
});
