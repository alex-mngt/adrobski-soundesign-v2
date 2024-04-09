import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { OS } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wait = async (duration: number) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

export const isVideoPlaying = (videoElement: HTMLVideoElement) => {
  return (
    !videoElement.paused && !videoElement.ended && videoElement.currentTime > 0
  );
};

export const playVideo = (videoElement: HTMLVideoElement) => {
  if (videoElement.readyState < videoElement.HAVE_METADATA) {
    return;
  }

  videoElement.play().catch((err) => {
    console.error(err);
  });
};

export const pauseVideo = (videoElement: HTMLVideoElement) => {
  videoElement.pause();
};

export const throttle = (fn: Function, wait: number = 300) => {
  let inThrottle: boolean,
    lastFn: ReturnType<typeof setTimeout>,
    lastTime: number;
  return function (this: any) {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(
        () => {
          if (Date.now() - lastTime >= wait) {
            fn.apply(context, args);
            lastTime = Date.now();
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0),
      );
    }
  };
};

export const getOS = (window: Window): OS => {
  const platform = window.navigator.platform;

  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return "MacOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return "Windows";
  } else {
    return "Other";
  }
};
