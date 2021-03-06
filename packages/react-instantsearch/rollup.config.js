import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

const clear = x => x.filter(Boolean);

const version = process.env.VERSION || 'UNRELEASED';
const algolia = '© Algolia, inc.';
const link = 'https://community.algolia.com/react-instantsearch';
const createLicence = () =>
  `/*! React InstantSearch ${version} | ${algolia} | ${link} */`;

const plugins = [
  babel({
    exclude: ['../../node_modules/**', 'node_modules/**'],
    plugins: ['external-helpers'],
  }),
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    namedExports: {
      'algoliasearch-helper': [
        'version',
        'AlgoliaSearchHelper',
        'SearchParameters',
        'SearchResults',
        'url',
      ],
    },
  }),
  globals(),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  filesize(),
];

const createConfiguration = ({ input, name, minify = false } = {}) => ({
  input,
  external: ['react', 'react-dom'],
  output: {
    file: `dist/umd/${name}${minify ? '.min' : ''}.js`,
    name: `ReactInstantSearch.${name}`,
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    banner: createLicence(),
    sourcemap: true,
  },
  plugins: plugins.concat(
    clear([
      minify &&
        uglify({
          output: {
            preamble: createLicence(),
          },
        }),
    ])
  ),
});

export default [
  // Core
  createConfiguration({
    input: 'index.umd.js',
    name: 'Core',
  }),
  createConfiguration({
    input: 'index.umd.js',
    name: 'Core',
    minify: true,
  }),

  // DOM
  createConfiguration({
    input: 'dom.js',
    name: 'Dom',
  }),
  createConfiguration({
    input: 'dom.js',
    name: 'Dom',
    minify: true,
  }),

  // Connectors
  createConfiguration({
    input: 'connectors.js',
    name: 'Connectors',
  }),
  createConfiguration({
    input: 'connectors.js',
    name: 'Connectors',
    minify: true,
  }),
];
