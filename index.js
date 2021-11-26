const { stat, readFile } = require("fs/promises");

module.exports = (options = {}) => ({
  name: "inline-image",
  setup(build) {
    const esbuildOptions = build.initialOptions;
    const limit = parseInt(
      options.limit || process.env.IMAGE_INLINE_SIZE_LIMIT || "10000",
      10
    );
    const extensions = options.extensions || [
      "svg",
      "png",
      "jpeg",
      "jpg",
      "gif",
      "webp",
    ];
    const filter =
      options.filter ||
      new RegExp(`.(${extensions.map((x) => escapeRegExp(x)).join("|")})$`);
    build.onLoad({ filter }, async (args) => {
      let contents;
      let loader = "file";
      const stats = await stat(args.path);
      if (stats && stats.size < limit) {
        contents = await readFile(args.path);
        loader = "dataurl";
      }
      return {
        contents,
        loader,
      };
    });
    if (typeof esbuildOptions.loader !== "object") {
      esbuildOptions.loader = {};
    }
    extensions.forEach((ext) => {
      esbuildOptions.loader[`.${ext}`] = "file";
    });
  },
});

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
