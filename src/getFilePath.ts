import { join } from "node:path";
import type { Config } from "./Config.ts";
import { isValidFilePath } from "./isValidFilePath.ts";
import { getRootPath } from "./getRootPath.ts";

export async function getFilePath(url = "", config: Config) {
  let { dirs = [], spa } = config;

  let rootPath = getRootPath(config);
  let urlPath = url.replace(/[?#].*$/, "");

  for (let dir of dirs.length === 0 ? [""] : dirs) {
    let dirPath = join(rootPath, dir);
    let filePath = join(dirPath, urlPath);

    if (!urlPath.endsWith("/") && (await isValidFilePath(filePath, dirPath)))
      return filePath;

    filePath = join(dirPath, spa ? "" : urlPath, "index.html");

    if (await isValidFilePath(filePath, dirPath)) return filePath;
  }
}
