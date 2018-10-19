import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

// https://codeburst.io/deploy-react-component-as-an-npm-library-d396efc25122

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'index',
			file: pkg.main,
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			babel({ 
				// otherwise Babel will convert our modules to CommonJS before Rollup gets a chance to do its thing
				exclude: 'node_modules/**',
				presets: ['@babel/env', '@babel/preset-react']
			}),
			commonjs(), // so Rollup can convert `ms` to an ES module
		],
		external: [
			'react',
			'prop-types',
		],
		globals: {
			react: "React"
		}
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	// {
	// 	input: 'src/index.js',
	// 	external: ['ms'],
	// 	output: [
	// 		{ file: pkg.cjs, format: 'cjs' },
	// 		{ file: pkg.module, format: 'es' }
	// 	]
	// }
];
