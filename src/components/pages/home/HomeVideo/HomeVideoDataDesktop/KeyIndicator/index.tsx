import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

type Props = {
  pressed: boolean;
} & PropsWithChildren;

export const KeyIndicator: FC<Props> = (props) => {
  const { children, pressed } = props;

  return (
    <span
      className={clsx(
        "px-2 py-1",
        "rounded-sm border border-primary shadow-sm transition-all",
        pressed && "bg-white/20 font-semibold",
      )}
    >
      {children}
    </span>
  );
};
