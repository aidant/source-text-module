import { promises as fs } from 'fs'
import { Toolkit } from '../run-plugins'
import { URL } from 'url'
import { posix as path } from 'path'

export const fileLoader = async (options: { url: URL }, toolkit: Toolkit) => {
  if (options.url.protocol !== 'file:') return toolkit.next()
  const code = await fs.readFile(options.url.pathname, { encoding: 'utf8' })
  return { code, ext: path.extname(options.url.pathname) }
}
