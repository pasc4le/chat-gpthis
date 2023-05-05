const path = require('node:path');
const fs = require('node:fs');
const prettier = require('prettier');

const BASE_PATH = './';

const MANIFEST_PATH = path.join(BASE_PATH, 'src', 'manifest.json');
const PACKAGE_INFO_PATH = path.join(BASE_PATH, '/package.json');
const PRETTIER_RC_PATH = path.join(BASE_PATH, '.prettierrc.json');

const package = require(path.resolve(PACKAGE_INFO_PATH));
const manifest = require(path.resolve(MANIFEST_PATH));
const prettierOptions = require(path.resolve(PRETTIER_RC_PATH));

manifest.version = package.version;

fs.writeFileSync(
  MANIFEST_PATH,
  prettier.format(JSON.stringify(manifest), {
    ...prettierOptions,
    parser: 'json',
  })
);
