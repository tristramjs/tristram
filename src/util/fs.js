/* @flow */
import fs from 'fs';
import util from 'util';

const appendFile = util.promisify(fs.appendFile);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);
const readfile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const writeFile = util.promisify(fs.writeFile);

export { appendFile, exists, mkdir, readdir, readfile, unlink, rmdir, writeFile };
