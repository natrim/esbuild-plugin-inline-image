# esbuild-plugin-inline-image

`esbuild` plugin for inlining yout images conditionaly on size

Aka. switches loader for image between `file` and `dataurl` depending on size (as in Webpack)

## Usage

Add it to your `esbuild` plugins list:

```js
const esbuild = require("esbuild");
const inlineImage = require("esbuild-plugin-inline-image");

esbuild.build({
  ...
  plugins: [
    inlineImage()
  ]
  ...
});
```

You can then import images

```js
import logo from "../assets/logo.png";
```

## Options

By default it works for `.jpg, .png, .gif, .svg, .webp` extensions.

You can customize the options (ie. to disable svg loading if being handled by different plugin)

```js
inlineImage({
  // options
});
```
### Allowed options are:

- `limit`: define image limit for size after which the image wll not be inline (default is 10KB)

  - limit can also be set from env as `IMAGE_INLINE_SIZE_LIMIT`

- `extensions`: an array of extensions to work on (default is `[` `jpg`, `png`, `gif`, `svg`, `webp` `]`)
- `filter`: you can also pass filter for onLoad directly, but in this case you need to manually set `esbuild` `loaders` option for the extensions to `file`

## License

Licensed as MIT open source.