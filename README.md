# auxsrv

Simple static file server + bundler, primarily for demo apps and tests, manual or automated

Use cases:

- Use the CLI-based server to launch a demo or test app with a single CLI command.
- Use the code-based setup to launch an own server from multiple tests, each with its own app.

## CLI

```
npx auxsrv <app_dir> [...optional flags]

Flag            Usage notes

--bundle, -b    -b [input_file [[output_dir] [output_file]]]
                Defaults:
                - input_file: first of "index.ts", "index.tsx", "src/index.ts", "src/index.tsx"
                  that exists (relative to <app_dir>)
                - output_dir: "dist"
                - ouput_file: "index.js" (relative to <app_dir>/<output_dir>)

--url, -u       -u [<host>:]<port>
                Default: "localhost:3000"

--spa, -s       Whether to enable the SPA mode by handling all unmatched paths as "/".
                Enabled by default.

--dirs          --dirs assets public
                Lists subdirectories of <app_dir> to serve files from.
                By default, files are served from <app_dir>.

--watch         Whether to rebuild the bundled code if the source code changes.
                Enabled by default in the CLI mode.

--minify        To minify the bundled code.
```

<details>
<summary>Example with Playwright #1 (flat)</summary>

```
// package.json
"scripts": {
  "play": "npx auxsrv playground"
}
```

```
/playground
  - index.css
  - index.html
      contains <script src="/dist/index.js" type="module"></script>
      contains <link rel="stylesheet" href="/index.css">
  - index.ts
```

```sh
npm run play
```

```
// playwright.config.ts
...
use: {
  baseURL: "http://localhost:3000",
},
webServer: {
  command: "npm run play",
  url: "http://localhost:3000",
},
```

</details>

<details>
<summary>Example with Playwright #2 (nested)</summary>

```
// package.json
"scripts": {
  "play": "npx auxsrv playground"
}
```

```
/playground
  - src
    - App.tsx
    - index.css
    - index.tsx // imports "./App.tsx", "./index.css"
  - index.html
      contains <script src="/dist/index.js" type="module"></script>
      contains <link rel="stylesheet" href="/dist/index.css">
```

```sh
npm run play
```

```
// playwright.config.ts
...
use: {
  baseURL: "http://localhost:3000",
},
webServer: {
  command: "npm run play",
  url: "http://localhost:3000",
},
```

</details>

## Code

```ts
import { serve } from "auxsrv";

// Start
let server = await serve({
  host: "localhost", // default
  port: 3000, // default
  path: import.meta.url, // or "app"
  bundle: true, // default, or input path, or { input, output, dir }
  spa: true, // default
});

// Stop
server.close();
```

<details>
<summary>Example with Playwright 1 (flat)</summary>

```
/playground
  - index.css
  - index.html
      contains <script src="/dist/index.js" type="module"></script>
      contains <link rel="stylesheet" href="/index.css">
  - index.ts
```

```ts
// x.test.ts
import { test } from "@playwright/test";
import { type Server, serve } from "auxsrv";

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: import.meta.url, // or "playground"
  });
});

test.afterAll(() => {
  server.close();
});
```

</details>

<details>
<summary>Example with Playwright 2 (nested)</summary>

```
/tests/x
  - src
    - App.tsx
    - index.css
    - index.tsx // imports "./App.tsx", "./index.css"
  - index.html
      contains <script src="/dist/index.js" type="module"></script>
      contains <link rel="stylesheet" href="/dist/index.css">
  - index.ts
  - index.test.ts
```

```ts
// tests/x/index.test.ts
import { test } from "@playwright/test";
import { type Server, serve } from "auxsrv";

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: import.meta.url, // or "tests/x"
  });
});

test.afterAll(() => {
  server.close();
});
```

</details>

<details>
<summary>Example with an API mock</summary>

```ts
import { serve } from "auxsrv";

let server = await serve({
  // ... Rest of the config
  // Optional custom request handler, e.g. for simple APIs or API mocks
  onRequest(req, res) {
    if (req.url === "/items") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(["apple", "lemon", "cherry"]));
    }
  },
});
```

</details>
