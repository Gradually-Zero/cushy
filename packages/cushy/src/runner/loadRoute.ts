import fs from 'fs-extra';
import path from 'path';
import { generate } from './generate';
import { md5 } from '../runner_utils';
import * as logger from '../runner_logger';
import { generatedDir } from '../runner.constants';
import { blue } from '../runner_logger/terminal-color';

const FilenameExtension = ['.md', '.mdx'];
const excludeSpecifyFiles: RegExp[] = [];
const excludeSpecifyDirs: RegExp[] = [/node_modules/];

export function loadRoute(root: string) {
  if (!(fs.existsSync(root) && fs.statSync(root).isDirectory())) {
    logger.error(`${blue(root)} is not exist, or not directory.`);
    throw new Error();
  }

  const files: { [file_key: string]: Record<string, string> } = {};

  iterateFiles(root, (fileRelativePath, fileAbsolutePath) => {
    const file_key = createFileKey(fileRelativePath);
    const file_slash_path = slash(fileRelativePath);

    if (!isExcluded(file_slash_path, excludeSpecifyFiles)) {
      const importName = createImportName(file_key);
      files[file_key] = {
        importName,
        importStatement: syncImport(importName, slash(path.relative(generatedDir, fileAbsolutePath))),
      };
    }
  });

  let importContent = '';
  let hasRootPath = false;
  let firstFilePath = '';

  const routes = Object.entries(files).map(([path, file], index) => {
    importContent += file?.importStatement + '\n';

    if (index === 0) {
      firstFilePath = path;
    }

    if (path === 'index') {
      hasRootPath = true;
      return `<Route path="/" element={React.createElement(${file.importName})} />`;
    }

    return `<Route path="${path}" element={React.createElement(${file.importName})} />`;
  });

  if (!hasRootPath) {
    routes.push(`<Route path="/" element={<Navigate to="${firstFilePath ?? '/'}" />} />`);
  }

  /**
   * 生成 routes.js
   * e.g. import Example from './中文.md';
   */
  let routesContent = '';
  routesContent += `import React from 'react';\n`;
  routesContent += `import { Routes, Route, Navigate } from 'react-router-dom';\n`;
  routesContent += importContent;
  routesContent += `
export const RouteNodes = (
  <Routes>
    ${routes.join('\n    ')}
  </Routes>
);\n`;

  generate(generatedDir, 'routes.js', routesContent);
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

function createFileKey(file: string) {
  return slash(stripFilenameExtension(file));
}

const syncImport = (importName: string, path: string) => `import ${importName} from '${path}';`;

const createImportName = (key: string) => {
  const NAME_FORMAT = '__page_{md5}__';
  return NAME_FORMAT.replace('{md5}', md5(key));
};
