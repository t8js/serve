import type { BundleConfig } from "./BundleConfig";

export type Config = {
  url?: string;
  path?: string;
  dirs?: string[];
  spa?: boolean;
  log?: boolean;
  bundle?: boolean | BundleConfig;
};
