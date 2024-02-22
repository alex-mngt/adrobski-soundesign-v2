import type { Metadata } from "next";

import { Urbanist } from "next/font/google";
import { FC, PropsWithChildren } from "react";

import "./globals.css";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adrobski - Sound Design",
  description:
    "Sound Designer & Composer, working with Mekaverse, Blansable, Matteyy, Yoplait, Valorant France...",
};

type Props = {} & PropsWithChildren;

const RootLayout: FC<Props> = (props) => {
  const { children } = props;

  return (
    <html lang="en">
      <body className={urbanist.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
