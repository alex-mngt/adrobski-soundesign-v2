import { clsx } from "clsx";
import { FC } from "react";

type Props = {
  className?: string;
  height?: number;
  width?: number;
};

export const Spotify: FC<Props> = (props) => {
  const { className, height, width } = props;

  return (
    <svg
      className={clsx(className)}
      height={height}
      id="Calque_2"
      viewBox="0 0 183 183"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Layer_1">
        <path
          d="M151.88,79.36c2.21-3.72.99-8.52-2.74-10.73-31.08-18.45-80.25-20.18-109.83-11.2-4.14,1.26-6.47,5.63-5.22,9.77,1.25,4.14,5.63,6.47,9.77,5.22,25.77-7.82,70.3-6.35,97.29,9.68,3.71,2.21,8.52.98,10.73-2.74Z"
          fill="currentColor"
          strokeWidth={0}
        />
        <path
          d="M140.26,105.85c1.89-3.07.92-7.09-2.15-8.98-25.85-15.88-63.66-20.35-94.07-11.13-3.45,1.05-5.39,4.69-4.35,8.14,1.05,3.45,4.7,5.39,8.15,4.35,26.62-8.08,60.94-4.07,83.45,9.76,3.07,1.89,7.09.92,8.98-2.15Z"
          fill="currentColor"
          strokeWidth={0}
        />
        <path
          d="M46.95,112.14c-2.82.64-4.57,3.44-3.93,6.25.64,2.81,3.44,4.57,6.25,3.92,29.15-6.66,53.9-3.94,73.57,8.08,2.46,1.5,5.67.73,7.18-1.74,1.5-2.46.73-5.68-1.73-7.18-22.07-13.49-49.44-16.63-81.34-9.33Z"
          fill="currentColor"
          strokeWidth={0}
        />
        <circle
          cx="91.5"
          cy="91.5"
          fill="none"
          r="83.5"
          stroke="currentColor"
          strokeMiterlimit={10}
          strokeWidth={14}
        />
      </g>
    </svg>
  );
};
