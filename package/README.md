# `astro-globals`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that stores site data in a global virtual module

## Usage


### Installation

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

## Help! I'm getting red squiggles when I import `globals/*`!

Try [`astro sync`](https://docs.astro.build/en/reference/cli-reference/#astro-sync) and that *should* fix your problem.

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
