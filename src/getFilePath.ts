import { join } from "node:path";
import type { Config } from "./Config.ts";
import { isValidFilePath } from "./isValidFilePath.ts";

const cwd = process.cwd();

export async function getFilePath(
  url = "",
  { path = "", dirs = [], spa }: Config,
) {
  let urlPath = url.replace(/[?#].*$/, "");

  for (let dir of dirs.length === 0 ? [""] : dirs) {
    let dirPath = join(cwd, path, dir);
    let filePath = join(dirPath, urlPath);

    if (!urlPath.endsWith("/") && (await isValidFilePath(filePath, dirPath)))
      return filePath;

    filePath = join(dirPath, spa ? "" : urlPath, "index.html");

    if (await isValidFilePath(filePath, dirPath)) return filePath;
  }
}
