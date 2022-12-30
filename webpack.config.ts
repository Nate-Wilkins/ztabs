import { SourceMapDevToolPlugin } from 'webpack';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import path from 'path';
import { EntryPoints } from './src/entry_points';

module.exports = {
  entry: {
    background: path.resolve(__dirname, EntryPoints.background.input),
    inject: path.resolve(__dirname, EntryPoints.inject.input),
    client: path.resolve(__dirname, EntryPoints.client.input),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },

  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
    new SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')],
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // Include type definition files.
              transpileOnly: false,
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        exclude: /\.?global\.css$/,
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
        include: /\.?global\.css$/,
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg|gltf|fbx)$/,
        use: ['file-loader'],
      },
    ],
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    fallback: {},
  },

  mode: 'development',
  devtool: false,
};
