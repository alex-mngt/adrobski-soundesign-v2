import { clsx } from "clsx";
import { FC } from "react";

import { HomeCarousel } from "@/components/pages/home/HomeCarousel";
import { HomeSplashScreen } from "@/components/pages/home/HomeSplashScreen";
import { HomeVideo } from "@/components/pages/home/HomeVideo";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";

import { muxBlurHash } from "@/lib/mux-blurhash";
import { HomeContextProvider } from "@/lib/pages/home/home.context";

const Home: FC = async () => {
  const PLAYBACK_ID = "l9vsNmXIROHByUmT01Bk00aR4v8OI7W2mMDhbyG002lew4";

  return (
    <>
      <HomeSplashScreen />
      <main className={clsx("mx-auto max-w-screen-xl")}>
        <HomeContextProvider>
          <HomeCarousel>
            <CarouselContent
              className={clsx(
                "relative",
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
                <h1>Adrobski Sound Design</h1>
              </CarouselItem>
              {[...Array(4)].map(async (_, idx) => (
                <CarouselItem
                  className={clsx(
                    "basis-auto px-6 pt-0 md:px-12 md:odd:pl-0 md:even:pr-0 lg:px-36",
                  )}
                  key={idx}
                >
                  <HomeVideo
                    artist={{
                      name: "Blansable",
                      profileUrl: "https://www.instagram.com/blansable",
                    }}
                    dateStringISO8601="2023-01-03"
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
                    title="Almost flying with birds"
                    url="https://www.instagram.com/p/CoCvMqUN0E9/?igsh=c3ExOHA2YmFrdTU0"
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
    </>
  );
};

export default Home;
