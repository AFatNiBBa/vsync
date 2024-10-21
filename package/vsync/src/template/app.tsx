
import "../style/app.scss";

import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";

/** Radice dell'applicazione */
export default function () {
  return <>
    <Router
      children={<FileRoutes />}
      root={props => <MetaProvider children={props.children} />}
    />
  </>
}