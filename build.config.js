const esbuild = require('esbuild');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const postcss = require('esbuild-postcss');

const package = require('./package.json');

const MANIFEST_PATH = './src/manifest.json';
const OUTDIR = './dist';

const BACKGROUND_OUTDIR = 'background';

const POPUP_OUTDIR = 'popup';
const POPUP_INDEX = path.join(OUTDIR, POPUP_OUTDIR, 'index.html');

const IS_DEV =
  /(local-)?dev(elopment)?/.exec(process.env?.NODE_ENV ?? '') != null;

console.log('Building in Enviroment:', IS_DEV ? 'Development' : 'Production');

fse.copySync('./static', OUTDIR);

fs.mkdirSync(path.join(OUTDIR, BACKGROUND_OUTDIR), { recursive: true });
fs.mkdirSync(path.join(OUTDIR, POPUP_OUTDIR), { recursive: true });

const manifest = require(MANIFEST_PATH);

const files_to_inject = {
  js: [],
  css: [],
  matches: ['<all_urls>'],
};

esbuild.build({
  entryPoints: ['./src/background/index.ts'],
  bundle: true,
  minify: !IS_DEV,
  outdir: path.join(OUTDIR, BACKGROUND_OUTDIR),
  external: Object.keys(package?.dependencies ?? {}),
  plugins: [postcss()],
});

files_to_inject.js.push(path.join(BACKGROUND_OUTDIR, 'index.js'));
// files_to_inject.css.push(path.join(BACKGROUND_OUTDIR, "index.css"));

fs.copyFileSync('./src/popup/index.html', POPUP_INDEX);

esbuild.build({
  entryPoints: ['src/popup/index.tsx'],
  bundle: true,
  minify: !IS_DEV,
  format: 'esm',
  outdir: path.join(OUTDIR, POPUP_OUTDIR),
  loader: { '.ts': 'tsx' },
  external: Object.keys(package?.dependencies ?? {}),
  plugins: [postcss()],
});

manifest.action.default_popup = path.join(
  POPUP_OUTDIR,
  path.basename(POPUP_INDEX)
);
if (!Array.isArray(manifest.content_scripts)) manifest.content_scripts = [];
manifest.content_scripts.push(files_to_inject);

fs.writeFileSync(path.join(OUTDIR, 'manifest.json'), JSON.stringify(manifest));
