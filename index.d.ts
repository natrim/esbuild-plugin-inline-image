import type { OnLoadArgs, Plugin } from "esbuild";

type Options = {
  limit?: number | ((args: OnLoadArgs) => boolean | Promise<boolean>);
  extensions?: string[];
  filter?: RegExp;
  namespace?: string;
  loaderRegisterExtensions?: boolean;
};

declare const imageInline: (options?: Options) => Plugin;

export default imageInline;
