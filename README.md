# `vite-plugin-shebang`

A Vite plugin to prepend a custom shebang to JavaScript files based on the module type specified in `package.json`.

## Features

-   Prepends a custom shebang to JavaScript files.
-   Automatically detects the file extension (`.cjs`, `.mjs`, `.js`) based on the `type` specified in `package.json`.
-   Allows custom configuration for the shebang string and file extension.

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
    shebang: "#!/usr/bin/env node\n",
    // Keep null for automatic detection, or specify your out file extension directly.
    fileExtension: ".cjs",
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
