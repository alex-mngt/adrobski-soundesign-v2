"use client";

import {
  FC,
  MutableRefObject,
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { CarouselApi } from "@/components/ui/carousel";

import { OS, StateSetter } from "@/lib/types";
import { getOS } from "@/lib/utils";

type MethodAdder<T extends Array<any> = Array<any>> = (
  method: (...params: T) => Promise<any>,
  idx: number,
) => void;
export type MethodCaller<T extends Array<any> = Array<any>> = (
  idx: number,
  ...params: T
) => Promise<any>;
type MethodStack<T extends Array<any> = Array<any>> = Array<
  (...params: T) => Promise<any>
>;
type LinkAdder = (link: HTMLAnchorElement, idx: number) => void;

type HomeContextValue = {
  addVideoHighlighter: MethodAdder;
  addVideoUnhighlighter: MethodAdder;
  addVideoPlayButtonShower: MethodAdder;
  addVideoPlayButtonHider: MethodAdder;
  addVideoDataShower: MethodAdder;
  addVideoDataHider: MethodAdder;
  addVideoDataDesktopShower: MethodAdder;
  addVideoDataDesktopHider: MethodAdder;
  addVideoDataDesktopMover: MethodAdder<[number, number]>;
  addVideoDataDesktopArtistLink: LinkAdder;
  addVideoDataDesktopArtworkLink: LinkAdder;
  highlightVideo: MethodCaller;
  unhighlightVideo: MethodCaller;
  showVideoPlayButton: MethodCaller;
  hideVideoPlayButton: MethodCaller;
  showVideoData: MethodCaller;
  hideVideoData: MethodCaller;
  showVideoDataDesktop: MethodCaller;
  hideVideoDataDesktop: MethodCaller;
  moveVideoDataDesktop: MethodCaller<[number, number]>;
  clickOnArtistLink: MethodCaller;
  clickOnArtworkLink: MethodCaller;
  selectedVideoIdx: MutableRefObject<number | undefined>;
  videos: MutableRefObject<Array<HTMLVideoElement>>;
  carouselApi: CarouselApi;
  setCarouselApi: StateSetter<CarouselApi>;
  OS: OS | undefined;
};

export const HomeContext = createContext<HomeContextValue | undefined>(
  undefined,
);

export const HomeContextProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [OS, setOS] = useState<OS>();

  const videosHighlighter = useRef<MethodStack>([]);
  const videosUnhighlighter = useRef<MethodStack>([]);
  const videoPlayButtonsHider = useRef<MethodStack>([]);
  const videoPlayButtonsShower = useRef<MethodStack>([]);
  const videoDatasHider = useRef<MethodStack>([]);
  const videoDatasShower = useRef<MethodStack>([]);
  const videoDatasDesktopHider = useRef<MethodStack>([]);
  const videoDatasDesktopShower = useRef<MethodStack>([]);
  const videoDatasDesktopMover = useRef<MethodStack<[number, number]>>([]);
  const selectedVideoIdx = useRef<number | undefined>(undefined);
  const videos = useRef<Array<HTMLVideoElement>>([]);
  const videoDataDesktopArtistLinks = useRef<Array<HTMLAnchorElement>>([]);
  const videoDataDesktopArtworkLinks = useRef<Array<HTMLAnchorElement>>([]);

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

  const addVideoDataDesktopShower: MethodAdder = (dataHider, idx) => {
    videoDatasDesktopShower.current[idx] = dataHider;
  };

  const addVideoDataDesktopHider: MethodAdder = (dataHider, idx) => {
    videoDatasDesktopHider.current[idx] = dataHider;
  };

  const addVideoDataDesktopMover: MethodAdder<[number, number]> = (
    dataHider,
    idx,
  ) => {
    videoDatasDesktopMover.current[idx] = dataHider;
  };

  const addVideoDataDesktopArtistLink: LinkAdder = (link, idx) => {
    videoDataDesktopArtistLinks.current[idx] = link;
  };

  const addVideoDataDesktopArtworkLink: LinkAdder = (link, idx) => {
    videoDataDesktopArtworkLinks.current[idx] = link;
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

  const showVideoDataDesktop: MethodCaller = async (idx) => {
    return videoDatasDesktopShower.current[idx]();
  };

  const hideVideoDataDesktop: MethodCaller = async (idx) => {
    return videoDatasDesktopHider.current[idx]();
  };

  const moveVideoDataDesktop: MethodCaller<[number, number]> = async (
    idx,
    x,
    y,
  ) => {
    return videoDatasDesktopMover.current[idx](x, y);
  };

  const clickOnArtistLink: MethodCaller = async (idx: number) => {
    videoDataDesktopArtistLinks.current[idx].click();
  };

  const clickOnArtworkLink: MethodCaller = async (idx: number) => {
    videoDataDesktopArtworkLinks.current[idx].click();
  };

  useEffect(() => {
    setOS(getOS(window));
  }, []);

  const contextValue: HomeContextValue = {
    addVideoHighlighter,
    addVideoUnhighlighter,
    addVideoPlayButtonShower,
    addVideoPlayButtonHider,
    addVideoDataShower,
    addVideoDataHider,
    addVideoDataDesktopShower,
    addVideoDataDesktopHider,
    addVideoDataDesktopMover,
    addVideoDataDesktopArtistLink,
    addVideoDataDesktopArtworkLink,
    highlightVideo,
    unhighlightVideo,
    showVideoPlayButton,
    hideVideoPlayButton,
    moveVideoDataDesktop,
    showVideoData,
    hideVideoData,
    showVideoDataDesktop,
    hideVideoDataDesktop,
    clickOnArtistLink,
    clickOnArtworkLink,
    selectedVideoIdx,
    videos,
    carouselApi,
    setCarouselApi,
    OS,
  };

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};
