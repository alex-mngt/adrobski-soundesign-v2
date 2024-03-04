type HighlightVideoParams = {
  maximiseVideo: (videoIdx: number) => void;
  videoIdx: number;
  videoElement: HTMLVideoElement;
};

export const highlightVideo = (params: HighlightVideoParams) => {
  const { maximiseVideo, videoIdx, videoElement } = params;

  maximiseVideo(videoIdx);

  videoElement.play().catch((err) => {
    console.error(err);
  });
};

type MinimizeVideoParams = {
  minimizeVideo: (videoIdx: number) => void;
  videoIdx: number;
  videoElement: HTMLVideoElement;
};

export const fadeVideo = (params: MinimizeVideoParams) => {
  const { minimizeVideo, videoIdx, videoElement } = params;

  minimizeVideo(videoIdx);

  videoElement.pause();
};
