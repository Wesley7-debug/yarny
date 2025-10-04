/**
 * Creates a throttled version of a function that only invokes the original function
 * at most once per every wait milliseconds.
 * @param {Function} func - The function to throttle.
 * @param {number} wait - The number of milliseconds to throttle invocations to.
 * @returns {Function} - The throttled function.
 */
function throttle(func, wait) {
  let lastCall = 0;
  let timeout = null;
  let lastArgs;
  let lastContext;

  return function throttled(...args) {
    const now = Date.now();
    lastArgs = args;
    lastContext = this;

    const invoke = () => {
      lastCall = Date.now();
      timeout = null;
      func.apply(lastContext, lastArgs);
    };

    if (!lastCall || now - lastCall >= wait) {
      invoke();
    } else if (!timeout) {
      timeout = setTimeout(invoke, wait - (now - lastCall));
    }
  };
}

export default throttle;
