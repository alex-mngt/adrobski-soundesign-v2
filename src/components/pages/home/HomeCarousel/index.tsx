"use client";

import { clsx } from "clsx";
import { FC, PropsWithChildren, use, useEffect } from "react";

import { Carousel } from "@/components/ui/carousel";

import { HomeContext } from "@/lib/pages/home/home.context";
import { stopVideoInteraction } from "@/lib/pages/home/home.helpers";
import { isVideoPlaying } from "@/lib/utils";

type Props = {} & PropsWithChildren;

export const HomeCarousel: FC<Props> = (props) => {
  const { children } = props;

  const {
    selectedVideoIdx,
    highlightVideo,
    unhighlightVideo,
    showVideoPlayButton,
    carouselApi,
    setCarouselApi,
    videos,
  } = use(HomeContext) ?? {};

  useEffect(() => {
    if (!carouselApi || !videos || !selectedVideoIdx) {
      return;
    }

    carouselApi.on("select", (api) => {
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
          stopVideoInteraction({ videoElement: prevVideoElement });
          showVideoPlayButton(prevVideoIdx);
        }

        unhighlightVideo(prevVideoIdx);
        selectedVideoIdx.current = undefined;
      }

      if (
        highlightVideo &&
        currVideoIdx >= 0 &&
        currVideoIdx < videos.current.length
      ) {
        highlightVideo(currVideoIdx);
        selectedVideoIdx.current = currVideoIdx;
      }
    });
  }, [
    carouselApi,
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
