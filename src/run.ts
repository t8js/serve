#!/usr/bin/env node
import { exec as originalExec } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import { serve } from "./serve";

const exec = promisify(originalExec);

/**
 * @example
 * serve 3000 app public dist
 * serve 127.0.0.1:3000 app public dist
 * serve 3000 app public dist -b
 * serve 3000 app public dist -b src/index.ts
 */
async function run() {
  let [url, path = "", ...args] = process.argv.slice(2);
  let buildFlagIndex = args.indexOf("-b");

  if (buildFlagIndex !== -1) {
    let inputFile = join(path, args[buildFlagIndex + 1] ?? "index.ts");
    let outputFile = join(path, "dist", args[buildFlagIndex + 2] ?? "index.js");

    await exec(`npx esbuild ${inputFile} --outfile=${outputFile} --bundle --platform=neutral --log-level=warning`);
  }

  serve({
    url,
    path,
    dirs: buildFlagIndex === -1 ? args : args.slice(0, buildFlagIndex),
  });
}

run();
