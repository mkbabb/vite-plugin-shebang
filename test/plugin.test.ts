import fs from "fs";
import os from "os";
import path from "path";
import { build } from "vite";
import { describe, expect, it } from "vitest";
import { PrependShebangOptions, prependShebang } from "../src";

describe("prependShebang", () => {
    it("should prepend shebang to cjs files", async () => {
        const options: Partial<PrependShebangOptions> = {
            shebang: "#!/usr/bin/env node",
            files: ["index.cjs"],
        };

        const EXPECTED = `${options.shebang}\n\"use strict\";console.log(\"Hello, world!\");\n`;

        // Create a temporary directory
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vite-plugin-"));

        // Create a mock package.json in the temporary directory
        const packageJsonPath = path.join(tempDir, "package.json");
        const packageJson = { type: "module" };
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));

        // Create a mock index.js in the temporary directory
        const indexJsPath = path.join(tempDir, "index.js");
        const indexJs = "console.log('Hello, world!');";
        fs.writeFileSync(indexJsPath, indexJs);

        // Run Vite build with the plugin
        const buildOutput = await build({
            root: tempDir,
            plugins: [prependShebang(options)],

            build: {
                write: false, // Prevents actual file writing for the test
                outDir: path.resolve(tempDir, "dist"),
                emptyOutDir: true,

                lib: {
                    entry: path.resolve(tempDir, "index.js"),
                    fileName: "index",
                    formats: ["cjs"],
                },
            },
        });

        console.log(JSON.stringify(buildOutput, null, 4));
        expect(buildOutput[0].output[0].code).toBe(EXPECTED);

        // Clean up: remove the temporary directory and its contents
        fs.unlinkSync(packageJsonPath);
        fs.unlinkSync(indexJsPath);
        fs.rmdirSync(tempDir);
    });
});
