import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname } from "node:path";
import { bundle } from "./bundle";
import type { Config } from "./Config";
import { getFilePath } from "./getFilePath";
import { mimeTypes } from "./mimeTypes";

const defaultHost = "localhost";
const defaultPort = 3000;

export type Server = ReturnType<typeof createServer>;

export async function serve(config: Config = {}): Promise<Server> {
  let [, , host, , port] =
    config.url?.match(/^(https?:\/\/)?([^:/]+)(:(\d+))?\/?/) ?? [];

  if (!port && /^\d+$/.test(host)) {
    port = host;
    host = defaultHost;
  }

  await bundle(config);

  return new Promise((resolve) => {
    let server = createServer(async (req, res) => {
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

    let serverPort = Number(port) || defaultPort;
    let serverHost = host || defaultHost;

    server.listen(serverPort, serverHost, () => {
      if (!config.silent)
        console.log(`Server running at http://${serverHost}:${serverPort}`);

      resolve(server);
    });
  });
}
