import type { AppProps } from "next/app";

import { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/system";
import { cn, Spinner, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { useReadLocalStorage } from "usehooks-ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";

import "@/styles/globals.css";
import { useAuthCookie, useGetUserData } from "@/hooks";
import { fontSans, fontMono } from "@/config/fonts";
import Logo from "@/layouts/logo";
import { siteConfig } from "@/config/site";
import PageTransition from "@/layouts/page-transition";
import { RouteLoadingIndicator } from "@/layouts/route-loading-indicator";
import { Navbar } from "@/components/navbar";
import { BottomNavbar } from "@/components/bottom-navbar";

const queryClient = new QueryClient();

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { token } = useGetUserData();
  const { setAuthToken } = useAuthCookie();

  const localStorageToken = useReadLocalStorage<string>("token") || "";

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    async function getToken() {
      const tokenInfo = token || localStorageToken;

      if (tokenInfo) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${tokenInfo.replaceAll('"', "")}`;
      }

      if (tokenInfo) {
        setAuthToken(tokenInfo);
      }

      setIsUserLoggedIn(!!tokenInfo);

      setIsLoading(false);
    }
    getToken();
  }, [token, localStorageToken]);

  return (
    <>
      <Head>
        <title>{`${siteConfig.name} - ${siteConfig.tagline}`}</title>
        <meta content={siteConfig.description} name="description" />
        <meta content={siteConfig.keywords.join(", ")} name="keywords" />
        <link href={siteConfig.url} rel="canonical" />
        <meta
          content={`${siteConfig.url}${siteConfig.ogImage}`}
          property="og:image"
        />

        {/* Open Graph */}
        <meta
          content={`${siteConfig.name} - ${siteConfig.tagline}`}
          property="og:title"
        />
        <meta content={siteConfig.description} property="og:description" />
        <meta content="website" property="og:type" />
        <meta content={siteConfig.url} property="og:url" />
        <meta content={siteConfig.name} property="og:site_name" />
        <meta content="en_US" property="og:locale" />

        {/* Twitter */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta
          content={`${siteConfig.name} - ${siteConfig.tagline}`}
          name="twitter:title"
        />
        <meta content={siteConfig.description} name="twitter:description" />
        <meta
          content={`${siteConfig.url}${siteConfig.ogImage}`}
          name="twitter:image"
        />
        <meta content="@memorly_app" name="twitter:creator" />

        {/* Additional Meta Tags */}
        <meta content={siteConfig.author.name} name="author" />
        <meta content="#7828c8" name="theme-color" />
        <meta
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          name="viewport"
        />

        {/* Favicon */}
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <HeroUIProvider className="h-full flex flex-col" navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <QueryClientProvider client={queryClient}>
            <ToastProvider />
            {isLoading ? (
              <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Logo />
                  <Spinner size="lg" />
                </div>
              </div>
            ) : (
              <>
                <Navbar />
                <PageTransition>
                  <main
                    className={cn(
                      "container mx-auto max-w-7xl px-6 h-full mb-[85px]",
                      isUserLoggedIn &&
                        "[&_.grid-background]:blur-[2px] [&_.grid-background]:animate-pulse",
                    )}
                  >
                    <Component {...pageProps} />
                  </main>
                </PageTransition>
                {isUserLoggedIn && <BottomNavbar />}
                <RouteLoadingIndicator />
              </>
            )}
          </QueryClientProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
