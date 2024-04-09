import { useSpring } from "@react-spring/web";

const splashScreenInitState = { y: "0" };
const splashScreenEndState = { y: "-100dvh" };

export const useSplashScreenAnimation = () => {
  const [splashScreenStyles, splashScreenApi] = useSpring(() => ({
    from: splashScreenInitState,
  }));

  const hideSplashScreen = async () => {
    return splashScreenApi.start({
      from: splashScreenInitState,
      to: splashScreenEndState,
    });
  };

  return {
    styles: {
      splashScreenStyles,
    },
    methods: {
      hideSplashScreen,
    },
  };
};
