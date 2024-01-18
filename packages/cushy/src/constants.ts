// siteDir
export const process_CWD = process.cwd();

export const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const;

export const baseUrl = '/';
export const staticDirectories = ['static'];
export const protocol = 'http';
export const host = 'localhost';
export const port = 3000;

/**
 * This does not have extensions, so that we can substitute different ones
 * when resolving the path.
 */
export const DEFAULT_CONFIG_FILE_NAME = 'cushy.config';

// webpack output directory
export const WEBPACK_OUTPUT_DIR_NAME = 'build';

// generated files directory
export const GENERATED_FILES_DIR_NAME = '.cushy';
