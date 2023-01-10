
import { useParams } from "solid-start";
import Error from "./error";

export default function Missing() {
  const { error } = useParams();
  return <>
    <Error code={404}>
      La pagina "<b>{error}</b>" non è stata trovata
    </Error>
  </>
}