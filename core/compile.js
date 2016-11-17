
import fs from 'fs';
import path from 'path';
import compiler from './build/prod';

let dir = process.cwd();
if (!fs.lstatSync(dir).isDirectory()) {
  dir = path.dirname(dir);
}

compiler(dir)

console.log('[weave] bundling modules...')
