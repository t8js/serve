import { join } from "node:path";
import type { Config } from "./Config";
import { isValidFilePath } from "./isValidFilePath";

const cwd = process.cwd();

export async function getFilePath(
  urlPath: string = "",
  { path = "", dirs = [""] }: Config,
) {
  for (let dir of dirs) {
    let dirPath = join(cwd, path, dir);
    let filePath = join(dirPath, urlPath);

    if (await isValidFilePath(filePath, dirPath)) return filePath;

    if (!/\.\w+$/.test(filePath)) {
      filePath = join(dirPath, urlPath, "index.html");

      if (await isValidFilePath(filePath, dirPath)) return filePath;
    }
  }
}
