# rollup-plugin-computed

[![CI status](https://img.shields.io/github/workflow/status/krmax44/rollup-plugin-computed/build/main)](https://github.com/krmax44/rollup-plugin-computed/actions)
[![Code coverage](https://img.shields.io/codecov/c/github/krmax44/rollup-plugin-computed?token=U8BJP3K9SH)](https://codecov.io/gh/krmax44/rollup-plugin-computed)
[![npm version](https://img.shields.io/npm/v/rollup-plugin-computed)](https://www.npmjs.com/package/rollup-plugin-computed)
[![docs](https://img.shields.io/badge/docs-blue)](https://krmax44.github.io/rollup-plugin-computed/)

Oftentimes it's handy to compute some data at build time, like querying an API endpoint, so that it's faster for the client. This plugin makes it really simple.

## Installation

```bash
yarn add -D rollup-plugin-computed
# or using npm
npm i -D rollup-plugin-computed
```

## Usage

```js
// rollup.config.js or vite.config.js

import computed from 'rollup-plugin-computed';

const computers = {
	test() {
		return { hello: 'world' };
	},
	image: {
		// bundle file, even though nothing in the app imports it
		alwaysBuild: true,
		type: 'asset', // chunk by default
		fileExt: 'svg', // required for assets
		// will be saved to dist/image.svg (rollup applies image-hash.svg by default)
		fileName: 'image.svg',
		fn() {
			return '<svg>...</svg>';
		}
	}
};

export default {
	plugins: [computed({ computers })]
};
```

You can access the computed data like this in your app:

```js
import data from 'test.computed';
console.log(data);

// { hello: 'world' }
```

More more info, head over to the [documentation](https://krmax44.github.io/rollup-plugin-computed/).
