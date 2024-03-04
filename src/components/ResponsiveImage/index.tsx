import { clsx } from "clsx";
import Image, { ImageProps, StaticImageData } from "next/image";
import { FC } from "react";

type Props = Omit<ImageProps, "src" | "loading" | "alt"> & {
  className?: string;
  src: StaticImageData;
  desktopSrc: StaticImageData;
  alt: string;
};

export const ResponsiveImage: FC<Props> = (props) => {
  const { className, src, desktopSrc, alt, priority, ...rest } = props;

  return (
    <>
      <Image
        alt={alt}
        className={clsx(className, "md:hidden")}
        src={src}
        {...rest}
        fetchPriority={priority ? "high" : undefined}
      />
      <Image
        alt={alt}
        className={clsx(className, "hidden md:block")}
        src={desktopSrc}
        {...rest}
        fetchPriority={priority ? "high" : undefined}
      />
    </>
  );
};
