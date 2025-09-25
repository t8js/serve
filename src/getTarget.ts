import type { Config } from "./Config";

const defaultHost = "localhost";
const defaultPort = 3000;

export function getTarget(config: Config = {}) {
  let { host, port, url } = config;

  let [, , urlHost, , urlPort] =
    url?.match(/^(https?:\/\/)?([^:/]+)(:(\d+))?\/?/) ?? [];

  if (!urlPort && /^\d+$/.test(urlHost)) {
    urlPort = urlHost;
    urlHost = "";
  }

  return {
    port: port || Number(urlPort) || defaultPort,
    host: host || urlHost || defaultHost,
  };
}
