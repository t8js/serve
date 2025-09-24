import { access } from "node:fs/promises";

export async function isValidFilePath(filePath: string, dirPath: string) {
  if (!filePath.startsWith(dirPath)) return false;

  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
