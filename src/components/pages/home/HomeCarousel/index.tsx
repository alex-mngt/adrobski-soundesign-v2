"use client";

import { clsx } from "clsx";
import { UseEmblaCarouselType } from "embla-carousel-react";
import { FC, PropsWithChildren, use, useEffect } from "react";

import { Carousel } from "@/components/ui/carousel";

import { HomeContext } from "@/lib/pages/home/home.context";
import { isVideoPlaying, pauseVideo } from "@/lib/utils";

type Props = {} & PropsWithChildren;

export const HomeCarousel: FC<Props> = (props) => {
  const { children } = props;

  const {
    selectedVideoIdx,
    highlightVideo,
    unhighlightVideo,
    showVideoPlayButton,
    hideVideoData,
    carouselApi,
    setCarouselApi,
    videos,
  } = use(HomeContext) ?? {};

  useEffect(() => {
    if (!carouselApi || !videos || !selectedVideoIdx || !hideVideoData) {
      return;
    }

    const handleSlideChange = (api: NonNullable<UseEmblaCarouselType[1]>) => {
      // Remove 1 because the first slide is not a video
      const currVideoIdx = api.selectedScrollSnap() - 1;
      const prevVideoIdx = api.previousScrollSnap() - 1;

      if (
        unhighlightVideo &&
        showVideoPlayButton &&
        prevVideoIdx >= 0 &&
        prevVideoIdx < videos.current.length
      ) {
        const prevVideoElement = videos.current[prevVideoIdx];

        if (isVideoPlaying(prevVideoElement)) {
          pauseVideo(prevVideoElement);
          hideVideoData(prevVideoIdx);
          showVideoPlayButton(prevVideoIdx);
        }

        unhighlightVideo(prevVideoIdx);
        selectedVideoIdx.current = undefined;
      }

      if (
        highlightVideo &&
        currVideoIdx >= 0 &&
        // Don't check on the first video since the videos RefObject is still empty due to the mux video library lazy loading
        (currVideoIdx === 0 || currVideoIdx < videos.current.length)
      ) {
        highlightVideo(currVideoIdx);
        selectedVideoIdx.current = currVideoIdx;
      }
    };

    carouselApi.on("select", handleSlideChange);

    return () => {
      carouselApi.off("select", handleSlideChange);
    };
  }, [
    carouselApi,
    hideVideoData,
    highlightVideo,
    selectedVideoIdx,
    showVideoPlayButton,
    unhighlightVideo,
    videos,
  ]);

  return (
    <Carousel
      className={clsx("w-full")}
      opts={{
        align: "center",
        breakpoints: {
          "(min-width: 768px)": {
            active: false,
          },
        },
      }}
      orientation="vertical"
      setApi={setCarouselApi}
    >
      {children}
    </Carousel>
  );
};
