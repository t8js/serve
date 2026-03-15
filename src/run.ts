#!/usr/bin/env node
import { getValues, hasKey, isKey, parseArgs } from "args-json";
import type { Config } from "./Config.ts";
import { serve } from "./serve.ts";

type CLIConfig = Omit<Config, "dirs" | "bundle" | "onRequest">;

async function run() {
  let args = process.argv.slice(2);
  let path: string | undefined;

  if (!isKey(args[0])) path = args.shift();

  let cliConfig = parseArgs<CLIConfig>(args, {
    u: "url",
    s: "spa",
  });

  for (let cliKey of ["", "b", "bundle", "dirs"])
    delete cliConfig[cliKey as keyof CLIConfig];

  let bundleArgs = getValues(["--bundle", "-b"]);
  let dirs = getValues("--dirs");

  let config: Config = {
    path,
    dirs,
    bundle: Array.isArray(bundleArgs)
      ? { input: bundleArgs[0], output: bundleArgs[1], dir: bundleArgs[2] }
      : hasKey("--bundle") || hasKey("-b"),
    watch: true,
    log: true,
    ...cliConfig,
  };

  await serve(config);
}

run();
