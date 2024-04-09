"use client";

import { animated } from "@react-spring/web";
import { clsx } from "clsx";
import { DateTime } from "luxon";
import {
  FC,
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
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
import { renderToStaticMarkup } from "react-dom/server";
import { Play } from "react-feather";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { HomeContext, MethodCaller } from "@/lib/pages/home/home.context";
import { isVideoPlaying, pauseVideo, playVideo, throttle } from "@/lib/utils";

import { HomeVideoData } from "./HomeVideoData";
import { HomeVideoDataDesktop } from "./HomeVideoDataDesktop";
import { useVideoAnimation } from "./internal/HomeVideo.animations";
import { Key } from "./internal/HomeVideo.types";

const Player = lazy(() => import("@mux/mux-video-react"));
const AnimatedPlayer = animated(Player);
const AnimatedPlayButton = animated(Button);

type GetThrottledMoveInfosAlongCursorParams = {
  moveVideoDataDesktop: MethodCaller<[number, number]> | undefined;
  articleRef: MutableRefObject<HTMLElement | null>;
  idx: number;
};

const getThrottledMoveInfosAlongCursor = (
  params: GetThrottledMoveInfosAlongCursorParams,
) => {
  return throttle((e: MouseEvent) => {
    const { moveVideoDataDesktop, articleRef, idx } = params;

    if (!moveVideoDataDesktop || !articleRef.current) {
      return;
    }

    const boundingRect = articleRef.current.getBoundingClientRect();
    const x = e.clientX - boundingRect.x;
    const y = e.clientY - boundingRect.y;

    moveVideoDataDesktop(idx, x + 8, y + 8);
  }, 100);
};

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
};

export const HomeVideo: FC<Props> = (props) => {
  const {
    title,
    artist,
    dateStringISO8601,
    playbackId,
    idx,
    placeholder,
    url,
  } = props;

  const [dataAvailable, setDataAvailable] = useState(false);
  const [keyPressed, setKeyPressed] = useState<Key>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const dataRef = useRef<HTMLElement>(null);

  const { ref: articleIntersectionRef, inView } = useInView({
    triggerOnce: true,
  });

  const setArticleRefs = useCallback(
    (node: HTMLElement) => {
      articleRef.current = node;
      articleIntersectionRef(node);
    },
    [articleIntersectionRef],
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
    showVideoDataDesktop,
    hideVideoDataDesktop,
    moveVideoDataDesktop,
    clickOnArtistLink,
    clickOnArtworkLink,
    OS,
  } = use(HomeContext) ?? {};

  const { styles, methods } = useVideoAnimation();
  const { highlight, unhighlight, hidePlayButton, showPlayButton } = methods;
  const { videoStyles, wrapperStyles, playButtonStyles } = styles;

  const throttledMoveInfosAlongCursor = getThrottledMoveInfosAlongCursor({
    moveVideoDataDesktop,
    articleRef,
    idx,
  });

  const detectKeyPressed = (e: KeyboardEvent) => {
    if (OS === "MacOS") {
      if (e.key === "Meta") {
        setKeyPressed("Main");
      }
    } else {
      if (e.key === "Control") {
        setKeyPressed("Main");
      }
    }

    if (e.key === "Alt") {
      setKeyPressed("Alt");
    }
  };

  const resetKeyPressed = () => {
    setKeyPressed(undefined);
  };

  const handlePlayerPointerEnter: MouseEventHandler<HTMLVideoElement> = (e) => {
    if (!selectedVideoIdx || !showVideoDataDesktop) {
      return;
    }

    // Only desktop implements mouse in/out interactions
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    highlight();
    playVideo(e.currentTarget);
    selectedVideoIdx.current = idx;

    articleRef.current?.addEventListener(
      "mousemove",
      throttledMoveInfosAlongCursor,
    );

    showVideoDataDesktop(idx);

    document.addEventListener("keydown", detectKeyPressed);
    document.addEventListener("keyup", resetKeyPressed);
  };

  const handlePlayerPointerLeave: MouseEventHandler<HTMLVideoElement> = (e) => {
    if (!selectedVideoIdx || !hideVideoDataDesktop) {
      return;
    }

    // Only desktop implements mouse in/out interactions
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    unhighlight();
    pauseVideo(e.currentTarget);
    selectedVideoIdx.current = undefined;

    articleRef.current?.removeEventListener(
      "mousemove",
      throttledMoveInfosAlongCursor,
    );

    hideVideoDataDesktop(idx);

    setKeyPressed(undefined);
    document.removeEventListener("keydown", detectKeyPressed);
    document.removeEventListener("keyup", resetKeyPressed);
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

    // Manual link opening while holding some specific keys on desktop
    if (window.matchMedia("(min-width: 1024px)").matches && keyPressed) {
      if (keyPressed === "Main" && clickOnArtistLink) {
        clickOnArtistLink(idx);
      } else if (keyPressed === "Alt" && clickOnArtworkLink) {
        clickOnArtworkLink(idx);
      }

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

  const date = DateTime.fromISO(dateStringISO8601);

  const backgroundImageSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        id="blur"
      >
        <feGaussianBlur edgeMode="duplicate" stdDeviation="20 20" />
        <feComponentTransfer>
          <feFuncA tableValues="1 1" type="discrete" />
        </feComponentTransfer>
      </filter>
      <image
        filter="url(#blur)"
        height="100%"
        width="100%"
        xlinkHref={placeholder}
      />
    </svg>
  );

  return (
    <animated.article
      className={clsx("relative", "w-full", "aspect-square")}
      ref={setArticleRefs}
    >
      <HomeVideoDataDesktop
        artist={artist}
        date={date}
        idx={idx}
        keyPressed={keyPressed}
        reference={dataRef}
        title={title}
        url={url}
      />
      <animated.div
        className={clsx(
          "relative",
          "h-full w-full",
          "aspect-square overflow-hidden bg-cover bg-center bg-no-repeat",
        )}
        style={{
          ...wrapperStyles,
          backgroundImage: `url('data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderToStaticMarkup(backgroundImageSVG))}')`,
        }}
      >
        <Suspense
          fallback={
            <div className={clsx("absolute inset-0", "bg-background")}>
              <Skeleton className={clsx("h-full w-full")} />
            </div>
          }
        >
          {inView && (
            <>
              <AnimatedPlayButton
                className={clsx("lg:hidden", "absolute inset-0 z-10", "m-auto")}
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
                startTime={0.001}
                streamType="on-demand"
                style={{
                  ...videoStyles,
                  aspectRatio: "1 / 1",
                  position: "absolute",
                  inset: 0,
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </>
          )}
        </Suspense>
      </animated.div>
      {dataAvailable &&
        createPortal(
          <HomeVideoData
            artist={artist}
            date={date}
            idx={idx}
            removeDataFromDOM={removeDataFromDOM}
            title={title}
            url={url}
          />,
          document.body,
        )}
    </animated.article>
  );
};
