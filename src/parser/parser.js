import fs from 'fs';
import path from 'path';
import Tracer from 'pegjs-backtrace';

import parser from './peg-parser';
import { TablescriptError } from '../error';

export const findAndParseFile = (context, filename) => {
  const paths = (process.env.TS_PATH || '').split(':');
  return paths.reduce((result, p) => result || parseFileIfExists(context, p, filename), undefined);
};

const readFile = (context, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    throw new TablescriptError(e.name, e.message, context);
  }
};

const parseFileIfExists = (context, p, filename) => {
  const filePath = path.resolve(p, filename);
  return fs.existsSync(filePath) ? parse(filePath, readFile(context, filePath)) : undefined;
};

export const parseFile = filePath => {
  if (!fs.existsSync(filePath)) {
    throw new TablescriptError('IoError', 'File not found');
  }
  return parse(filePath, readFile(undefined, filePath));
};

const parse = (filePath, program) => {
  const tracer = new Tracer(program);
  try {
    return parser.parse(program, { tracer, path: filePath });
  } catch (e) {
    throw new TablescriptError(e.name, e.message, { path: filePath, line: e.location.start.line, column: e.location.start.column }, tracer.getBacktraceString());
  }
};
