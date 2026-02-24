# auxsrv

Simple static file server + bundler, primarily for demo apps and tests, manual or automated

Use cases:

- Use the CLI-based server to launch a demo or test app with a single CLI command.
- Use the code-based setup to launch an own server from multiple tests, each with its own app.

## CLI

```
npx auxsrv <app_dir> [...optional flags]

Flag            Usage notes

--bundle, -b    -b [input_path [[output_path] [output_dir]]]
                Defaults:
                - input_path: "index.ts" (relative to <app_dir>)
                - ouput_path: "index.js" (relative to <app_dir>/<output_dir>)
                - output_dir: "dist"

--url, -u       -u [<host>:]<port>
                Default: "localhost:3000"

--spa, -s       To switch to the SPA mode by handling all unmatched paths as "/".

--dirs          --dirs assets public
                To serve files from the listed subdirectories of <app_dir>.
                By default, files are served from <app_dir>.

--watch         To rebuild the bundled code if the source code changes.

--minify        To minify the bundled code.
```

<details>
<summary>Example with Playwright #1 (flat)</summary>

```
// package.json
"scripts": {
  "play": "npx auxsrv playground --spa -b"
}
```

```
/playground
  - index.css
  - index.html
      contains <script src="/dist/index.js"></script>
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
  "play": "npx auxsrv playground --spa -b src/index.tsx"
}
```

```
/playground
  - src
    - App.tsx
    - index.css
    - index.tsx // imports "./App.tsx", "./index.css"
  - index.html
      contains <script src="/dist/index.js"></script>
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

<details>
<summary>Example with the watch mode</summary>

```
/app
  - src
    - index.ts
  - index.css
  - index.html
      contains <script src="dist/index.js"></script>
      contains <link rel="stylesheet" href="index.css">
```

```
// /app/package.json
{
  "name": "app",
  "scripts": {
    "start": "npx auxsrv . -u 80 -b src/index.ts --watch"
  }
}
```

```sh
npm start
```

</details>

## Code

```ts
import { serve } from "auxsrv";

// Start
let server = await serve({
  host: "localhost", // default
  port: 3000, // default
  path: "app",
  bundle: true, // or input path, or { input, output, dir }
  spa: true,
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
      contains <script src="/dist/index.js"></script>
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
    path: "playground",
    bundle: true,
    spa: true,
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
      contains <script src="/dist/index.js"></script>
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
    path: "tests/x",
    bundle: "src/index.tsx",
    spa: true,
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
