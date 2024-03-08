import { wait } from "@/lib/utils";

type HighlightVideoParams = {
  maximiseVideo: (videoIdx: number) => Promise<any>;
  videoIdx: number;
  videoElement: HTMLVideoElement;
};

export const highlightVideo = async (params: HighlightVideoParams) => {
  const { maximiseVideo, videoIdx, videoElement } = params;

  await maximiseVideo(videoIdx);

  videoElement.muted = false;

  if (window.matchMedia("(max-width: 767px)").matches) {
    return;
  }

  // if (navigator.userActivation.isActive) {
  videoElement.play().catch((err) => {
    console.error(err);
  });
  // }
};

type MinimizeVideoParams = {
  minimizeVideo: (videoIdx: number) => Promise<any>;
  videoIdx: number;
  videoElement: HTMLVideoElement;
};

export const fadeVideo = async (params: MinimizeVideoParams) => {
  const { minimizeVideo, videoIdx, videoElement } = params;

  await minimizeVideo(videoIdx);

  videoElement.muted = true;

  if (window.matchMedia("(max-width: 767px)").matches) {
    return;
  }

  videoElement.pause();
};
