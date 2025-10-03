# @t8/serve

Simple static file server + bundler, primarily for demo apps and tests, manual or automated

Use cases:
- Use the CLI-based server to launch a demo or test app with a single CLI command.
- Use the code-based setup to launch an own server from multiple tests, each with its own app.

## CLI

```sh
npx @t8/serve [url|port] [*] [app_dir] [...assets_dirs] [-b [bundle_input_path] [bundle_output_path] [bundle_output_dir]]
# * = SPA mode: serve all unmatched paths as "/"

npx @t8/serve 3000 app
npx @t8/serve 3000 app -b
npx @t8/serve 3000 * app
npx @t8/serve 3000 * app -b
npx @t8/serve 3000 app public dist
npx @t8/serve 127.0.0.1:3000 app public dist
npx @t8/serve 3000 app public dist -b
npx @t8/serve 3000 app public dist -b src/index.ts
```

<details>
<summary>Example 1 (flat)</summary>

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
<summary>Example 2 (nested)</summary>

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
// With Playwright:
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
import { serve } from "@t8/serve";

// Start
let server = await serve({
  port: 3000,
  path: "app",
  bundle: true, // or input path, or `{ input, output, dir }`
  spa: true,
});

// Stop
server.close();
```

<details>
<summary>Example 1 (flat)</summary>

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
<summary>Example 2 (nested)</summary>

```
/tests/x
  - src
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
import { serve, type Server } from "@t8/serve";

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
