import { useSpring } from "@react-spring/web";

const videoInitState = { scale: 1 };
const videoEndState = { scale: 1.05 };
const wrapperInitState = { scale: 0.95, opacity: 0.5, borderRadius: 12 };
const wrapperEndState = { scale: 1, opacity: 1, borderRadius: 24 };

export const useVideoAnimation = () => {
  const [videoStyles, videoApi] = useSpring(() => ({
    from: videoInitState,
  }));
  const [wrapperStyles, wrapperApi] = useSpring(() => ({
    from: wrapperInitState,
  }));

  const maximise = async () => {
    return Promise.all([
      videoApi.start({
        from: videoInitState,
        to: videoEndState,
      }),
      wrapperApi.start({
        from: wrapperInitState,
        to: wrapperEndState,
      }),
    ]);
  };

  const minimize = async () => {
    return Promise.all([
      videoApi.start({
        from: videoEndState,
        to: videoInitState,
      }),
      wrapperApi.start({
        from: wrapperEndState,
        to: wrapperInitState,
      }),
    ]);
  };

  return {
    methods: {
      maximise,
      minimize,
    },
    styles: {
      videoStyles,
      wrapperStyles,
    },
  };
};
