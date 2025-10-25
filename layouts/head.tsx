import React from "react";
import NextHead from "next/head";

import { siteConfig } from "@/config/site";

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

export const Head = ({
  title,
  description,
  keywords,
  ogImage,
  noIndex = false,
}: HeadProps) => {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} - ${siteConfig.tagline}`;
  const pageDescription = description || siteConfig.description;
  const pageKeywords = keywords
    ? [...siteConfig.keywords, ...keywords]
    : siteConfig.keywords;
  const pageOgImage = ogImage || siteConfig.ogImage;
  const fullOgImageUrl = pageOgImage.startsWith("http")
    ? pageOgImage
    : `${siteConfig.url}${pageOgImage}`;

  return (
    <NextHead>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta content={pageDescription} name="description" />
      <meta content={pageKeywords.join(", ")} name="keywords" />
      <meta content={siteConfig.author.name} name="author" />
      <meta
        key="viewport"
        content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        name="viewport"
      />

      {/* Robots */}
      {noIndex && <meta content="noindex, nofollow" name="robots" />}

      {/* Open Graph / Facebook */}
      <meta content="website" property="og:type" />
      <meta content={siteConfig.url} property="og:url" />
      <meta content={pageTitle} property="og:title" />
      <meta content={pageDescription} property="og:description" />
      <meta content={fullOgImageUrl} property="og:image" />
      <meta content={siteConfig.name} property="og:site_name" />
      <meta content="en_US" property="og:locale" />

      {/* Twitter */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={siteConfig.url} name="twitter:url" />
      <meta content={pageTitle} name="twitter:title" />
      <meta content={pageDescription} name="twitter:description" />
      <meta content={fullOgImageUrl} name="twitter:image" />
      <meta content="@memorly_app" name="twitter:creator" />

      {/* Additional SEO */}
      <meta content={siteConfig.name} name="application-name" />
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta content="default" name="apple-mobile-web-app-status-bar-style" />
      <meta content={siteConfig.name} name="apple-mobile-web-app-title" />
      <meta content="telephone=no" name="format-detection" />
      <meta content="yes" name="mobile-web-app-capable" />
      <meta content="#7828c8" name="theme-color" />

      {/* Favicon */}
      <link href="/favicon.ico" rel="icon" />
      <link
        href="/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link href="/site.webmanifest" rel="manifest" />

      {/* Canonical URL */}
      <link href={siteConfig.url} rel="canonical" />
    </NextHead>
  );
};
