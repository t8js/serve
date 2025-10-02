import { rm } from "node:fs/promises";
import { join } from "node:path";
import { build } from "esbuild";
import type { BundleConfig } from "./BundleConfig";
import type { Config } from "./Config";

export async function bundle({ path = "", bundle: options }: Config = {}) {
  if (!options) return;

  let normalizedOptions: BundleConfig;

  if (typeof options === "boolean") normalizedOptions = {};
  else if (typeof options === "string")
    normalizedOptions = {
      input: options,
    };
  else normalizedOptions = options;

  let dir = normalizedOptions.dir ?? "dist";
  let inputFile = join(path, normalizedOptions.input ?? "index.ts");
  let outputFile = join(path, dir, normalizedOptions.output ?? "index.js");

  await rm(join(path, dir), { recursive: true, force: true });

  await build({
    entryPoints: [inputFile],
    outfile: outputFile,
    bundle: true,
    platform: "browser",
    logLevel: "warning",
  });
}
