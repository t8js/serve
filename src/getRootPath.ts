import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Config } from "./Config.ts";

export function getRootPath({ path = "" }: Config) {
  try {
    return dirname(fileURLToPath(path));
  } catch {
    return path;
  }
}
