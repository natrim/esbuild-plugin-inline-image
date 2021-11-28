const { stat, readFile } = require("fs/promises");
const defLimit = "10000";
function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
module.exports = (options = {}) => ({
  name: "inline-image",
  setup(build) {
    const limit =
      typeof options.limit === "string" || typeof options.limit === "number"
        ? options.limit === 0 || options.limit === ""
          ? 0
          : parseInt(options.limit, 10) ||
            parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || defLimit, 10) ||
            parseInt(defLimit, 10)
        : typeof options.limit === "function"
        ? options.limit
        : typeof options.limit === "undefined"
        ? parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || defLimit, 10) ||
          parseInt(defLimit, 10)
        : 0;
    const extensions =
      typeof options.extensions === "object" &&
      Array.isArray(options.extensions)
        ? options.extensions
        : ["svg", "png", "jpeg", "jpg", "gif", "webp", "avif"];
    const filter =
      typeof options.filter === "object" && options.filter instanceof RegExp
        ? options.filter
        : extensions.length > 0
        ? new RegExp(
            `\\.(${extensions
              .map((x) => x && escapeRegExp(x.replace(".", "")))
              .filter(Boolean)
              .join("|")})$`
          )
        : null;
    const namespace =
      typeof options.namespace === "string" ? options.namespace : undefined;
    if (limit && filter) {
      build.onLoad({ filter, namespace }, async (args) => {
        let contents;
        let loader = "file";
        if (typeof limit === "function") {
          const r = limit(args);
          if (
            (typeof r === "object" && r instanceof Promise && (await r)) ||
            (typeof r === "boolean" && r)
          ) {
            contents = await readFile(args.path);
            loader = args.loader || "dataurl";
          }
        } else {
          const stats = await stat(args.path);
          if (stats && stats.size < limit) {
            contents = await readFile(args.path);
            loader = "dataurl";
          }
        }
        return {
          contents,
          loader,
        };
      });
    }
    if (extensions.length > 0) {
      const esbuildOptions = build.initialOptions;
      if (typeof esbuildOptions.loader !== "object") {
        esbuildOptions.loader = {};
      }
      extensions.forEach((ext) => {
        if (ext) {
          esbuildOptions.loader[`.${ext.replace(".", "")}`] = "file";
        }
      });
    }
  },
});
