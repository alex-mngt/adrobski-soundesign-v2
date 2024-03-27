import clsx from "clsx";
import { FC } from "react";
import { ChevronDown } from "react-feather";

import s from "./internal/HomeHero.module.scss";

const HomeHero: FC = () => {
  return (
    <div className={clsx("relative flex", "h-full", "flex-col justify-center")}>
      <h1
        className={clsx(
          "text-center font-serif text-8xl font-extrabold italic md:text-[13em]",
        )}
      >
        Adrobski
      </h1>
      <div
        className={clsx(
          s["hero-description"],
          "flex flex-col gap-2",
          "text-xl font-semibold md:tracking-[1.13em]",
        )}
      >
        <p className={clsx("")}>French Musician and Sound Designer</p>
      </div>
      <div
        className={clsx(
          "absolute bottom-5",
          "w-full",
          "flex flex-col items-center justify-center gap-2",
          "text-2xl font-semibold",
        )}
      >
        <span>Working for</span>
        <span>3d Artists & Brands</span>
        <ChevronDown className={clsx("mt-5", "h-8 w-8", "animate-bounce")} />
      </div>
    </div>
  );
};

export default HomeHero;
