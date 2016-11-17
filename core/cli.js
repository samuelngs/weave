
import fs from 'fs';
import path from 'path';
import temp from 'temporary';
import compiler from './build/dev';

const arg = process.argv.slice(2);
const tmp = new temp.Dir();

const clean = function(e) {
  if (e) {
    console.log('force stopping server => ', e);
  } else {
    console.log('stopping dev server...');
  }
  tmp.rmdir();
  process.exit(0);
}

process.stdin.resume();
process.on('exit', clean);
process.on('SIGINT', clean);
process.on('uncaughtException', clean);

let dir = arg[0] ? path.resolve(arg[0]) : process.cwd();
if (!fs.lstatSync(dir).isDirectory()) {
  dir = path.dirname(dir);
}

compiler(dir, tmp.path)

