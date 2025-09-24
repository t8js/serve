```sh
npx @t8/serve [url|port] [app_dir] [...assets_dirs] [-b [bundle_input_path] [bundle_output_path]]

npx @t8/serve 3000 app
npx @t8/serve 3000 app -b
npx @t8/serve 3000 app public dist
npx @t8/serve 127.0.0.1:3000 app public dist
npx @t8/serve 3000 app public dist -b
npx @t8/serve 3000 app public dist -b src/index.ts
```
