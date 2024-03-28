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

type MethodAdder = (method: () => Promise<any>, idx: number) => void;
type MethodCaller = (idx: number) => Promise<any>;

type HomeContextValue = {
  addVideoHighlighter: MethodAdder;
  addVideoUnhighlighter: MethodAdder;
  addVideoPlayButtonShower: MethodAdder;
  addVideoPlayButtonHider: MethodAdder;
  addVideoDataShower: MethodAdder;
  addVideoDataHider: MethodAdder;
  highlightVideo: MethodCaller;
  unhighlightVideo: MethodCaller;
  showVideoPlayButton: MethodCaller;
  hideVideoPlayButton: MethodCaller;
  showVideoData: MethodCaller;
  hideVideoData: MethodCaller;
  selectedVideoIdx: MutableRefObject<number | undefined>;
  videos: MutableRefObject<Array<HTMLVideoElement>>;
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
  const videoPlayButtonsHider = useRef<Array<() => Promise<any>>>([]);
  const videoPlayButtonsShower = useRef<Array<() => Promise<any>>>([]);
  const videoDatasHider = useRef<Array<() => Promise<any>>>([]);
  const videoDatasShower = useRef<Array<() => Promise<any>>>([]);
  const selectedVideoIdx = useRef<number | undefined>(undefined);
  const videos = useRef<Array<HTMLVideoElement>>([]);

  const addVideoHighlighter: MethodAdder = (itemHighlighter, idx) => {
    videosHighlighter.current[idx] = itemHighlighter;
  };

  const addVideoUnhighlighter: MethodAdder = (itemUnhighlighter, idx) => {
    videosUnhighlighter.current[idx] = itemUnhighlighter;
  };

  const addVideoPlayButtonShower: MethodAdder = (itemShower, idx) => {
    videoPlayButtonsShower.current[idx] = itemShower;
  };

  const addVideoPlayButtonHider: MethodAdder = (itemHider, idx) => {
    videoPlayButtonsHider.current[idx] = itemHider;
  };

  const addVideoDataShower: MethodAdder = (dataHider, idx) => {
    videoDatasShower.current[idx] = dataHider;
  };
  const addVideoDataHider: MethodAdder = (dataHider, idx) => {
    videoDatasHider.current[idx] = dataHider;
  };

  const highlightVideo: MethodCaller = async (idx) => {
    return videosHighlighter.current[idx]();
  };

  const unhighlightVideo: MethodCaller = async (idx) => {
    return videosUnhighlighter.current[idx]();
  };

  const showVideoPlayButton: MethodCaller = async (idx) => {
    return videoPlayButtonsShower.current[idx]();
  };

  const hideVideoPlayButton: MethodCaller = async (idx) => {
    return videoPlayButtonsHider.current[idx]();
  };

  const showVideoData: MethodCaller = async (idx) => {
    return videoDatasShower.current[idx]();
  };

  const hideVideoData: MethodCaller = async (idx) => {
    return videoDatasHider.current[idx]();
  };

  const contextValue: HomeContextValue = {
    addVideoHighlighter,
    addVideoUnhighlighter,
    addVideoPlayButtonShower,
    addVideoPlayButtonHider,
    addVideoDataShower,
    addVideoDataHider,
    highlightVideo,
    unhighlightVideo,
    showVideoPlayButton,
    showVideoData,
    hideVideoData,
    hideVideoPlayButton,
    selectedVideoIdx,
    videos,
    carouselApi,
    setCarouselApi,
  };

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};
