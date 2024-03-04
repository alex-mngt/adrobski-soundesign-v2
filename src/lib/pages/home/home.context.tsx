"use client";

import {
  FC,
  MutableRefObject,
  PropsWithChildren,
  createContext,
  useRef,
  useState,
} from "react";

import { CarouselApi } from "@/components/ui/carousel";

import { StateSetter } from "@/lib/types";

type HomeContextValue = {
  addVideoMaximizer: (itemHighlighter: () => void) => void;
  maximiseVideo: (idx: number) => void;
  addVideoMinimizer: (itemMinimizer: () => void) => void;
  minimizeVideo: (idx: number) => void;
  selectedVideoIdx: MutableRefObject<number | undefined>;
  videos: MutableRefObject<HTMLVideoElement[]>;
  carouselApi: CarouselApi;
  setCarouselApi: StateSetter<CarouselApi>;
};

export const HomeContext = createContext<HomeContextValue | undefined>(
  undefined,
);

export const HomeContextProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const videosMaximizer = useRef<Array<() => void>>([]);
  const videosMinimizer = useRef<Array<() => void>>([]);
  const selectedVideoIdx = useRef<number | undefined>(undefined);
  const videos = useRef<Array<HTMLVideoElement>>([]);

  const addVideoMaximizer = (itemHighlighter: () => void) => {
    videosMaximizer.current.push(itemHighlighter);
  };

  const addVideoMinimizer = (itemMinimizer: () => void) => {
    videosMinimizer.current.push(itemMinimizer);
  };

  const maximiseVideo = (idx: number) => {
    videosMaximizer.current[idx]();
  };

  const minimizeVideo = (idx: number) => {
    videosMinimizer.current[idx]();
  };

  const contextValue: HomeContextValue = {
    addVideoMaximizer,
    maximiseVideo,
    addVideoMinimizer,
    minimizeVideo,
    selectedVideoIdx,
    videos,
    carouselApi,
    setCarouselApi,
  };

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};
