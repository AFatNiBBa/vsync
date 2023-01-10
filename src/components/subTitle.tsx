
import { Title } from "@solidjs/meta";
import { JSX, Show } from "solid-js";

export default function SubTitle(props: { children?: JSX.Element }) {
  return <>
    <Title>
      VSync
      <Show when={props.children}>
        {" - "}
        {props.children}
      </Show>
    </Title>
  </>
}