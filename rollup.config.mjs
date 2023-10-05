import path from 'path'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import { dts } from 'rollup-plugin-dts'

const getOutputFile = (basePath, { outputDir, name, extension }) => {
  return path.resolve(basePath, outputDir, `${name}.${extension}`)
}

// Extension Information
const CJS_FILE = {
  extension: 'cjs',
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
const DCTS_FILE = {
  extension: 'd.cts',
  format: 'cjs',
  name: 'index',
  outputDir: 'types',
}
const DMTS_FILE = {
  extension: 'd.mts',
  format: 'es',
  name: 'index',
  outputDir: 'types',
}

const INPUT_SRC_FILE = 'src/index.js'
const INPUT_DTS_FILE = 'dist/tmp/types/index.d.ts'

// Resolve import * as plugin from './plugins'
const RESOLVE_IMPORT_ALL = 'resolveImportAll'

// Unminified transpiler files
const BASE_DIR = 'dist'
const OUTPUT_CJS_FILE = getOutputFile(BASE_DIR, CJS_FILE)
const OUTPUT_MJS_FILE = getOutputFile(BASE_DIR, MJS_FILE)
const OUTPUT_DCTS_FILE = getOutputFile(BASE_DIR, DCTS_FILE)
const OUTPUT_DMTS_FILE = getOutputFile(BASE_DIR, DMTS_FILE)

// getBabelOutputPlugin configuration
const BABEL_CONFIG_FILE = path.resolve('.', 'babel.config.json')

export default defineConfig([
  {
    input: INPUT_SRC_FILE,
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
  },
  {
    input: INPUT_DTS_FILE,
    output: [
      {
        file: OUTPUT_DCTS_FILE,
        format: DCTS_FILE.format,
      },
      {
        file: OUTPUT_DMTS_FILE,
        format: DMTS_FILE.format,
      },
    ],
    plugins: [dts()],
  },
])
