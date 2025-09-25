import type { BundleConfig } from "./BundleConfig";

export type Config = {
  url?: string;
  host?: string;
  port?: number;
  path?: string;
  dirs?: string[];
  spa?: boolean;
  log?: boolean;
  bundle?: boolean | string | BundleConfig;
};
