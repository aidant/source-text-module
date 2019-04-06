import { promises as fs } from 'fs'
import { URL } from 'url'

export const fileLoader = async (options: { url: URL }) => {
  const code = await fs.readFile(options.url.pathname, { encoding: 'utf8' })
  return { code }
}
