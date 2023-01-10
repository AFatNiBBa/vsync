
import { JSX, JSXElement } from "solid-js";

export default function Center(props: { x?: boolean, y?: boolean, fill?: boolean, children?: JSXElement, inner?: JSX.HTMLAttributes<HTMLDivElement> }) {
  return <div
    {...props.inner}
    children={props.children}
    style={{
      "width": (props.fill ?? true) ? "100%" : "unset",
      "height": (props.fill ?? true) ? "100%" : "unset",

      "display": "grid",
      "justify-content": (props.x ?? true) ? "center" : "unset",
      "align-items": (props.y ?? true) ? "center" : "unset"
    }}
  />
}