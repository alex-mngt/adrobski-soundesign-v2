"use-client";

import { animated } from "@react-spring/web";
import clsx from "clsx";
import { DateTime } from "luxon";
import Link from "next/link";
import { FC, RefObject, useContext, useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";

import { HomeContext } from "@/lib/pages/home/home.context";

import { useDataAnimation } from "./_internal/HomeVideoData.animations";

type CommonProps = {
  className?: string;
  reference?: RefObject<HTMLElement>;
  title: string;
  artist: {
    name: string;
    profileUrl: string;
  };
  url: string;
  dateStringISO8601: string;
  idx: number;
};

type DefaultProps = CommonProps & {
  portalRendered?: false;
  removeDataFromDOM?: undefined;
};

type PortalRenderedProps = CommonProps & {
  portalRendered: true;
  removeDataFromDOM: () => void;
};

type Props = DefaultProps | PortalRenderedProps;

export const HomeVideoData: FC<Props> = (props) => {
  const {
    className,
    reference,
    title,
    artist,
    dateStringISO8601,
    idx,
    portalRendered,
    removeDataFromDOM,
    url,
  } = props;

  const [date, setDate] = useState<DateTime>();

  const { addVideoDataHider, addVideoDataShower } =
    useContext(HomeContext) ?? {};

  const { methods, styles } = useDataAnimation();
  const { dataStyles } = styles;
  const { showData, hideData } = methods;

  useEffect(() => {
    setDate(DateTime.fromISO(dateStringISO8601));
  }, [dateStringISO8601]);

  useEffect(() => {
    if (!addVideoDataHider || !addVideoDataShower || !portalRendered) {
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
    <animated.header
      className={clsx(
        className,
        "p-4",
        "flex items-center justify-between gap-4",
        "rounded-md border border-white/10 bg-background/80 shadow backdrop-blur-sm",
      )}
      ref={reference}
      style={portalRendered ? dataStyles : undefined}
    >
      <h2 className={clsx("font-bold")}>
        {title}
        <span className={clsx("hidden lg:inline")}>&nbsp;by&nbsp;</span>
        <address className={clsx("font-medium not-italic")}>
          <Link href={artist.profileUrl} target="_blank">
            {artist.name}
          </Link>
        </address>
      </h2>
      <ButtonLink href={url} target="_blank">
        View artwork
      </ButtonLink>
      {date && (
        <p className={clsx("absolute text-transparent")}>
          Created on&nbsp;
          <time dateTime={date.toISODate() ?? undefined}>
            {date.toLocaleString(DateTime.DATE_FULL, { locale: "en-EN" })}
          </time>
        </p>
      )}
    </animated.header>
  );
};
