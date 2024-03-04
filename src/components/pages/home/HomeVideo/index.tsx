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
  useEffect,
  useRef,
} from "react";
import { useInView } from "react-intersection-observer";

import { Skeleton } from "@/components/ui/skeleton";

import { HomeContext } from "@/lib/pages/home/home.context";
import { highlightVideo, fadeVideo } from "@/lib/pages/home/home.helpers";

import { useVideoAnimation } from "./internal/Video.animations";

const Player = lazy(() => import("@mux/mux-video-react"));
const AnimatedPlayer = animated(Player);

type Props = {
  playbackId: string;
  idx: number;
  placeholder?: string;
  forceRender?: boolean;
};

export const HomeVideo: FC<Props> = (props) => {
  const { playbackId, idx, placeholder, forceRender } = props;

  const videoRef = useRef<HTMLVideoElement>(null);

  const { ref, inView } = useInView({ triggerOnce: true });

  const {
    addVideoMaximizer,
    addVideoMinimizer,
    selectedVideoIdx,
    videos,
    carouselApi,
    maximiseVideo,
    minimizeVideo,
  } = use(HomeContext) ?? {};

  const { styles, methods } = useVideoAnimation();
  const { maximise, minimize } = methods;
  const { videoStyles, wrapperStyles } = styles;

  const handleHighlightVideoMouseEnter: MouseEventHandler<HTMLVideoElement> = (
    e,
  ) => {
    // Only desktop implements mouse in/out interactions
    if (!maximiseVideo || !window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    highlightVideo({
      maximiseVideo,
      videoIdx: idx,
      videoElement: e.currentTarget,
    });
  };

  const handleMinimizeVideoMouseLeave: MouseEventHandler<HTMLVideoElement> = (
    e,
  ) => {
    // Only desktop implements mouse in/out interactions
    if (!minimizeVideo || !window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    fadeVideo({
      minimizeVideo,
      videoIdx: idx,
      videoElement: e.currentTarget,
    });
  };

  const handleHighlightVideoClick: MouseEventHandler<HTMLVideoElement> = (
    e,
  ) => {
    if (!carouselApi || !maximiseVideo || !minimizeVideo) {
      return;
    }

    // No action associated with click on desktop
    if (window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    // Manual highlighting/minimizing on tablet
    if (window.matchMedia("(min-width: 768px)").matches && selectedVideoIdx) {
      if (selectedVideoIdx.current !== undefined && videos) {
        fadeVideo({
          minimizeVideo,
          videoIdx: selectedVideoIdx.current,
          videoElement: videos.current[selectedVideoIdx.current],
        });
      }

      highlightVideo({
        maximiseVideo,
        videoIdx: idx,
        videoElement: e.currentTarget,
      });

      selectedVideoIdx.current = idx;

      return;
    }

    // Highlighting/minimizing implemented on slide change on mobile
    carouselApi.scrollTo(idx + 1);
  };

  // Not perfect, maybe find a way to populate videos as soon as videoRef.current gets not null
  const handlePopulateItemsOnLoadStart: ReactEventHandler = () => {
    const videoElement = videoRef.current;

    if (videoElement && videos) {
      videos.current.push(videoElement);
    }
  };

  useEffect(() => {
    if (!addVideoMaximizer || !addVideoMinimizer) {
      return;
    }

    addVideoMaximizer(maximise);
    addVideoMinimizer(minimize);
  }, [addVideoMaximizer, addVideoMinimizer, maximise, minimize]);

  return (
    <animated.div
      className={clsx(
        "w-full overflow-hidden",
        "aspect-square",
        inView && "bg-cover bg-no-repeat",
      )}
      ref={ref}
      style={{
        ...wrapperStyles,
        backgroundImage: inView ? `url(${placeholder})` : undefined,
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
          <AnimatedPlayer
            className={clsx("h-full w-full object-cover object-center")}
            loop
            onClick={handleHighlightVideoClick}
            onLoadStart={handlePopulateItemsOnLoadStart}
            onMouseEnter={handleHighlightVideoMouseEnter}
            onMouseLeave={handleMinimizeVideoMouseLeave}
            placeholder={undefined}
            playbackId={playbackId}
            playsInline
            ref={videoRef}
            streamType="on-demand"
            style={videoStyles}
          />
        )}
      </Suspense>
    </animated.div>
  );
};
