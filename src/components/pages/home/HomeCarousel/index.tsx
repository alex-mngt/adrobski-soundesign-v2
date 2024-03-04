"use client";

import { clsx } from "clsx";
import { FC, PropsWithChildren, use, useEffect } from "react";

import { Carousel } from "@/components/ui/carousel";

import { HomeContext } from "@/lib/pages/home/home.context";
import { highlightVideo, fadeVideo } from "@/lib/pages/home/home.helpers";

type Props = {} & PropsWithChildren;

export const HomeCarousel: FC<Props> = (props) => {
  const { children } = props;

  const { maximiseVideo, minimizeVideo, carouselApi, setCarouselApi } =
    use(HomeContext) ?? {};

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    carouselApi.on("select", (api) => {
      const currSlideIdx = api.selectedScrollSnap();
      const prevSlideIdx = api.previousScrollSnap();
      const slides = api.slideNodes();
      const currVideo = slides[currSlideIdx].querySelector("video");
      const prevVideo = slides[prevSlideIdx].querySelector("video");

      if (minimizeVideo && prevVideo) {
        fadeVideo({
          minimizeVideo,
          videoIdx: prevSlideIdx - 1,
          videoElement: prevVideo,
        });
      }

      if (maximiseVideo && currVideo) {
        highlightVideo({
          maximiseVideo,
          videoIdx: currSlideIdx - 1,
          videoElement: currVideo,
        });
      }
    });
  }, [carouselApi, maximiseVideo, minimizeVideo]);

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
