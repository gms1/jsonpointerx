const path = require('path');

const pkg = require('./package.json');

const utc = new Date().toJSON();
const moduleName = 'jsonpointerx';

if (!pkg.module) {
  throw new Error(`property 'module'`);
}

module.exports = {
  input: `dist/${pkg.module}`,
  output: {
    name: moduleName,
    file: `dist/bundles/${pkg.name}.umd.js`,
    format: 'umd',
    banner: `/*!\n${pkg.name} ${pkg.version} ${utc} \n*/`,
    sourcemap: true,
  },

  context: 'this',
  plugins: [],
  treeshake: true,

  onwarn: function(warning) {
    // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    console.error(warning.message);
  }

}
