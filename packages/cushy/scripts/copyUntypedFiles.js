import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';

/**
 * 复制文件到 lib
 * tsc 编译不会处理不相关的文件
 * 例如: index.html.template.ejs
 */

const srcDir = path.join(process.cwd(), 'src');
const libDir = path.join(process.cwd(), 'lib');

const ignoredPattern = /(?:__tests__|\.tsx?$)/;

async function copy() {
  await fs.copy(srcDir, libDir, {
    filter(testedPath) {
      return !ignoredPattern.test(testedPath);
    },
  });
}

if (process.argv.includes('--watch')) {
  const watcher = chokidar.watch(srcDir, {
    ignored: ignoredPattern,
    ignoreInitial: true,
    persistent: true,
  });
  ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach((event) => watcher.on(event, copy));
} else {
  await copy();
}
