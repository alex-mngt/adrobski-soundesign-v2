"use client";

import { animated } from "@react-spring/web";
import clsx from "clsx";
import { FC } from "react";

import { Button } from "@/components/ui/button";

import { useSplashScreenAnimation } from "./_internal/HomeSplashScreen.animations";

export const HomeSplashScreen: FC = () => {
  const { methods, styles } = useSplashScreenAnimation();
  const { hideSplashScreen } = methods;
  const { splashScreenStyles } = styles;

  return (
    <animated.div
      className={clsx(
        "fixed left-0 top-0 z-50",
        "h-dvh w-screen",
        "flex items-center justify-center",
        "bg-background",
      )}
      style={splashScreenStyles}
    >
      <Button onClick={hideSplashScreen} variant="secondary">
        Enter Website
      </Button>
    </animated.div>
  );
};
