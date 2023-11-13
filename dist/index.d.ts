import { Plugin } from "vite";
export type PrependShebangOptions = {
    shebang: string;
    fileExtension: string;
};
export declare const defaultOptions: PrependShebangOptions;
export declare function prependShebangPlugin(options?: PrependShebangOptions): Plugin;
