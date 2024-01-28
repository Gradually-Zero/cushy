import path from 'path';
import fs from 'fs-extra';
import WebpackBar from 'webpackbar';
import { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WEBPACK_OUTPUT_DIR_NAME, baseUrl, generatedDir, process_CWD } from '../server.constants';
import type { Configuration } from 'webpack';

export async function createClientWebpackConfig(): Promise<Configuration> {
  const name = 'client';
  const mode = 'development';
  const hydrate = true;

  const config: Configuration = {
    entry: path.resolve(__dirname, '../client/client-entry.js'),
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/i,
          exclude: excludeJS,
          use: [
            {
              loader: require.resolve('swc-loader'),
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                    },
                  },
                  target: 'es2017',
                },
                module: {
                  type: 'es6',
                },
              },
            },
          ],
        },
        {
          test: /\.mdx?$/,
          use: [
            // {loader: 'babel-loader', options: {}},
            {
              loader: require.resolve('@mdx-js/loader'),
              /** @type {import('@mdx-js/loader').Options} */
              options: {
                /* jsxImportSource: …, otherOptions… */
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../server.webpack/templates/index.html.template.ejs'),
        // So we can define the position where the scripts are injected.
        // inject: false,
        filename: 'index.html',
        title: 'Cushy',
        // headTags,
        // preBodyTags,
        // postBodyTags,
      }),
      new DefinePlugin({
        'process.env.HYDRATE_CLIENT_ENTRY': JSON.stringify(hydrate),
      }),
      // new ChunkAssetPlugin(),
      // Show compilation progress bar and build time.
      new WebpackBar({
        name: 'Client',
      }),
    ],
    mode,
    name,
    watchOptions: {
      ignored: /node_modules\/(?!cushy)/,
      poll: false,
    },
    resolve: {
      unsafeCache: false, // Not enabled, does not seem to improve perf much
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      symlinks: true, // See https://github.com/facebook/docusaurus/issues/3272
      roots: [
        // Allow resolution of url("/fonts/xyz.ttf") by webpack
        // See https://webpack.js.org/configuration/resolve/#resolveroots
        // See https://github.com/webpack-contrib/css-loader/issues/1256
        // ...siteConfig.staticDirectories.map((dir) => path.resolve(siteDir, dir)),
        // siteDir,
        process_CWD,
      ],
      alias: {
        '@site': process_CWD,
        '@generated': generatedDir,
        // ...(await loadDocusaurusAliases()),
        // ...themeAliases,
      },
      // This allows you to set a fallback for where Webpack should look for
      // modules. We want `@docusaurus/core` own dependencies/`node_modules` to
      // "win" if there is conflict. Example: if there is core-js@3 in user's
      // own node_modules, but core depends on core-js@2, we should use
      // core-js@2.
      modules: [path.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules', path.resolve(await fs.realpath(process.cwd()), 'node_modules')],
    },
    resolveLoader: {
      modules: ['node_modules', path.join(process_CWD, 'node_modules')],
    },
    cache: {
      type: 'filesystem',
      // Can we share the same cache across locales?
      // Exploring that question at https://github.com/webpack/webpack/issues/13034
      name: `cushy-${name}-${mode}`,

      // When one of those modules/dependencies change (including transitive
      // deps), cache is invalidated
      buildDependencies: {
        config: [__filename, path.join(__dirname, 'client.config.js')],
      },
    },
    output: {
      pathinfo: false,
      path: path.resolve(process_CWD, WEBPACK_OUTPUT_DIR_NAME),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: baseUrl,
      hashFunction: 'xxhash64',
    },
    devtool: 'eval-cheap-module-source-map',
    infrastructureLogging: {
      // Reduce log verbosity, see https://github.com/facebook/docusaurus/pull/5420#issuecomment-906613105
      level: 'warn',
    },
    // Don't throw warning when asset created is over 250kb
    performance: {
      hints: false,
    },

    optimization: {
      removeAvailableModules: false,
      // Only minimize client bundle in production because server bundle is only
      // used for static site generation
      minimize: false,
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
  };

  return config;
}

const clientDir = path.join(__dirname, '..', 'client');

function excludeJS(modulePath: string): boolean {
  // Always transpile client dir
  if (modulePath.startsWith(clientDir)) {
    return false;
  }
  // Don't transpile node_modules except any cushy npm package
  return modulePath.includes('node_modules') && !/cushy(?:(?!node_modules).)*\.jsx?$/.test(modulePath);
}
