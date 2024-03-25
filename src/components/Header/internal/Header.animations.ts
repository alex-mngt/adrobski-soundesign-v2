import { useSpring, useSprings } from "@react-spring/web";
import { useEffect } from "react";

const navInitState = { x: "100vw" };
const mdNavInitState = { x: "0" };
const navEndState = { x: "0" };
const closeNavInitState = { scale: 0 };
const closeNavEndState = { scale: 1 };
const socialsInitState = { opacity: 0, y: -12 };
const mdSocialsInitState = { opacity: 1, y: 0 };
const socialsEndState = { opacity: 1, y: 0 };

// TODO : Find a way to type animations hooks without loosing
// the capability to infer 'methods' and 'styles' names

export const useHeaderAnimation = () => {
  // Init the springs with no opacity because the init states
  // are dependent on the viewport size which is only accessible
  // on the first client render

  const [mobileNavStyles, mobileNavApi] = useSpring(() => ({
    from: { ...navInitState, opacity: 0 },
  }));
  const [closeNavStyles, closeNavApi] = useSpring(() => ({
    from: { ...closeNavInitState, opacity: 0 },
  }));
  const [socialsStyles, socialsApi] = useSprings(3, () => ({
    from: { ...socialsInitState, opacity: 0 },
  }));

  // Set the init values depending on the viewport size and
  // set the opacity back on the elements that needs to
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)").matches;

    mobileNavApi.set(
      md ? { opacity: 1, ...mdNavInitState } : { opacity: 1, ...navInitState },
    );
    closeNavApi.set({ opacity: 1, ...closeNavInitState });
    socialsApi.set(md ? { ...mdSocialsInitState } : { ...socialsInitState });

    // We can disable this eslint rule on the next line because we
    // only want to run this code on the first client render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const md = window.matchMedia("(min-width: 768px)").matches;

      mobileNavApi.set(md ? mdNavInitState : navInitState);
      closeNavApi.set(closeNavInitState);
      socialsApi.set(md ? mdSocialsInitState : socialsInitState);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [closeNavApi, socialsApi, mobileNavApi]);

  const showMobileNav = () => {
    document.body.classList.add("locked");

    mobileNavApi.start({
      from: navInitState,
      to: async (next) => {
        await next(navEndState);

        socialsApi.start((index) => ({
          from: socialsInitState,
          to: socialsEndState,
          delay: index * 100,
        }));

        closeNavApi.start({
          from: closeNavInitState,
          to: closeNavEndState,
          delay: 150,
        });
      },
    });
  };

  const hideMobileNav = () => {
    document.body.classList.remove("locked");

    mobileNavApi.start({
      from: navEndState,
      to: async (next) => {
        await next(navInitState);

        socialsApi.set(socialsInitState);
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
      socialsStyles,
    },
  };
};
