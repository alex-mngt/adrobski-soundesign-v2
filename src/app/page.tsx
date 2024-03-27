import { clsx } from "clsx";
import { FC } from "react";

import { HomeCarousel } from "@/components/pages/home/HomeCarousel";
import HomeHero from "@/components/pages/home/HomeHero";
import { HomeVideo } from "@/components/pages/home/HomeVideo";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";

import { muxBlurHash } from "@/lib/mux-blurhash";
import { HomeContextProvider } from "@/lib/pages/home/home.context";

const Home: FC = async () => {
  const PLAYBACK_ID = "ya9U5NgYf71TNza01PVmx5xpLSa3zypemCkqFDNzG6s00";

  return (
    <main className={clsx("mx-auto max-w-screen-xl")}>
      <HomeContextProvider>
        <HomeCarousel>
          <CarouselContent
            className={clsx(
              "h-dvh md:h-auto",
              "gap-12 md:grid md:grid-cols-2 lg:gap-16",
              "mt-0",
            )}
          >
            <CarouselItem
              className={clsx(
                "basis-full px-6 pt-0 md:col-span-2 md:h-dvh md:px-12",
                "flex flex-col items-center justify-center",
              )}
            >
              <HomeHero />
            </CarouselItem>
            {[...Array(4)].map(async (_, idx) => (
              <CarouselItem
                className={clsx(
                  "basis-auto px-6 pt-0 md:px-12 md:odd:pl-0 md:even:pr-0 lg:px-36",
                )}
                key={idx}
              >
                <HomeVideo
                  // force the render of the first video since it's HTLMVideoElement
                  // needs to be available to be played on the user's first slide
                  forceRender={idx === 0}
                  idx={idx}
                  placeholder={
                    (
                      await muxBlurHash(PLAYBACK_ID, {
                        blurWidth: 192,
                        blurHeight: 192,
                        time: 0,
                      })
                    ).blurHashBase64
                  }
                  playbackId={PLAYBACK_ID}
                />
              </CarouselItem>
            ))}
            <CarouselItem className={clsx("basis-auto  pt-0 md:col-span-2 ")}>
              <footer className={clsx("h-[200px] px-6 md:px-12")}>
                <p>footer</p>
              </footer>
            </CarouselItem>
          </CarouselContent>
        </HomeCarousel>
      </HomeContextProvider>
    </main>
  );
};

export default Home;
