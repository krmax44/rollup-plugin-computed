---
title: Assets
---

# Assets

So far, we've only taken a look on Chunks, which is great for most kinds of data that your app would consume. But what about assets, like images? That's easy as well:

```ts
import type { Computers } from 'rollup-plugin-computed';

const computers: Computers = {
	example: {
		type: 'asset',
		fileExt: 'svg',

		fn() {
			return '<svg>...</svg>';
		}
	}
};
```

You can use it like this in your app:

```js
import image from 'example.computed';
console.log(image); // --> /dist/example-ca5b68.svg

document.querySelector('img').src = image;
```

## `fn`

The computer function. It will be executed at build-time (never in the browser) and the returned data will be saved and included in the bundle.

## `fileExt`

This option is required. Specify the asset's file extension, like `png`, `json`, etc.

## `alwaysBuild?`

If you don't import your computed asset anywhere in the app, Rollup will not include it in the output bundle. This is great for removing bloat, but sometimes not desired. You can set `alwaysBuild` to true, to circumvent this.

## `fileName?`

Specify a custom filename with the `fileName` option. This overrides the default Rollup filename.
