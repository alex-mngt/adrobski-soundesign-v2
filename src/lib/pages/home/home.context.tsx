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
  addVideoHighlighter: (
    itemHighlighter: () => Promise<any>,
    idx: number,
  ) => void;
  addPlayButtonHider: (itemHider: () => Promise<any>, idx: number) => void;
  highlightVideo: (idx: number) => Promise<any>;
  hideVideoPlayButton: (idx: number) => Promise<any>;
  addVideoUnhighlighter: (
    itemMinimizer: () => Promise<any>,
    idx: number,
  ) => void;
  addPlayButtonShower: (itemShower: () => Promise<any>, idx: number) => void;
  unhighlightVideo: (idx: number) => Promise<any>;
  showVideoPlayButton: (idx: number) => Promise<any>;
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

  const videosHighlighter = useRef<Array<() => Promise<any>>>([]);
  const videosUnhighlighter = useRef<Array<() => Promise<any>>>([]);
  const playButtonsHider = useRef<Array<() => Promise<any>>>([]);
  const playButtonsShower = useRef<Array<() => Promise<any>>>([]);
  const selectedVideoIdx = useRef<number | undefined>(undefined);
  const videos = useRef<Array<HTMLVideoElement>>([]);

  const addVideoHighlighter = (
    itemHighlighter: () => Promise<any>,
    idx: number,
  ) => {
    videosHighlighter.current[idx] = itemHighlighter;
  };

  const addPlayButtonHider = (itemHider: () => Promise<any>, idx: number) => {
    playButtonsHider.current[idx] = itemHider;
  };

  const addVideoUnhighlighter = (
    itemMinimizer: () => Promise<any>,
    idx: number,
  ) => {
    videosUnhighlighter.current[idx] = itemMinimizer;
  };

  const addPlayButtonShower = (itemShower: () => Promise<any>, idx: number) => {
    playButtonsShower.current[idx] = itemShower;
  };

  const highlightVideo = async (idx: number) => {
    return videosHighlighter.current[idx]();
  };

  const hideVideoPlayButton = async (idx: number) => {
    return playButtonsHider.current[idx]();
  };

  const unhighlightVideo = async (idx: number) => {
    return videosUnhighlighter.current[idx]();
  };

  const showVideoPlayButton = async (idx: number) => {
    return playButtonsShower.current[idx]();
  };

  const contextValue: HomeContextValue = {
    addVideoHighlighter,
    addPlayButtonHider,
    highlightVideo,
    hideVideoPlayButton,
    addVideoUnhighlighter,
    addPlayButtonShower,
    unhighlightVideo,
    showVideoPlayButton,
    selectedVideoIdx,
    videos,
    carouselApi,
    setCarouselApi,
  };

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};
