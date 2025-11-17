import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname } from "node:path";
import { bundle } from "./bundle.ts";
import type { Config } from "./Config.ts";
import { getFilePath } from "./getFilePath.ts";
import { getTarget } from "./getTarget.ts";
import { mimeTypes } from "./mimeTypes.ts";

export type Server = ReturnType<typeof createServer>;

export async function serve(config: Config = {}) {
  let stop = await bundle(config);

  return new Promise<Server>((resolve) => {
    let server = createServer(async (req, res) => {
      await config.onRequest?.(req, res);

      if (res.headersSent) return;

      let filePath = await getFilePath(req.url, config);

      if (filePath === undefined) {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not found");
        return;
      }

      let ext = extname(filePath).slice(1).toLowerCase();
      let mimeType = mimeTypes[ext] ?? "application/octet-stream";

      res.writeHead(200, { "content-type": mimeType });
      createReadStream(filePath).pipe(res);
    });

    if (stop) {
      server.on("close", async () => {
        await stop();
      });
    }

    let { host, port } = getTarget(config);

    server.listen(port, host, () => {
      if (config.log) console.log(`Server running at http://${host}:${port}`);

      resolve(server);
    });
  });
}
