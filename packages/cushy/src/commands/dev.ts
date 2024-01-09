import { loadCustomCushyConfig } from '../server/config';
import logger from '../logger';

export interface DevCLIOptions {
  /** Custom config path. Can be customized with `--config` option */
  config?: string;
}

export async function dev(cliOptions: Partial<DevCLIOptions> = {}): Promise<void> {
  logger.info('Starting the development server...');

  const props = await loadCustomCushyConfig({ customConfigFilePath: cliOptions?.config });

  console.log('props', props);

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      console.info('Stop server.');
      process.exit();
    });
  });
}
