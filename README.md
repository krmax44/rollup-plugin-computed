# rollup-plugin-computed

[![CI status](https://img.shields.io/github/workflow/status/krmax44/rollup-plugin-computed/build/main)](https://github.com/krmax44/rollup-plugin-computed/actions)
[![Code coverage](https://img.shields.io/codecov/c/github/krmax44/rollup-plugin-computed?token=token)](https://codecov.io/gh/krmax44/rollup-plugin-computed)
[![npm version](https://img.shields.io/npm/v/rollup-plugin-computed)](https://www.npmjs.com/package/rollup-plugin-computed)

Oftentimes it's handy to compute some data at build time, like querying an API endpoint, so that it's faster for the client. With this Rollup/Vite plugin, it's really easy to do.

## Installation

```bash
yarn add rollup-plugin-computed
# or using npm
npm i rollup-plugin-computed
```

## Usage

```js
// rollup.config.js or vite.config.js

import computed from 'rollup-plugin-computed';

const computers = {
	test() {
		return { hello: 'world' };
	},
	image()
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
