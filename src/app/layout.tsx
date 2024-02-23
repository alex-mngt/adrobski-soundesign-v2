
import { clsx } from "clsx";
import { Urbanist } from "next/font/google";
import { FC, PropsWithChildren } from "react";

import { Header } from "@/components/Header";

import type { Metadata, Viewport } from "next";

import "./globals.css";

const urbanist = Urbanist({ subsets: ["latin"] });

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
          urbanist.className,
          "min-h-dvh",
          "cursor-cell bg-black",
          "text-white",
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
