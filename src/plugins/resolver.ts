import path from 'path'
import { URL } from 'url'
import { promises as fs } from 'fs'
import Module from 'module'
import { allSettled } from '../all-settled.js'
const builtins = Module.builtinModules

export const resolver = ({
  alias = {} as { [specifier: string]: string },
  filenames = ['index'],
  extensions = ['.js', '.json', '.node']
} = {}) => async ({
  specifier,
  parentURL
}: {
  specifier: string
  parentURL: URL
}): Promise<{ url: URL }> => {
  if (alias[specifier]) specifier = alias[specifier]

  if (builtins.includes(specifier)) return { url: new URL(specifier, 'builtin://') }
  if (!/^\.{0,2}\//.test(specifier)) return { url: new URL(specifier, 'package://') }

  if (parentURL.protocol !== 'file:') {
    const directory = path.parse(parentURL.pathname).dir
    let pathname = path.resolve(directory, specifier)
    const url = new URL(pathname, parentURL)
    return { url }
  }

  const directory = (await fs.stat(parentURL.pathname)).isDirectory()
    ? parentURL.pathname
    : path.parse(parentURL.pathname).dir

  const pathname = path.resolve(directory, specifier)

  const order = [pathname]

  for (const extension of extensions) {
    order.push(`${pathname}${extension}`)
  }

  for (const filename of filenames) {
    order.push(path.join(pathname, filename))
    for (const extension of extensions) {
      order.push(path.join(pathname, `${filename}${extension}`))
    }
  }

  const promises = order.map(async pathname => (await fs.stat(pathname)).isFile())
  const settled = await allSettled(promises)
  const index = settled.findIndex(stat => stat.status === 'fulfilled' && stat.value)

  return { url: new URL(order[index], parentURL.protocol) }
}
