// @ts-ignore
import { builtinModules as builtins } from 'module'

interface Options {
  alias: { [specifier: string]: string }
}

export const resolver = ({ alias = {} }: Partial<Options> = {}) => async ({
  specifier,
  parentURL
}: {
  specifier: string
  parentURL: URL
}): Promise<{ url: URL }> => {
  if (alias[specifier]) specifier = alias[specifier]

  if (builtins.includes(specifier)) return { url: new URL(specifier, 'builtin://') }
  if (!/^\.{0,2}\//.test(specifier)) return { url: new URL(specifier, 'package://') }
  return { url: new URL(specifier, parentURL) }
}
