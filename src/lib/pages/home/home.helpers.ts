import { wait } from "@/lib/utils";

type HighlightVideoParams = {
  videoElement: HTMLVideoElement;
};

export const startVideoInteraction = (params: HighlightVideoParams) => {
  const { videoElement } = params;

  if (videoElement.readyState < videoElement.HAVE_METADATA) {
    return;
  }

  videoElement.play().catch((err) => {
    console.error(err);
  });
};

type MinimizeVideoParams = {
  videoElement: HTMLVideoElement;
};

export const stopVideoInteraction = (params: MinimizeVideoParams) => {
  const { videoElement } = params;

  videoElement.pause();
};
