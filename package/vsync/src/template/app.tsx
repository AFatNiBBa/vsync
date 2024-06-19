
import "../style/app.scss";

import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { Suspense } from "solid-js";

/** Radice dell'applicazione */
export default function () {
  return <>
    <Router
      children={<FileRoutes />}
      root={props =>
        <MetaProvider>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      }
    />
  </>
}