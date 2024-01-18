import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import WebpackDevServer from 'webpack-dev-server';
import { loadCustomConfig } from '../server/loadConfig';
import * as logger from '../logger';
import { process_CWD, baseUrl, staticDirectories, protocol, host, port } from '../constants';
import createEvalSourceMapMiddleware from '../webpack/dev-server-middlewares/createEvalSourceMapMiddleware';
import createClientConfig from '../webpack/client';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { blue } from '../logger/terminal-color';

export interface DevCLIOptions {
  /** Custom config path. Can be customized with `--config` option */
  config?: string;
}

export async function dev(cliOptions: Partial<DevCLIOptions> = {}): Promise<void> {
  logger.info('Starting the development server...');

  const props = await loadCustomConfig({ customConfigFilePath: cliOptions?.config });

  let config: webpack.Configuration = merge(await createClientConfig(props, true, false), {
    watchOptions: {
      ignored: /node_modules\/(?!cushy)/,
      poll: false,
    },
    infrastructureLogging: {
      // Reduce log verbosity, see https://github.com/facebook/docusaurus/pull/5420#issuecomment-906613105
      level: 'warn',
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../webpack/templates/index.html.template.ejs'),
        // So we can define the position where the scripts are injected.
        // inject: false,
        filename: 'index.html',
        title: '--cushy--',
        // headTags,
        // preBodyTags,
        // postBodyTags,
      }),
    ],
  });

  const compiler = webpack(config);

  compiler.hooks.done.tap('done', (stats) => {
    const errorsWarnings = stats.toJson('errors-warnings');
    console.error(errorsWarnings);
  });

  // https://webpack.js.org/configuration/dev-server
  const defaultDevServerConfig: WebpackDevServer.Configuration = {
    hot: true,
    liveReload: false,
    client: {
      progress: true,
      overlay: {
        warnings: false,
        errors: true,
      },
      webSocketURL: {
        hostname: '0.0.0.0',
        port: 0,
      },
    },
    headers: {
      'access-control-allow-origin': '*',
    },
    devMiddleware: {
      publicPath: baseUrl,
      // Reduce log verbosity, see https://github.com/facebook/docusaurus/pull/5420#issuecomment-906613105
      stats: 'summary',
    },
    static: staticDirectories.map((dir) => ({
      publicPath: baseUrl,
      directory: path.resolve(process_CWD, dir),
      watch: {
        // Useful options for our own monorepo using symlinks!
        // See https://github.com/webpack/webpack/issues/11612#issuecomment-879259806
        followSymlinks: true,
        ignored: /node_modules\/(?!cushy)/,
        usePolling: false,
        interval: undefined,
      },
    })),
    // ...(httpsConfig && {
    //   server:
    //     typeof httpsConfig === 'object'
    //       ? {
    //           type: 'https',
    //           options: httpsConfig,
    //         }
    //       : 'https',
    // }),
    historyApiFallback: {
      rewrites: [{ from: /\/*/, to: baseUrl }],
    },
    allowedHosts: 'all',
    host,
    port,
    setupMiddlewares: (middlewares, devServer) => {
      // This lets us fetch source contents from webpack for the error overlay.
      middlewares.unshift(createEvalSourceMapMiddleware(devServer));
      return middlewares;
    },
  };

  const devServer = new WebpackDevServer(defaultDevServerConfig, compiler);
  devServer.startCallback(() => {
    const appUrl = `${protocol}://${host}:${port}`;
    logger.bootstrap(` - Local:        ${blue(appUrl)}`);
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      console.info('Stop server.');
      process.exit();
    });
  });
}
