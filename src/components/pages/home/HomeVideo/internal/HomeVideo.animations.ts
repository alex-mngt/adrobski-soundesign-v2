import { useSpring } from "@react-spring/web";

const videoInitState = { scale: 1 };
const videoEndState = { scale: 1.05 };
const wrapperInitState = { scale: 0.95, borderRadius: 12, opacity: 0.5 };
const wrapperEndState = { scale: 1, borderRadius: 24, opacity: 1 };
const playButtonInitState = { scale: 1, opacity: 1 };
const playButtonEndState = { scale: 0.2, opacity: 0 };

export const useVideoAnimation = () => {
  const [videoStyles, videoApi] = useSpring(() => ({
    from: videoInitState,
  }));
  const [wrapperStyles, wrapperApi] = useSpring(() => ({
    from: wrapperInitState,
  }));
  const [playButtonStyles, playButtonApi] = useSpring(() => ({
    from: playButtonInitState,
  }));

  const highlight = async () => {
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

  const unhighlight = async () => {
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

  const hidePlayButton = async () => {
    return playButtonApi.start({
      from: playButtonInitState,
      to: playButtonEndState,
    });
  };

  const showPlayButton = async () => {
    return playButtonApi.start({
      from: playButtonEndState,
      to: playButtonInitState,
    });
  };

  return {
    methods: {
      highlight,
      unhighlight,
      hidePlayButton,
      showPlayButton,
    },
    styles: {
      videoStyles,
      wrapperStyles,
      playButtonStyles,
    },
  };
};
