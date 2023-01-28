
import type { Request } from "express";

/**
 * Gets the number of subdomains in a given host.
 * Ignores things like ".co.uk"
 * @param host The host to check
 */
export function getSubDomainOffset(host: string) {
  return host.endsWith("localhost") ? 1 : 2;
}

/**
 * Returns the legth of the subdomains part in {@link host}
 * @param host The source host
 * @param offset The domains to skip
 */
export function getSubDomainLength(host: string, offset = getSubDomainOffset(host)) {
  for (var i = host.length - 1; i >= 0; i--)
    if (!offset)
      return i + 2;
    else if (host[i] === '.')
      offset--;
  return 0;
}

/**
 * Removes the subdomains from a given host
 * @param host The source host
 * @param offset The domains to skip
 */
export function getTopLevelHost(host: string, offset?: number) {
  return host.substring(getSubDomainLength(host, offset));
}

/**
 * Returns a link to the website
 * @param req The current request
 */
export function hostLink(req: Request) {
  return new URL(`${ req.protocol }://${ getTopLevelHost(req.host) }`); // Include anche la porta
}

/**
 * Returns an error url in the top level host
 * @param req The current request
 * @param code The error code
 * @param dex The error description
 * @param icon The error icon
 */
export function errorLink(req: Request, code: number = 500, dex?: string, icon?: string) {
  const url = hostLink(req);
  url.pathname = "error";
  url.searchParams.set("code", code.toString());
  if (dex) url.searchParams.set("dex", dex);
  if (icon) url.searchParams.set("icon", icon);
  return url.href;
}