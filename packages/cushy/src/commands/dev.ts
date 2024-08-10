import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import WebpackDevServer from 'webpack-dev-server';
import * as logger from '../runner_logger';
import { blue } from '../runner_logger/terminal-color';
import { load } from '../runner/load';
import { createMdsiteWebpackConfig } from '../runner_webpack/mdsite.config';
import { process_CWD, baseUrl, staticDirectories, protocol, host, port } from '../runner.constants';
import createEvalSourceMapMiddleware from '../runner_webpack/dev_server_middlewares/createEvalSourceMapMiddleware';

export interface DevCLIOptions {
  /** Custom config path. Can be customized with `--config` option */
  configFilePath?: string;
}

export async function dev(cliOptions: Partial<DevCLIOptions> = {}): Promise<void> {
  logger.info('Starting the development server...');

  load(cliOptions?.configFilePath);

  const compiler = webpack(await createMdsiteWebpackConfig());

  compiler.hooks.done.tap('done', (stats) => {
    const errorsWarnings = stats.toJson('errors-warnings');
    logger.error(errorsWarnings);
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
      logger.info('Stop server.');
      process.exit();
    });
  });
}
