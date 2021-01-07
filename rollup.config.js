const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');
const allDependancies = Object.keys(pkg.peerDependencies);

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} Chart.js Contributors
 * Released under the ${pkg.license} license
 */`;

const globals = {
  'chart.js': 'Chart',
  'chart.js/helpers': 'Chart.helpers'
};

allDependancies.push('chart.js/helpers');

module.exports = [
  {
    input: 'src/plugin.js',
    output: ['.js', '.min.js'].map((suffix) => {
      const config = {
        name: 'ChartDataLabels',
        file: `dist/${pkg.name}${suffix}`,
        banner: banner,
        format: 'umd',
        indent: false,
        plugins: [],
        globals: globals
      };

      if (suffix.match(/\.min\.js$/)) {
        config.plugins.push(
          terser({
            output: {
              comments: /^!/
            }
          })
        );
      }

      return config;
    }),
    external: allDependancies
  },
  {
    input: 'src/plugin.js',
    output: ['.js', '.min.js'].map((suffix) => {
      const config = {
        name: 'ChartDataLabels',
        file: `dist/${pkg.name}.esm${suffix}`,
        banner: banner,
        format: 'esm',
        indent: false,
        plugins: [],
        globals: globals
      };

      if (suffix.match(/\.min\.js$/)) {
        config.plugins.push(
          terser({
            output: {
              comments: /^!/
            }
          })
        );
      }

      return config;
    }),
    external: allDependancies
  }
];
