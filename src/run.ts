#!/usr/bin/env node
import type { Config } from "./Config";
import { serve } from "./serve";

async function run() {
  let [url, ...args] = process.argv.slice(2);
  let spa = false;

  if (args[0] === "*") {
    spa = true;
    args.shift();
  }

  let bundleFlagIndex = args.indexOf("-b");
  let path = args[0];

  let dirs: string[];
  let bundle: Config["bundle"];

  if (bundleFlagIndex === -1) dirs = args.slice(1);
  else {
    dirs = args.slice(1, bundleFlagIndex);
    bundle = {
      input: args[bundleFlagIndex + 1],
      output: args[bundleFlagIndex + 2],
    };
  }

  await serve({
    url,
    path,
    dirs,
    spa,
    bundle,
  });
}

run();
