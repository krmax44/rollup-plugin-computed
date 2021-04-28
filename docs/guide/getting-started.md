---
title: Getting started
---

# Getting started

## Basic Setup

Firstly, install the package:

```bash
yarn add -D rollup-plugin-computed
# or using npm
npm i rollup-plugin-computed --save-dev
```

Then, configure it in the `rollup.config.js` (or `vite.config.js`):

```js
import computed from 'rollup-plugin-computed';

export default {
	plugins: [
		computed({
			computers: {
				// your computer functions go here
				example() {
					return 'hello!';
				}
			}
		})
	]
};
```

Within your app, you can now import it as such:

```js
import data from 'example.computed';
console.log(data); // --> hello!
```

Now, you're ready for more advanced computers ✨
