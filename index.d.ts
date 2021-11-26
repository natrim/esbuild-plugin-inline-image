declare module "esbuild-plugin-image-inline" {
  import type { Plugin } from "esbuild";
  import imageInline from "esbuild-plugin-image-inline";

  type Options = {
    limit?: number;
    extensions?: string[];
    filter?: RegExp;
  };

  const imageInlineTyped: (opts?: Options) => Plugin = imageInline;

  export default imageInlineTyped;
}
