"use-client";

import { animated } from "@react-spring/web";
import clsx from "clsx";
import { DateTime } from "luxon";
import Link from "next/link";
import { FC, useContext, useEffect } from "react";

import { ButtonLink } from "@/components/ui/button-link";

import { HomeContext } from "@/lib/pages/home/home.context";

import { useDataAnimation } from "./internal/HomeVideoData.animations";
import s from "./internal/HomeVideoData.module.scss";

type Props = {
  className?: string;
  title: string;
  artist: {
    name: string;
    profileUrl: string;
  };
  url: string;
  date: DateTime;
  idx: number;
  removeDataFromDOM: () => void;
};

export const HomeVideoData: FC<Props> = (props) => {
  const { className, title, artist, date, idx, removeDataFromDOM, url } = props;

  const { addVideoDataHider } = useContext(HomeContext) ?? {};

  const { methods, styles } = useDataAnimation();
  const { dataStyles } = styles;
  const { showData, hideData } = methods;

  useEffect(() => {
    if (!addVideoDataHider) {
      return;
    }

    addVideoDataHider(async () => {
      await hideData();
      removeDataFromDOM();
    }, idx);

    showData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <animated.div
      className={clsx(
        className,
        "fixed bottom-4 left-4 z-40",
        "w-[calc(100%-2rem)] p-4",
        "flex items-center justify-between gap-4",
        "rounded-md border border-white/10 bg-background/80 shadow backdrop-blur-sm",
      )}
      style={dataStyles}
    >
      <h2 className={clsx("flex flex-col gap-1", "font-bold")}>
        {title}
        <address className={clsx("pb-1", "font-medium not-italic")}>
          <Link
            className={clsx(s["artist-link"])}
            href={artist.profileUrl}
            target="_blank"
          >
            {artist.name}
          </Link>
        </address>
      </h2>
      <ButtonLink href={url} target="_blank">
        View artwork
      </ButtonLink>
      <p className={clsx("absolute text-transparent")}>
        Created on&nbsp;
        <time dateTime={date.toISODate() ?? undefined}>
          {date.toLocaleString(DateTime.DATE_FULL, { locale: "en-EN" })}
        </time>
      </p>
    </animated.div>
  );
};
