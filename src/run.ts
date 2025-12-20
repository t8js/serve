#!/usr/bin/env node
import { parseArgs } from "args-json";
import type { Config } from "./Config.ts";
import { serve } from "./serve.ts";

type CLIConfig = Omit<Config, "bundle" | "onRequest"> & {
  ""?: string[];
  bundle?: string | string[];
};

async function run() {
  let {
    "": unkeyedArgs,
    bundle,
    dirs,
    ...args
  } = parseArgs<CLIConfig>(process.argv.slice(2), {
    b: "bundle",
    u: "url",
    s: "spa",
  });

  let config: Config = {
    path: unkeyedArgs?.[0],
    dirs: Array.isArray(dirs) ? dirs : dirs && [dirs],
    bundle: Array.isArray(bundle)
      ? { input: bundle[0], output: bundle[1], dir: bundle[2] }
      : bundle,
    log: true,
    ...args,
  };

  await serve(config);
}

run();
