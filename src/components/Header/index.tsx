"use client";

import { animated } from "@react-spring/web";
import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ArrowUpRight, Instagram, Menu, Twitter, X } from "react-feather";

import { Spotify } from "@/components/icons/Spotify";
import { ResponsiveImage } from "@/components/ResponsiveImage";

import {
  INSTAGRAM_PROFILE_URL,
  SPOTIFY_PROFILE_URL,
  TWITTER_PROFILE_URL,
} from "@/lib/constants";

import logoBlack from "@public/images/logo-black.png";
import logo from "@public/images/logo.png";

import { useHeaderAnimation } from "./internal/Header.animations";

import "./internal/Header.style.css";

export const Header: FC = () => {
  const animation = useHeaderAnimation();
  const { hideMobileNav, showMobileNav } = animation.methods;
  const { mobileNavStyles, closeNavStyles, logosStyles } = animation.styles;

  return (
    <header
      className={clsx(
        "relative",
        "p-4 md:p-8",
        "flex items-center justify-between",
      )}
    >
      <Link className={clsx("md:hidden")} href="/">
        <Image
          alt="Adrobski sound design logo"
          height={40}
          priority
          quality={100}
          src={logo}
        />
      </Link>
      <button className={clsx("md:hidden", "p-1")} onClick={showMobileNav}>
        <Menu />
      </button>
      <animated.nav
        className={clsx(
          "fixed left-0 top-0 z-50 md:static",
          "h-dvh w-screen md:h-auto",
          "flex flex-col items-center justify-center",
          "bg-white md:bg-black",
          "text-black md:text-white",
        )}
        style={mobileNavStyles}
      >
        <div
          className={clsx(
            "absolute right-0 top-0",
            "box-content h-[40px] p-4",
            "flex items-center justify-end",
          )}
        >
          <animated.button
            className={clsx("p-1")}
            onClick={hideMobileNav}
            style={closeNavStyles}
          >
            <X className={clsx("text-black")} />
          </animated.button>
        </div>
        <ul
          className={clsx(
            "lg:w-full",
            "flex flex-col items-center justify-center gap-6 md:grid md:grid-cols-3 md:gap-16",
          )}
        >
          <li className={clsx("md:order-2 md:flex md:justify-center")}>
            <Link href="/">
              <ResponsiveImage
                alt="Adrobski sound design logo"
                desktopSrc={logo}
                height={72}
                priority
                quality={100}
                src={logoBlack}
              />
            </Link>
          </li>
          <li className={clsx("md:order-3")}>
            <ul
              className={clsx(
                "flex items-center gap-4 md:gap-6 lg:gap-0",
                "font-bold uppercase",
              )}
            >
              <li
                className={clsx(
                  "lg:[&+li]:hover:translate-x-5 lg:[&_svg]:hover:opacity-100",
                )}
              >
                <Link
                  className={clsx("flex items-center gap-1", "text-lg")}
                  href="/contact"
                >
                  contact
                  <ArrowUpRight
                    className={clsx(
                      "hidden lg:block",
                      "transition-all lg:opacity-0",
                    )}
                  />
                </Link>
              </li>
              <li
                className={clsx("transition-all lg:[&_svg]:hover:opacity-100")}
              >
                <Link
                  className={clsx("flex items-center gap-1", "text-lg")}
                  href="/clients"
                >
                  clients
                  <ArrowUpRight
                    className={clsx(
                      "hidden lg:block",
                      "transition-all lg:opacity-0",
                    )}
                  />
                </Link>
              </li>
            </ul>
          </li>
          <li className={clsx("md:order-1 ")}>
            <ul
              className={clsx(
                "flex items-center gap-4 md:justify-end md:gap-6",
                "md:text-white",
              )}
            >
              <animated.li
                className={clsx("lg:[&_svg]:hover:-translate-y-1")}
                style={logosStyles[0]}
              >
                <Link href={TWITTER_PROFILE_URL}>
                  <Twitter className={clsx("transition-all")} size={32} />
                </Link>
              </animated.li>
              <animated.li
                className={clsx("lg:[&_svg]:hover:-translate-y-1")}
                style={logosStyles[1]}
              >
                <Link href={INSTAGRAM_PROFILE_URL}>
                  <Instagram className={clsx("transition-all")} size={32} />
                </Link>
              </animated.li>
              <animated.li
                className={clsx("lg:[&_svg]:hover:-translate-y-1")}
                style={logosStyles[2]}
              >
                <Link href={SPOTIFY_PROFILE_URL}>
                  <Spotify
                    className={clsx("transition-all")}
                    height={32}
                    width={32}
                  />
                </Link>
              </animated.li>
            </ul>
          </li>
        </ul>
      </animated.nav>
    </header>
  );
};
