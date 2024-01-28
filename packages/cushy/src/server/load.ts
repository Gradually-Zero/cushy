import { loadConfig } from './loadConfig';
import { loadRoute } from './loadRoute';

export async function load(configFilePath?: string) {
  const config = await loadConfig(configFilePath);

  loadRoute(config.root);
}
