---
title: Chunks
---

# Chunks

For simple usage, passing an object of functions to the plugin is adequate. Sometimes though, you probably want to make use of the options below.

To specify options, you can register computers like this:

```ts
import type { ComputerSetups } from 'rollup-plugin-computed';

const computers: ComputerSetups = {
	example: {
		// options go here
		serializer: 'json',
		fileName: 'example-data.js',
		split: true,

		// the computer function
		fn() {
			return 'it works!';
		}
	}
};
```

## `fn`

The computer function. It will be executed at build-time (never in the browser) and the returned data can be imported in your app.

## `serializer?`

In our computer function, we pass back a string. To import it though, we need to return an ES module. The serializer takes care of transforming our returned data to ESM. By default, it is set to `json`, which will `JSON.stringify` the data and set that as the default export.

You can disable serialization by passing `false`.

### Custom serializers

You can define a custom serializer as such:

```js
const computers = {
	example: {
		serializer(input) {
			return `
        const text = '${input}';
        export { text };
      `;
		},
		fn() {
			return 'it works!';
		}
	}
};
```

Which would yield the following module:

```js
const text = 'it works!';
export { text };
```

And can be imported as follows:

```js
import { text } from 'example.computed';
```

### JSON collection

There is also another serializer built in called `json-collection`. Sometimes it's handy to return not just one chunk, but multiple ones at a time - for example when returning a set of blog posts. Yet, the client might only need some of these.

When setting `serializer` to `json-collection`, you can return an object like this:

```js
{
	serializer: 'json-collection',
	fn() {
		return {
			firstPost: 'Hello!',
			secondPost: 'My fingers hurt from writing'
		};
	}
}
```

In your app, you can then load each "post" on-demand:

```js
import posts from 'example.computed';

// let's get the first post
const firstPost = await posts.firstPost();
console.log(firstPost); // --> Hello!
```

## `split?`

To force-split the computed data into a seperate file, set `split` to `true`. Otherwise, it will be inlined into the chunk of the module that imports the computer. Rollup is smart enough to split it automatically in most cases, if for example multiple modules require the computer.

## `fileName?`

If the computer gets split, you can set a custom filename here. This overrides the default Rollup filename.
