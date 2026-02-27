import { rm } from "node:fs/promises";
import { join } from "node:path";
import { type BuildOptions, build, context } from "esbuild";
import type { BundleConfig } from "./BundleConfig.ts";
import type { Config } from "./Config.ts";
import { getRootPath } from "./getRootPath.ts";

export async function bundle(config: Config = {}) {
  if (!config.bundle) return;

  let { bundle: options, watch, minify } = config;

  let normalizedOptions: BundleConfig;
  let rootPath = getRootPath(config);

  if (typeof options === "boolean") normalizedOptions = {};
  else if (typeof options === "string")
    normalizedOptions = {
      input: options,
    };
  else normalizedOptions = options;

  let dir = normalizedOptions.dir ?? "dist";
  let inputFile = join(rootPath, normalizedOptions.input ?? "index.ts");

  await rm(join(rootPath, dir), { recursive: true, force: true });

  let buildOptions: BuildOptions = {
    entryPoints: [inputFile],
    bundle: true,
    format: "esm",
    platform: "browser",
    logLevel: "warning",
    minify,
  };

  if (normalizedOptions.output)
    buildOptions.outfile = join(rootPath, dir, normalizedOptions.output);
  else {
    buildOptions.outdir = join(rootPath, dir);
    buildOptions.splitting = true;
  }

  if (watch) {
    let ctx = await context(buildOptions);

    await ctx.watch();

    return async () => {
      await ctx.dispose();
    };
  }

  await build(buildOptions);
}
