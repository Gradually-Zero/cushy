import path from 'path';
import fs from 'fs-extra';
import Joi from 'joi';
import jiti from 'jiti';
import * as logger from '../runner_logger';
import { blue } from '../runner_logger/terminal-color';
import { DEFAULT_CONFIG_FILE_NAME, process_CWD } from '../runner.constants';

export async function loadConfig(configFilePath?: string) {
  const config_path = configFilePath ? path.resolve(process_CWD, configFilePath) : await findConfig(process_CWD);

  if (!(await fs.pathExists(config_path))) {
    throw new Error(`Config file at "${config_path}" not found.`);
  }

  const importedConfig = await loadFreshModule(config_path);

  const loadedConfig: unknown = typeof importedConfig === 'function' ? await importedConfig() : await importedConfig;

  const siteConfig = validateConfig(loadedConfig, path.relative(process_CWD, config_path));

  return siteConfig;
}

async function findConfig(siteDir: string) {
  // We could support .mjs, .ts, etc. in the future
  const candidates = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'].map((ext) => DEFAULT_CONFIG_FILE_NAME + ext);
  const configPath = await findAsyncSequential(
    candidates.map((file) => path.join(siteDir, file)),
    fs.pathExists
  );

  if (!configPath) {
    logger.error('No config file found.');
    logger.info('Expected one of:');
    candidates.map((candidate) => {
      logger.line(`- ${candidate}`);
    });
    logger.line(`You can provide a custom config path with the ${blue('--config')} option.`);
    throw new Error();
  }
  return configPath;
}

/**
 * `Array#find` for async operations where order matters.
 * @param array The array to traverse.
 * @param predicate An async predicate to be called on every array item. Should
 * return a boolean indicating whether the currently element should be returned.
 * @returns The function immediately returns the first item on which `predicate`
 * returns `true`, or `undefined` if none matches the predicate.
 */
async function findAsyncSequential<T>(array: T[], predicate: (t: T) => Promise<boolean>): Promise<T | undefined> {
  for (const t of array) {
    if (await predicate(t)) {
      return t;
    }
  }
  return undefined;
}

/**
 * jiti is able to load ESM, CJS, JSON, TS modules
 */
async function loadFreshModule(modulePath: string): Promise<unknown> {
  try {
    if (typeof modulePath !== 'string') {
      throw new Error(`Invalid module path of type name=${modulePath}`);
    }
    const load = jiti(__filename, {
      // Transpilation cache, can be safely enabled
      cache: true,
      // Bypass Node.js runtime require cache
      // Same as "import-fresh" package we used previously
      requireCache: false,
      // Only take into consideration the default export
      // For now we don't need named exports
      // This also helps normalize return value for both CJS/ESM/TS modules
      interopDefault: true,
      // debug: true,
    });

    return load(modulePath);
  } catch (error) {
    throw new Error(`Cushy could not load module at path path=${modulePath}\nCause: ${(error as Error).message}`, { cause: error });
  }
}

export interface CushyConfig {
  patterns: string[];
  root: string;
}

const DEFAULT_CONFIG: Pick<CushyConfig, 'patterns' | 'root'> = {
  patterns: [],
  root: process_CWD,
};

const ConfigSchema = Joi.object<CushyConfig>({
  patterns: Joi.array().items(Joi.string()).default(DEFAULT_CONFIG.patterns),
  root: Joi.string().default(DEFAULT_CONFIG.root),
}).messages({
  'cushy.configValidationWarning': 'Cushy config validation warning. Field {#label}: {#warningMessage}',
});

function validateConfig(config: unknown, siteConfigPath: string): CushyConfig {
  const { error, warning, value } = ConfigSchema.validate(config, {
    abortEarly: false,
  });

  printWarning(warning);

  if (error) {
    const unknownFields = error.details.reduce((formattedError, err) => {
      if (err.type === 'object.unknown') {
        return `${formattedError}"${err.path.reduce((acc, cur) => (typeof cur === 'string' ? `${acc}.${cur}` : `${acc}[${cur}]`))}",`;
      }
      return formattedError;
    }, '');

    let formattedError = error.details.reduce(
      (accumulatedErr, err) => (err.type !== 'object.unknown' ? `${accumulatedErr}${err.message}\n` : accumulatedErr),
      ''
    );

    if (unknownFields) {
      logger.error(`${formattedError}These field(s) (${blue(unknownFields)}) are not recognized in ${blue(siteConfigPath)}.`);
      logger.line(`If you still want these fields to be in your configuration, put them in the "customFields" field.`);
      logger.line(`See https://cushy.io/docs/api/cushy-config/#customfields`);
      logger.line();
    } else {
      logger.error(formattedError);
    }
    throw new Error();
  } else {
    return value;
  }
}

/** Print warnings returned from Joi validation. */
function printWarning(warning?: Joi.ValidationError): void {
  if (warning) {
    const warningMessages = warning.details.map(({ message }) => message).join('\n');
    logger.warn(warningMessages);
  }
}
