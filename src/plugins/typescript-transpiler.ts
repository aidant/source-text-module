import * as ts from 'typescript'
import { Toolkit } from '../run-plugins'

export const typescriptTranspiler = (tsOptions: ts.TranspileOptions) => async (
  options: { code: string; ext: string },
  toolkit: Toolkit
) => {
  if (options.ext !== '.ts') return toolkit.next()
  const output = ts.transpileModule(options.code, tsOptions)
  return { code: output.outputText, ext: '.js' }
}
