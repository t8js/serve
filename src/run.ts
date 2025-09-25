#!/usr/bin/env node
import { exec as originalExec } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { serve } from "./serve";

const exec = promisify(originalExec);

async function run() {
  let [url, ...args] = process.argv.slice(2);
  let spa = false;

  if (args[0] === "*") {
    spa = true;
    args.shift();
  }

  let buildFlagIndex = args.indexOf("-b");
  let path = args[0];
  let dirs = args.slice(
    1,
    buildFlagIndex === -1 ? args.length : buildFlagIndex,
  );

  if (buildFlagIndex !== -1) {
    let inputFile = join(path, args[buildFlagIndex + 1] ?? "index.ts");
    let outputFile = join(path, "dist", args[buildFlagIndex + 2] ?? "index.js");

    await rm(join(path, "dist"), { recursive: true, force: true });
    await exec(
      `npx esbuild ${inputFile} --outfile=${outputFile} --bundle --platform=neutral --log-level=warning`,
    );
  }

  serve({
    url,
    path,
    dirs,
    spa,
  });
}

run();
