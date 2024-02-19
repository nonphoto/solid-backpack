import {
  createVisibilityObserver,
  withDirection,
  withOccurrence,
} from "@solid-primitives/intersection-observer";
import { Accessor } from "solid-js";

export function createIsVisible(
  element: Element | Accessor<Element | undefined>,
) {
  return createVisibilityObserver(
    { threshold: 0 },
    withOccurrence(
      withDirection(
        (entry, { occurrence, directionY }) =>
          entry.isIntersecting ||
          (occurrence === "Leaving" && directionY === "Top"),
      ),
    ),
  )(element);
}
