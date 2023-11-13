import fs from "fs";
import path from "path";
// Set the default options
export const defaultOptions = {
    shebang: "#!/usr/bin/env node",
    files: ["index.js"],
};
// Function to get the file extension based on package.json
function getBinFiles() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
            const bin = packageJson.bin;
            if (bin != null) {
                return Object.keys(bin);
            }
        }
        catch (error) {
            console.error("Error reading package.json:", error);
        }
    }
    return [];
}
// Main plugin function
export function prependShebang(options = defaultOptions) {
    var _a, _b;
    // Merge user-provided options with the default options
    let shebang = (_a = options.shebang) !== null && _a !== void 0 ? _a : defaultOptions.shebang;
    // Trim trailing newlines and then add a single newline
    shebang = shebang.replace(/\n+$/, "") + "\n";
    const shebangLines = shebang.split("\n").length - 1;
    const files = (_b = options.files) !== null && _b !== void 0 ? _b : defaultOptions.files;
    return {
        name: "prepend-shebang",
        buildStart() {
            files.push(...getBinFiles());
        },
        renderChunk(code, chunk, options) {
            if (files.includes(chunk.fileName) &&
                chunk.type === "chunk" &&
                chunk.isEntry) {
                const modifiedCode = shebang + code;
                // Generate a very basic sourcemap
                const lines = code.split("\n").length;
                const mappings = Array(lines)
                    .fill(undefined)
                    .map((_, i) => `AACA${i}`)
                    .join(";");
                const map = {
                    version: 3,
                    sources: [chunk.fileName],
                    names: [],
                    mappings: ";".repeat(shebangLines) + mappings, // Offset by the number of shebang lines
                };
                return {
                    code: modifiedCode,
                    map: map,
                };
            }
            return { code, map: null };
        },
    };
}
