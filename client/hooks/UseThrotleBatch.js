import { useRef } from "react";
import throttle from "../src/utils/throttle";

export function useThrottleBatch(sendFn, wait = 5000) {
  const bufferedRef = useRef([]);

  const flush = async () => {
    if (bufferedRef.current.length === 0) return;
    const batch = [...bufferedRef.current];
    bufferedRef.current = [];
    await sendFn(batch);
  };
  const throttleFlush = throttle(flush, wait);

  const addToItem = (item) => {
    bufferedRef.current.push(item);
    throttleFlush();
  };
  return addToItem;
}
