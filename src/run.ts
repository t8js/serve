#!/usr/bin/env node
import { serve } from "./serve";

let args = process.argv.slice(2);

/**
 * @example
 * serve 3000 app public dist
 * serve 127.0.0.1:3000 app public dist
 */
serve({
  url: args[0],
  path: args[1],
  dirs: args.slice(2),
});
