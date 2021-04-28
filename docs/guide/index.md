---
title: What is this plugin?
---

# What is this plugin?

Oftentimes it's handy to compute some data at build time, like querying an API endpoint, so that it's faster for the client. This plugin makes it really simple.

From pulling data out of an API, to grabbing local data from disk, to generating dynamic SVGs: the use-cases are quite wide.

With this plugin, you can easily write a function to fetch some data, that will be executed by Rollup during build...

```js
function dateAtBuild() {
	const d = new Date().toLocaleDateString('en-us');
	return `this bundle was built on ${d}`;
}
```

and import it in your app:

```js
// my-app.js
import dateAtBuild from 'dateAtBuild.computed';
console.log('in case you are curious:', dateAtBuild);

// --> in case you are curious: this bundle was built on ...
```
