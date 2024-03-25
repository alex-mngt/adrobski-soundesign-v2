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
} from "react";
import { Play } from "react-feather";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { HomeContext } from "@/lib/pages/home/home.context";
import {
  startVideoInteraction,
  stopVideoInteraction,
} from "@/lib/pages/home/home.helpers";
import { isVideoPlaying } from "@/lib/utils";

import { useVideoAnimation } from "./internal/HomeVideo.animations";
import s from "./internal/HomeVideo.module.scss";

const Player = lazy(() => import("@mux/mux-video-react"));
const AnimatedPlayer = animated(Player);
const AnimatedPlayButton = animated(Button);

type Props = {
  playbackId: string;
  idx: number;
  placeholder?: string;
  forceRender?: boolean;
};

export const HomeVideo: FC<Props> = (props) => {
  const { playbackId, idx, placeholder, forceRender } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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
    addPlayButtonHider,
    addPlayButtonShower,
    unhighlightVideo,
    showVideoPlayButton,
  } = use(HomeContext) ?? {};

  const { styles, methods } = useVideoAnimation();
  const { highlight, unhighlight, hidePlayButton, showPlayButton } = methods;
  const { videoStyles, wrapperStyles, playButtonStyles } = styles;

  const handlePlayerPointerEnter: MouseEventHandler<HTMLVideoElement> = (e) => {
    if (!selectedVideoIdx) {
      return;
    }

    // Only desktop implements mouse in/out interactions
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    highlight();
    selectedVideoIdx.current = idx;

    startVideoInteraction({
      videoElement: e.currentTarget,
    });
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
    selectedVideoIdx.current = undefined;

    stopVideoInteraction({
      videoElement: e.currentTarget,
    });
  };

  const handlePlayerClick: MouseEventHandler<HTMLVideoElement> = () => {
    if (
      !carouselApi ||
      !unhighlightVideo ||
      !showVideoPlayButton ||
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
          showVideoPlayButton(prevVideoIdx);
          stopVideoInteraction({ videoElement: prevVideoElement });
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

  const handlePlayButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (
      !unhighlightVideo ||
      !showVideoPlayButton ||
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
        showVideoPlayButton(prevVideoIdx);
        stopVideoInteraction({ videoElement: prevVideoElement });
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
    startVideoInteraction({
      videoElement,
    });

    selectedVideoIdx.current = idx;
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
      !addPlayButtonHider ||
      !addPlayButtonShower
    ) {
      return;
    }

    addVideoHighlighter(highlight, idx);
    addPlayButtonHider(hidePlayButton, idx);
    addVideoUnhighlighter(unhighlight, idx);
    addPlayButtonShower(showPlayButton, idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <animated.div
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
              // poster={`https://image.mux.com/${playbackId}/thumbnail.png?time=0`}
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
    </animated.div>
  );
};
