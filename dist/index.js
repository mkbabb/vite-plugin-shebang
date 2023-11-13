import fs from "fs";
import path from "path";
// Set the default options
export const defaultOptions = {
    shebang: "#!/usr/bin/env node\n",
    fileExtension: ".js",
};
// Function to get the file extension based on package.json
function getFileExtension() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
            const type = packageJson.type;
            if (type === "module") {
                return ".cjs";
            }
            else if (type === "commonjs") {
                return ".js";
            }
        }
        catch (error) {
            console.error("Error reading package.json:", error);
        }
    }
    return defaultOptions.fileExtension;
}
// Main plugin function
export function prependShebang(options = defaultOptions) {
    var _a;
    // Merge user-provided options with the default options
    const shebang = (_a = options.shebang) !== null && _a !== void 0 ? _a : defaultOptions.shebang;
    const shebangLines = shebang.split("\n").length - 1;
    let fileExtension = options.fileExtension;
    return {
        name: "prepend-shebang",
        buildStart() {
            fileExtension !== null && fileExtension !== void 0 ? fileExtension : (fileExtension = getFileExtension());
        },
        renderChunk(code, chunk, options) {
            if (chunk.fileName.endsWith(fileExtension !== null && fileExtension !== void 0 ? fileExtension : "")) {
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
