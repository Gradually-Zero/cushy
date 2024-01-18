import path from 'path';
import merge from 'webpack-merge';
import WebpackBar from 'webpackbar';
import { DefinePlugin } from 'webpack';
import * as logger from '../logger';
import { createBaseConfig } from './base';
import ChunkAssetPlugin from './plugins/ChunkAssetPlugin';
import type { Configuration } from 'webpack';
import type { LoadContext } from '../server/loadConfig';

export default async function createClientConfig(props: ClientConfigProps, minify: boolean = true, hydrate: boolean = true): Promise<Configuration> {
  const isBuilding = process.argv[2] === 'build';
  const config = await createBaseConfig(props, false, minify);

  const clientConfig = merge(config, {
    entry: path.resolve(__dirname, '../client/client-entry.js'),

    // module from base

    plugins: [
      new DefinePlugin({
        'process.env.HYDRATE_CLIENT_ENTRY': JSON.stringify(hydrate),
      }),
      // new ChunkAssetPlugin(),
      // Show compilation progress bar and build time.
      new WebpackBar({
        name: 'Client',
      }),
    ],

    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
  });

  // When building, include the plugin to force terminate building if errors
  // happened in the client bundle.
  if (isBuilding) {
    clientConfig.plugins?.push({
      apply: (compiler) => {
        compiler.hooks.done.tap('client:done', (stats) => {
          if (stats.hasErrors()) {
            const errorsWarnings = stats.toJson('errors-warnings');
            logger.error(`Client bundle compiled with errors therefore further build is impossible.\n${errorsWarnings}`);
            process.exit(1);
          }
        });
      },
    });
  }

  return clientConfig;
}

export type ClientConfigProps = LoadContext & {};
