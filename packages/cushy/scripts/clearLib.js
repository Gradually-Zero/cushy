import fs from 'fs-extra';
import path from 'path';

const libDir = path.join(process.cwd(), 'lib');

/** 删除 lib 目录 */
fs.removeSync(libDir);
