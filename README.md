# eleventy-plugin-sass

**An [Eleventy](https://www.11ty.dev) plugin for processing SCSS files with [Dart Sass](https://sass-lang.com).**

[![npm](https://img.shields.io/npm/v/@jgarber/eleventy-plugin-sass.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@jgarber/eleventy-plugin-sass)
[![Downloads](https://img.shields.io/npm/dt/@jgarber/eleventy-plugin-sass.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@jgarber/eleventy-plugin-sass)
[![Build](https://img.shields.io/github/actions/workflow/status/jgarber623/eleventy-plugin-sass/ci.yml?branch=main&logo=github&style=for-the-badge)](https://github.com/jgarber623/eleventy-plugin-sass/actions/workflows/ci.yml)

## Usage

First, add the plugin as [a development dependency](https://docs.npmjs.com/cli/configuring-npm/package-json#devdependencies) to your project's `package.json` file:

```sh
npm install --save-dev @jgarber/eleventy-plugin-sass
```

Next, add the plugin to your project's [Eleventy configuration file](https://www.11ty.dev/docs/config#default-filenames) (e.g. `eleventy.config.js`):

```js
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(require('@jgarber/eleventy-plugin-sass'));
};
```

With no additional configuration, eleventy-plugin-sass will process SCSS files in your Eleventy project's input directory ([`dir.input`](https://www.11ty.dev/docs/config#input-directory)) and generate CSS files in the output directory ([`dir.output`](https://www.11ty.dev/docs/config#output-directory)).

Generated CSS files' permalinks will mimic the input directory's file structure. For example, `./src/assets/stylesheets/app.scss` will generate a CSS file at `./_site/assets/stylesheets/app.css`. [Sass partials](https://sass-lang.com/guide#partials) (files whose name begins with an underscore) _will not_ generate a corresponding CSS file.

## Options

eleventy-plugin-sass supports the following options:

| Name              | Type(s)                   | Default                           |
|:------------------|:--------------------------|:----------------------------------|
| `sassOptions`     | `Object`                  | `{ loadPaths: ['node_modules'] }` |
| `templateFormats` | `Array<String>`, `String` | `['sass', 'scss']`                |

```js
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(require('@jgarber/eleventy-plugin-sass'), {
    sassOptions: {
      sourceMap: true,
      style: 'compressed'
    },
    templateFormats: 'scss'
  });
};
```

Refer to the [Sass JavaScript API documentation](https://sass-lang.com/documentation/js-api) (specifically, the [Options documentation](https://sass-lang.com/documentation/js-api/interfaces/options)) for details.

> [!NOTE]
> Enabling source maps with `sourceMap: true` will _also_ automatically set `sourceMapIncludeSources: true`. Currently, this plugin supports inlined source maps only.

### Custom Functions

eleventy-plugin-sass supports configuring [Custom Functions](https://sass-lang.com/documentation/js-api/interfaces/options#functions) through Sass' JavaScript API with one notable caveat. User-supplied configuration must use the same instance of the Sass parser that this plugin uses. The standard `Object`-based options argument _will not_ have a reference to this instance.

To bridge this gap, eleventy-plugin-sass accepts a function as a second argument to Eleventy's `addPlugin` function:

```js
eleventyConfig.addPlugin(require('@jgarber/eleventy-plugin-sass'), function(sass) {
  return {
    sassOptions: {
      functions: {
        'font-url($path)': function(args) {
          const path = args[0].assertString('path').text;

          return new sass.SassString(`url("/assets/fonts/${path}")`, {
            quotes: false
          });
        }
      }
    },
    templateFormats: 'scss'
  };
});
```

> [!WARNING]
> In the usage above, your configuration function _must_ accept a single argument (`sass`, in the example above). Declaring Custom Functions using this plugin's default `Object` options style will result in hard-to-debug errors.

A configuration function like the one above should return an `Object` conforming to this plugin's available options (noted in the table above!).

## ESM Support

Eleventy v3.0.0 [added bundler-free ESM support](https://www.11ty.dev/blog/canary-eleventy-v3). This plugin works with either ESM or CommonJS projects!

```js
import sassPlugin from '@jgarber/eleventy-plugin-sass';

export default async function(eleventyConfig) {
  eleventyConfig.addPlugin(sassPlugin);
}
```

## Acknowledgments

First and foremost, eleventy-plugin-sass wouldn't be possible without [Zach Leatherman](https://www.zachleat.com)'s incredible work creating Eleventy and his stewardship of its community.

eleventy-plugin-sass is written and maintained by [Jason Garber](https://sixtwothree.org).
