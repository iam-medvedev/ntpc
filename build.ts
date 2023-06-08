import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formats: esbuild.Format[] = ['cjs', 'esm'];

function getOutputFilename(format: esbuild.Format) {
  switch (format) {
    case 'esm':
      return `index.mjs`;
    default:
      return `index.js`;
  }
}

async function build() {
  for (const format of formats) {
    await esbuild.build({
      bundle: true,
      minify: true,
      entryPoints: ['./src/index.ts'],
      platform: 'node',
      outfile: path.resolve(__dirname, './dist', getOutputFilename(format)),
      format,
    });
  }
}

build();
