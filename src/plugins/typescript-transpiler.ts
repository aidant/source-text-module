import * as ts from 'typescript'

export const typescriptTranspiler = (tsOptions: ts.TranspileOptions) => async (options: {
  code: string
}) => {
  const output = ts.transpileModule(options.code, tsOptions)
  return { code: output.outputText }
}
