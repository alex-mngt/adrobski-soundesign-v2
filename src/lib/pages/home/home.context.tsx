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
  addVideoMaximizer: (itemHighlighter: () => Promise<any>) => void;
  maximiseVideo: (idx: number) => Promise<any>;
  addVideoMinimizer: (itemMinimizer: () => Promise<any>) => void;
  minimizeVideo: (idx: number) => Promise<any>;
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

  const videosMaximizer = useRef<Array<() => Promise<any>>>([]);
  const videosMinimizer = useRef<Array<() => Promise<any>>>([]);
  const selectedVideoIdx = useRef<number | undefined>(undefined);
  const videos = useRef<Array<HTMLVideoElement>>([]);

  const addVideoMaximizer = (itemHighlighter: () => Promise<any>) => {
    videosMaximizer.current.push(itemHighlighter);
  };

  const addVideoMinimizer = (itemMinimizer: () => Promise<any>) => {
    videosMinimizer.current.push(itemMinimizer);
  };

  const maximiseVideo = async (idx: number) => {
    return videosMaximizer.current[idx]();
  };

  const minimizeVideo = async (idx: number) => {
    return videosMinimizer.current[idx]();
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
