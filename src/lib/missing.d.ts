
declare module "express-subdomain" {
  import type { RequestHandler } from "express";

  function subdomain(path: string, router: RequestHandler): RequestHandler;
  export default subdomain;
}