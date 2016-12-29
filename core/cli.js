
import fs from 'fs';
import path from 'path';
import temp from 'temporary';
import compiler from './build/dev';

let devServer;

const arg = process.argv.slice(2);
const tmp = new temp.Dir();

const rmdir = (tmp) => {
  try {
    if ( typeof tmp !== 'undefined') tmp.rmdirSync();
  } catch(e) { }
}

const clean = (e) => {
  if (e) {
    console.log('force stopping server => ', e);
  } else {
    console.log('stopping dev server...');
  }
  rmdir(tmp);
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

compiler(dir, tmp.path);

