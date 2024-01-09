export const CWD = process.cwd();

export const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const;

/**
 * Can be overridden with cli option `--config`. Code should generally use
 * `context.siteConfigPath` instead (which is always absolute).
 *
 * This does not have extensions, so that we can substitute different ones
 * when resolving the path.
 */
export const DEFAULT_CONFIG_FILE_NAME = 'cushy.config';
