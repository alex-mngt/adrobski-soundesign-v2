"use-client";

import { animated } from "@react-spring/web";
import clsx from "clsx";
import { DateTime } from "luxon";
import Link from "next/link";
import { FC, RefObject, useContext, useEffect, useRef } from "react";

import { ButtonLink } from "@/components/ui/button-link";

import { HomeContext } from "@/lib/pages/home/home.context";

import { useDataDesktopAnimation } from "./internal/HomeVideoDataDesktop.animations";
import { KeyIndicator } from "./KeyIndicator";
import { Key } from "../internal/HomeVideo.types";

type Props = {
  className?: string;
  reference?: RefObject<HTMLElement>;
  title: string;
  artist: {
    name: string;
    profileUrl: string;
  };
  url: string;
  date: DateTime;
  idx: number;
  keyPressed: Key | undefined;
};

export const HomeVideoDataDesktop: FC<Props> = (props) => {
  const { className, reference, title, artist, date, idx, keyPressed, url } =
    props;

  const artworkLinkRef = useRef<HTMLAnchorElement>(null);
  const artistProfileLinkRef = useRef<HTMLAnchorElement>(null);

  const {
    addVideoDataDesktopHider,
    addVideoDataDesktopShower,
    addVideoDataDesktopMover,
    addVideoDataDesktopArtistLink,
    addVideoDataDesktopArtworkLink,
    OS,
  } = useContext(HomeContext) ?? {};

  const { methods, styles } = useDataDesktopAnimation();
  const { dataDesktopStyles } = styles;
  const { showDataDesktop, hideDataDesktop, moveDataDesktop } = methods;

  const isMacOS = OS === "MacOS";

  useEffect(() => {
    if (
      !addVideoDataDesktopShower ||
      !addVideoDataDesktopHider ||
      !addVideoDataDesktopMover ||
      !addVideoDataDesktopArtistLink ||
      !addVideoDataDesktopArtworkLink
    ) {
      return;
    }

    addVideoDataDesktopShower(showDataDesktop, idx);
    addVideoDataDesktopHider(hideDataDesktop, idx);
    addVideoDataDesktopMover(moveDataDesktop, idx);

    if (artistProfileLinkRef.current) {
      addVideoDataDesktopArtistLink(artistProfileLinkRef.current, idx);
    }

    if (artworkLinkRef.current) {
      addVideoDataDesktopArtworkLink(artworkLinkRef.current, idx);
    }
  }, [
    addVideoDataDesktopArtistLink,
    addVideoDataDesktopArtworkLink,
    addVideoDataDesktopHider,
    addVideoDataDesktopMover,
    addVideoDataDesktopShower,
    hideDataDesktop,
    idx,
    moveDataDesktop,
    showDataDesktop,
  ]);

  return (
    <animated.header
      className={clsx(
        className,
        "absolute z-10",
        "min-w-[345px] p-4",
        "flex flex-col gap-1",
        "pointer-events-none rounded-md border border-white/10 bg-background/80 shadow backdrop-blur-sm",
      )}
      ref={reference}
      style={dataDesktopStyles}
    >
      <h2 className={clsx("flex items-center", "font-bold")}>
        {title}
        <span className={clsx("font-normal")}>&nbsp;by&nbsp;</span>
        <address className={clsx("font-medium not-italic")}>
          <Link
            href={artist.profileUrl}
            ref={artistProfileLinkRef}
            target="_blank"
          >
            {artist.name}
          </Link>
        </address>
      </h2>
      <p className={clsx("flex items-center gap-2")}>
        {keyPressed ? "Hold" : "Press"}
        {(keyPressed === undefined || keyPressed === "Main") && (
          <KeyIndicator pressed={keyPressed === "Main"}>
            {isMacOS ? "\u2318" : "Ctrl"}
          </KeyIndicator>
        )}
        {keyPressed === undefined && "or"}
        {(keyPressed === undefined || keyPressed === "Alt") && (
          <KeyIndicator pressed={keyPressed === "Alt"}>
            {isMacOS ? "\u2325" : "Alt"}
          </KeyIndicator>
        )}
        {keyPressed !== undefined && "+"}
        {keyPressed === "Main" && (
          <>
            <span className={clsx("font-bold")}>Click</span>
            to open artist profile
          </>
        )}
        {keyPressed === "Alt" && (
          <>
            <span className={clsx("font-bold")}>Click</span>
            to open original artwork
          </>
        )}
      </p>
      <ButtonLink
        className={clsx("absolute opacity-0")}
        href={url}
        ref={artworkLinkRef}
        target="_blank"
      >
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
