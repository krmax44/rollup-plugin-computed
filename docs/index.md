---
title: Welcome
home: true
heroText: computed 📂
tagline: Compute data at build-time and use it within your app
actionText: Get started
actionLink: /guide/
features:
  - title: Simple
    details: Easy setup, quick results. Everything is consolidated nicely, no more hacky pre-build scripts.
  - title: Versatile
    details: Use it to pre-fetch an API, fetch local Markdown files, render dynamic images, and more!
  - title: Performant
    details: Save your client's time by pre-rendering data at build-time. Only ship what you need using Code Splitting.

footer: MIT Licensed
---

Oftentimes it's handy to compute some data at build time, like querying an API endpoint, so that it's faster for the client. This plugin makes it really simple.

### Installation

```bash
yarn add -D rollup-plugin-computed
# or using npm
npm i -D rollup-plugin-computed
```

### Usage

```js
// rollup.config.js or vite.config.js

import computed from 'rollup-plugin-computed';

const computers = {
	test() {
		return { hello: 'world' };
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
