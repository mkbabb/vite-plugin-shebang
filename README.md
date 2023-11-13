# `vite-plugin-shebang`

A Vite plugin to prepend a custom shebang to JavaScript files based on the module type specified in `package.json`.

## Features

-   Prepends a custom shebang to JavaScript files
-   Automatically detects bin files based on the `bin` field in `package.json`

## Installation

Install the plugin via npm:

```bash
npm install vite-plugin-shebang --save-dev
```

## Usage

Specify your options:

```ts
const options: PrependShebangOptions = {
    // The shebang string to prepend to the file.
    shebang: "#!/usr/bin/env node",
    // The output file names to prepend the shebang to.
    files: ["index.cjs"],
};
```

And then call the plugin in your build chain:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { prependShebang } from "vite-plugin-shebang";

export default defineConfig({
    plugins: [prependShebang(options)],
});
```
