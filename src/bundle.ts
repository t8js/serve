import { rm } from "node:fs/promises";
import { join } from "node:path";
import { type BuildOptions, build, context } from "esbuild";
import type { BundleConfig } from "./BundleConfig";
import type { Config } from "./Config";

export async function bundle({
  path = "",
  bundle: options,
  watch,
}: Config = {}) {
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

  let buildOptions: BuildOptions = {
    entryPoints: [inputFile],
    outfile: outputFile,
    bundle: true,
    platform: "browser",
    logLevel: "warning",
  };

  if (watch) {
    let ctx = await context(buildOptions);

    await ctx.watch();

    return async () => {
      await ctx.dispose();
    };
  }

  await build(buildOptions);
}
