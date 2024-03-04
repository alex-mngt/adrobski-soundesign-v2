import { wait } from "@/lib/utils";

type HighlightVideoParams = {
  maximiseVideo: (videoIdx: number) => Promise<any>;
  videoIdx: number;
  videoElement: HTMLVideoElement;
};

export const highlightVideo = async (params: HighlightVideoParams) => {
  const { maximiseVideo, videoIdx, videoElement } = params;

  await maximiseVideo(videoIdx);

  // Wait for the slide animation to be over before playing on mobile
  if (window.matchMedia("(max-width: 768px)").matches) {
    await wait(750);
  }

  videoElement.play().catch((err) => {
    console.error(err);
  });
};

type MinimizeVideoParams = {
  minimizeVideo: (videoIdx: number) => Promise<any>;
  videoIdx: number;
  videoElement: HTMLVideoElement;
};

export const fadeVideo = async (params: MinimizeVideoParams) => {
  const { minimizeVideo, videoIdx, videoElement } = params;

  await minimizeVideo(videoIdx);

  videoElement.pause();
};
