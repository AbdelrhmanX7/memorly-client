import type { NextApiRequest, NextApiResponse } from "next";

import { siteConfig } from "@/config/site";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

const generateSitemap = (): string => {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString().split("T")[0];

  // Define your public pages here
  const urls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/features`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.5,
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.5,
    },
  ];

  const urlEntries = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sitemap = generateSitemap();

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate",
    );
    res.status(200).send(sitemap);
  } catch (_error) {
    res.status(500).json({ error: "Failed to generate sitemap" });
  }
}
