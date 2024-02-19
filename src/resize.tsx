import { createElementSize } from "@solid-primitives/resize-observer";
import { createSingletonRoot } from "@solid-primitives/rootless";
import { createSignal, onCleanup, onMount } from "solid-js";

type WidthUnit = "svw" | "lvw";
type HeightUnit = "svh" | "lvh";

function createViewportSize(widthUnit: WidthUnit, heightUnit: HeightUnit) {
  const [element, setElement] = createSignal<HTMLElement>();
  onMount(() => {
    const element = (
      <div
        inert
        style={{
          width: "100" + widthUnit,
          height: "100" + heightUnit,
          position: "fixed",
          inset: "0 auto auto 0",
        }}
      />
    ) as HTMLElement;
    setElement(element);
    document.body.appendChild(element);
    onCleanup(() => {
      setElement(undefined);
      document.body.removeChild(element);
    });
  });
  return createElementSize(element);
}

export const useSmallViewportSize = createSingletonRoot(() => {
  return createViewportSize("svw", "svh");
});

export const useLargeViewportSize = createSingletonRoot(() => {
  return createViewportSize("lvw", "lvh");
});
