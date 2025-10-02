# @t8/serve

Simple static file server + bundler, primarily for tests, manual or automated

## CLI

```sh
npx @t8/serve [url|port] [*] [app_dir] [...assets_dirs] [-b [bundle_input_path] [bundle_output_path]]
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
<summary>Example</summary>

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
    + <script src="/dist/index.js"></script>
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

## Code

```ts
import { serve } from "@t8/serve";

// Start
let server = await serve({
  port: 3000,
  path: "app",
  bundle: true, // or `{ input, output }`, or `input` path
  spa: true,
});

// Stop
server.close();
```

<details>
<summary>Example</summary>

```
/playground
  - index.css
  - index.html
    + <script src="/dist/index.js"></script>
  - index.ts
```

```ts
// x.test.ts
import { test } from "@playwright/test";
import { serve, type Server } from "@t8/serve";

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: "playground",
    bundle: "src/index.tsx",
    spa: true,
  });
});

test.afterAll(() => {
  server.close();
});
```

</details>
