import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
