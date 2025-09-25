import type { BundleConfig } from "./BundleConfig";

export type Config = {
  url?: string;
  path?: string;
  dirs?: string[];
  spa?: boolean;
  silent?: boolean;
  bundle?: boolean | BundleConfig;
};
