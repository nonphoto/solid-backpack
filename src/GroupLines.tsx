import { resolveElements } from "@solid-primitives/refs";
import { equals, groupWith } from "ramda";
import {
  createMemo,
  createSignal,
  For,
  on,
  onMount,
  ParentComponent,
  ParentProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { createIsResizing } from "./createIsResizing";

function Span(props: ParentProps) {
  return <span>{props.children}</span>;
}

export default function GroupLines(
  props: ParentProps & {
    component?: ParentComponent<{ index: number; length: number }>;
    enabled?: boolean;
  },
) {
  const resolved = resolveElements(
    () => props.children,
    (element): element is HTMLElement => element instanceof HTMLElement,
  );
  const [isMounted, setIsMounted] = createSignal(false);
  const isResizing = createIsResizing();

  onMount(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  });

  const elements = createMemo(
    () =>
      isMounted() && (props.enabled ?? true) && !isResizing()
        ? resolved.toArray().map((element) => ({
          element,
          offset: getComputedStyle(element).display === "inline-block"
            ? Math.floor(element.offsetTop)
            : undefined,
        }))
        : [],
    [],
    { equals },
  );

  const lines = createMemo(
    on(elements, (elements) =>
      groupWith(
        (a, b) => a.offset === b.offset,
        elements.reduce<{ element: HTMLElement; offset: number | undefined }[]>(
          (acc, { element, offset }, index) => [
            ...acc,
            {
              element,
              offset: offset ?? acc[index - 1]?.offset,
            },
          ],
          [],
        ),
      )),
  );

  return (
    <For
      each={lines()}
      fallback={<span style={{ visibility: "hidden" }}>{resolved()}</span>}
    >
      {(line, index) => (
        <Dynamic
          component={props.component ?? Span}
          index={index()}
          length={lines().length}
        >
          <For each={line}>{({ element }) => element}</For>
        </Dynamic>
      )}
    </For>
  );
}
