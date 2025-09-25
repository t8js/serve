import { exec as originalExec } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import type { BundleConfig } from "./BundleConfig";
import type { Config } from "./Config";

const exec = promisify(originalExec);

export async function bundle({ path = "", bundle: options }: Config = {}) {
  if (!options) return;

  let normalizedOptions: BundleConfig;

  if (typeof options === "boolean") normalizedOptions = {};
  else if (typeof options === "string")
    normalizedOptions = {
      input: options,
    };
  else normalizedOptions = options;

  let inputFile = join(path, normalizedOptions.input ?? "index.ts");
  let outputFile = join(path, "dist", normalizedOptions.output ?? "index.js");

  await rm(join(path, "dist"), { recursive: true, force: true });
  await exec(
    `npx esbuild ${inputFile} --outfile=${outputFile} --bundle --platform=browser --log-level=warning`,
  );
}
