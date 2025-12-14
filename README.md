# T8 Serve

Simple static file server + bundler, primarily for demo apps and tests, manual or automated

Use cases:

- Use the CLI-based server to launch a demo or test app with a single CLI command.
- Use the code-based setup to launch an own server from multiple tests, each with its own app.

## CLI

```sh
npx @t8/serve [url|port] [*] [app_dir] [...assets_dirs] [-b [bundle_input_path] [bundle_output_path] [bundle_output_dir]] [--watch] [--minify]
# * = SPA mode: serve all unmatched paths as "/"
```

Examples:

```sh
npx @t8/serve 3000 app
# - serve files from './app' at 'localhost:3000'

npx @t8/serve 3000 * app -b
# - bundle './app/index.ts' to './app/dist/index.js' [-b]
# - serve files from './app' at 'localhost:3000' in the SPA mode [*] (handling all unmatched paths as "/")

npx @t8/serve 3000 * app -b src/index.ts
# - bundle './app/src/index.ts' to './app/dist/index.js'
# - serve files from './app' at 'localhost:3000' in the SPA mode

npx @t8/serve 127.0.0.1:3000 app public dist -b
# - bundle './app/index.ts' to './app/dist/index.js'
# - serve files from './app/public' and './app/dist' at '127.0.0.1:3000'
```

<details>
<summary>Example with Playwright #1 (flat)</summary>

```
// package.json
"scripts": {
  "play": "npx @t8/serve 3000 * playground -b"
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
  "play": "npx @t8/serve 3000 * playground -b src/index.tsx"
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
    "start": "npx @t8/serve 80 . -b src/index.ts --watch"
  }
}
```

```sh
npm start
```

</details>

## Code

```ts
import { serve } from "@t8/serve";

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
import { type Server, serve } from "@t8/serve";

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
import { type Server, serve } from "@t8/serve";

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
import { serve } from "@t8/serve";

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
