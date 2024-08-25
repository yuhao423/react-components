/**
 * Throttle function to limit the rate at which a function is invoked.
 * @param func The function to throttle.
 * @param wait The time, in milliseconds, to wait before invoking the function again.
 * @returns A throttled version of the input function.
 */
 function throttle<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: any = null;
    let lastCallTime: number = 0;

    const later = () => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime;

        if (timeSinceLastCall < wait) {
            timeout = setTimeout(later, wait - timeSinceLastCall);
        } else {
            timeout = null;
            lastCallTime = now;
            if (lastArgs) {
                func.apply(lastThis, lastArgs);
                lastArgs = null;
                lastThis = null;
            }
        }
    };

    const throttled = function(this: any, ...args: Parameters<T>) {
        const now = Date.now();
        if (!lastCallTime) {
            lastCallTime = now;
        }

        const timeSinceLastCall = now - lastCallTime;
        lastArgs = args;
        lastThis = this;

        if (timeSinceLastCall >= wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            lastCallTime = now;
            func.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(later, wait - timeSinceLastCall);
        }
    } as T;

    return throttled;
}

export default throttle;
