import fs from 'fs-extra';
import path from 'path';
import { md5 } from '../server.utils';

/**
 * 生成文件缓存
 */
const fileHash = new Map<string, string>();

export async function generate(generatedDir: string, file: string, content: string, skipCache: boolean = process.env.NODE_ENV === 'production'): Promise<void> {
  const filepath = path.resolve(generatedDir, file);

  if (skipCache) {
    await fs.outputFile(filepath, content);
    // Cache still needs to be reset, otherwise, writing "A", "B", and "A" where
    // "B" skips cache will cause the last "A" not be able to overwrite as the
    // first "A" remains in cache. But if the file never existed in cache, no
    // need to register it.
    if (fileHash.get(filepath)) {
      fileHash.set(filepath, md5(content));
    }
    return;
  }

  let lastHash = fileHash.get(filepath);

  // If file already exists but it's not in runtime cache yet, we try to
  // calculate the content hash and then compare. This is to avoid unnecessary
  // overwriting and we can reuse old file.
  if (!lastHash && (await fs.pathExists(filepath))) {
    const lastContent = await fs.readFile(filepath, 'utf8');
    lastHash = md5(lastContent);
    fileHash.set(filepath, lastHash);
  }

  const currentHash = md5(content);

  if (lastHash !== currentHash) {
    await fs.outputFile(filepath, content);
    fileHash.set(filepath, currentHash);
  }
}
