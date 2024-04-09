import { useSpring } from "@react-spring/web";

const dataDesktopOpacityInitState = { opacity: 0 };
const dataDesktopOpacityEndState = { opacity: 1 };
const dataDesktopPositionInitState = { x: 0, y: 0 };

export const useDataDesktopAnimation = () => {
  const [dataDesktopStyles, dataDesktopApi] = useSpring(() => ({
    from: { ...dataDesktopOpacityInitState, ...dataDesktopPositionInitState },
  }));

  const showDataDesktop = async () => {
    return new Promise<void>((res) => {
      dataDesktopApi.start({
        to: async (next) => {
          await next(dataDesktopOpacityEndState);
          res();
        },
      });
    });
  };

  const hideDataDesktop = async () => {
    return new Promise<void>((res) => {
      dataDesktopApi.start({
        to: async (next) => {
          await next(dataDesktopOpacityInitState);
          res();
        },
      });
    });
  };

  const moveDataDesktop = async (x: number, y: number) => {
    return new Promise<void>((res) => {
      dataDesktopApi.start({
        to: async (next) => {
          await next({ x, y });
          res();
        },
      });
    });
  };

  return {
    methods: {
      showDataDesktop,
      hideDataDesktop,
      moveDataDesktop,
    },
    styles: { dataDesktopStyles },
  };
};
