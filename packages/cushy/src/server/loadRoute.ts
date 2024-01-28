import fs from 'fs-extra';
import { createHash } from 'crypto';
import path from 'path';
import { generatedDir } from '../server.constants';
import * as logger from '../server.logger';
import { blue } from '../server.logger/terminal-color';

const FilenameExtension = ['.md', '.mdx'];
const excludeSpecifyFiles: RegExp[] = [];
const excludeSpecifyDirs: RegExp[] = [/node_modules/];

export function loadRoute(root: string) {
  if (!(fs.existsSync(root) && fs.statSync(root).isDirectory())) {
    logger.error(`${blue(root)} is not exist, or not directory.`);
    throw new Error();
  }

  const files: { [route_path: string]: Record<string, string> } = {};

  iterateFiles(root, (fileRelativePath, fileAbsolutePath) => {
    const route_path = createRoutePath(fileRelativePath);
    const file_slash_path = slash(fileRelativePath);

    if (!isExcluded(file_slash_path, excludeSpecifyFiles)) {
      const importName = createImportName(route_path);
      files[route_path] = {
        importName,
        importStatement: syncImport(importName, slash(path.relative(generatedDir, fileAbsolutePath))),
      };
    }
  });

  let routesContentImport = 'import React from "react";\n';

  const routes = Object.entries(files).map(([path, file]) => {
    routesContentImport += file?.importStatement + '\n';
    return { path, element: `React.createElement(${file.importName})` };
  });

  // 生成 routes.js
  // import Example from './中文.md';
  generate(generatedDir, 'routes.js', routesContentImport + `\nexport const routes = ${JSON.stringify(routes)}`.replace(componentReg, componentReplacer));
}

interface IteratorType {
  (fileRelativePath: string, fileAbsolutePath: string): void;
}

/**
 * 从文件夹遍历文件
 */
function iterateFiles(current_path: string, iterator: IteratorType, parent_path?: string): void {
  const parent_dir = parent_path || current_path;

  for (const filename of fs.readdirSync(current_path)) {
    const peddling = path.resolve(current_path, filename);
    const peddling_stat = fs.lstatSync(peddling);

    if (peddling_stat.isDirectory() && !isExcluded(peddling, excludeSpecifyDirs)) {
      iterateFiles(peddling, iterator, parent_dir);
    } else if (peddling_stat.isFile() && FilenameExtension.includes(path.extname(peddling))) {
      iterator(path.relative(parent_dir, peddling), peddling);
    }
  }
}

/**
 * 判断是否被排除
 */
function isExcluded(str: string, exclude: RegExp[] = []) {
  for (const excludeRegExp of exclude || []) {
    if (str && excludeRegExp instanceof RegExp && excludeRegExp.test(str)) {
      return true;
    }
  }
  return false;
}

/**
 * foo\\bar ➔ foo/bar
 * https://github.com/sindresorhus/slash
 */
function slash(path: string) {
  const isExtendedLengthPath = path.startsWith('\\\\?\\');
  if (isExtendedLengthPath) {
    return path;
  }
  return path.replace(/\\/g, '/');
}

/**
 * 脱去后缀
 */
function stripFilenameExtension(file: string) {
  // 数字大小字母组成的后缀
  return file.replace(/\.[a-z0-9]+$/i, '');
}

function createRoutePath(file: string) {
  return slash(stripFilenameExtension(file));
}

/**
 * 生成文件缓存
 */
const fileHash = new Map<string, string>();

async function generate(generatedDir: string, file: string, content: string, skipCache: boolean = process.env.NODE_ENV === 'production'): Promise<void> {
  const filepath = path.resolve(generatedDir, file);

  if (skipCache) {
    await fs.outputFile(filepath, content);
    // Cache still needs to be reset, otherwise, writing "A", "B", and "A" where
    // "B" skips cache will cause the last "A" not be able to overwrite as the
    // first "A" remains in cache. But if the file never existed in cache, no
    // need to register it.
    if (fileHash.get(filepath)) {
      fileHash.set(filepath, createHash('md5').update(content).digest('hex'));
    }
    return;
  }

  let lastHash = fileHash.get(filepath);

  // If file already exists but it's not in runtime cache yet, we try to
  // calculate the content hash and then compare. This is to avoid unnecessary
  // overwriting and we can reuse old file.
  if (!lastHash && (await fs.pathExists(filepath))) {
    const lastContent = await fs.readFile(filepath, 'utf8');
    lastHash = createHash('md5').update(lastContent).digest('hex');
    fileHash.set(filepath, lastHash);
  }

  const currentHash = createHash('md5').update(content).digest('hex');

  if (lastHash !== currentHash) {
    await fs.outputFile(filepath, content);
    fileHash.set(filepath, currentHash);
  }
}

const md5 = (str: string) => createHash('md5').update(str).digest('hex');

const syncImport = (importName: string, path: string) => `import ${importName} from "${path}"`;

const createImportName = (key: string) => {
  const NAME_FORMAT = '__page_{md5}__';
  return NAME_FORMAT.replace('{md5}', md5(key));
};

const componentReg = /"(?:element)":("(.*?)")/g;

function componentReplacer(str: string, replaceStr: string, path: string) {
  return str.replace(replaceStr, path);
}
