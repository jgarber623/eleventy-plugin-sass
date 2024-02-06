const { Buffer } = require('node:buffer');
const path = require('node:path');

const sass = require('sass');

const packageConfig = require('./package.json');

const compiler = sass.initCompiler();

module.exports = function(eleventyConfig, options = {}) {
  try {
    eleventyConfig.versionCheck(packageConfig['11ty'].compatibility);
  } catch (error) {
    console.log(`WARN: Eleventy Plugin (${packageConfig.name}) Compatibility: ${error.message}`);
  }

  if (typeof options === 'function') {
    options = (options)(sass);
  }

  let { sassOptions = {}, templateFormats = ['sass', 'scss'] } = options;

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

      permalink: function(inputContent, inputPath) {
        if (path.parse(inputPath).name.startsWith('_')) {
          return false;
        }
      }
    },

    compile: function(inputContent, inputPath) {
      sassOptions.loadPaths.unshift(path.parse(inputPath).dir || '.');

      const { css, sourceMap } = compiler.compileString(inputContent, sassOptions);

      sassOptions.loadPaths.shift();

      return function() {
        if (sourceMap === undefined) {
          return css;
        }

        const sourceMapData = Buffer.from(JSON.stringify(sourceMap)).toString('base64');

        return `${css}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${sourceMapData} */`;
      };
    }
  });
};
