# esbuild-plugin-inline-image

[esbuild](https://esbuild.github.io/) plugin for inlining yout images conditionaly on size

Aka. switches loader for image between `file` and `dataurl` depending on size (as in Webpack)

## Instalation

```sh
yarn add esbuild-plugin-inline-image
```

or

```sh
npm install esbuild-plugin-inline-image
```

## Usage

Add it to your `esbuild` plugins list:

```js
const esbuild = require("esbuild");
const inlineImage = require("esbuild-plugin-inline-image");

esbuild.build({
  ...
  plugins: [
    ...
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

By default it works for `jpg, png, gif, svg, webp, avif` extensions.

You can customize the options (ie. to disable svg loading if being handled by different plugin)

```js
inlineImage({
  // options
});
```

### Allowed options are:

- `limit`: define image limit (in bytes) for size after which the image wll not be inline (default is `10000`)

  - limit can also be set from env as `IMAGE_INLINE_SIZE_LIMIT`
  - in case you pass function, the image will be inlined if it returns `true` (or `Promise` that resolves to `true`)
    - the function get's passed `onLoad` [args](https://esbuild.github.io/plugins/#load-arguments)

- `extensions`: an array of extensions to work on (default is `[` `"jpg"`, `"jpeg"`, `"png"`, `"gif"`, `"svg"`, `"webp"`, `"avif"` `]`)

- `filter`: you can also pass filter for onLoad directly, but in this case you need to manually set `esbuild` [loader](https://esbuild.github.io/api/#loader) option for the extensions to `file`

- `namespace`: custom namespace for the plugin to operate on, default's to built-in `file`

## License

Licensed as MIT open source.
