import { intersperse } from "ramda";
import { createMemo, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

export default function SplitWords(props: {
  children: string;
  component?: ValidComponent;
}) {
  const words = createMemo(() =>
    intersperse(
      () => <span>{" "}</span> as HTMLSpanElement,
      props.children
        .trim()
        .split(/\s+/)
        .map((s) => () => (
          <Dynamic
            component={props.component ?? "span"}
            style={{ display: "inline-block" }}
          >
            {s}
          </Dynamic>
        )),
    ).map((fn) => fn())
  );

  return <>{words()}</>;
}
