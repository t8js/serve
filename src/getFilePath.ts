import { join } from "node:path";
import type { Config } from "./Config";
import { isValidFilePath } from "./isValidFilePath";

const cwd = process.cwd();

export async function getFilePath(
  urlPath = "",
  { path = "", dirs = [], spa }: Config,
) {
  let effectiveURLPath = urlPath.replace(/[?#].*$/, "");

  for (let dir of dirs.length === 0 ? [""] : dirs) {
    let dirPath = join(cwd, path, dir);
    let filePath = join(dirPath, effectiveURLPath);

    if (
      !effectiveURLPath.endsWith("/") &&
      (await isValidFilePath(filePath, dirPath))
    )
      return filePath;

    filePath = join(dirPath, spa ? "/" : effectiveURLPath, "index.html");

    if (await isValidFilePath(filePath, dirPath)) return filePath;
  }
}
