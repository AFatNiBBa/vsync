
import Input from "~/components/input";
import Center from "~/components/center";
import { createSignal, Signal } from "solid-js";

function Counter(props: { value?: Signal<number>, start?: number }) {
  const [count, setCount] = props.value ?? createSignal(props.start ?? 0);
  return <>
    <button class="btn btn-primary" onClick={() => setCount(x => x + 1)}>
      {count()}
    </button>
  </>
}

export default function Index() {
  const count = createSignal(7);
  const str: Signal<string> = [() => "" + count[0](), x => count[1](+x)] as any;
  return <>
    <div class="grid" style={{ grid: "1fr / repeat(2, 1fr) 2fr" }}>
      <div style={{ "background-color": "red" }} />
      <div style={{ "background-color": "green" }}>
        <Center>
          <Counter value={count} />
          <Input label='NUMMERO' value={str}>
            CAMBIA!
          </Input>
        </Center>
      </div>
      <div style={{ "background-color": "blue" }} />
    </div>
  </>
}