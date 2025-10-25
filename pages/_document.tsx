import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";

export default function Document() {
  return (
    <Html className="h-full" lang="en">
      <Head />
      <body
        className={clsx(
          "bg-background font-sans antialiased h-full [&>div]:h-full",
          fontSans.variable
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
