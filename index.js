const { Buffer } = require('node:buffer');
const path = require('node:path');

const sass = require('sass');

const package_ = require('./package.json');

const compiler = sass.initCompiler();

module.exports = function(eleventyConfig, options_ = {}) {
  try {
    eleventyConfig.versionCheck(package_['11ty'].compatibility);
  } catch (error) {
    console.log(`WARN: Eleventy Plugin (${package_.name}) Compatibility: ${error.message}`);
  }

  if (typeof options_ === 'function') {
    options_ = (options_)(sass);
  }

  let { sassOptions = {}, templateFormats = ['sass', 'scss'] } = options_;

  sassOptions = Object.assign({
    loadPaths: ['node_modules']
  }, sassOptions);

  if (sassOptions.sourceMap) {
    sassOptions.sourceMapIncludeSources = true;
  }

  eleventyConfig.addTemplateFormats(templateFormats);

  eleventyConfig.addExtension(templateFormats, {
    outputFileExtension: 'css',

    compileOptions: {
      cache: false,

      permalink: (inputContent, inputPath) => {
        if (path.parse(inputPath).name.startsWith('_')) {
          return false;
        }
      }
    },

    compile: (inputContent, inputPath) => {
      sassOptions.loadPaths.unshift(path.parse(inputPath).dir || '.');

      const { css, sourceMap } = compiler.compileString(inputContent, sassOptions);

      sassOptions.loadPaths.shift();

      return () => {
        if (sourceMap === undefined) {
          return css;
        }

        const sourceMapData = Buffer.from(JSON.stringify(sourceMap)).toString('base64');

        return `${css}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${sourceMapData} */`;
      };
    }
  });
};
