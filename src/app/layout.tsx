import { clsx } from "clsx";
import { Urbanist } from "next/font/google";
import { FC, PropsWithChildren } from "react";

import { Header } from "@/components/Header";

import type { Metadata, Viewport } from "next";

import "./globals.css";

const fontSans = Urbanist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Adrobski - Sound Design",
  description:
    "Sound Designer & Composer, working with Mekaverse, Blansable, Matteyy, Yoplait, Valorant France...",
  robots: "noindex",
};

export const viewport: Viewport = {
  themeColor: "black",
};

type Props = {} & PropsWithChildren;

const RootLayout: FC<Props> = (props) => {
  const { children } = props;

  return (
    <html lang="en">
      <body
        className={clsx(
          "min-h-dvh",
          "cursor-cell",
          "font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
