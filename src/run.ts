#!/usr/bin/env node
import type { Config } from "./Config";
import { serve } from "./serve";

async function run() {
  let [url, ...args] = process.argv.slice(2);
  let spa = false;
  let watch = false;
  let minify = false;

  if (args[0] === "*") {
    spa = true;
    args.shift();
  }

  while (args.at(-1)?.startsWith("--")) {
    let arg = args.pop();

    switch (arg) {
      case "--watch": watch = true; break;
      case "--minify": minify = true; break;
    }
  }

  let bundleFlagIndex = args.indexOf("-b");
  let path = args[0];

  let dirs: string[];
  let bundle: Config["bundle"];

  if (bundleFlagIndex === -1) dirs = args.slice(1);
  else {
    dirs = args.slice(1, bundleFlagIndex);
    bundle = {
      input: args[bundleFlagIndex + 1] || undefined,
      output: args[bundleFlagIndex + 2] || undefined,
      dir: args[bundleFlagIndex + 3] || undefined,
    };
  }

  await serve({
    url,
    path,
    dirs,
    spa,
    bundle,
    log: true,
    watch,
    minify,
  });
}

run();
