import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname } from "node:path";
import type { Config } from "./Config";
import { getFilePath } from "./getFilePath";
import { mimeTypes } from "./mimeTypes";

const defaultHost = "localhost";
const defaultPort = 3000;

export function serve(config: Config = {}) {
  let [, , host, , port] =
    config.url?.match(/^(https?:\/\/)?([^:/]+)(:(\d+))?\/?/) ?? [];

  if (!port && /^\d+$/.test(host)) {
    port = host;
    host = defaultHost;
  }

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

  server.on("close", () => {
    process.exit(0);
  });

  let serverPort = Number(port) || defaultPort;
  let serverHost = host || defaultHost;

  server.listen(serverPort, serverHost);

  console.log(`Server running at http://${serverHost}:${serverPort}`);

  return server;
}
