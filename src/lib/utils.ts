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
