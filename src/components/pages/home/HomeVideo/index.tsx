"use client";

import { animated } from "@react-spring/web";
import { clsx } from "clsx";
import {
  FC,
  MouseEventHandler,
  ReactEventHandler,
  Suspense,
  lazy,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Play } from "react-feather";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { HomeContext } from "@/lib/pages/home/home.context";
import { isVideoPlaying, pauseVideo, playVideo } from "@/lib/utils";

import { HomeVideoData } from "./HomeVideoData";
import { useVideoAnimation } from "./internal/HomeVideo.animations";
import s from "./internal/HomeVideo.module.scss";

const Player = lazy(() => import("@mux/mux-video-react"));
const AnimatedPlayer = animated(Player);
const AnimatedPlayButton = animated(Button);

type Props = {
  title: string;
  artist: {
    name: string;
    profileUrl: string;
  };
  url: string;
  dateStringISO8601: string;
  playbackId: string;
  idx: number;
  placeholder?: string;
  forceRender?: boolean;
};

export const HomeVideo: FC<Props> = (props) => {
  const {
    title,
    artist,
    dateStringISO8601,
    playbackId,
    idx,
    placeholder,
    forceRender,
    url,
  } = props;

  const [dataAvailable, setDataAvailable] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dataRef = useRef<HTMLElement>(null);

  const { ref: wrapperIntersectionRef, inView } = useInView({
    triggerOnce: true,
  });

  const setWrapperRefs = useCallback(
    (node: HTMLDivElement) => {
      wrapperRef.current = node;
      wrapperIntersectionRef(node);
    },
    [wrapperIntersectionRef],
  );

  const {
    selectedVideoIdx,
    videos,
    carouselApi,
    addVideoHighlighter,
    addVideoUnhighlighter,
    addVideoPlayButtonHider,
    addVideoPlayButtonShower,
    addVideoDataShower,
    unhighlightVideo,
    showVideoPlayButton,
    hideVideoData,
  } = use(HomeContext) ?? {};

  const { styles, methods } = useVideoAnimation();
  const { highlight, unhighlight, hidePlayButton, showPlayButton } = methods;
  const { videoStyles, wrapperStyles, playButtonStyles } = styles;

  const moveInfosAlongCursor = (e: MouseEvent) => {
    // console.log(e);
    // console.log(dataRef.current);
  };

  const handlePlayerPointerEnter: MouseEventHandler<HTMLVideoElement> = (e) => {
    if (!selectedVideoIdx) {
      return;
    }

    // Only desktop implements mouse in/out interactions
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    highlight();
    playVideo(e.currentTarget);
    selectedVideoIdx.current = idx;

    wrapperRef.current?.addEventListener("mousemove", moveInfosAlongCursor);
  };

  const handlePlayerPointerLeave: MouseEventHandler<HTMLVideoElement> = (e) => {
    if (!selectedVideoIdx) {
      return;
    }

    // Only desktop implements mouse in/out interactions
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    unhighlight();
    pauseVideo(e.currentTarget);
    selectedVideoIdx.current = undefined;

    wrapperRef.current?.removeEventListener("mousemove", moveInfosAlongCursor);
  };

  const handlePlayerClick: MouseEventHandler<HTMLVideoElement> = () => {
    if (
      !carouselApi ||
      !unhighlightVideo ||
      !showVideoPlayButton ||
      !hideVideoData ||
      !videos ||
      !selectedVideoIdx
    ) {
      return;
    }

    // Desktop does not implements on click interactions
    if (window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    const prevVideoIdx = selectedVideoIdx.current;

    if (prevVideoIdx === idx) {
      return;
    }

    // Manual highlighting/unhighlighting on tablet
    if (window.matchMedia("(min-width: 768px)").matches) {
      if (prevVideoIdx !== undefined) {
        const prevVideoElement = videos.current[prevVideoIdx];

        if (isVideoPlaying(prevVideoElement)) {
          pauseVideo(prevVideoElement);
          showVideoPlayButton(prevVideoIdx);
          hideVideoData(prevVideoIdx);
        }

        unhighlightVideo(prevVideoIdx);
        selectedVideoIdx.current = undefined;
      }

      highlight();
      selectedVideoIdx.current = idx;

      return;
    }

    carouselApi.scrollTo(idx + 1);
  };

  const handlePlayButtonClick: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (
      !unhighlightVideo ||
      !showVideoPlayButton ||
      !hideVideoData ||
      !videos ||
      !selectedVideoIdx
    ) {
      return;
    }

    const videoElement = videos.current[idx];
    const prevVideoIdx = selectedVideoIdx.current;

    if (prevVideoIdx !== undefined) {
      const prevVideoElement = videos.current[prevVideoIdx];

      if (isVideoPlaying(prevVideoElement)) {
        pauseVideo(prevVideoElement);
        showVideoPlayButton(prevVideoIdx);
        await hideVideoData(prevVideoIdx);
      }

      if (prevVideoIdx !== idx) {
        unhighlightVideo(prevVideoIdx);
        selectedVideoIdx.current = undefined;
      }
    }

    if (prevVideoIdx !== idx) {
      highlight();
      selectedVideoIdx.current = idx;
    }

    hidePlayButton();
    wrapperRef.current?.classList.add(s["home-video--clear"]);
    appendDataToDOM();
    playVideo(videoElement);
  };

  // Not perfect, maybe find a way to populate videos as soon as videoRef.current gets not null
  const populateItemsOnLoadStart: ReactEventHandler = () => {
    const videoElement = videoRef.current;

    if (videoElement && videos) {
      videos.current.push(videoElement);
    }
  };

  useEffect(() => {
    if (
      !addVideoHighlighter ||
      !addVideoUnhighlighter ||
      !addVideoPlayButtonShower ||
      !addVideoPlayButtonHider ||
      !addVideoDataShower
    ) {
      return;
    }

    const showData = async () => {
      appendDataToDOM();
    };

    addVideoHighlighter(highlight, idx);
    addVideoUnhighlighter(unhighlight, idx);
    addVideoPlayButtonShower(showPlayButton, idx);
    addVideoPlayButtonHider(hidePlayButton, idx);
    addVideoDataShower(showData, idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appendDataToDOM = () => {
    setDataAvailable(true);
  };

  const removeDataFromDOM = () => {
    setDataAvailable(false);
  };

  return (
    <animated.article
      className={clsx(
        s["home-video"],
        "relative",
        "w-full overflow-hidden",
        "aspect-square bg-cover bg-no-repeat",
      )}
      ref={setWrapperRefs}
      style={{
        ...wrapperStyles,
        backgroundImage: `url(${placeholder})`,
      }}
    >
      <HomeVideoData
        artist={artist}
        className={clsx("absolute opacity-0 lg:opacity-100")}
        dateStringISO8601={dateStringISO8601}
        idx={idx}
        reference={dataRef}
        title={title}
        url={url}
      />
      <Suspense
        fallback={
          <div className={clsx("h-full w-full bg-background")}>
            <Skeleton className={clsx("h-full w-full")} />
          </div>
        }
      >
        {(inView || forceRender) && (
          <>
            <AnimatedPlayButton
              className={clsx(
                "lg:hidden",
                "absolute bottom-0 left-0 right-0 top-0 z-10",
                "m-auto",
              )}
              onClick={handlePlayButtonClick}
              size="icon"
              style={playButtonStyles}
              variant="glass"
            >
              <Play
                className={clsx("fill-white/90 text-white/90 drop-shadow-sm")}
                size={20}
              />
            </AnimatedPlayButton>
            {/* TO REMOVE WHEN SUPPORTED */}
            {/* @ts-expect-error: missing props onPointerEnterCapture & onPointerLeaveCapture does not exist  */}
            <AnimatedPlayer
              disablePictureInPicture
              disableRemotePlayback
              loop
              onClick={handlePlayerClick}
              onLoadStart={populateItemsOnLoadStart}
              onPointerEnter={handlePlayerPointerEnter}
              onPointerLeave={handlePlayerPointerLeave}
              playbackId={playbackId}
              playsInline
              preload="metadata"
              ref={videoRef}
              streamType="on-demand"
              style={{
                ...videoStyles,
                aspectRatio: "1 / 1",
                height: "100%",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </>
        )}
      </Suspense>
      {dataAvailable &&
        createPortal(
          <HomeVideoData
            artist={artist}
            className={clsx(
              "fixed bottom-4 left-4 z-40",
              "w-[calc(100%-2rem)]",
            )}
            dateStringISO8601={dateStringISO8601}
            idx={idx}
            portalRendered
            removeDataFromDOM={removeDataFromDOM}
            title={title}
            url={url}
          />,
          document.body,
        )}
    </animated.article>
  );
};
