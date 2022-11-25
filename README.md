# esbuild-plugin-inline-image

[esbuild](https://esbuild.github.io/) plugin for inlining yout images conditionaly on size

Aka. switches loader for image between `file` and `dataurl` depending on size (as in Webpack)

*Well, technically can be used even for non images (just set the right extensions), but who would want that?*

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
  - setting limit to 0 disables inlining, -1 will always inline
  - in case you pass function, the image will be inlined if it returns `true` (or `Promise` that resolves to `true`)
    - the function get's passed `onLoad` [args](https://esbuild.github.io/plugins/#load-arguments)

- `extensions`: an array of extensions to work on (default is `[` `"jpg"`, `"jpeg"`, `"png"`, `"gif"`, `"svg"`, `"webp"`, `"avif"` `]`)

- `filter`: you can also pass filter for onLoad directly, but in this case you need to manually set `esbuild` [loader](https://esbuild.github.io/api/#loader) option for the extensions to `file`

- `namespace`: custom namespace for the plugin to operate on, default's to built-in `file`

- `loaderRegisterExtensions`: register `extensions` to esbuild loader? default's to `true`, set `false` to disable

## Examples

Use plugin multiple times to have different size for different extensions

```js
esbuild.build({
  ...
  plugins: [
    ...
    inlineImage({
      extensions: ["svg", "webp", "avif"]
    }),
    inlineImage({
      limit: 5000,
      extensions: ["jpg", "jpeg", "gif"]
    }),
    inlineImage({
      limit: 2000,
      extensions: ["png"]
    })
  ]
  ...
});
```

Use function to decide inlining

```js
esbuild.build({
  ...
  plugins: [
    ...
    inlineImage({
      limit: ({ path }) => {
        // inline only svg, other extensions get only loader set to file
        return path.endsWith(".svg");
      }
    }),
  ]
  ...
});
```

Set limit to -1 to inline all images

```js
esbuild.build({
  ...
  plugins: [
    ...
    inlineImage({
      limit: -1
    })
  ]
  ...
});
```

Set limit to 0, to disable inlining (extensions will only get registed to `loader`)

```js
esbuild.build({
  ...
  plugins: [
    ...
    inlineImage({
      limit: 0
    })
  ]
  ...
});
```

## License

Licensed as MIT open source.
