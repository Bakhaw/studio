import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import localFont from "next/font/local";

import SessionProvider from "@/components/SessionProvider";

import { cn } from "@/lib/utils";

import "@/app/styles/globals.css";
import "@/app/styles/vinyl.scss";
import QueryProvider from "@/components/QueryProvider";

const myFont = localFont({
  src: [
    {
      path: "../fonts/CircularStd-Medium.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/CircularStd-MediumItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/CircularStd-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/CircularStd-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Studio",
  description: "Studio",
  manifest: "/manifest.json",
};

type Props = {
  children?: React.ReactNode;
};

function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background h-screen overflow-hidden",
          myFont.className
        )}
      >
        <SessionProvider>
          <QueryProvider>
            {children}
            <SpeedInsights />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

export default RootLayout;
