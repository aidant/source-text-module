import { runPlugins, Toolkit } from './run-plugins'

export interface TranspilerOptions {
  code: string
  ext: string
}

export interface TranspilerResult {
  code: string
  ext: string
  meta?: object
}

export type Transpiler = (
  options: TranspilerOptions,
  toolkit: Toolkit
) => Promise<symbol | TranspilerResult>

export const runTranspilers = (
  transpilers: Transpiler[],
  options: TranspilerOptions
) =>
  runPlugins<Transpiler, TranspilerOptions, TranspilerResult>(
    transpilers,
    options
  )
