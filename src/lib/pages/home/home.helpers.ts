type HighlightVideoParams = {
  maximiseVideo: (videoIdx: number) => Promise<any>;
  videoIdx: number;
  videoElement: HTMLVideoElement;
};

export const highlightVideo = async (params: HighlightVideoParams) => {
  const { maximiseVideo, videoIdx, videoElement } = params;

  await maximiseVideo(videoIdx);

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
