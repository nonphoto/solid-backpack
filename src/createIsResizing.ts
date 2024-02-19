import { debounce } from "@solid-primitives/scheduled";
import { createComputed, createSignal, on } from "solid-js";
import { useSmallViewportSize } from "./resize";

export function createIsResizing() {
  const [isResizing, setIsResizing] = createSignal(true);
  const size = useSmallViewportSize();
  const completeResize = debounce(() => {
    setIsResizing(false);
  }, 100);

  createComputed(
    on(
      () => size.width,
      () => {
        setIsResizing(true);
        completeResize();
      },
    ),
  );

  return isResizing;
}
