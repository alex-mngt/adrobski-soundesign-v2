"use client";

import { animated } from "@react-spring/web";
import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ArrowUpRight, Menu, X } from "react-feather";

import { ResponsiveImage } from "@/components/ResponsiveImage";

import logoBlack from "@public/images/logo-black.png";
import logo from "@public/images/logo.png";

import { useHeaderAnimation } from "./internal/Header.animations";
import { MAIN_NAV, SOCIALS } from "./internal/Header.constants";

export const Header: FC = () => {
  const animation = useHeaderAnimation();
  const { hideMobileNav, showMobileNav } = animation.methods;
  const { mobileNavStyles, closeNavStyles, socialsStyles } = animation.styles;

  return (
    <header
      className={clsx(
        "fixed z-50",
        "w-full p-4 md:p-6",
        "flex items-center justify-between",
        "bg-black/90 shadow-lg backdrop-blur",
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
          "bg-white md:bg-transparent",
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
                height={54}
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
              {MAIN_NAV.map((navItem, index, nav) => (
                <li
                  className={clsx(
                    index !== nav.length - 1 && "lg:[&~li]:hover:translate-x-5",
                    index !== 0 && "transition-all",
                    "lg:[&_svg]:hover:opacity-100",
                  )}
                  key={navItem.href}
                >
                  <Link
                    className={clsx("flex items-center gap-1", "text-lg")}
                    href={navItem.href}
                  >
                    {navItem.display}
                    <ArrowUpRight
                      className={clsx(
                        "hidden lg:block",
                        "transition-all lg:opacity-0",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className={clsx("md:order-1 ")}>
            <ul
              className={clsx(
                "flex items-center gap-4 md:justify-end md:gap-6",
                "md:text-white",
              )}
            >
              {SOCIALS.map((social, index) => (
                <animated.li
                  className={clsx("lg:[&_svg]:hover:-translate-y-1")}
                  key={social.href}
                  style={socialsStyles[index]}
                >
                  <Link href={social.href}>{social.logo}</Link>
                </animated.li>
              ))}
            </ul>
          </li>
        </ul>
      </animated.nav>
    </header>
  );
};
