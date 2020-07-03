var webpack = require('webpack');
var path = require('path');

const tsImportPluginFactory = require('ts-import-plugin');


module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './build'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
		{
			test: /\.(jsx|tsx|js|ts)$/,
			loader: 'ts-loader',
			options: {
				transpileOnly: true,
				getCustomTransformers: () => ({
					before: [ tsImportPluginFactory([{ libraryName: 'antd', libraryDirectory: 'lib'}]) ]
				}),
				compilerOptions: {
					module: 'es2015'
				}
			},
			exclude: /node_modules/
		},	
	    { test: /\.css$/, use: ["style-loader", "css-loader" ]}
    ]
  },

};