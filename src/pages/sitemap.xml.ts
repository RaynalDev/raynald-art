import type { APIContext } from 'astro';

const pageModules = import.meta.glob('./**/*.{astro,md,mdx}', { eager: true });

/**
 * Convert a file path within src/pages to its public route.
 */
const buildRoutes = () => {
  const routes = new Set<string>();

  for (const rawPath of Object.keys(pageModules)) {
    if (rawPath === './sitemap.xml.ts') {
      continue;
    }

    const segments = rawPath.split('/');
    if (segments.some((segment) => segment.startsWith('_'))) {
      continue;
    }

    if (rawPath.includes('[')) {
      continue;
    }

    let route = rawPath
      .replace(/^\.\//, '/')
      .replace(/\.(astro|mdx?|md)$/, '')
      .replace(/\/index$/, '/');

    if (route !== '/' && route.endsWith('/')) {
      route = route.slice(0, -1);
    }

    routes.add(route || '/');
  }

  return Array.from(routes).sort();
};

const ROUTES = buildRoutes();

export function GET({ site }: APIContext) {
  if (!site) {
    throw new Error('The `site` configuration option is required to generate the sitemap.');
  }

  const urls = ROUTES.map((route) => new URL(route, site).toString());

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls
      .map((url) => `<url><loc>${url}</loc></url>`)
      .join('') +
    '</urlset>';

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=600',
    },
  });
}
