// eslint-disable-next-line no-unused-vars
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
) => {
  let timeout: NodeJS.Timeout | null;

  return (...args: Parameters<F>): ReturnType<F> | void => {
    const later = () => {
      if (!timeout) {
        return;
      }

      clearTimeout(timeout);
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
};

// Chat GPT generated ; TO REVIEW

// eslint-disable-next-line no-unused-vars
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number,
  // eslint-disable-next-line no-unused-vars
): (...args: Parameters<T>) => void {
  let lastFunc: number;
  let lastRan: number;

  return function (...args: Parameters<T>) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(
        function () {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
}
