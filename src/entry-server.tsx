
import ws from "express-ws";
import sync from "./lib/app/server";
import getApi from "./lib/api/entry";
import subdomain from "express-subdomain";
import { getSubDomainOffset } from "./lib/url";
import type { Observer } from "solid-start-express";
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";

declare module "express" {
  interface Express {
    ws: ws.WebsocketMethod<this>
  }
}

const handler = createHandler(renderAsync((event) => <StartServer event={event} />));
export default Object.assign(handler, {
  beforePublic(app) {
    ws(app);

    app.use((req, _, next) => {
      app.set('subdomain offset', getSubDomainOffset(req.hostname));
      next();
    });

    app.ws("/", sync); // Non può essere dentro "api.*" a causa di problemi con le implementazioni del tutte-cose

    app.use(subdomain("api", getApi()));
  }
} satisfies Observer);