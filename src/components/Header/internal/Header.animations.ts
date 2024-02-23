import { SpringRef, useSpring, useSprings } from "@react-spring/web";
import { useEffect } from "react";

import { debounce } from "@/lib/utils";

const mobileNavInitState = { x: "var(--mobile-nav-init-x)" };
const mobileNavEndState = { x: "0" };
const closeNavInitState = { scale: 0 };
const closeNavEndState = { scale: 1 };
const logosInitState = {
  opacity: "var(--logo-init-opacity)",
  y: "var(--logo-init-y)",
};
const logosEndState = { opacity: "1", y: "0" };

const getDebouncedHandleResize = (
  mobileNavApi: SpringRef<any>,
  closeNavApi: SpringRef<any>,
  logosApi: SpringRef<any>,
) =>
  debounce(() => {
    mobileNavApi.set(mobileNavInitState);
    closeNavApi.set(closeNavInitState);
    logosApi.set(logosInitState);
  }, 200);

// TODO : Find a way to type animations hooks without loosing
// the capability to infer 'methods' and 'styles' names

export const useHeaderAnimation = () => {
  const [mobileNavStyles, mobileNavApi] = useSpring(() => ({
    from: mobileNavInitState,
  }));
  const [closeNavStyles, closeNavApi] = useSpring(() => ({
    from: closeNavInitState,
  }));
  const [logosStyles, logosApi] = useSprings(3, () => ({
    from: logosInitState,
  }));

  useEffect(() => {
    const debouncedHandleResize = getDebouncedHandleResize(
      mobileNavApi,
      closeNavApi,
      logosApi,
    );
    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [closeNavApi, logosApi, mobileNavApi]);

  const showMobileNav = () => {
    mobileNavApi.start({
      from: mobileNavInitState,
      to: async (next) => {
        await next(mobileNavEndState);
        closeNavApi.start({
          from: closeNavInitState,
          to: async (next) => {
            await next(closeNavEndState);
            logosApi.start((index) => ({
              from: logosInitState,
              to: logosEndState,
              delay: index * 100,
            }));
          },
        });
      },
    });
  };

  const hideMobileNav = () => {
    mobileNavApi.start({
      from: mobileNavEndState,
      to: async (next) => {
        await next(mobileNavInitState);
        logosApi.set(logosInitState);
        closeNavApi.set(closeNavInitState);
      },
    });
  };

  return {
    methods: {
      showMobileNav,
      hideMobileNav,
    },
    styles: {
      mobileNavStyles,
      closeNavStyles,
      logosStyles,
    },
  };
};
