# `astro-globals`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that stores site data in a global virtual module.

## Usage

Before going over usage, let's cover the *why* and *what* first.

### Why should you use this?

Let's say you have a component, `<Nav>` that has an `#id`. You want to use that `#id` to select it in another component. You _could_ export it from your `Nav.astro` component, but that can cause side effects.

Instead, this *static* string can be exported from a `global.ts` file.

```ts
// ./global.ts
export const nav_id = 'unique-string';
```

```astro
---
// ./components/NavTrigger.astro
import { nav_id } from 'globals/data'
---
<button data-target={nav_id}>Open Nav</button>
```

```astro
---
// ./components/Nav.astro
import { nav_id } from 'globals/data';
---
<nav id={nav_id}>...</nav>
```

### What should you keep in global data?

The *recommended* type of data to keep in these global files is strictly static.

```ts
// ./global.ts
// While this pacakge can't stop you from using default exports, 
// it is not recommended. Named exports only
export default 'Super special string'

// You shouldn't be exporting something mutable/used for tracking
// for that you should use something with global state management
export let timesCrashed = 0

// This doesn't need to be global and might not work how you expect
export const today = new Date();

// Socials are a good example, but if you're going to export it as a URL, you should add that to the name
export const githubRepo = new URL('https://github.com/gingerchew/astro-globals');

// This should be in your components or lib folder, even if the outcome will be the same for the same arguments
export const aFunctionWithDeterministicOutput = (...args) => { /* ... */ }

// Anything that goes in an env should **not** be in here
export const MY_SECRET_TOKEN_THAT_WILL_GET_ME_FIRED_IF_SOMEONE_SEES_IT = '...';

// If you feel the need to export your data in an object, you likely want to use the object config type instead
export const myData = { ... };

// If the data changes between environments, it probably shouldn't be in a global virtual module
export const changesBasedOnEnvironment = import.meta.env.DEV ? 'Useful debugging data' : '';
```

Given this config:

```ts
export default defineConfig({
  integrations: [globals({ source: ['./global.ts', './global2.ts', { name: 'special', file: './special.global.ts' }]})]
});
```

The output should be:

```ts
// globals/data
export * from "./global.ts";
export * from "./global2.ts";
// globals/special
export * from "./special.global.ts";
```

## Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-globals
```

```bash
npx astro add astro-globals
```

```bash
yarn astro add astro-globals
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-globals
```

```bash
npm install astro-globals
```

```bash
yarn add astro-globals
```

2. Add the integration to your astro config

```diff
+import astroGlobals from "astro-globals";

export default defineConfig({
  integrations: [
+   astroGlobals({
+     sources: ['./path/to/my/global/data.ts', { name: 'named-data', file: './path/to/my/other/named-data.ts' }]
+   }),
  ],
});
```

### Configuration

This integrations has one option, `sources`, that is used to pull in data to be exported into a virtual module.

A source can either be a valid path to a typescript/javascript file, or an object.

#### Why an object?

Let's say you have data that is useful for the whole site:

```ts
export const site_title = 'Your site';
export const site_desc = 'This is a fancy site, right?'
```

That sort of data can be accessed at `globals/data`, but what if you have more specific data like about the author?

```ts
export const author = 'Ginger';
export const coolness_level = 'Totally Radical!!';
```

That sort of data could be nicer to have in a module with a specific name, like `globals/author`. What about something related to components that needs to be shared throughout the site?

```ts
export const nav_id = `my-unique-string`
```

That could be sorted under `globals/component-ids`.

Here's what that config object would look like:

```ts
import astroGlobals from "astro-globals";

export default defineConfig({
  integrations: [
   astroGlobals({
     sources: [{
      name: 'author',
      file: './source/to/author/data.ts'
     }, {
      name: 'component-ids',
      file: './source/to/component/ids.ts'
     }]
   }),
  ],
});
```

## Shouldn't this be the responsibility of a CMS?

Yes! If you have a CMS that supports some sort of global variable, use that instead. If you are just making a hobby site, or don't need to mess with a database at all, you could likely get away with this.

## Help! I'm getting red squiggles when I import `globals/*`!

Try [`astro sync`](https://docs.astro.build/en/reference/cli-reference/#astro-sync) and that *should* fix your problem.

## Help! I have a naming conflict!

As much as I would love to parse each file through an AST and make sure there's no naming conflicts, that just isn't time/cost effective. Change the name of one.

If you *absolutely* __positively__ ***NEED*** to have two pieces of data exported under the same name, you can move one of them to a named module.

```ts
export default defineConfig({
  integrations: ['./global.ts', { name: 'has-conflict', file: './conflict.ts' }]
})
```

Now they will not conflict anymore.


## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/gingerchew/astro-globals/blob/main/LICENSE). Made with ❤️ by [ginger](https://github.com/gingerchew/astro-globals).

## Acknowledgements

- The wonderful [Astro Integration Kit](https://astro-integration-kit.netlify.app/) made all of this a 15 minute endeavor with no headaches.
