
import { FileRoutes } from "@solidjs/start/router";
import { Router } from "@solidjs/router";
import { Suspense } from "solid-js";

/** Radice dell'applicazione */
export default function () {
  return <>
    <Router root={props => <Suspense>{props.children}</Suspense>}>
      <FileRoutes />
    </Router>
  </>
}