import { Plugin } from "vite";
export type PrependShebangOptions = {
    shebang: string;
    files: string[];
};
export declare const defaultOptions: PrependShebangOptions;
export declare function prependShebang(options?: Partial<PrependShebangOptions>): Plugin;
