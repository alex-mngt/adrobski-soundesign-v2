import { useSpring } from "@react-spring/web";
import { useEffect } from "react";

const dataInitState = { y: 12, opacity: 0 };
const tabletDataInitState = { y: 0, opacity: 1 };
const dataEndState = { y: 0, opacity: 1 };

export const useDataAnimation = () => {
  const [dataStyles, dataApi] = useSpring(() => ({
    from: dataInitState,
  }));

  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 768px)").matches;

    dataApi.set(tablet ? tabletDataInitState : dataInitState);

    // We can disable this eslint rule on the next line because we
    // only want to run this code on the first client render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showData = async () => {
    return new Promise<void>((res) => {
      dataApi.start({
        from: dataInitState,
        to: async (next) => {
          await next(dataEndState);
          res();
        },
      });
    });
  };

  const hideData = async () => {
    return new Promise<void>((res) => {
      dataApi.start({
        from: dataEndState,
        to: async (next) => {
          await next(dataInitState);
          res();
        },
      });
    });
  };

  return {
    methods: {
      showData,
      hideData,
    },
    styles: { dataStyles },
  };
};
