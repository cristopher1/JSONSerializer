import path from 'path'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'

const getOutputFile = (basePath, { outputDir, name, extension }) => {
  return path.resolve(basePath, outputDir, `${name}.${extension}`)
}

// Extension Information
const CJS_FILE = {
  extension: 'js',
  format: 'cjs',
  name: 'index',
  outputDir: 'cjs',
  babelEnvName: 'buildCommonJS',
}
const MJS_FILE = {
  extension: 'mjs',
  format: 'es',
  name: 'index',
  outputDir: 'esm',
  babelEnvName: 'buildESmodules',
}

const INPUT_FILE = 'src/index.js'

// Resolve import * as plugin from './plugins'
const RESOLVE_IMPORT_ALL = 'resolveImportAll'

// Unminified transpiler files
const BASE_DIR = 'dist'
const OUTPUT_CJS_FILE = getOutputFile(BASE_DIR, CJS_FILE)
const OUTPUT_MJS_FILE = getOutputFile(BASE_DIR, MJS_FILE)

// getBabelOutputPlugin configuration
const BABEL_CONFIG_FILE = path.resolve('.', 'babel.config.json')

export default defineConfig({
  input: INPUT_FILE,
  output: [
    {
      file: OUTPUT_CJS_FILE,
      format: CJS_FILE.format,
      sourcemap: true,
      plugins: [
        getBabelOutputPlugin({
          configFile: BABEL_CONFIG_FILE,
          envName: CJS_FILE.babelEnvName,
        }),
      ],
    },
    {
      file: OUTPUT_MJS_FILE,
      format: MJS_FILE.format,
      sourcemap: true,
      plugins: [
        getBabelOutputPlugin({
          configFile: BABEL_CONFIG_FILE,
          envName: MJS_FILE.babelEnvName,
        }),
      ],
    },
  ],
  external: [/node_module/],
  plugins: [
    babel({ envName: RESOLVE_IMPORT_ALL, babelHelpers: 'bundled' }),
    nodeResolve(),
  ],
})
