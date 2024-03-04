import { clsx } from "clsx";
import { ReactNode } from "react";
import { Instagram, Twitter } from "react-feather";

import { Spotify } from "@/components/icons/Spotify";

import {
  INSTAGRAM_PROFILE_URL,
  SPOTIFY_PROFILE_URL,
  TWITTER_PROFILE_URL,
} from "@/lib/constants";

const logosClassName = clsx("transition-all");

type Social = {
  href: string;
  logo: ReactNode;
};

export const SOCIALS: Array<Social> = [
  {
    href: TWITTER_PROFILE_URL,
    logo: <Twitter className={logosClassName} size={32} />,
  },
  {
    href: INSTAGRAM_PROFILE_URL,
    logo: <Instagram className={logosClassName} size={32} />,
  },
  {
    href: SPOTIFY_PROFILE_URL,
    logo: <Spotify className={clsx(logosClassName)} height={32} width={32} />,
  },
];

type Link = {
  href: string;
  display: string;
};

export const MAIN_NAV: Array<Link> = [
  { href: "/contact", display: "contact" },
  { href: "/clients", display: "clients" },
];
