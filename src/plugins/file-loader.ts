import { promises as fs } from 'fs'

export const fileLoader = async (options: { url: URL }) => {
  const code = await fs.readFile(options.url.pathname, { encoding: 'utf8' })
  return { code }
}
